import { motion } from "framer-motion";
import { useHangman } from "../../contexts/HangManContext";

function DifficultyScreen() {
  const { gameStatus, dispatch } = useHangman();

  return (
    <div className="w-full h-screen flex flex-col ">
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="flex justify-between"
      >
        <button
          className="bg-[url('/src/assets/images/icons/settings.svg')] bg-contain bg-center bg-no-repeat w-15 h-15 flex items-center justify-center ml-2 cursor-pointer"
          //   since no routing the condition is to give the illusion.
          onClick={() =>
            dispatch({
              type: "BUTTON_NAV",
              payload: gameStatus === "lost" ? "lost" : "home",
            })
          }
        ></button>

        <div className="flex flex-col pr-2 md:pr-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="cursor-pointer"
          >
            <img
              src="/src/assets/images/icons/settings.svg"
              alt="Settings"
              className="w-15 h-15"
            />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="cursor-pointer"
          >
            <img
              src="/src/assets/images/icons/settings.svg"
              alt="Settings"
              className="w-15 h-15"
            />
          </motion.button>
        </div>
      </motion.div>

      <div
        className={`h-2/5 md:h-1/2 flex flex-col items-center justify-between mt-15`}
      >
        <button className="bg-[url('/src/assets/images/icons/difficulty-board.svg')] bg-contain bg-center bg-no-repeat w-64 h-20 flex items-center justify-center cursor-pointer">
          <span
            className="text-white font-bold text-2xl"
            onClick={() =>
              dispatch({ type: "SET_DIFFICULTY", payload: "easy" })
            }
          >
            Easy
          </span>
        </button>

        <button className="bg-[url('/src/assets/images/icons/difficulty-board.svg')] bg-contain bg-center bg-no-repeat w-64 h-20 flex items-center justify-center cursor-pointer">
          <span
            className="text-white font-bold text-2xl"
            onClick={() =>
              dispatch({ type: "SET_DIFFICULTY", payload: "normal" })
            }
          >
            Normal
          </span>
        </button>

        <button
          className="bg-[url('/src/assets/images/icons/difficulty-board.svg')] bg-contain bg-center bg-no-repeat w-64 h-20 flex items-center justify-center cursor-pointer"
          onClick={() => dispatch({ type: "SET_DIFFICULTY", payload: "hard" })}
        >
          <span className="text-white font-bold text-2xl">Hard </span>
        </button>
      </div>
    </div>
  );
}

export default DifficultyScreen;
