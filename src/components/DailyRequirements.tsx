import { NUTRIENT_KEYS, NUTRIENT_LABELS } from "@/data/foodDatabase";

interface Props {
  requirements: Record<string, number>;
  onChange: (reqs: Record<string, number>) => void;
}

export const DailyRequirements = ({ requirements, onChange }: Props) => {
  const handleChange = (key: string, value: number) => {
    onChange({ ...requirements, [key]: value });
  };

  return (
    <div className="nutrition-card">
      <h2 className="section-title mb-4">
        <span className="text-warning">🎯</span> Daily Nutritional Requirements
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
        {NUTRIENT_KEYS.map((k) => (
          <div key={k} className="space-y-1">
            <label className="text-xs text-muted-foreground font-medium block">
              {NUTRIENT_LABELS[k]}
            </label>
            <input
              type="number"
              min="0"
              value={requirements[k] || ""}
              onChange={(e) => handleChange(k, Number(e.target.value) || 0)}
              className="nutrition-input text-center"
              placeholder="0"
            />
          </div>
        ))}
      </div>
    </div>
  );
};
