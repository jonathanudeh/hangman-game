import { motion } from "framer-motion";

function LoseScreen() {
  return (
    <motion.div
      className="w-full h-screen flex flex-col items-center p-2 pt-0"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
    >
      <div className="flex flex-col items-center justify-between h-full">
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
            className="w-15 md:w-13"
            // animate={{
            //   rotate: [0, 2, -2, 1, -1, 0],
            // }}
            // transition={{
            //   duration: 4,
            //   repeat: Infinity,
            //   ease: "easeInOut",
            // }}
          />
          <motion.img
            src="/src/assets/images/hangman-parts/lose-man.svg"
            alt="A supposed dead doll man"
            className="w-35 md:w-32 -mt-18"
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

        <motion.span
          className="w-60 text-black font-bold text-3xl text-center tracking-[2.2rem]"
          initial={{ opacity: 0, y: 20 }}
          animate={{
            opacity: 1,
            y: 0,
            x: [0, -2, 2, -2, 2, 0],
          }}
          transition={{
            opacity: { delay: 1, duration: 0.5 },
            y: { delay: 0.8, duration: 0.5 },
            x: { delay: 1.2, duration: 0.5 },
          }}
        >
          APPLE
        </motion.span>

        <motion.div
          className="w-81 h-82 md:w-150  bg-[#E68929] rounded-2xl border-2 border-[#FFB01C] flex flex-col items-center justify-between"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{
            delay: 0.3,
            duration: 0.4,
            type: "spring",
            stiffness: 200,
          }}
        >
          <motion.div
            className="text-white font-bold text-3xl h-2/7 w-full flex items-center justify-center"
            animate={{
              scale: [1, 1.1, 1],
              color: ["#ffffff", "#ff6b6b", "#ffffff"],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            YOU LOSE !
          </motion.div>

          <div className="flex flex-col items-center gap-5 pt-3 md:justify- w-full h-6/7 border-t-2 border-[#FFB01C]">
            <motion.button
              className="cursor-pointer"
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              whileHover={{
                scale: 1.05,
                transition: { duration: 0.2 },
              }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="bg-[url('/src/assets/images/icons/difficulty-board.svg')] bg-contain bg-center bg-no-repeat w-45 h-13 flex items-center justify-center">
                <span className="text-white font-bold">Restart</span>
              </div>
            </motion.button>

            <motion.button
              className="cursor-pointer"
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              whileHover={{
                scale: 1.05,
                transition: { duration: 0.2 },
              }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="bg-[url('/src/assets/images/icons/difficulty-board.svg')] bg-contain bg-center bg-no-repeat w-45 h-13 flex items-center justify-center">
                <span className="text-white font-bold">Difficulty</span>
              </div>
            </motion.button>

            <motion.div
              className="relative flex items-center justify-between w-2/3 md:w-1/2 h-20 -mt-4"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.9, duration: 0.5 }}
            >
              <button className="cursor-pointer">
                <img
                  src="/src/assets/images/icons/help-icon.svg"
                  alt="Help icon"
                  className="w-15 h-15"
                />
              </button>
              <button className="cursor-pointer absolute top-8 left-1/2 -translate-x-1/2 z-20">
                <img
                  src="/src/assets/images/icons/home-icon.svg"
                  alt="Home icon"
                  className="w-15 h-15 "
                />
              </button>
              <button className="cursor-pointer">
                <img
                  src="/src/assets/images/icons/settings.svg"
                  alt="settings icon"
                  className="w-15 h-15"
                />
              </button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default LoseScreen;
