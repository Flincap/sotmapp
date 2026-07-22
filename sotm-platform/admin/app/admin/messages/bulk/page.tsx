"use client";

import { API_URL } from "@/lib/api";
import { useRef, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Download, Upload, FileSpreadsheet } from "lucide-react";

/* =========================================================================
   BULK MESSAGE UPLOAD
   Admin uploads a CSV (exported from Excel / Google Sheets via "Save as
   CSV"). Each valid row becomes a message via the same API endpoint the
   single-message form uses, so all server-side validation still applies.
   ========================================================================= */

const TEMPLATE_HEADERS = [
  "title",
  "speaker",
  "date",
  "categories",
  "downloadUrl",
  "imageUrl",
  "size",
  "duration",
  "description",
  "seriesTitle",
  "specialMeetingName",
];

const TEMPLATE_EXAMPLE = [
  "The Power of the Blessing",
  "Apostle Segun Obadje",
  "2026-07-20",
  "Faith; New Creation Realities",
  "https://1drv.ms/u/s!EXAMPLE-onedrive-share-link",
  "",
  "45 MB",
  "75",
  "A teaching on the empowerment that turns labour into rest.",
  "",
  "",
];

type RowStatus = "ready" | "invalid" | "uploading" | "done" | "failed";

interface ParsedRow {
  index: number;
  data: Record<string, string>;
  problems: string[];
  status: RowStatus;
  error?: string;
}

/** Minimal RFC-4180 CSV parser: handles quoted fields, escaped quotes,
    commas and newlines inside quotes, and CRLF line endings. */
function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        field += c;
      }
    } else if (c === '"') {
      inQuotes = true;
    } else if (c === ",") {
      row.push(field);
      field = "";
    } else if (c === "\n" || c === "\r") {
      if (c === "\r" && text[i + 1] === "\n") i++;
      row.push(field);
      field = "";
      if (row.some((f) => f.trim() !== "")) rows.push(row);
      row = [];
    } else {
      field += c;
    }
  }
  row.push(field);
  if (row.some((f) => f.trim() !== "")) rows.push(row);
  return rows;
}

