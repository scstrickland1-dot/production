const { requireUser } = require("../shared/auth");
const { canUpload } = require("../shared/access");
const { clearStore } = require("../shared/store");
const { calculateDashboard } = require("../shared/calculate");
module.exports = async function(context, req){
  try{
    const user=requireUser(context, req); if(!user) return;
    if(!canUpload(user)){ context.res={status:403,headers:{"Content-Type":"application/json"},body:{error:"Only supervisors and admins can clear dashboard data."}}; return; }
    await clearStore();
    const summary=calculateDashboard({completed:[],open:[],time:[]},{},user);
    context.res={status:200,headers:{"Content-Type":"application/json"},body:{message:"Dashboard data cleared.",summary}};
  } catch(e){ context.res={status:500,headers:{"Content-Type":"application/json"},body:{error:e.message}}; }
};
