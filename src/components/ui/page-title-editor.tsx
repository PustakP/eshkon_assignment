"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { updatePageTitle } from "@/lib/actions/pages";

type Props = {
  pageId: string;
  initialTitle: string;
};

// inline editable page title w/ debounced save
export function PageTitleEditor({ pageId, initialTitle }: Props) {
  const [title, setTitle] = useState(initialTitle);
  const timer = useRef<ReturnType<typeof setTimeout>>(null);

  const save = useCallback(
    (newTitle: string) => {
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(async () => {
        try {
          await updatePageTitle(pageId, newTitle);
        } catch (err) {
          console.error("title save failed:", err);
        }
      }, 1000);
    },
    [pageId]
  );

  useEffect(() => {
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setTitle(e.target.value);
    save(e.target.value);
  }

  return (
    <input
      type="text"
      value={title}
      onChange={handleChange}
      className="bg-transparent text-xl font-bold focus:outline-none focus:border-b focus:border-brand"
      placeholder="Untitled page"
    />
  );
}