function validateRow(data: Record<string, string>): string[] {
  const problems: string[] = [];
  if (!data.title?.trim()) problems.push("title is missing");
  if (!data.speaker?.trim()) problems.push("speaker is missing");
  if (!data.date?.trim() || Number.isNaN(new Date(data.date).getTime()))
    problems.push("date is missing or not understandable (use YYYY-MM-DD)");
  if (!data.categories?.trim()) problems.push("categories is missing");
  if (!data.downloadUrl?.trim() || !/^https?:\/\//i.test(data.downloadUrl))
    problems.push("downloadUrl is missing or not a link");
  if (data.imageUrl && !/^https?:\/\//i.test(data.imageUrl))
    problems.push("imageUrl is not a link");
  if (data.duration && Number.isNaN(Number(data.duration)))
    problems.push("duration must be a number of minutes");
  if (data.description && data.description.length > 400)
    problems.push("description is longer than 400 characters");
  return problems;
}

export default function BulkUploadPage() {
  const [rows, setRows] = useState<ParsedRow[]>([]);
  const [fileName, setFileName] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [finished, setFinished] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const downloadTemplate = () => {
    const csv =
      TEMPLATE_HEADERS.join(",") +
      "\n" +
      TEMPLATE_EXAMPLE.map((v) =>
        v.includes(",") || v.includes('"') ? `"${v.replace(/"/g, '""')}"` : v
      ).join(",") +
      "\n";
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "sotm-messages-template.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleFile = async (file: File) => {
    setFinished(false);
    setFileName(file.name);
    const text = await file.text();
    const table = parseCsv(text);
    if (table.length < 2) {
      toast.error("That file has no data rows. Fill in the template first.");
      setRows([]);
      return;
    }
    const headers = table[0].map((h) => h.trim());
    const parsed: ParsedRow[] = table.slice(1).map((cells, i) => {
      const data: Record<string, string> = {};
      headers.forEach((h, j) => {
        const key = TEMPLATE_HEADERS.find(
          (t) => t.toLowerCase() === h.toLowerCase()
        );
        if (key) data[key] = (cells[j] ?? "").trim();
      });
      const problems = validateRow(data);
      return {
        index: i + 2, // spreadsheet row number (1-based + header)
        data,
        problems,
        status: problems.length ? "invalid" : "ready",
      };
    });
    setRows(parsed);
    const bad = parsed.filter((r) => r.status === "invalid").length;
    if (bad > 0) {
      toast.warning(
        `${bad} row${bad === 1 ? "" : "s"} need fixing — see the notes below.`
      );
    } else {
      toast.success(`${parsed.length} messages ready to upload.`);
    }
  };

  const uploadAll = async () => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      toast.error("You are not logged in.");
      return;
    }
    setIsUploading(true);
    const next = [...rows];
    for (let i = 0; i < next.length; i++) {
      const row = next[i];
      if (row.status !== "ready" && row.status !== "failed") continue;
      row.status = "uploading";
      setRows([...next]);
      try {
        const d = row.data;
        const categories = d.categories
          .split(/[;|]/)
          .map((c) => c.trim())
          .filter(Boolean);
        const formData = new FormData();
        formData.append("title", d.title);
        formData.append("speaker", d.speaker);
        formData.append("date", new Date(d.date).toISOString());
        formData.append("category", JSON.stringify(categories));
        formData.append("downloadUrl", d.downloadUrl);
        if (d.imageUrl) formData.append("imageUrl", d.imageUrl);
        if (d.size) formData.append("size", d.size);
        formData.append(
          "duration",
          JSON.stringify(d.duration ? Number(d.duration) : 0)
        );
        if (d.description) formData.append("description", d.description);
        formData.append(
          "isSeries",
          JSON.stringify(Boolean(d.seriesTitle?.trim()))
        );
        if (d.seriesTitle?.trim())
          formData.append("seriesTitle", d.seriesTitle.trim());
        formData.append(
          "specialMeeting",
          JSON.stringify(Boolean(d.specialMeetingName?.trim()))
        );
        if (d.specialMeetingName?.trim())
          formData.append("specialMeetingName", d.specialMeetingName.trim());

        await axios.post(`${API_URL}/messages`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        row.status = "done";
      } catch (error) {
        row.status = "failed";
        if (axios.isAxiosError(error) && error.response) {
          const msg = error.response.data?.message;
          row.error = Array.isArray(msg) ? msg.join("; ") : String(msg ?? "");
        } else {
          row.error = "Network error";
        }
      }
      setRows([...next]);
    }
    setIsUploading(false);
    setFinished(true);
    const done = next.filter((r) => r.status === "done").length;
    const failed = next.filter((r) => r.status === "failed").length;
    if (failed === 0) {
      toast.success(`All ${done} messages uploaded.`);
    } else {
      toast.warning(`${done} uploaded, ${failed} failed — see notes below.`);
    }
  };

  const readyCount = rows.filter(
    (r) => r.status === "ready" || r.status === "failed"
  ).length;

  const statusLabel: Record<RowStatus, string> = {
    ready: "Ready",
    invalid: "Needs fixing",
    uploading: "Uploading…",
    done: "Uploaded ✓",
    failed: "Failed",
  };

  return (
    <div className="p-6 max-w-5xl">
      <div className="mb-6">
        <h2 className="text-xl font-bold">Bulk Upload</h2>
        <p className="text-muted-foreground">
          Add many messages at once from a spreadsheet.
        </p>
      </div>

      <div className="mb-6 rounded-md border p-4 text-sm leading-6">
        <p className="font-medium mb-2">How it works</p>
        <ol className="list-decimal ml-5 space-y-1">
          <li>Download the template and open it in Excel or Google Sheets.</li>
          <li>
            One row per message. Required: title, speaker, date (YYYY-MM-DD),
            categories, downloadUrl (the OneDrive share link). Separate
            multiple categories with a semicolon, e.g.{" "}
            <code>Faith; Healing</code>.
          </li>
          <li>
            Optional: imageUrl (a link to the flier/thumbnail image), size,
            duration (minutes), description, seriesTitle, specialMeetingName.
          </li>
          <li>Save as CSV, then choose the file below and press Upload.</li>
        </ol>
      </div>

      <div className="mb-6 flex flex-wrap gap-3">
        <Button variant="outline" onClick={downloadTemplate}>
          <Download size={16} className="mr-2" /> Download template
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv,text/csv"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) void handleFile(f);
            e.target.value = "";
          }}
        />
        <Button
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
        >
          <FileSpreadsheet size={16} className="mr-2" />
          {fileName ? `Change file (${fileName})` : "Choose CSV file"}
        </Button>
        {rows.length > 0 && (
          <Button onClick={uploadAll} disabled={isUploading || readyCount === 0}>
            <Upload size={16} className="mr-2" />
            {isUploading
              ? "Uploading…"
              : finished
                ? `Retry failed (${rows.filter((r) => r.status === "failed").length})`
                : `Upload ${readyCount} message${readyCount === 1 ? "" : "s"}`}
          </Button>
        )}
      </div>

      {rows.length > 0 && (
        <div className="rounded-md border overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-left">
              <tr>
                <th className="p-2 font-medium">Row</th>
                <th className="p-2 font-medium">Title</th>
                <th className="p-2 font-medium">Speaker</th>
                <th className="p-2 font-medium">Date</th>
                <th className="p-2 font-medium">Status</th>
                <th className="p-2 font-medium">Notes</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.index} className="border-b align-top">
                  <td className="p-2">{r.index}</td>
                  <td className="p-2">{r.data.title || "—"}</td>
                  <td className="p-2">{r.data.speaker || "—"}</td>
                  <td className="p-2">{r.data.date || "—"}</td>
                  <td className="p-2 whitespace-nowrap">
                    {statusLabel[r.status]}
                  </td>
                  <td className="p-2 text-red-600">
                    {r.problems.join("; ") || r.error || ""}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
