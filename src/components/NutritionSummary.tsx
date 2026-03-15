import { NUTRIENT_KEYS, NUTRIENT_LABELS } from "@/data/foodDatabase";

interface Props {
  totals: Record<string, number>;
}

export const NutritionSummary = ({ totals }: Props) => {
  return (
    <div className="nutrition-card">
      <h2 className="section-title mb-4">
        <span className="text-info">📊</span> Total Nutrition Summary
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
        {NUTRIENT_KEYS.map((k) => (
          <div
            key={k}
            className="bg-muted rounded-lg p-3 text-center"
          >
            <div className="text-xs text-muted-foreground font-medium mb-1">
              {NUTRIENT_LABELS[k]}
            </div>
            <div className="text-lg font-semibold text-foreground tabular-nums">
              {totals[k].toFixed(2)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
