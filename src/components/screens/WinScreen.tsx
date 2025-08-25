import { motion } from "framer-motion";
import { useHangman } from "../../contexts/HangManContext";

function WinScreen() {
  const { currentWord } = useHangman();

  // Confetti-like particles animation
  const confettiVariants = {
    hidden: {
      opacity: 0,
      y: -100,
      rotate: 0,
      scale: 0,
    },
    visible: (i: number) => ({
      opacity: [0, 1, 1, 0],
      y: [0, 100, 200, 400],
      rotate: [0, 180, 360, 540],
      scale: [0, 1, 1, 0],
      x: [0, Math.sin(i) * 2, Math.cos(i) * 2, Math.sin(i * 2) * 2],
      transition: {
        duration: 3,
        delay: Math.random() * 2,
      },
    }),
  };

  return (
    <div className="w-full h-screen flex flex-col items-center gap-10">
      {/* Confetti Background Elements */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-3 h-3 bg-yellow-400 rounded"
          style={{
            left: `${Math.random() * 100}%`,
            backgroundColor: [
              "#FFD700",
              "#FF6B6B",
              "#4ECDC4",
              "#45B7D1",
              "#96CEB4",
            ][i % 5],
          }}
          custom={i}
          variants={confettiVariants}
          initial="hidden"
          animate="visible"
        />
      ))}

      <button className="cursor-pointer self-end">
        <img
          src="/src/assets/images/icons/settings.svg"
          alt=""
          className="w-15 h-15"
        />
      </button>

      <div className="flex flex-col items-center justify-between h-4/5 md:h-5/6">
        <motion.div
          initial={{ y: -50, opacity: 0, scale: 0.5 }}
          animate={{
            y: 0,
            opacity: 1,
            scale: 1,
            rotate: [0, -10, 10, -5, 5, 0],
          }}
          transition={{
            delay: 0.1,
            duration: 0.8,
            type: "spring",
            stiffness: 200,
            rotate: { delay: 1, duration: 1 },
          }}
        >
          <motion.img
            src="/src/assets/images/hangman-parts/win-man.svg"
            alt="A happy doll man"
            animate={{
              y: [0, -10, 0],
              scale: [1, 1.05, 1],
            }}
            transition={{
              duration: 2,
              repeat: 2,
              ease: "easeInOut",
            }}
          />
        </motion.div>

        <motion.span
          className="w-60 text-black font-bold text-3xl text-center tracking-[2.2rem]"
          initial={{ opacity: 0, y: 30, scale: 0.8 }}
          animate={{
            opacity: 1,
            y: 0,
            scale: 1,
          }}
          transition={{
            delay: 1,
            duration: 0.6,
            type: "spring",
            stiffness: 150,
          }}
        >
          <motion.span
            animate={{
              textShadow: [
                "0 0 10px #FFD700",
                "0 0 20px #FFD700",
                "0 0 30px #FFD700",
                "0 0 20px #FFD700",
                "0 0 10px #FFD700",
              ],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            {currentWord.toUpperCase()}
          </motion.span>
        </motion.span>

        <motion.div
          className="w-81 h-82 md:w-150 bg-[#E68929] rounded-2xl border-2 border-[#FFB01C] flex flex-col items-center justify-between"
          initial={{ y: 100, opacity: 0, scale: 0.8 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          transition={{
            delay: 0.3,
            duration: 0.7,
            type: "spring",
            stiffness: 120,
          }}
        >
          <motion.div
            className="text-white font-bold text-3xl h-1/5 w-full flex items-center justify-center"
            animate={{
              scale: [1, 1.1, 1],
              color: ["#ffffff", "#FFD700", "#ffffff"],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            YOU WON!
          </motion.div>

          <div className="flex flex-col items-center justify-around w-full h-4/5 border-t-2 border-[#FFB01C]">
            <motion.div
              className="bg-[#B0670B] w-70 h-14 rounded-lg text-white font-bold text-2xl flex items-center justify-between px-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.5 }}
            >
              Level: <span>01</span>
            </motion.div>
            <motion.div
              className="bg-[#B0670B] w-70 h-14 rounded-lg text-white font-bold text-2xl flex items-center justify-between px-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.5 }}
            >
              Progress: <span>40%</span>
            </motion.div>

            <motion.button
              className="mt-3 cursor-pointer"
              initial={{ y: 50, opacity: 0, scale: 0.8 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              transition={{
                delay: 0.7,
                duration: 0.6,
                type: "spring",
                stiffness: 200,
              }}
              whileHover={{
                scale: 1.05,
                y: -5,
                transition: { duration: 0.2 },
              }}
              whileTap={{ scale: 0.95 }}
            >
              <img
                src="/src/assets/images/hangman-parts/win-next-btn.svg"
                alt="Next button"
                className="w-64 md:w-66 h-16 md:h-20"
              />
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default WinScreen;
