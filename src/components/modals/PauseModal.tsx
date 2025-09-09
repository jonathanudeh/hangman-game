import { type Dispatch, type SetStateAction } from "react";
import { motion } from "framer-motion";
import { useHangman } from "../../contexts/HangManContext";

interface ChildComponentProps {
  onPause: Dispatch<SetStateAction<boolean>>;
  onExit: Dispatch<SetStateAction<boolean>>;
  onIsHelpShowing: Dispatch<SetStateAction<boolean>>;
  onSettings: Dispatch<SetStateAction<boolean>>;
}

function PauseModal({
  onPause,
  onExit,
  onIsHelpShowing,
  onSettings,
}: ChildComponentProps) {
  const { dispatch } = useHangman();

  return (
    <div className="fixed w-full h-screen flex items-center justify-center">
      {/* dark background overlay */}
      <div className="absolute w-full h-screen inset-0 bg-black/30 z-3"></div>

      {/* main modal */}
      <div className="bg-[#C47C31] w-80 h-80 md:w-130 md:h-100 flex-col items-center justify-around rounded-2xl z-5">
        <div className="relative bg-[#E68929] text-white w-full h-1/5 flex items-center justify-center border-b-2 border-b-[#B0670B] p-2 text-3xl rounded-t-2xl">
          PAUSE
          <button
            className="absolute right-4 cursor-pointer"
            onClick={() => onPause(() => false)}
          >
            <img
              src="/assets/images/icons/cancel-btn.svg"
              alt="A cancel button"
              className="w-10 h-10"
            />
          </button>
        </div>

        {/*  */}
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
              onClick={() => onPause(() => false)}
            >
              <div className="bg-[url('/assets/images/icons/difficulty-board.svg')] bg-contain bg-center bg-no-repeat w-45 h-13 flex items-center justify-center">
                <span className="text-white font-bold">Resume</span>
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
                onPause(false);
                dispatch({ type: "RESET_GAME" });
              }}
            >
              <div className="bg-[url('/assets/images/icons/difficulty-board.svg')] bg-contain bg-center bg-no-repeat w-45 h-13 flex items-center justify-center">
                <span className="text-white font-bold">Restart</span>
              </div>
            </motion.button>
          </div>

          <motion.div
            className="relative flex items-center justify-between w-2/3 md:w-1/2 h-30 -mt-4"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="cursor-pointer -mt-10"
              onClick={() => onIsHelpShowing(true)}
            >
              <img
                src="/assets/images/icons/help-icon.svg"
                alt="Help icon"
                className="w-15 h-15"
              />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="cursor-pointer absolute top-10 left-1/2 -translate-x-1/2 z-20"
            >
              <img
                src="/assets/images/icons/home-icon.svg"
                alt="Home icon"
                className="w-15 h-15 "
                onClick={() => {
                  onExit(true);
                  onPause(false);
                }}
              />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="cursor-pointer -mt-10"
              onClick={() => {
                onPause(false);
                onSettings(true);
              }}
            >
              <img
                src="/assets/images/icons/settings.svg"
                alt="settings icon"
                className="w-15 h-15"
              />
            </motion.button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default PauseModal;
