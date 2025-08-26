import { motion } from "framer-motion";

function LoadingScreen() {
  return (
    <div className="bg-[#CCECFB] w-full h-screen flex flex-col items-center justify-center">
      <motion.div
        initial={{ rotate: -10 }}
        animate={{
          rotate: [10, -10, 10],
        }}
        transition={{
          rotate: {
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          },
        }}
        className="transform-origin-top"
      >
        <img
          src="/src/assets/images/hangman-parts/hook-logo.svg"
          alt="Pirate Hook"
          className="w-50 h-50 "
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.8 }}
        animate={{ opacity: 1, y: 0, scale: [0.9, 1.1, 0.9] }}
        transition={{
          delay: 0.5,
          duration: 0.8,
          scale: {
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          },
        }}
      >
        <img
          src="/src/assets/images/hangman-parts/hangman-text.svg"
          alt="Hangman Game"
          className="w-48 md:w-64"
        />
      </motion.div>

      {/* Loading dots */}
      <motion.div
        className="flex space-x-2 mt-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        {Array.from({ length: 3 }).map((_, i) => (
          <motion.div
            key={i}
            className="w-3 h-3 bg-amber-600 rounded-full"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 1.2,
              repeat: Infinity,
              delay: i * 0.2,
            }}
          />
        ))}
      </motion.div>

      {/* Loading word */}
      <motion.p
        className="text-amber-700 font-semibold text-lg mt-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
      >
        <motion.span
          animate={{ opacity: [1, 0.5, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          Loading your word...
        </motion.span>
      </motion.p>
    </div>
  );
}

export default LoadingScreen;
