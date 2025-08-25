import { motion } from "framer-motion";
import VirtualKeyBoard from "../VirtualKeyBoard";
import { useHangman } from "../../contexts/HangManContext";

function GameScreen() {
  const { currentWord, wrongGuesses, maxWrongGuesses, guessedLetters } =
    useHangman();

  const shouldRevealLetter = (letter: string) => {
    return guessedLetters.includes(letter.toLowerCase());
  };

  return (
    <div className="flex flex-col gap-20 md:gap-0 md:justify-between w-full h-screen">
      <div className="flex justify-between px-4">
        <p className="text-black font-bold text-2xl mt-1">
          {" "}
          {String(maxWrongGuesses)}/{String(wrongGuesses)}
        </p>

        <motion.div
          className="flex flex-col items-center"
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{
            delay: 0.3,
            duration: 0.8,
            type: "spring",
            stiffness: 100,
          }}
        >
          <motion.img
            src="/src/assets/images/hangman-parts/hang-rope.svg"
            alt="A hanging rope"
            className="w-10 md:w-10"
          />
          <motion.img
            src="/src/assets/images/hangman-parts/win-man.svg"
            alt="A supposed dead doll man"
            className="w-30 md:w-30 -mt-12"
            // initial={{ rotate: -15 }}
            animate={{
              rotate: [0, 2, -2, 1, -1, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </motion.div>

        <div className="flex flex-col  mt-1">
          <button className="cursor-pointer">
            <img
              src="/src/assets/images/icons/help-icon.svg"
              alt="Help button"
              className="w-15 h-15"
            />
          </button>
          <button className="cursor-pointer">
            <img
              src="/src/assets/images/icons/help-icon.svg"
              alt="Pause button"
              className="w-15 h-15"
            />
          </button>
        </div>
      </div>

      <div className="flex gap-2 items-center justify-center">
        {currentWord.split("").map((letter, index) => (
          <motion.div
            key={index}
            className="w-12 h-16 border-b-4 border-amber-600 flex items-center justify-center"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: index * 0.1 }}
          >
            <motion.span
              className="text-3xl font-bold text-amber-900"
              initial={{ opacity: 0, y: 20 }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{ duration: 0.3 }}
            >
              {shouldRevealLetter(letter) ? letter.toUpperCase() : ""}
            </motion.span>
          </motion.div>
        ))}
      </div>

      <VirtualKeyBoard />
    </div>
  );
}

export default GameScreen;
