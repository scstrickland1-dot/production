const { getAccessForEmail } = require("./access");
function parseClientPrincipal(req){
  const header = req.headers["x-ms-client-principal"];
  if(!header) return null;
  try { return JSON.parse(Buffer.from(header, "base64").toString("utf8")); } catch { return null; }
}
function getAuthenticatedUser(req){
  const p = parseClientPrincipal(req);
  if(!p) return null;
  const email = p.userDetails || p.identityProviderUserId || "";
  const access = getAccessForEmail(email);
  return { ...access, identityProvider:p.identityProvider, userId:p.userId, userRoles:p.userRoles || [], claims:p.claims || [] };
}
function requireUser(context, req){
  const user = getAuthenticatedUser(req);
  if(!user){ context.res = { status:401, headers:{"Content-Type":"application/json"}, body:{ error:"Microsoft login required." } }; return null; }
  if(!user.isApproved){ context.res = { status:403, headers:{"Content-Type":"application/json"}, body:{ error:"Your Microsoft account is not approved for this dashboard.", email:user.email } }; return null; }
  return user;
}
module.exports = { getAuthenticatedUser, requireUser };
