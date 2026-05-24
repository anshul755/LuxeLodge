const fs = require("fs");

function parseCsv(text) {
  const rows = [];
  let row = [];
  let value = "";
  let inQuotes = false;

  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    const nextChar = text[index + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        value += '"';
        index += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (char === "," && !inQuotes) {
      row.push(value);
      value = "";
      continue;
    }

    if ((char === "\n" || char === "\r") && !inQuotes) {
      if (char === "\r" && nextChar === "\n") index += 1;
      row.push(value);
      if (row.some((field) => field !== "")) rows.push(row);
      row = [];
      value = "";
      continue;
    }

    value += char;
  }

  if (value || row.length) {
    row.push(value);
    rows.push(row);
  }

  return rows;
}

function readCsv(filePath) {
  const text = fs.readFileSync(filePath, "utf8").replace(/^\uFEFF/, "");
  const [headers, ...rows] = parseCsv(text);

  return rows.map((row) =>
    headers.reduce((record, header, index) => {
      record[header] = row[index] || "";
      return record;
    }, {}),
  );
}

module.exports = { readCsv };
