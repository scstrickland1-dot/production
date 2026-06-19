const { app } = require("@azure/functions");
const { requireUser, jsonResponse } = require("../shared/auth");
const { canViewProject } = require("../shared/access");
const { getProject } = require("../shared/projects");
const { loadStore } = require("../shared/store");
const { calculateDashboard } = require("../shared/calculate");
const { configurationStatus } = require("../shared/utilisphere");

app.http("dashboard", {
  methods: ["GET"],
  authLevel: "anonymous",
  handler: async request => {
    try {
      const auth = requireUser(request);
      if (auth.error) return auth.error;
      const user = auth.user;

      const projectId = String(request.query.get("projectId") || "all").toLowerCase();
      if (projectId !== "all" && !getProject(projectId)) {
        return jsonResponse(400, { error: "Project must be all, alabama, or ohio." });
      }
      if (!canViewProject(user, projectId)) {
        return jsonResponse(403, { error: "You do not have access to this project." });
      }

      const options = {
        reportDate: request.query.get("reportDate") || undefined,
        viewMode: request.query.get("viewMode") || "eod",
        cutoffTime: request.query.get("cutoffTime") || "13:00"
      };

      const store = await loadStore();
      const summary = calculateDashboard(store, projectId, options);

      return jsonResponse(200, {
        message: store.updatedAt ? "Dashboard loaded." : "No data has been loaded yet.",
        user: {
          email: user.email,
          displayName: user.displayName,
          role: user.role,
          allowedProjects: user.allowedProjects
        },
        utilisphere: configurationStatus(),
        summary
      });
    } catch (error) {
      return jsonResponse(500, { error: error.message });
    }
  }
});
