"use client";

import type { Block } from "@/types";
import { BlockRenderer } from "./block-renderer";

type Props = {
  block: Block;
};

// wraps block-renderer w/ noop handlers for ssr-safe readonly usage
export function ReadOnlyBlockRenderer({ block }: Props) {
  return (
    <BlockRenderer
      block={block}
      onChange={() => {}}
      onDelete={() => {}}
      onMoveUp={() => {}}
      onMoveDown={() => {}}
      isFirst
      isLast
      readOnly
    />
  );
}
