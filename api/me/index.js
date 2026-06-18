const { requireUser } = require("../shared/auth");
module.exports = async function(context, req){
  const user = requireUser(context, req); if(!user) return;
  context.res = { status:200, headers:{"Content-Type":"application/json"}, body:{ user:{ email:user.email, displayName:user.displayName, role:user.role, locatorName:user.locatorName, warning:user.warning || null } } };
};
