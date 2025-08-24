import { motion } from "framer-motion";

function VirtualKeyBoard() {
  const keyboardRows = [
    ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
    ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
    ["Z", "X", "C", "V", "B", "N", "M"],
  ];

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
            />
          ))}
        </motion.div>
      ))}
    </div>
  );
}

// The keys
const KeyButton = ({
  letter,
  index,
  rowIndex,
}: {
  letter: string;
  index: number;
  rowIndex: number;
}) => {
  return (
    <motion.button
      className={`
          relative w-9 h-9 md:w-17 md:h-17 rounded-full font-bold text-white text-sm md:text-2xl
          border-2 shadow-lg transition-all duration-200 bg-[hsl(25,87%,27%)] cursor-pointer`}
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
