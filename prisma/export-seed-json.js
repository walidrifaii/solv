const fs = require("fs");
const path = require("path");

function extractArrayLiteral(filePath, exportName) {
  const source = fs.readFileSync(filePath, "utf8");
  const marker = `export const ${exportName}`;
  const start = source.indexOf(marker);
  if (start < 0) throw new Error(`Missing export ${exportName} in ${filePath}`);
  const eq = source.indexOf("=", start);
  const bracket = source.indexOf("[", eq);
  if (bracket < 0) throw new Error(`Missing array for ${exportName}`);

  let depth = 0;
  let end = -1;
  for (let i = bracket; i < source.length; i += 1) {
    const ch = source[i];
    if (ch === "[") depth += 1;
    if (ch === "]") {
      depth -= 1;
      if (depth === 0) {
        end = i;
        break;
      }
    }
  }
  if (end < 0) throw new Error(`Unclosed array for ${exportName}`);
  return source.slice(bracket, end + 1);
}

function parseTsArrayLiteral(literal) {
  // Already valid JSON (quoted keys) — countries.ts
  try {
    return JSON.parse(literal);
  } catch {
    // TS object shorthand with unquoted keys — qatar-cities.ts
    const jsonish = literal
      .replace(/\/\/[^\n]*/g, "")
      .replace(/(\s|\{|,)([A-Za-z_][A-Za-z0-9_]*)\s*:/g, '$1"$2":')
      .replace(/,(\s*[}\]])/g, "$1");
    return JSON.parse(jsonish);
  }
}

const countries = parseTsArrayLiteral(
  extractArrayLiteral(path.join(__dirname, "data", "countries.ts"), "countries"),
);
const cities = parseTsArrayLiteral(
  extractArrayLiteral(
    path.join(__dirname, "data", "qatar-cities.ts"),
    "qatarCities",
  ),
);

fs.writeFileSync(
  path.join(__dirname, "data", "countries.json"),
  JSON.stringify(countries),
);
fs.writeFileSync(
  path.join(__dirname, "data", "qatar-cities.json"),
  JSON.stringify(cities),
);

console.log(
  `Wrote ${countries.length} countries and ${cities.length} cities JSON`,
);
