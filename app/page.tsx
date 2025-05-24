"use client";
import { useState, useEffect, useRef } from "react";
import Header from "./components/Header";
import WritingArea from "./components/WritingArea";
import FocusTimerModal from "./components/FocusTimerModal";
import NotebookDrawer from "./components/NotebookDrawer";
import { AnimatePresence, motion } from "framer-motion";

// Timer Encouragement Modal — closes on overlay or buttons
function EncouragementModal({
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
        onClick={onClose} // Overlay click closes modal
      >
        <motion.div
          className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-lg max-w-xs w-full text-center border dark:border-gray-700"
          initial={{ scale: 0.95, opacity: 0, y: 40 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: -40 }}
          onClick={(e) => e.stopPropagation()} // Prevent close if inside box
        >
          <h3 className="font-bold text-lg mb-2 text-gray-800 dark:text-gray-100">
            Stay Focused!
          </h3>
          <p className="mb-4 text-gray-700 dark:text-gray-300">
            You’re working hard. Just a little more! 🚀<br />
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

export default function Home() {
  // Drawer state
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Timer state
  const [timerOpen, setTimerOpen] = useState(false);
  const [encouragementOpen, setEncouragementOpen] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [showCongrats, setShowCongrats] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Start timer
  const handleStartTimer = (seconds: number) => {
    setSecondsLeft(seconds);
    setIsTimerActive(true);
    setTimerOpen(false);
    setShowCongrats(false);
  };

  // Timer countdown effect
  useEffect(() => {
    if (!isTimerActive) return;
    if (secondsLeft <= 0) {
      setIsTimerActive(false);
      setShowCongrats(true);
      return;
    }
    intervalRef.current = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(intervalRef.current!);
  }, [secondsLeft, isTimerActive]);

  // Dismiss congrats message after 1.5s
  useEffect(() => {
    if (showCongrats) {
      const t = setTimeout(() => setShowCongrats(false), 1500);
      return () => clearTimeout(t);
    }
  }, [showCongrats]);

  // Timer display MM:SS
  const timerDisplay = isTimerActive
    ? `${String(Math.floor(secondsLeft / 60)).padStart(2, "0")}:${String(
        secondsLeft % 60
      ).padStart(2, "0")}`
    : null;

  // Handle timer icon click:
  const handleTimerIconClick = () => {
    if (isTimerActive) {
      setEncouragementOpen(true);
    } else {
      setTimerOpen(true);
    }
  };

  // Handle force stop:
  const handleForceStop = () => {
    setIsTimerActive(false);
    setSecondsLeft(0);
    setEncouragementOpen(false);
  };

  return (
    <main className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-300">
      <Header
        onMenuClick={() => setDrawerOpen(true)}
        onTimerClick={handleTimerIconClick}
        timerDisplay={timerDisplay}
      />

      {/* Notebook Drawer */}
      <NotebookDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />

      {/* Minimal, clean, non-intrusive congrats bar below header */}
      <AnimatePresence>
        {showCongrats && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.45 }}
            className="fixed left-1/2 -translate-x-1/2 top-16 z-40"
          >
            <div className="bg-gray-800 dark:bg-gray-100 text-gray-100 dark:text-gray-900 border border-gray-300 dark:border-gray-800 px-6 py-2 rounded-xl shadow font-semibold text-base select-none min-w-[180px] text-center">
              Session complete. Nice work!
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <section className="flex-1 flex flex-col items-center justify-center">
        <WritingArea />
      </section>

      <FocusTimerModal
        open={timerOpen}
        onStart={handleStartTimer}
        onClose={() => setTimerOpen(false)}
      />
      <EncouragementModal
        open={encouragementOpen}
        onForceStop={handleForceStop}
        onClose={() => setEncouragementOpen(false)}
      />

      <footer className="text-center text-xs text-gray-400 py-4">
        Made by Introvert
      </footer>
    </main>
  );
}
