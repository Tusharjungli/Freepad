"use client";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

export default function FocusTimerModal({
  open,
  onStart,
  onClose,
}: {
  open: boolean;
  onStart: (seconds: number) => void;
  onClose: () => void;
}) {
  // Add hour, minute, second input states
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);

  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-40"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-2xl w-full max-w-xs text-center border border-gray-200 dark:border-gray-700"
          initial={{ opacity: 0, y: 80 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -40 }}
          transition={{ type: "spring", stiffness: 100, damping: 16 }}
        >
          <h3 className="text-2xl font-bold mb-2">Focus Timer</h3>
          <div className="flex justify-center gap-2 mb-4">
            <input
              type="number"
              min={0}
              max={23}
              value={hours}
              onChange={e => setHours(Number(e.target.value))}
              className="w-16 px-2 py-1 rounded bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-center"
              placeholder="Hrs"
            />
            <span className="text-lg mt-2">:</span>
            <input
              type="number"
              min={0}
              max={59}
              value={minutes}
              onChange={e => setMinutes(Number(e.target.value))}
              className="w-16 px-2 py-1 rounded bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-center"
              placeholder="Min"
            />
            <span className="text-lg mt-2">:</span>
            <input
              type="number"
              min={0}
              max={59}
              value={seconds}
              onChange={e => setSeconds(Number(e.target.value))}
              className="w-16 px-2 py-1 rounded bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-center"
              placeholder="Sec"
            />
          </div>
          <button
            className="w-full py-2 bg-green-600 hover:bg-green-700 text-white rounded font-semibold transition"
            onClick={() => {
              onStart(hours * 3600 + minutes * 60 + seconds);
            }}
            disabled={hours + minutes + seconds === 0}
          >
            Start
          </button>
          <button
            className="w-full mt-2 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded font-semibold"
            onClick={onClose}
          >
            Cancel
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
