const store=require('../shared/store');const {calc}=require('../shared/calculate');
module.exports=async function(context,req){store.clear();context.res={status:200,headers:{'Content-Type':'application/json'},body:{message:'Cleared.',summary:calc({completed:[],open:[],time:[]})}}};
