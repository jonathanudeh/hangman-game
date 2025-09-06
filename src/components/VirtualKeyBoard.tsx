import { motion } from "framer-motion";
import { useHangman } from "../contexts/HangManContext";
import { useEffect } from "react";

function VirtualKeyBoard() {
  const { guessedLetters, currentWord, hint, showHint, gameStatus, dispatch } =
    useHangman();

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
        dispatch({ type: "GUESS_LETTER", payload: key });
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [gameStatus, dispatch]);

  const getKeyState = (letter: string) => {
    const lowerLetter = letter.toLowerCase();
    if (!guessedLetters.includes(lowerLetter)) return "available";
    return currentWord.toLowerCase().includes(lowerLetter)
      ? "correct"
      : "wrong";
  };

  const guessLetter = (letter: string) => {
    dispatch({ type: "GUESS_LETTER", payload: letter });
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
        className={`bg-[url('/src/assets/images/icons/hint-frame.svg')] bg-center bg-no-repeat 
          w-48 flex items-center justify-center text-white mt-3 cursor-pointer
          ${
            showHint
              ? "text-xs p-5 text-center min-h-[4rem] max-h-32 overflow-y-auto leading-relaxed"
              : "text-2xl h-15"
          }`}
        onClick={() => dispatch({ type: "GET_HINT" })}
      >
        {showHint ? (
          <div className="break-words max-w-full">{hint}</div>
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
