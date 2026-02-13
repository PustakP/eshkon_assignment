"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import type { Block, BlockType, BlockData } from "@/types";
import { BlockRenderer } from "./block-renderer";
import { BlockToolbar } from "./block-toolbar";
import { updatePageContent } from "@/lib/actions/pages";
import { Save } from "lucide-react";

type Props = {
  pageId: string;
  initialBlocks: Block[];
};

// gen unique block id
function genId(): string {
  return Math.random().toString(36).slice(2, 10);
}

// default data for each block type
function getDefaultData(type: BlockType): BlockData {
  switch (type) {
    case "heading":
      return { level: 1, text: "" };
    case "paragraph":
      return { html: "" };
    case "image":
      return { url: "", alt: "" };
    case "divider":
      return {};
    case "spacer":
      return { height: 40 };
  }
}

// main block editor - manages block state + auto-save
export function BlockEditor({ pageId, initialBlocks }: Props) {
  const [blocks, setBlocks] = useState<Block[]>(initialBlocks);
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const saveTimer = useRef<ReturnType<typeof setTimeout>>(null);

  // debounced auto-save
  const debouncedSave = useCallback(
    (updatedBlocks: Block[]) => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
      saveTimer.current = setTimeout(async () => {
        setSaving(true);
        try {
          await updatePageContent(pageId, updatedBlocks);
          setLastSaved(new Date());
        } catch (err) {
          console.error("auto-save failed:", err);
        } finally {
          setSaving(false);
        }
      }, 1500);
    },
    [pageId]
  );

  // cleanup timer
  useEffect(() => {
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
  }, []);

  // add block
  function addBlock(type: BlockType) {
    const newBlock: Block = { id: genId(), type, data: getDefaultData(type) };
    const updated = [...blocks, newBlock];
    setBlocks(updated);
    debouncedSave(updated);
  }

  // update block data
  function updateBlock(index: number, data: BlockData) {
    const updated = blocks.map((b, i) => (i === index ? { ...b, data } : b));
    setBlocks(updated);
    debouncedSave(updated);
  }

  // delete block
  function deleteBlock(index: number) {
    const updated = blocks.filter((_, i) => i !== index);
    setBlocks(updated);
    debouncedSave(updated);
  }

  // move block up/down
  function moveBlock(index: number, direction: "up" | "down") {
    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= blocks.length) return;
    const updated = [...blocks];
    [updated[index], updated[newIndex]] = [updated[newIndex], updated[index]];
    setBlocks(updated);
    debouncedSave(updated);
  }

  // manual save
  async function handleManualSave() {
    if (saveTimer.current) clearTimeout(saveTimer.current);
    setSaving(true);
    try {
      await updatePageContent(pageId, blocks);
      setLastSaved(new Date());
    } catch (err) {
      console.error("save failed:", err);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-4">
      {/* save status bar */}
      <div className="flex items-center justify-between text-xs text-muted">
        <div>
          {saving && "Saving..."}
          {!saving && lastSaved && `Saved at ${lastSaved.toLocaleTimeString()}`}
          {!saving && !lastSaved && "Not saved yet"}
        </div>
        <button
          type="button"
          onClick={handleManualSave}
          disabled={saving}
          className="flex items-center gap-1 border border-brand px-3 py-1 text-brand hover:bg-brand hover:text-white disabled:opacity-50"
        >
          <Save size={12} />
          Save
        </button>
      </div>

      {/* blocks */}
      <div className="ml-12">
        {blocks.map((block, i) => (
          <BlockRenderer
            key={block.id}
            block={block}
            onChange={(data) => updateBlock(i, data)}
            onDelete={() => deleteBlock(i)}
            onMoveUp={() => moveBlock(i, "up")}
            onMoveDown={() => moveBlock(i, "down")}
            isFirst={i === 0}
            isLast={i === blocks.length - 1}
          />
        ))}
      </div>

      {/* add block toolbar */}
      <BlockToolbar onAdd={addBlock} />
    </div>
  );
}
