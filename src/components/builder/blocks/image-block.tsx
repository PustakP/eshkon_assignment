"use client";

import type { ImageData } from "@/types";
import { ImageIcon } from "lucide-react";

type Props = {
  data: ImageData;
  onChange: (data: ImageData) => void;
  readOnly?: boolean;
};

// image block - url input + alt text
export function ImageBlock({ data, onChange, readOnly }: Props) {
  if (readOnly) {
    return data.url ? (
      <img src={data.url} alt={data.alt} className="max-w-full" />
    ) : null;
  }

  return (
    <div className="space-y-2">
      {data.url ? (
        <img src={data.url} alt={data.alt} className="max-w-full border border-beige-dark" />
      ) : (
        <div className="flex h-32 items-center justify-center border border-dashed border-beige-dark bg-beige text-muted">
          <ImageIcon size={24} />
        </div>
      )}
      <input
        type="url"
        value={data.url}
        onChange={(e) => onChange({ ...data, url: e.target.value })}
        className="w-full border border-beige-dark bg-beige px-3 py-1.5 text-sm focus:border-brand focus:outline-none"
        placeholder="Image URL..."
      />
      <input
        type="text"
        value={data.alt}
        onChange={(e) => onChange({ ...data, alt: e.target.value })}
        className="w-full border border-beige-dark bg-beige px-3 py-1.5 text-sm focus:border-brand focus:outline-none"
        placeholder="Alt text..."
      />
    </div>
  );
}
