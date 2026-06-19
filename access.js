const { app } = require("@azure/functions");
const { requireUser, jsonResponse } = require("../shared/auth");
const { canWrite, canViewProject } = require("../shared/access");
const { getProject } = require("../shared/projects");
const { parseCSV } = require("../shared/csv");
const { loadStore, saveStore } = require("../shared/store");
const { calculateDashboard } = require("../shared/calculate");

app.http("uploadData", {
  methods: ["POST"],
  authLevel: "anonymous",
  handler: async request => {
    try {
      const auth = requireUser(request);
      if (auth.error) return auth.error;
      const user = auth.user;
      if (!canWrite(user)) return jsonResponse(403, { error: "Only admins and supervisors can upload CSV data." });

      const body = await request.json().catch(() => ({}));
      const projectId = String(body.projectId || "").toLowerCase();
      const type = String(body.type || "").toLowerCase();

      if (!getProject(projectId)) return jsonResponse(400, { error: "Choose Alabama or Ohio before uploading." });
      if (!canViewProject(user, projectId)) return jsonResponse(403, { error: "You do not have access to this project." });
      if (!["completed", "open", "time"].includes(type)) return jsonResponse(400, { error: "Upload type must be completed, open, or time." });
      if (!body.csvText) return jsonResponse(400, { error: "The CSV file was empty." });

      const rows = parseCSV(body.csvText);
      const store = await loadStore();
      const project = store.projects[projectId];
      project[type] = rows;
      project.source = project.source === "utilisphere" ? "mixed" : "csv";
      project.lastRefresh = new Date().toISOString();
      project.lastError = null;
      project.files[type] = {
        filename: body.filename || `${type}.csv`,
        uploadedAt: new Date().toISOString(),
        rowCount: rows.length
      };

      await saveStore(store);
      const summary = calculateDashboard(store, projectId, {
        reportDate: body.reportDate,
        viewMode: body.viewMode || "eod",
        cutoffTime: body.cutoffTime || "13:00"
      });

      return jsonResponse(200, {
        message: `${projectId} ${type} CSV uploaded.`,
        uploadedRows: rows.length,
        summary
      });
    } catch (error) {
      return jsonResponse(500, { error: error.message });
    }
  }
});
