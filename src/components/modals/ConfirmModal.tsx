import { motion } from "framer-motion";
import { useHangman } from "../../contexts/HangManContext";
import type { Dispatch, SetStateAction } from "react";

interface ChildComponentProps {
  onExit: Dispatch<SetStateAction<boolean>>;
  onPause: Dispatch<SetStateAction<boolean>>;
}

function ConfirmModal({ onExit, onPause }: ChildComponentProps) {
  const { dispatch } = useHangman();

  return (
    <div className="fixed w-full h-screen flex items-center justify-center z-10">
      {/* dark background overlay */}
      <div className="absolute w-full h-screen inset-0 bg-black/40 z-11"></div>

      {/* main modal */}
      <div className="bg-[#C47C31] w-80 h-62 md:w-100 md:h-70 flex-col items-center justify-start rounded-2xl z-12">
        <div className="relative bg-[#E68929] text-white w-full h-1/4 flex items-center justify-center border-b-2 border-b-[#B0670B] p-2 text-3xl rounded-t-2xl">
          EXIT ?
          <button
            className="absolute right-4 cursor-pointer"
            onClick={() => {
              onExit(() => false);
              onPause(() => true);
            }}
          >
            <img
              src="/assets/images/icons/cancel-btn.svg"
              alt="A cancel button"
              className="w-10 h-10"
            />
          </button>
        </div>

        <div className="w-full h-3/4 flex flex-col items-center justify-around">
          <div className="flex flex-col items-center justify-center gap-5 h-35">
            <motion.button
              className="cursor-pointer"
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              whileHover={{
                scale: 1.05,
                transition: { duration: 0.2 },
              }}
              whileTap={{ scale: 0.95 }}
              onClick={() => dispatch({ type: "BUTTON_NAV", payload: "home" })}
            >
              <div className="bg-[url('/assets/images/icons/difficulty-board.svg')] bg-contain bg-center bg-no-repeat w-45 h-13 flex items-center justify-center">
                <span className="text-white font-bold">YES</span>
              </div>
            </motion.button>

            <motion.button
              className="cursor-pointer"
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              whileHover={{
                scale: 1.05,
                transition: { duration: 0.2 },
              }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                onExit(() => false);
                onPause(true);
              }}
            >
              <div className="bg-[url('/assets/images/icons/difficulty-board.svg')] bg-contain bg-center bg-no-repeat w-45 h-13 flex items-center justify-center">
                <span className="text-white font-bold">NO</span>
              </div>
            </motion.button>
          </div>
        </div>
        {/*  */}
      </div>
    </div>
  );
}

export default ConfirmModal;
