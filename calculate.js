const { getAccess } = require("./access");

function parseClientPrincipal(request) {
  const header = request.headers.get("x-ms-client-principal");
  if (!header) return null;

  try {
    const decoded = Buffer.from(header, "base64").toString("utf8");
    return JSON.parse(decoded);
  } catch {
    return null;
  }
}

function getAuthenticatedUser(request) {
  const principal = parseClientPrincipal(request);
  if (!principal) return null;

  const email = principal.userDetails || principal.identityProviderUserId || "";
  const access = getAccess(email);

  return {
    ...access,
    identityProvider: principal.identityProvider,
    userId: principal.userId,
    userRoles: principal.userRoles || []
  };
}

function jsonResponse(status, body) {
  return {
    status,
    jsonBody: body,
    headers: { "Cache-Control": "no-store" }
  };
}

function requireUser(request) {
  const user = getAuthenticatedUser(request);
  if (!user) {
    return { error: jsonResponse(401, { error: "Microsoft login required." }) };
  }
  if (!user.isApproved) {
    return {
      error: jsonResponse(403, {
        error: "This Microsoft account is not approved for the dashboard.",
        email: user.email
      })
    };
  }
  return { user };
}

module.exports = { getAuthenticatedUser, requireUser, jsonResponse };
