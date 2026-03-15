import { foodDatabase, NUTRIENT_KEYS, NUTRIENT_LABELS } from "@/data/foodDatabase";
import type { CalculatorRow } from "@/pages/Index";
import { Plus, Trash2 } from "lucide-react";

interface Props {
  rows: CalculatorRow[];
  onAdd: () => void;
  onRemove: (id: string) => void;
  onUpdate: (id: string, field: "foodIndex" | "quantity", value: number) => void;
}

export const CalculatorTable = ({ rows, onAdd, onRemove, onUpdate }: Props) => {
  return (
    <div className="nutrition-card">
      <div className="flex items-center justify-between mb-4">
        <h2 className="section-title">
          <span className="text-primary">🧮</span> Nutrition Calculator
        </h2>
        <button
          onClick={onAdd}
          className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2.5 rounded-lg font-medium text-sm hover:opacity-90 transition-opacity"
        >
          <Plus className="w-4 h-4" />
          Add Food
        </button>
      </div>

      {rows.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <p className="text-lg">No foods added yet</p>
          <p className="text-sm mt-1">Click "Add Food" to start calculating your nutrition</p>
        </div>
      ) : (
        <div className="scrollable-table rounded-lg border border-border">
          <table className="nutrition-table">
            <thead className="sticky top-0 z-10">
              <tr>
                <th className="min-w-[200px]">Food</th>
                <th className="min-w-[100px]">Qty (g)</th>
                {NUTRIENT_KEYS.map((k) => (
                  <th key={k} className="text-right min-w-[80px]">
                    {NUTRIENT_LABELS[k]}
                  </th>
                ))}
                <th className="w-12"></th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => {
                const food = foodDatabase[row.foodIndex];
                const factor = row.quantity / 100;
                return (
                  <tr key={row.id} className="fade-in">
                    <td>
                      <select
                        value={row.foodIndex}
                        onChange={(e) =>
                          onUpdate(row.id, "foodIndex", Number(e.target.value))
                        }
                        className="nutrition-input text-sm max-w-[220px]"
                      >
                        {foodDatabase.map((f, i) => (
                          <option key={i} value={i}>
                            {f.name}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <input
                        type="number"
                        min="0"
                        value={row.quantity}
                        onChange={(e) =>
                          onUpdate(row.id, "quantity", Number(e.target.value) || 0)
                        }
                        className="nutrition-input w-20 text-center"
                      />
                    </td>
                    {NUTRIENT_KEYS.map((k) => (
                      <td key={k} className="text-right tabular-nums">
                        {(food[k] * factor).toFixed(2)}
                      </td>
                    ))}
                    <td>
                      <button
                        onClick={() => onRemove(row.id)}
                        className="text-destructive hover:text-destructive/80 transition-colors p-1"
                        title="Remove"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
