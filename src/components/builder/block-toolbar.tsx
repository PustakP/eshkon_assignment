"use client";

import { Heading, Type, ImageIcon, Minus, ArrowUpDown } from "lucide-react";
import type { BlockType } from "@/types";

type Props = {
  onAdd: (type: BlockType) => void;
};

const BLOCK_OPTIONS: { type: BlockType; label: string; icon: React.ReactNode }[] = [
  { type: "heading", label: "Heading", icon: <Heading size={14} /> },
  { type: "paragraph", label: "Text", icon: <Type size={14} /> },
  { type: "image", label: "Image", icon: <ImageIcon size={14} /> },
  { type: "divider", label: "Divider", icon: <Minus size={14} /> },
  { type: "spacer", label: "Spacer", icon: <ArrowUpDown size={14} /> },
];

// toolbar to add new blocks
export function BlockToolbar({ onAdd }: Props) {
  return (
    <div className="flex flex-wrap gap-2 border border-dashed border-beige-dark bg-beige p-3">
      <span className="self-center text-xs text-muted">Add block:</span>
      {BLOCK_OPTIONS.map((opt) => (
        <button
          key={opt.type}
          type="button"
          onClick={() => onAdd(opt.type)}
          className="flex items-center gap-1 border border-beige-dark bg-surface px-3 py-1.5 text-xs font-medium text-gray-600 hover:border-brand hover:text-brand"
        >
          {opt.icon}
          {opt.label}
        </button>
      ))}
    </div>
  );
}
