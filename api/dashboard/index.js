const {load}=require('../shared/store');const {calc}=require('../shared/calculate');
module.exports=async function(context,req){try{const s=load();context.res={status:200,headers:{'Content-Type':'application/json'},body:{message:'Dashboard API is working.',summary:calc(s.files)}}}catch(e){context.res={status:500,body:{error:e.message}}}};
