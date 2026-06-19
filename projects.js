const { app } = require("@azure/functions");
const { requireUser, jsonResponse } = require("../shared/auth");
const { canSync, canViewProject } = require("../shared/access");
const { getProject, getProjectIds } = require("../shared/projects");
const { fetchProjectData, configurationStatus } = require("../shared/utilisphere");
const { loadStore, saveStore } = require("../shared/store");
const { calculateDashboard } = require("../shared/calculate");

app.http("syncUtilisphere", {
  methods: ["POST"],
  authLevel: "anonymous",
  handler: async request => {
    try {
      const auth = requireUser(request);
      if (auth.error) return auth.error;
      const user = auth.user;
      if (!canSync(user)) return jsonResponse(403, { error: "Your role cannot refresh UtiliSphere data." });

      const body = await request.json().catch(() => ({}));
      const projectId = String(body.projectId || "all").toLowerCase();
      if (projectId !== "all" && !getProject(projectId)) {
        return jsonResponse(400, { error: "Project must be all, alabama, or ohio." });
      }
      if (!canViewProject(user, projectId)) {
        return jsonResponse(403, { error: "You do not have access to this project." });
      }

      const config = configurationStatus();
      if (!config.configured) {
        return jsonResponse(400, {
          error: "UtiliSphere API settings are incomplete.",
          missing: config.missing
        });
      }

      const projectIds = projectId === "all"
        ? getProjectIds().filter(id => canViewProject(user, id))
        : [projectId];
      const store = await loadStore();
      const results = [];

      for (const id of projectIds) {
        try {
          const data = await fetchProjectData(id, {
            startDate: body.startDate || body.reportDate,
            endDate: body.endDate || body.reportDate
          });
          store.projects[id] = {
            ...store.projects[id],
            ...data,
            files: {},
            lastError: null
          };
          results.push({ projectId: id, success: true, completed: data.completed.length, open: data.open.length, time: data.time.length });
        } catch (error) {
          store.projects[id].lastError = error.message;
          results.push({ projectId: id, success: false, error: error.message });
        }
      }

      await saveStore(store);
      const summary = calculateDashboard(store, projectId, {
        reportDate: body.reportDate,
        viewMode: body.viewMode || "eod",
        cutoffTime: body.cutoffTime || "13:00"
      });

      const failed = results.filter(result => !result.success);
      return jsonResponse(failed.length === results.length ? 502 : 200, {
        message: failed.length ? "Refresh completed with one or more project errors." : "UtiliSphere refresh completed.",
        results,
        summary
      });
    } catch (error) {
      return jsonResponse(500, { error: error.message });
    }
  }
});
