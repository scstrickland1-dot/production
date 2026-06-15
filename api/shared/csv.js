function parseCSV(text){
  text=String(text||'').replace(/^\uFEFF/,'');
  const rows=[];let row=[],cur='',q=false;
  for(let i=0;i<text.length;i++){
    const ch=text[i],n=text[i+1];
    if(ch=='"'){if(q&&n=='"'){cur+='"';i++;}else q=!q;}
    else if(ch==','&&!q){row.push(cur);cur='';}
    else if((ch=='\n'||ch=='\r')&&!q){if(ch=='\r'&&n=='\n')i++;row.push(cur);if(row.some(c=>String(c).trim()))rows.push(row);row=[];cur='';}
    else cur+=ch;
  }
  row.push(cur);if(row.some(c=>String(c).trim()))rows.push(row);
  if(!rows.length)return[];
  const h=rows[0].map(x=>String(x||'').trim());
  return rows.slice(1).map(r=>{const o={};h.forEach((x,i)=>o[x]=r[i]||'');return o;});
}
module.exports={parseCSV};
