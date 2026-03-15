import { NUTRIENT_KEYS, NUTRIENT_LABELS } from "@/data/foodDatabase";

interface Props {
  totals: Record<string, number>;
  requirements: Record<string, number>;
  differences: Record<string, number>;
}

export const ComparisonTable = ({ totals, requirements, differences }: Props) => {
  return (
    <div className="nutrition-card">
      <h2 className="section-title mb-4">
        <span className="text-secondary">⚖️</span> Nutrition Comparison
      </h2>
      <div className="scrollable-table rounded-lg border border-border">
        <table className="nutrition-table">
          <thead>
            <tr>
              <th className="min-w-[160px]">Category</th>
              {NUTRIENT_KEYS.map((k) => (
                <th key={k} className="text-right min-w-[80px]">
                  {NUTRIENT_LABELS[k]}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="font-semibold text-foreground">Total Consumed</td>
              {NUTRIENT_KEYS.map((k) => (
                <td key={k} className="text-right tabular-nums">
                  {totals[k].toFixed(2)}
                </td>
              ))}
            </tr>
            <tr>
              <td className="font-semibold text-foreground">Required</td>
              {NUTRIENT_KEYS.map((k) => (
                <td key={k} className="text-right tabular-nums">
                  {requirements[k].toFixed(2)}
                </td>
              ))}
            </tr>
            <tr className="font-semibold">
              <td className="text-foreground">Difference</td>
              {NUTRIENT_KEYS.map((k) => (
                <td
                  key={k}
                  className={`text-right tabular-nums ${
                    differences[k] >= 0 ? "diff-positive" : "diff-negative"
                  }`}
                >
                  {differences[k] >= 0 ? "+" : ""}
                  {differences[k].toFixed(2)}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
