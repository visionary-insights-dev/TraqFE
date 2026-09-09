export interface ParsedCsvRow {
  [header: string]: string;
}

/**
 * Minimal RFC-4180-style CSV parser. Handles quoted fields (including commas,
 * quotes and newlines inside quotes). Returns header row as keys and data rows
 * as objects. Empty lines are skipped.
 */
export function parseCsv(input: string): { headers: string[]; rows: ParsedCsvRow[] } {
  let cells: string[] = [];
  const rowsOfCells: string[][] = [];
  let current = "";
  let inQuotes = false;
  const src = input.replace(/\r\n/g, "\n").replace(/\r/g, "\n");

  for (let i = 0; i < src.length; i += 1) {
    const char = src[i];
    if (inQuotes) {
      if (char === '"') {
        if (src[i + 1] === '"') {
          current += '"';
          i += 1;
        } else {
          inQuotes = false;
        }
      } else {
        current += char;
      }
    } else if (char === '"') {
      inQuotes = true;
    } else if (char === ",") {
      cells.push(current);
      current = "";
    } else if (char === "\n") {
      cells.push(current);
      rowsOfCells.push(cells);
      current = "";
      cells = [];
    } else {
      current += char;
    }
  }

  if (current !== "" || cells.length > 0) {
    cells.push(current);
    rowsOfCells.push(cells);
  }

  const cleaned = rowsOfCells
    .map((row) => row.map((cell) => cell.trim()))
    .filter((row) => row.some((cell) => cell.length > 0));

  if (cleaned.length === 0) {
    return { headers: [], rows: [] };
  }

  const headers = cleaned[0];
  const rows = cleaned.slice(1).reduce<ParsedCsvRow[]>((acc, row) => {
    const record: ParsedCsvRow = {};
    headers.forEach((header, index) => {
      record[header] = row[index] ?? "";
    });
    acc.push(record);
    return acc;
  }, []);

  return { headers, rows };
}