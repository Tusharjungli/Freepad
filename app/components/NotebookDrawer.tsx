"use client";
import { motion, AnimatePresence } from "framer-motion";

export default function NotebookDrawer({
  open,
  onClose,
  children,
}: {
  open: boolean;
  onClose: () => void;
  children?: React.ReactNode;
}) {
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
            className="fixed top-0 left-0 bottom-0 w-[270px] bg-white dark:bg-gray-900 z-50 shadow-xl border-r border-gray-200 dark:border-gray-800 flex flex-col"
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <button
              onClick={onClose}
              className="self-end m-4 text-gray-400 hover:text-gray-800 dark:hover:text-gray-100"
              aria-label="Close menu"
            >
              ×
            </button>
            <nav className="flex-1 flex flex-col px-6 py-2 gap-2">
              <div className="font-bold text-lg mb-4 text-gray-700 dark:text-gray-200">
                Menu
              </div>
              <a className="py-2 px-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition text-gray-800 dark:text-gray-200 font-medium" href="#">
                Login / Signup
              </a>
              <a className="py-2 px-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition text-gray-800 dark:text-gray-200 font-medium" href="#">
                Tools & Sheets
              </a>
              <a className="py-2 px-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition text-gray-800 dark:text-gray-200 font-medium" href="#">
                Your Notebooks
              </a>
              {/* Add more as needed */}
            </nav>
            {children}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
