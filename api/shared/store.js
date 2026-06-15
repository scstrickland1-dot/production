let store={files:{completed:[],open:[],time:[]}};
module.exports={load:()=>store,save:(s)=>{store=s;return store},clear:()=>{store={files:{completed:[],open:[],time:[]}};return store}};
