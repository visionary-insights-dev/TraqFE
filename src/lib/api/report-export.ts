import { db, computeScholarStats } from "./mock-db";

export interface ReportRow {
  name: string;
  email: string;
  courseName: string;
  programName: string;
  status: string;
  overall: number;
  assignmentPct: number;
  attendancePct: number;
  atRisk: boolean;
}

/**
 * Builds a fresh snapshot of scholar progress for report export. Reports are
 * stored as lightweight records, so the payload is regenerated from the live
 * store at download time.
 */
export function buildReportRows(): ReportRow[] {
  return db.users
    .filter((u) => u.role === "SCHOLAR")
    .map((u) => {
      const stats = computeScholarStats(u.id);
      return {
        name: u.name,
        email: u.email,
        courseName: db.courses[0]?.name ?? "",
        programName: db.programs[0]?.name ?? "",
        status: u.status,
        overall: stats.overall,
        assignmentPct: stats.assignmentPct,
        attendancePct: stats.attendancePct,
        atRisk: stats.atRisk,
      };
    });
}

const TABLE_HEADERS: Array<{ key: keyof ReportRow; label: string }> = [
  { key: "name", label: "Name" },
  { key: "email", label: "Email" },
  { key: "programName", label: "Program" },
  { key: "courseName", label: "Course" },
  { key: "status", label: "Status" },
  { key: "overall", label: "Overall (%)" },
  { key: "assignmentPct", label: "Assignments (%)" },
  { key: "attendancePct", label: "Attendance (%)" },
  { key: "atRisk", label: "At Risk" },
];

function csvEscape(value: string | number | boolean): string {
  const str = String(value);
  if (/[",\n]/.test(str)) {
    return `"${str.replaceAll('"', '""')}"`;
  }
  return str;
}

export function buildCsv(rows: ReportRow[]): string {
  const header = TABLE_HEADERS.map((h) => csvEscape(h.label)).join(",");
  const body = rows.map((row) =>
    TABLE_HEADERS.map((h) => csvEscape(row[h.key])).join(",")
  );
  return [header, ...body].join("\n");
}

function pdfEscape(value: string | number | boolean): string {
  return String(value)
    .replaceAll("\\", "\\\\")
    .replaceAll("(", "\\(")
    .replaceAll(")", "\\)");
}

function buildPdfFactory(title: string, rows: ReportRow[]): { body: Uint8Array<ArrayBuffer>; startxref: number } {
  const printed = rows.slice(0, 40);
  const yStart = 710;
  const rowsY = printed.map((_, i) => yStart - (i + 1) * 14).filter((y) => y > 50);

  const contentParts: string[] = [];
  contentParts.push(`BT /F1 14 Tf 50 730 Td (${pdfEscape(title)}) Tj ET`);
  contentParts.push(`BT /F1 9 Tf 50 714 Td (Generated ${new Date().toISOString()}) Tj ET`);
  for (let i = 0; i < rowsY.length; i++) {
    const row = printed[i];
    const line = [
      row.name,
      row.email,
      row.programName,
      row.courseName,
      `${row.assignmentPct}% / ${row.attendancePct}%`,
      row.atRisk ? "AT RISK" : "",
    ]
      .filter(Boolean)
      .join(" | ");
    contentParts.push(`BT /F1 9 Tf 50 ${rowsY[i]} Td (${pdfEscape(line)}) Tj ET`);
  }
  const content = contentParts.join("\n");

  const objects: string[] = [];
  objects.push("1 0 obj");
  objects.push("<< /Type /Catalog /Pages 2 0 R >>");
  objects.push("endobj");
  objects.push("2 0 obj");
  objects.push("<< /Type /Pages /Kids [3 0 R] /Count 1 >>");
  objects.push("endobj");
  objects.push("3 0 obj");
  objects.push(
    "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R " +
      ">>"
  );
  objects.push("endobj");
  objects.push("4 0 obj");
  objects.push(`<< /Length ${content.length} >>`);
  objects.push("stream");
  objects.push(content);
  objects.push("endstream");
  objects.push("endobj");
  objects.push("5 0 obj");
  objects.push("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>");
  objects.push("endobj");

  const offsets: number[] = [];
  const pieces: string[] = [];
  let cursor = 0;
  pieces.push("%PDF-1.4\n");
  cursor = "%PDF-1.4\n".length;

  for (const line of objects) {
    offsets.push(cursor);
    const chunk = `${line}\n`;
    pieces.push(chunk);
    cursor += chunk.length;
  }

  const xrefStart = cursor;
  const xrefEntries: string[] = ["0 6\n"];
  xrefEntries.push("0000000000 65535 f\n");
  for (const offset of offsets) {
    xrefEntries.push(`${String(offset).padStart(10, "0")} 00000 n\n`);
  }
  const xref = xrefEntries.join("");
  pieces.push("xref\n", xref);

  const trailer = `trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n${xrefStart}\n%%EOF\n`;
  pieces.push(trailer);

  return { body: new TextEncoder().encode(pieces.join("")), startxref: xrefStart };
}

export function buildPdf(title: string, rows: ReportRow[]): Uint8Array<ArrayBuffer> {
  return buildPdfFactory(title, rows).body;
}