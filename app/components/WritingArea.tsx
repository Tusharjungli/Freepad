"use client";
import { useEffect, useRef, useState } from "react";
import {
  Bold, Italic, Underline, Strikethrough,
  Heading1, List, ListOrdered, Quote,
  Link as LinkIcon, Minus, Undo2, Redo2, Eraser
} from "lucide-react";

export default function WritingArea() {
  const [text, setText] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [future, setFuture] = useState<string[]>([]);
  const [status, setStatus] = useState<"saved" | "saving" | "unsaved">("saved");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const saveTimeout = useRef<NodeJS.Timeout | null>(null);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("freepad-text") || "";
    setText(saved);
  }, []);

  // Autosave on text change (with debounce)
  useEffect(() => {
    if (saveTimeout.current) clearTimeout(saveTimeout.current);
    setStatus("saving");
    saveTimeout.current = setTimeout(() => {
      localStorage.setItem("freepad-text", text);
      setStatus("saved");
    }, 700); // Save after 700ms of pause
    return () => {
      if (saveTimeout.current) clearTimeout(saveTimeout.current);
    };
  }, [text]);

  // Save history for undo/redo
  useEffect(() => {
    setHistory((prev) => (prev.length > 100 ? prev.slice(1) : [...prev, text]));
  }, [text]);

  // Helpers for formatting
  function formatSelected(before: string, after?: string) {
    if (!textareaRef.current) return;
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = text.substring(start, end);
    const newText =
      text.substring(0, start) +
      before +
      selected +
      (after ?? before) +
      text.substring(end);
    setText(newText);
    // Reselect after format
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + before.length,
        end + before.length
      );
    }, 10);
    setStatus("unsaved");
  }

  function insertAtCursor(insertText: string) {
    if (!textareaRef.current) return;
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const newText =
      text.substring(0, start) + insertText + text.substring(end);
    setText(newText);
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + insertText.length, start + insertText.length);
    }, 10);
    setStatus("unsaved");
  }

  function clearText() {
    setText("");
    setStatus("unsaved");
    textareaRef.current?.focus();
  }

  function undo() {
    if (history.length > 1) {
      setFuture([text, ...future]);
      setText(history[history.length - 2]);
      setHistory(history.slice(0, -1));
      setStatus("unsaved");
    }
  }

  function redo() {
    if (future.length > 0) {
      setHistory([...history, future[0]]);
      setText(future[0]);
      setFuture(future.slice(1));
      setStatus("unsaved");
    }
  }

  return (
    <div className="flex flex-col items-center w-full">
      {/* Writing area */}
      <textarea
        ref={textareaRef}
        className="w-full max-w-3xl min-h-[400px] md:min-h-[500px] lg:min-h-[600px] px-5 py-6 rounded-2xl text-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 resize-none transition"
        placeholder="Start writing your thoughts..."
        value={text}
        onChange={e => {
          setText(e.target.value);
          setStatus("unsaved");
          setFuture([]); // clear redo stack
        }}
        spellCheck={true}
      />
      {/* Saved status */}
      <div className="mt-2 text-sm text-gray-400 h-5">
        {status === "saving" && <span>Saving...</span>}
        {status === "saved" && <span className="text-green-500">Saved</span>}
        {status === "unsaved" && <span className="text-yellow-500">Unsaved</span>}
      </div>
      {/* Toolbar */}
      <div
        className="mt-2 w-full max-w-3xl flex items-center justify-center gap-2 px-2 py-1
          rounded-xl bg-gray-100/80 dark:bg-gray-800/80 shadow border border-gray-200 dark:border-gray-700
          h-9"
      >
        <button title="Bold" aria-label="Bold"
          onClick={() => formatSelected("**")}
          className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition"
          type="button"><Bold size={16} /></button>
        <button title="Italic" aria-label="Italic"
          onClick={() => formatSelected("_")}
          className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition"
          type="button"><Italic size={16} /></button>
        <button title="Underline" aria-label="Underline"
          onClick={() => formatSelected("<u>", "</u>")}
          className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition"
          type="button"><Underline size={16} /></button>
        <button title="Strikethrough" aria-label="Strikethrough"
          onClick={() => formatSelected("~~")}
          className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition"
          type="button"><Strikethrough size={16} /></button>
        <button title="Heading" aria-label="Heading"
          onClick={() => insertAtCursor("\n# ")}
          className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition"
          type="button"><Heading1 size={16} /></button>
        <button title="Bullet List" aria-label="Bullet List"
          onClick={() => insertAtCursor("\n- ")}
          className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition"
          type="button"><List size={16} /></button>
        <button title="Numbered List" aria-label="Numbered List"
          onClick={() => insertAtCursor("\n1. ")}
          className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition"
          type="button"><ListOrdered size={16} /></button>
        <button title="Quote" aria-label="Quote"
          onClick={() => insertAtCursor("\n> ")}
          className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition"
          type="button"><Quote size={16} /></button>
        <button title="Link" aria-label="Link"
          onClick={() => insertAtCursor("[Link text](https://)")}
          className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition"
          type="button"><LinkIcon size={16} /></button>
        <button title="Divider" aria-label="Divider"
          onClick={() => insertAtCursor("\n---\n")}
          className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition"
          type="button"><Minus size={16} /></button>
        <button title="Undo" aria-label="Undo"
          onClick={undo}
          className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition"
          type="button"><Undo2 size={16} /></button>
        <button title="Redo" aria-label="Redo"
          onClick={redo}
          className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition"
          type="button"><Redo2 size={16} /></button>
        <button title="Clear" aria-label="Clear"
          onClick={clearText}
          className="p-1 rounded hover:bg-red-100 dark:hover:bg-red-900 transition"
          type="button"><Eraser size={16} /></button>
      </div>
    </div>
  );
}
