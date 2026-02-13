"use client";

import { TiptapEditor } from "../tiptap-editor";
import type { ParagraphData } from "@/types";

type Props = {
  data: ParagraphData;
  onChange: (data: ParagraphData) => void;
  readOnly?: boolean;
};

// paragraph block - rich text via tiptap
export function ParagraphBlock({ data, onChange, readOnly }: Props) {
  if (readOnly) {
    return (
      <div
        className="prose max-w-none"
        dangerouslySetInnerHTML={{ __html: data.html }}
      />
    );
  }

  return (
    <TiptapEditor
      content={data.html}
      onUpdate={(html) => onChange({ html })}
      placeholder="Write something..."
    />
  );
}
