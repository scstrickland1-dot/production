const { app } = require("@azure/functions");
const { requireUser, jsonResponse } = require("../shared/auth");

app.http("me", {
  methods: ["GET"],
  authLevel: "anonymous",
  handler: async request => {
    const auth = requireUser(request);
    if (auth.error) return auth.error;

    const user = auth.user;
    return jsonResponse(200, {
      user: {
        email: user.email,
        displayName: user.displayName,
        role: user.role,
        allowedProjects: user.allowedProjects,
        warning: user.warning || null
      }
    });
  }
});
