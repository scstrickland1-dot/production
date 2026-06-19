const { app } = require("@azure/functions");
const { requireUser, jsonResponse } = require("../shared/auth");
const { canWrite, canViewProject } = require("../shared/access");
const { getProject } = require("../shared/projects");
const { clearProject, loadStore } = require("../shared/store");
const { calculateDashboard } = require("../shared/calculate");

app.http("clearData", {
  methods: ["POST"],
  authLevel: "anonymous",
  handler: async request => {
    try {
      const auth = requireUser(request);
      if (auth.error) return auth.error;
      const user = auth.user;
      if (!canWrite(user)) return jsonResponse(403, { error: "Only admins and supervisors can clear data." });

      const body = await request.json().catch(() => ({}));
      const projectId = String(body.projectId || "").toLowerCase();
      if (projectId !== "all" && !getProject(projectId)) {
        return jsonResponse(400, { error: "Project must be all, alabama, or ohio." });
      }
      if (!canViewProject(user, projectId)) return jsonResponse(403, { error: "You do not have access to this project." });

      await clearProject(projectId);
      const store = await loadStore();
      return jsonResponse(200, {
        message: `${projectId} data cleared.`,
        summary: calculateDashboard(store, projectId, {})
      });
    } catch (error) {
      return jsonResponse(500, { error: error.message });
    }
  }
});
