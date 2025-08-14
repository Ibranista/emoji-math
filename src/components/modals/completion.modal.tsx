import React from "react";
import { createPortal } from "react-dom";

import { Typography } from "../ui/typography";

function CompletionModal({
  open,
  onClose,
  total,
  correct,
}: {
  open: boolean;
  onClose: () => void;
  total: number;
  correct: number;
}) {
  if (!open) return null;
  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl p-8 flex flex-col items-center relative w-[360px] max-w-full border-[3px] border-yellow-400 transform transition-all animate-pop-in">
        <Typography className="text-3xl font-bold text-yellow-600 mb-3">
          Congratulations! 🎉
        </Typography>
        <Typography className="text-lg text-gray-700 mb-6 text-center">
          You scored {correct}/{total} correct answers!
        </Typography>
        <button
          className="curosr-pointer mt-2 px-8 py-3 bg-yellow-400 hover:bg-yellow-500 text-white rounded-xl font-bold shadow-md hover:shadow-lg transition-all duration-200"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>,
    typeof window !== "undefined" ? document.body : ({} as HTMLElement),
  );
}

export default CompletionModal;
