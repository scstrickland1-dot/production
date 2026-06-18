const { requireUser } = require("../shared/auth");
const { canUpload } = require("../shared/access");
const { parseCSV } = require("../shared/csv");
const { loadStore, saveStore } = require("../shared/store");
const { calculateDashboard } = require("../shared/calculate");
module.exports = async function(context, req){
  try{
    const user = requireUser(context, req); if(!user) return;
    if(!canUpload(user)){ context.res={status:403,headers:{"Content-Type":"application/json"},body:{error:"Only supervisors and admins can upload dashboard data."}}; return; }
    const body=req.body||{}, type=body.type;
    if(!["completed","open","time"].includes(type)){ context.res={status:400,headers:{"Content-Type":"application/json"},body:{error:"Invalid upload type. Use completed, open, or time."}}; return; }
    if(!body.csvText){ context.res={status:400,headers:{"Content-Type":"application/json"},body:{error:"csvText is required."}}; return; }
    const rows=parseCSV(body.csvText), store=await loadStore();
    store.files[type]={ filename:body.filename || `${type}.csv`, uploadedAt:new Date().toISOString(), rows };
    await saveStore(store);
    const summary=calculateDashboard({completed:store.files.completed.rows,open:store.files.open.rows,time:store.files.time.rows},{reportDate:body.reportDate,viewMode:body.viewMode||"eod",cutoffTime:body.cutoffTime||"13:00"},user);
    context.res={status:200,headers:{"Content-Type":"application/json"},body:{message:`${type} CSV uploaded and dashboard recalculated.`,type,filename:store.files[type].filename,uploadedRows:rows.length,summary}};
  } catch(e){ context.res={status:500,headers:{"Content-Type":"application/json"},body:{error:e.message}}; }
};
