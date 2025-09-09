import { motion } from "framer-motion";
import { useHangman } from "../contexts/HangManContext";
import { useEffect } from "react";
import { useSound } from "../cutom-hooks/useSound";

function VirtualKeyBoard() {
  const { guessedLetters, currentWord, hint, showHint, gameStatus, dispatch } =
    useHangman();
  const { playKeyPress, playHint } = useSound();

  const keyboardRows = [
    ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
    ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
    ["Z", "X", "C", "V", "B", "N", "M"],
  ];

  // listening for physical keyboard
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (gameStatus !== "playing") return;

      const key = event.key.toLowerCase();

      if (key >= "a" && key <= "z") {
        event.preventDefault();

        if (!guessedLetters.includes(key)) {
          playKeyPress();
          dispatch({ type: "GUESS_LETTER", payload: key });
        }
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [gameStatus, guessedLetters, playKeyPress, dispatch]);

  const getKeyState = (letter: string) => {
    const lowerLetter = letter.toLowerCase();
    if (!guessedLetters.includes(lowerLetter)) return "available";
    return currentWord.toLowerCase().includes(lowerLetter)
      ? "correct"
      : "wrong";
  };

  const guessLetter = (letter: string) => {
    const lowerLetter = letter.toLowerCase();

    if (!guessedLetters.includes(lowerLetter)) {
      playKeyPress();
      dispatch({ type: "GUESS_LETTER", payload: letter });
    }
  };

  const handleHintClick = () => {
    playHint();
    dispatch({ type: "GET_HINT" });
  };

  return (
    <div className="flex flex-col items-center gap-3 py-4">
      {keyboardRows.map((row, rowIndex) => (
        <motion.div
          key={rowIndex}
          className={`flex gap-[3px] md:gap-2 pl-[${
            rowIndex === 1 ? "1rem" : rowIndex === 2 ? "2rem" : "0"
          }]`}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: rowIndex * 0.1 }}
        >
          {row.map((letter, index) => (
            <KeyButton
              key={letter}
              letter={letter}
              index={index}
              rowIndex={rowIndex}
              state={getKeyState(letter)}
              onClick={() => guessLetter(letter)}
            />
          ))}
        </motion.div>
      ))}

      <button
        className={`bg-[url('/assets/images/icons/hint-frame.svg')] bg-center bg-no-repeat 
          w-48 flex items-center justify-center text-white mt-3 cursor-pointer
          ${
            showHint
              ? "text-xs p-5 text-center min-h-[4rem] max-h-32 overflow-y-auto leading-relaxed"
              : "text-2xl h-15"
          }`}
        onClick={handleHintClick}
      >
        {showHint ? (
          <motion.div
            className="absolute top-15 sm:top-10 left-0 bg-amber-800 border-4 border-amber-600 rounded-xl p-6 w-1/2 max-w-full sm:max-w-1/3 mx-2 shadow-2xl"
            initial={{ scale: 0.8, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.8, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            {/* Close button
            <button
              className="absolute top-2 right-2 w-8 h-8 bg-red-600 hover:bg-red-700 rounded-full flex items-center justify-center text-white font-bold transition-colors"
              aria-label="Close hint"
            >
              x
            </button> */}
            {/* Hint icon */}
            <div className="flex flex-col">
              <div className="w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-amber-800 font-bold text-xs">💡</span>
              </div>

              {/* Hint text */}
              <div className="text-white">
                <h3 className="font-bold text-lg mb-2 text-yellow-300">Hint</h3>
                <p className="text-xs sm:text-lg leading-relaxed break-words">
                  {hint}
                </p>
              </div>
            </div>
            {/* Bottom tip
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
              <div className="w-4 h-4 bg-amber-800 border-b-4 border-r-4 border-amber-600 transform rotate-45" />
            </div> */}
          </motion.div>
        ) : (
          "HINT"
        )}
      </button>
    </div>
  );
}

// The keys
const KeyButton = ({
  letter,
  index,
  rowIndex,
  state,
  onClick,
}: {
  letter: string;
  index: number;
  rowIndex: number;
  state: "available" | "correct" | "wrong";
  onClick: () => void;
}) => {
  const getButtonStyles = () => {
    switch (state) {
      case "correct":
        return "bg-green-600 border-green-700 text-white";
      case "wrong":
        return "bg-red-600 border-red-700 text-white";
      default:
        return "bg-[hsl(25,87%,27%)] border-amber-700 text-white hover:bg-amber-500";
    }
  };

  return (
    <motion.button
      className={`
          relative w-9 h-9 md:w-17 md:h-17 rounded-full font-bold text-white text-sm md:text-2xl
          border-2 shadow-lg transition-all duration-200 ${getButtonStyles()} cursor-pointer`}
      onClick={onClick}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{
        delay: rowIndex * 0.1 + index * 0.02,
        type: "spring",
        stiffness: 200,
      }}
      whileHover={{
        scale: 1.1,
        y: -2,
        transition: { duration: 0.1 },
      }}
      whileTap={{
        scale: 0.95,
        y: 1,
      }}
    >
      {letter}
    </motion.button>
  );
};

export default VirtualKeyBoard;
