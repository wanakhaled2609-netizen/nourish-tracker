import { NUTRIENT_KEYS, NUTRIENT_LABELS } from "@/data/foodDatabase";
import * as XLSX from "xlsx";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { FileSpreadsheet, FileText } from "lucide-react";

interface Props {
  totals: Record<string, number>;
  requirements: Record<string, number>;
  differences: Record<string, number>;
}

export const ExportButtons = ({ totals, requirements, differences }: Props) => {
  const getTableData = () => {
    const headers = ["Category", ...NUTRIENT_KEYS.map((k) => NUTRIENT_LABELS[k])];
    const consumed = ["Total Consumed", ...NUTRIENT_KEYS.map((k) => totals[k].toFixed(2))];
    const required = ["Required", ...NUTRIENT_KEYS.map((k) => requirements[k].toFixed(2))];
    const diff = ["Difference", ...NUTRIENT_KEYS.map((k) => {
      const v = differences[k];
      return (v >= 0 ? "+" : "") + v.toFixed(2);
    })];
    return { headers, rows: [consumed, required, diff] };
  };

  const downloadExcel = () => {
    const { headers, rows } = getTableData();
    const ws = XLSX.utils.aoa_to_sheet([headers, ...rows]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Nutrition Comparison");
    XLSX.writeFile(wb, "nutrition_report.xlsx");
  };

  const downloadPDF = () => {
    const { headers, rows } = getTableData();
    const doc = new jsPDF({ orientation: "landscape" });

    doc.setFontSize(18);
    doc.setTextColor(17, 24, 39);
    doc.text("Nutrition Intake Report", 14, 20);

    doc.setFontSize(10);
    doc.setTextColor(107, 114, 128);
    doc.text(`Generated on ${new Date().toLocaleDateString()}`, 14, 28);

    autoTable(doc, {
      head: [headers],
      body: rows,
      startY: 35,
      styles: { fontSize: 7, cellPadding: 3 },
      headStyles: {
        fillColor: [16, 185, 129],
        textColor: 255,
        fontStyle: "bold",
      },
      alternateRowStyles: { fillColor: [249, 250, 251] },
    });

    doc.save("nutrition_report.pdf");
  };

  return (
    <div className="nutrition-card">
      <h2 className="section-title mb-4">
        <span>📥</span> Export Report
      </h2>
      <div className="flex gap-3 flex-wrap">
        <button
          onClick={downloadExcel}
          className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-lg font-medium text-sm hover:opacity-90 transition-opacity"
        >
          <FileSpreadsheet className="w-4 h-4" />
          Download as Excel
        </button>
        <button
          onClick={downloadPDF}
          className="inline-flex items-center gap-2 bg-destructive text-destructive-foreground px-5 py-2.5 rounded-lg font-medium text-sm hover:opacity-90 transition-opacity"
        >
          <FileText className="w-4 h-4" />
          Download as PDF
        </button>
      </div>
    </div>
  );
};
