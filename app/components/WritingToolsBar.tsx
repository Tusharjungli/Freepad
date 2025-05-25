// components/WritingToolsBar.tsx
"use client";
import { Bold, Italic, Underline, List, Heading1, Heading2 } from "lucide-react";

export default function WritingToolsBar({ onCommand }: { onCommand: (cmd: string, value?: string) => void }) {
  return (
    <div className="w-full max-w-5xl flex items-center gap-2 mt-6 mb-2 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 px-4 py-3 shadow">
      <button onClick={() => onCommand("bold")} className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700" title="Bold"><Bold size={18} /></button>
      <button onClick={() => onCommand("italic")} className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700" title="Italic"><Italic size={18} /></button>
      <button onClick={() => onCommand("underline")} className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700" title="Underline"><Underline size={18} /></button>
      <button onClick={() => onCommand("formatBlock", "h1")} className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700" title="Heading 1"><Heading1 size={18} /></button>
      <button onClick={() => onCommand("formatBlock", "h2")} className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700" title="Heading 2"><Heading2 size={18} /></button>
      <button onClick={() => onCommand("insertUnorderedList")} className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700" title="Bulleted List"><List size={18} /></button>
    </div>
  );
}
