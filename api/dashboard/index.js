const { requireUser } = require("../shared/auth");
const { loadStore } = require("../shared/store");
const { calculateDashboard } = require("../shared/calculate");
module.exports = async function(context, req){
  try{
    const user = requireUser(context, req); if(!user) return;
    const store = await loadStore();
    const options = { reportDate:req.query.reportDate, viewMode:req.query.viewMode || "eod", cutoffTime:req.query.cutoffTime || "13:00" };
    const summary = calculateDashboard({ completed:store.files.completed.rows, open:store.files.open.rows, time:store.files.time.rows }, options, user);
    context.res = { status:200, headers:{"Content-Type":"application/json"}, body:{ message:store.updatedAt ? "Dashboard loaded." : "No CSV data has been uploaded yet.", updatedAt:store.updatedAt, user:{ email:user.email, displayName:user.displayName, role:user.role, locatorName:user.locatorName, warning:user.warning || null }, summary } };
  } catch(e){ context.res = { status:500, headers:{"Content-Type":"application/json"}, body:{ error:e.message } }; }
};
