let store = { updatedAt:null, files:{ completed:{filename:null,rows:[]}, open:{filename:null,rows:[]}, time:{filename:null,rows:[]} } };
async function loadStore(){ return store; }
async function saveStore(next){ next.updatedAt = new Date().toISOString(); store = next; return store; }
async function clearStore(){ store = { updatedAt:new Date().toISOString(), files:{ completed:{filename:null,rows:[]}, open:{filename:null,rows:[]}, time:{filename:null,rows:[]} } }; return store; }
module.exports = { loadStore, saveStore, clearStore };
