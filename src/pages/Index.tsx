import { useState, useCallback, useMemo } from "react";
import { foodDatabase, NUTRIENT_KEYS, NUTRIENT_LABELS } from "@/data/foodDatabase";
import type { FoodItem } from "@/data/foodDatabase";
import { FoodDatabaseTable } from "@/components/FoodDatabaseTable";
import { CalculatorTable } from "@/components/CalculatorTable";
import { NutritionSummary } from "@/components/NutritionSummary";
import { DailyRequirements } from "@/components/DailyRequirements";
import { ComparisonTable } from "@/components/ComparisonTable";
import { ExportButtons } from "@/components/ExportButtons";

export interface CalculatorRow {
  id: string;
  foodIndex: number;
  quantity: number;
}

const Index = () => {
  const [rows, setRows] = useState<CalculatorRow[]>([]);
  const [requirements, setRequirements] = useState<Record<string, number>>(() => {
    const init: Record<string, number> = {};
    NUTRIENT_KEYS.forEach((k) => (init[k] = 0));
    return init;
  });

  const addRow = useCallback(() => {
    setRows((prev) => [
      ...prev,
      { id: crypto.randomUUID(), foodIndex: 0, quantity: 100 },
    ]);
  }, []);

  const removeRow = useCallback((id: string) => {
    setRows((prev) => prev.filter((r) => r.id !== id));
  }, []);

  const updateRow = useCallback((id: string, field: "foodIndex" | "quantity", value: number) => {
    setRows((prev) =>
      prev.map((r) => (r.id === id ? { ...r, [field]: value } : r))
    );
  }, []);

  const totals = useMemo(() => {
    const t: Record<string, number> = {};
    NUTRIENT_KEYS.forEach((k) => (t[k] = 0));
    rows.forEach((row) => {
      const food = foodDatabase[row.foodIndex];
      if (!food) return;
      const factor = row.quantity / 100;
      NUTRIENT_KEYS.forEach((k) => {
        t[k] += food[k] * factor;
      });
    });
    return t;
  }, [rows]);

  const differences = useMemo(() => {
    const d: Record<string, number> = {};
    NUTRIENT_KEYS.forEach((k) => {
      d[k] = totals[k] - requirements[k];
    });
    return d;
  }, [totals, requirements]);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-[1400px] mx-auto px-4 py-8 space-y-6">
        <header className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground tracking-tight">
            🥗 Nutrition Calculator
          </h1>
          <p className="text-muted-foreground mt-1">
            Track your daily nutrient intake and compare it to your requirements
          </p>
        </header>

        <FoodDatabaseTable />
        <CalculatorTable
          rows={rows}
          onAdd={addRow}
          onRemove={removeRow}
          onUpdate={updateRow}
        />
        <NutritionSummary totals={totals} />
        <DailyRequirements
          requirements={requirements}
          onChange={setRequirements}
        />
        <ComparisonTable
          totals={totals}
          requirements={requirements}
          differences={differences}
        />
        <ExportButtons
          rows={rows}
          totals={totals}
          requirements={requirements}
          differences={differences}
        />
      </div>
    </div>
  );
};

export default Index;
