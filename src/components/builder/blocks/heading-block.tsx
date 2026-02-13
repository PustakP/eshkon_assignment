"use client";

import type { HeadingData } from "@/types";

type Props = {
  data: HeadingData;
  onChange: (data: HeadingData) => void;
  readOnly?: boolean;
};

// heading block - editable h1/h2/h3
export function HeadingBlock({ data, onChange, readOnly }: Props) {
  const Tag = `h${data.level}` as "h1" | "h2" | "h3";
  const sizes = { 1: "text-3xl", 2: "text-2xl", 3: "text-xl" };

  if (readOnly) {
    return <Tag className={`${sizes[data.level]} font-bold`}>{data.text}</Tag>;
  }

  return (
    <div>
      {/* level selector */}
      <div className="mb-1 flex gap-1">
        {([1, 2, 3] as const).map((lvl) => (
          <button
            key={lvl}
            type="button"
            onClick={() => onChange({ ...data, level: lvl })}
            className={`px-2 py-0.5 text-xs ${
              data.level === lvl ? "bg-brand text-white" : "bg-beige text-muted"
            }`}
          >
            H{lvl}
          </button>
        ))}
      </div>
      <input
        type="text"
        value={data.text}
        onChange={(e) => onChange({ ...data, text: e.target.value })}
        className={`w-full border-none bg-transparent ${sizes[data.level]} font-bold focus:outline-none`}
        placeholder="Heading text..."
      />
    </div>
  );
}
