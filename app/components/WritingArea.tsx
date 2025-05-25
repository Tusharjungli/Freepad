// components/WritingArea.tsx
"use client";
import { useNotebookStore } from "@/lib/store/notebookStore";
import { useEffect, useState, useRef } from "react";
import RichWritingArea from "./RichWritingArea";
import WritingToolsBar from "./WritingToolsBar";

export default function WritingArea() {
  const { notebooks, currentId, updateNotebook } = useNotebookStore();
  const current = notebooks.find(nb => nb.id === currentId);
  const [html, setHtml] = useState(current?.content ?? "");
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setHtml(current?.content ?? "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentId]);

  useEffect(() => {
    if (current && html !== current.content) {
      updateNotebook(current.id, html);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [html]);

  const handleCommand = (cmd: string, value?: string) => {
    if (document.activeElement !== editorRef.current) {
      editorRef.current?.focus();
    }
    document.execCommand(cmd, false, value);
  };

  if (!current)
    return (
      <div className="text-gray-500 dark:text-gray-400 text-center py-8">
        No notebook selected.
      </div>
    );

  return (
    <div className="flex flex-col items-center w-full">
      {/* Writing area and tools align at full width on large screens */}
      <div className="w-full flex flex-col items-center">
        <RichWritingArea
          value={html}
          onChange={setHtml}
          ref={editorRef}
        />
        <WritingToolsBar onCommand={handleCommand} />
      </div>
    </div>
  );
}
