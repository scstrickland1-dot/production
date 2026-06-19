const { app } = require("@azure/functions");
const { requireUser, jsonResponse } = require("../shared/auth");
const { configurationStatus } = require("../shared/utilisphere");
const { loadStore } = require("../shared/store");

app.http("status", {
  methods: ["GET"],
  authLevel: "anonymous",
  handler: async request => {
    const auth = requireUser(request);
    if (auth.error) return auth.error;

    const store = await loadStore();
    return jsonResponse(200, {
      app: "Bermex Alabama and Ohio Dashboard",
      api: "working",
      utilisphere: configurationStatus(),
      storage: {
        persistent: Boolean(process.env.AZURE_STORAGE_CONNECTION_STRING),
        updatedAt: store.updatedAt || null
      },
      projects: {
        alabama: {
          source: store.projects.alabama.source,
          lastRefresh: store.projects.alabama.lastRefresh,
          lastError: store.projects.alabama.lastError
        },
        ohio: {
          source: store.projects.ohio.source,
          lastRefresh: store.projects.ohio.lastRefresh,
          lastError: store.projects.ohio.lastError
        }
      }
    });
  }
});
