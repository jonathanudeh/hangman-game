import { motion } from "framer-motion";
import { useHangman } from "../../contexts/HangManContext";
import { useState } from "react";
import SettingsModal from "../modals/SettingsModal";

function DifficultyScreen() {
  const [settings, setIsSetthings] = useState(false);
  const { sound, difficulty, dispatch } = useHangman();

  return (
    <div className="w-full h-screen flex flex-col">
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="flex justify-between"
      >
        <button
          className="bg-[url('/assets/images/icons/go-back.svg')] bg-contain bg-center bg-no-repeat w-15 h-15 flex items-center justify-center ml-2 cursor-pointer"
          onClick={() =>
            dispatch({
              type: "BUTTON_NAV",
              payload: "home",
            })
          }
        ></button>

        <div className="flex flex-col pr-2 md:pr-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="cursor-pointer"
            onClick={() => setIsSetthings(true)}
          >
            <img
              src="/assets/images/icons/settings.svg"
              alt="Settings"
              className="w-15 h-15"
            />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="cursor-pointer"
            onClick={() => dispatch({ type: "SET_SOUND" })}
          >
            <img
              src={`${
                sound
                  ? "/assets/images/icons/sound-icon.svg"
                  : "/assets/images/icons/mute-icon.svg"
              }`}
              alt="Settings"
              className="w-15 h-15"
            />
          </motion.button>
        </div>
      </motion.div>

      <div
        className={`h-2/5 md:h-1/2 flex flex-col items-center justify-between mt-15`}
      >
        <button
          className="bg-[url('/assets/images/icons/difficulty-board.svg')] bg-contain bg-center bg-no-repeat w-64 h-20 flex items-center justify-center cursor-pointer"
          onClick={() => dispatch({ type: "SET_DIFFICULTY", payload: "easy" })}
        >
          <span
            className={`font-bold text-2xl ${
              difficulty === "easy" ? "text-black" : "text-white"
            }`}
          >
            Easy
          </span>
        </button>

        <button
          className="bg-[url('/assets/images/icons/difficulty-board.svg')] bg-contain bg-center bg-no-repeat w-64 h-20 flex items-center justify-center cursor-pointer"
          onClick={() =>
            dispatch({ type: "SET_DIFFICULTY", payload: "normal" })
          }
        >
          <span
            className={`font-bold text-2xl ${
              difficulty === "normal" ? "text-black" : "text-white"
            }`}
          >
            Normal
          </span>
        </button>

        <button
          className="bg-[url('/assets/images/icons/difficulty-board.svg')] bg-contain bg-center bg-no-repeat w-64 h-20 flex items-center justify-center cursor-pointer"
          onClick={() => dispatch({ type: "SET_DIFFICULTY", payload: "hard" })}
        >
          <span
            className={`font-bold text-2xl ${
              difficulty === "hard" ? "text-black" : "text-white"
            }`}
          >
            Hard{" "}
          </span>
        </button>
      </div>

      {settings && <SettingsModal onSettings={setIsSetthings} />}
    </div>
  );
}

export default DifficultyScreen;
