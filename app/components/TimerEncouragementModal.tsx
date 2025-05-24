"use client";
import { motion, AnimatePresence } from "framer-motion";

export default function TimerEncouragementModal({
  open,
  onForceStop,
  onClose,
}: {
  open: boolean;
  onForceStop: () => void;
  onClose: () => void;
}) {
  if (!open) return null;
  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        // 👉 close on overlay click
        onClick={onClose}
      >
        <motion.div
          className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-lg max-w-xs w-full text-center border dark:border-gray-700"
          initial={{ scale: 0.95, opacity: 0, y: 40 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: -40 }}
          // 👉 prevent close when clicking inside modal
          onClick={e => e.stopPropagation()}
        >
          <h3 className="font-bold text-lg mb-2 text-gray-800 dark:text-gray-100">
            Stay Focused!
          </h3>
          <p className="mb-4 text-gray-700 dark:text-gray-300">
            You’re working hard. Just a little more! 🚀<br/>
            If you really need to leave, you can force stop the timer.
          </p>
          <button
            className="w-full py-2 bg-red-600 hover:bg-red-700 text-white rounded font-semibold transition mb-2"
            onClick={onForceStop}
          >
            Force Stop Timer
          </button>
          <button
            className="w-full py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded font-semibold"
            onClick={onClose}
          >
            Keep Focusing
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
