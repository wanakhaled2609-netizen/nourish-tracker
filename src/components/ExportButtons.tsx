import { foodDatabase, NUTRIENT_KEYS, NUTRIENT_LABELS } from "@/data/foodDatabase";
import type { CalculatorRow } from "@/pages/Index";
import * as XLSX from "xlsx";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { FileSpreadsheet, FileText } from "lucide-react";

interface Props {
  rows: CalculatorRow[];
  totals: Record<string, number>;
  requirements: Record<string, number>;
  differences: Record<string, number>;
}

export const ExportButtons = ({ rows, totals, requirements, differences }: Props) => {
  const headers = ["Food Name", "Qty (g)", ...NUTRIENT_KEYS.map((k) => NUTRIENT_LABELS[k])];

  const getFoodRows = () =>
    rows.map((row) => {
      const food = foodDatabase[row.foodIndex];
      const factor = row.quantity / 100;
      return [food.name, row.quantity.toString(), ...NUTRIENT_KEYS.map((k) => (food[k] * factor).toFixed(2))];
    });

  const getSummaryRows = () => {
    const pad = (label: string, vals: string[]) => [label, "", ...vals];
    return [
      pad("Total Consumed", NUTRIENT_KEYS.map((k) => totals[k].toFixed(2))),
      pad("Required", NUTRIENT_KEYS.map((k) => requirements[k].toFixed(2))),
      pad("Difference", NUTRIENT_KEYS.map((k) => {
        const v = differences[k];
        return (v >= 0 ? "+" : "") + v.toFixed(2);
      })),
    ];
  };

  const downloadExcel = () => {
    const data = [headers, ...getFoodRows(), [], ...getSummaryRows()];
    const ws = XLSX.utils.aoa_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Nutrition Analysis");
    XLSX.writeFile(wb, "nutrition_analysis.xlsx");
  };

  const downloadPDF = () => {
    const doc = new jsPDF({ orientation: "landscape" });
    doc.setFontSize(18);
    doc.setTextColor(17, 24, 39);
    doc.text("Nutrition Intake Report", 14, 20);
    doc.setFontSize(10);
    doc.setTextColor(107, 114, 128);
    doc.text(`Generated on ${new Date().toLocaleDateString()}`, 14, 28);

    const body = [...getFoodRows(), [], ...getSummaryRows()];

    autoTable(doc, {
      head: [headers],
      body,
      startY: 35,
      styles: { fontSize: 6, cellPadding: 2 },
      headStyles: { fillColor: [16, 185, 129], textColor: 255, fontStyle: "bold" },
      alternateRowStyles: { fillColor: [249, 250, 251] },
      didParseCell: (data) => {
        const rowIdx = data.row.index;
        const totalRows = body.length;
        if (rowIdx >= totalRows - 3) {
          data.cell.styles.fontStyle = "bold";
        }
      },
    });

    doc.save("nutrition_analysis.pdf");
  };

  return (
    <div className="nutrition-card">
      <h2 className="section-title mb-4">
        <span>📥</span> Download Analysis
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
