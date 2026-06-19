function parseCSV(text) {
  text = String(text || "").replace(/^\uFEFF/, "");
  const rows = [];
  let row = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    const next = text[i + 1];

    if (ch === '"') {
      if (inQuotes && next === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (ch === "," && !inQuotes) {
      row.push(current);
      current = "";
    } else if ((ch === "\n" || ch === "\r") && !inQuotes) {
      if (ch === "\r" && next === "\n") i++;
      row.push(current);
      if (row.some(value => String(value).trim() !== "")) rows.push(row);
      row = [];
      current = "";
    } else {
      current += ch;
    }
  }

  row.push(current);
  if (row.some(value => String(value).trim() !== "")) rows.push(row);
  if (!rows.length) return [];

  const headers = rows[0].map(value => String(value || "").trim());
  return rows.slice(1).map(values => {
    const record = {};
    headers.forEach((header, index) => {
      record[header] = values[index] ?? "";
    });
    return record;
  });
}

module.exports = { parseCSV };
