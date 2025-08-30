import { motion } from "framer-motion";
import { useHangman } from "../../contexts/HangManContext";
import { useState } from "react";
import SettingsModal from "../modals/SettingsModal";

function HomeScreen() {
  const [settings, setIsSetthings] = useState(false);
  const { difficulty, level, dispatch } = useHangman();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, staggerChildren: 0.1 }}
      className="relative w-full max-h-screen h-screen
      flex flex-col gap-10 justify-around md:gap-3
    "
      style={{
        scrollbarWidth: "none",
        msOverflowStyle: "none",
      }}
    >
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="flex  justify-between pl-4"
      >
        <div className="bg-[url('/src/assets/images/icons/level-board.svg')] bg-contain bg-center bg-no-repeat w-24 h-12 flex items-center justify-center">
          <span className="text-white font-bold">Level {level}</span>
        </div>
        <div className="flex flex-col pr-4">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="cursor-pointer"
            onClick={() => setIsSetthings(true)}
          >
            <img
              src="/src/assets/images/icons/settings.svg"
              alt="Settings"
              className="w-15 h-15"
            />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="cursor-pointer"
          >
            <img
              src="/src/assets/images/icons/sound-icon.svg"
              alt="Settings"
              className="w-15 h-15"
            />
          </motion.button>
        </div>
      </motion.div>

      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="flex flex-col items-center justify-center"
      >
        <motion.img
          src="/src/assets/images/hangman-parts/hangman-hs-text.svg"
          alt="Hang man text"
          initial={{ y: -60 }}
          animate={{ y: 0 }}
          transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
          className="md:w-80 md:h-auto"
        />
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
          className="cursor-pointer"
          onClick={() => dispatch({ type: "BUTTON_NAV", payload: "loading" })}
        >
          <img
            src="/src/assets/images/icons/play.svg"
            alt="Play button"
            className="w-40 h-40 md:w-60 md:h-60"
          />
        </motion.button>
      </motion.div>

      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="flex items-center justify-between px-2"
      >
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="cursor-pointer"
        >
          <img
            src="/src/assets/images/icons/help.svg"
            alt="Help icon"
            className="w-15 h-15"
          />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="bg-[url('/src/assets/images/icons/difficulty-board.svg')] bg-contain bg-center bg-no-repeat w-24 h-10 flex items-center justify-center cursor-pointer"
          onClick={() =>
            dispatch({ type: "BUTTON_NAV", payload: "difficulty" })
          }
        >
          <span className="text-white font-bold">
            {difficulty.toUpperCase()}
          </span>
        </motion.button>
      </motion.div>

      {settings && <SettingsModal onSettings={setIsSetthings} />}
    </motion.div>
  );
}

export default HomeScreen;
