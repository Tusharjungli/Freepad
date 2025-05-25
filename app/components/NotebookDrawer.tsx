"use client";
import { useNotebookStore } from "@/lib/store/notebookStore";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Edit2, Trash2, BookOpen } from "lucide-react";
import { useState } from "react";

export default function NotebookDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const {
    notebooks,
    currentId,
    createNotebook,
    setCurrentNotebook,
    renameNotebook,
    deleteNotebook,
  } = useNotebookStore();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState("");

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Overlay */}
          <motion.div
            className="fixed inset-0 z-40 bg-black bg-opacity-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          {/* Drawer */}
          <motion.aside
            className="fixed top-0 left-0 bottom-0 w-[290px] bg-white dark:bg-gray-900 z-50 shadow-xl border-r border-gray-200 dark:border-gray-800 flex flex-col"
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-800">
              <div className="font-bold text-xl text-gray-700 dark:text-gray-200 flex items-center gap-2">
                <BookOpen size={22} /> Notebooks
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-800 dark:hover:text-gray-100"
                aria-label="Close menu"
              >
                ×
              </button>
            </div>
            <nav className="flex-1 flex flex-col px-4 py-2 gap-2">
              {notebooks.map((nb) =>
                editingId === nb.id ? (
                  <div key={nb.id} className="flex items-center gap-2">
                    <input
                      className="w-full px-2 py-1 rounded border dark:bg-gray-800 dark:border-gray-600"
                      value={renameValue}
                      autoFocus
                      onChange={e => setRenameValue(e.target.value)}
                      onBlur={() => {
                        renameNotebook(nb.id, renameValue.trim() || "Untitled");
                        setEditingId(null);
                      }}
                      onKeyDown={e => {
                        if (e.key === "Enter") {
                          renameNotebook(nb.id, renameValue.trim() || "Untitled");
                          setEditingId(null);
                        }
                      }}
                    />
                  </div>
                ) : (
                  <div
                    key={nb.id}
                    className={`flex items-center gap-2 py-2 px-2 rounded cursor-pointer group
                      ${nb.id === currentId
                        ? "bg-green-100 dark:bg-gray-800 font-bold text-green-700 dark:text-green-400"
                        : "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-800 dark:text-gray-200"}`}
                    onClick={() => setCurrentNotebook(nb.id)}
                  >
                    <span className="flex-1 truncate">{nb.name}</span>
                    <button
                      className="opacity-60 hover:opacity-100 p-1"
                      onClick={e => {
                        e.stopPropagation();
                        setRenameValue(nb.name);
                        setEditingId(nb.id);
                      }}
                      title="Rename"
                    >
                      <Edit2 size={16} />
                    </button>
                    {notebooks.length > 1 && (
                      <button
                        className="opacity-60 hover:opacity-100 p-1"
                        onClick={e => {
                          e.stopPropagation();
                          if (confirm("Delete this notebook?")) deleteNotebook(nb.id);
                        }}
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                )
              )}
              <button
                onClick={() => createNotebook()}
                className="flex items-center gap-2 mt-4 px-2 py-2 bg-gray-100 dark:bg-gray-800 rounded font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 transition"
              >
                <Plus size={16} /> New Notebook
              </button>
            </nav>
            <div className="p-4 text-xs text-gray-400 dark:text-gray-500 border-t border-gray-100 dark:border-gray-800">
              Made by Introvert
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
