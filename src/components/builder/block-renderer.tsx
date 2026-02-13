"use client";

import type { Block, BlockData } from "@/types";
import { HeadingBlock } from "./blocks/heading-block";
import { ParagraphBlock } from "./blocks/paragraph-block";
import { ImageBlock } from "./blocks/image-block";
import { DividerBlock } from "./blocks/divider-block";
import { SpacerBlock } from "./blocks/spacer-block";
import { Trash2, ChevronUp, ChevronDown } from "lucide-react";

type Props = {
  block: Block;
  onChange: (data: BlockData) => void;
  onDelete: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  isFirst: boolean;
  isLast: boolean;
  readOnly?: boolean;
};

// renders a single block w/ controls
export function BlockRenderer({
  block,
  onChange,
  onDelete,
  onMoveUp,
  onMoveDown,
  isFirst,
  isLast,
  readOnly,
}: Props) {
  function renderBlock() {
    switch (block.type) {
      case "heading":
        return (
          <HeadingBlock
            data={block.data as any}
            onChange={onChange}
            readOnly={readOnly}
          />
        );
      case "paragraph":
        return (
          <ParagraphBlock
            data={block.data as any}
            onChange={onChange}
            readOnly={readOnly}
          />
        );
      case "image":
        return (
          <ImageBlock
            data={block.data as any}
            onChange={onChange}
            readOnly={readOnly}
          />
        );
      case "divider":
        return <DividerBlock />;
      case "spacer":
        return (
          <SpacerBlock
            data={block.data as any}
            onChange={onChange}
            readOnly={readOnly}
          />
        );
      default:
        return <div className="text-sm text-muted">Unknown block type</div>;
    }
  }

  if (readOnly) {
    return <div className="mb-4">{renderBlock()}</div>;
  }

  return (
    <div className="group relative mb-3 border border-transparent hover:border-beige-dark">
      {/* block controls */}
      <div className="absolute -left-10 top-0 flex flex-col gap-0.5 opacity-0 group-hover:opacity-100">
        <button
          type="button"
          onClick={onMoveUp}
          disabled={isFirst}
          className="p-0.5 text-muted hover:text-brand disabled:invisible"
          title="Move up"
        >
          <ChevronUp size={14} />
        </button>
        <button
          type="button"
          onClick={onMoveDown}
          disabled={isLast}
          className="p-0.5 text-muted hover:text-brand disabled:invisible"
          title="Move down"
        >
          <ChevronDown size={14} />
        </button>
        <button
          type="button"
          onClick={onDelete}
          className="p-0.5 text-muted hover:text-red-500"
          title="Delete block"
        >
          <Trash2 size={14} />
        </button>
      </div>

      {/* block content */}
      <div className="px-2 py-1">{renderBlock()}</div>

      {/* block type label */}
      <span className="absolute -top-2.5 right-2 bg-beige px-1 text-[10px] uppercase text-muted opacity-0 group-hover:opacity-100">
        {block.type}
      </span>
    </div>
  );
}
