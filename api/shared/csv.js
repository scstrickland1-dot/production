function parseCSV(text){
  text = String(text || "").replace(/^\uFEFF/, "");
  const rows=[]; let row=[], cur="", q=false;
  for(let i=0;i<text.length;i++){
    const ch=text[i], next=text[i+1];
    if(ch==='"'){ if(q && next==='"'){ cur+='"'; i++; } else q=!q; }
    else if(ch===',' && !q){ row.push(cur); cur=""; }
    else if((ch==='\n'||ch==='\r') && !q){ if(ch==='\r' && next==='\n') i++; row.push(cur); if(row.some(c=>String(c).trim()!=="")) rows.push(row); row=[]; cur=""; }
    else cur += ch;
  }
  row.push(cur); if(row.some(c=>String(c).trim()!=="")) rows.push(row);
  if(!rows.length) return [];
  const headers = rows[0].map(h=>String(h||"").trim());
  return rows.slice(1).map(r=>{ const o={}; headers.forEach((h,i)=>o[h]=r[i] ?? ""); return o; });
}
module.exports = { parseCSV };
