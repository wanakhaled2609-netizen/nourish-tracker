import { useState } from "react";
import { foodDatabase, NUTRIENT_KEYS, NUTRIENT_LABELS } from "@/data/foodDatabase";
import { Search } from "lucide-react";

export const FoodDatabaseTable = () => {
  const [search, setSearch] = useState("");

  const filtered = search
    ? foodDatabase.filter((f) =>
        f.name.toLowerCase().includes(search.toLowerCase())
      )
    : foodDatabase;

  return (
    <div className="nutrition-card">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <h2 className="section-title">
          <span className="text-primary">📋</span> Food Database
          <span className="text-xs font-normal text-muted-foreground ml-1">
            ({foodDatabase.length} items, per 100g)
          </span>
        </h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search foods..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="nutrition-input pl-9 w-64"
          />
        </div>
      </div>
      <div className="scrollable-table max-h-[300px] rounded-lg border border-border">
        <table className="nutrition-table">
          <thead className="sticky top-0 z-10">
            <tr>
              <th className="min-w-[200px]">Food Name</th>
              {NUTRIENT_KEYS.map((k) => (
                <th key={k} className="text-right min-w-[80px]">
                  {NUTRIENT_LABELS[k]}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((food, i) => (
              <tr key={i}>
                <td className="font-medium text-foreground whitespace-nowrap">
                  {food.name}
                </td>
                {NUTRIENT_KEYS.map((k) => (
                  <td key={k} className="text-right tabular-nums">
                    {food[k]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
