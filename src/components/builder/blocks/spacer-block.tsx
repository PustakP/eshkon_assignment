"use client";

import type { SpacerData } from "@/types";

type Props = {
  data: SpacerData;
  onChange: (data: SpacerData) => void;
  readOnly?: boolean;
};

// spacer block - configurable height
export function SpacerBlock({ data, onChange, readOnly }: Props) {
  if (readOnly) {
    return <div style={{ height: `${data.height}px` }} />;
  }

  return (
    <div className="flex items-center gap-2">
      <div
        className="flex-1 border border-dashed border-beige-dark bg-beige"
        style={{ height: `${data.height}px` }}
      />
      <input
        type="number"
        value={data.height}
        onChange={(e) => onChange({ height: Math.max(8, Number(e.target.value)) })}
        className="w-16 border border-beige-dark bg-beige px-2 py-1 text-sm focus:border-brand focus:outline-none"
        min={8}
        max={200}
      />
      <span className="text-xs text-muted">px</span>
    </div>
  );
}
