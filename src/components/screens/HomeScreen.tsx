function HomeScreen() {
  return (
    <div
      className="w-full max-h-screen h-screen
      flex flex-col gap-10 md:gap-3
    "
    >
      <div className="flex  justify-between">
        <div className="bg-[url('/src/assets/images/icons/level-board.svg')] bg-contain bg-center bg-no-repeat w-24 h-12 flex items-center justify-center">
          <span className="text-white font-bold">Level 1</span>
        </div>
        <div className="flex flex-col">
          <button className="cursor-pointer">
            <img
              src="/src/assets/images/icons/settings.svg"
              alt="Settings"
              className="w-15 h-15"
            />
          </button>
          <button className="cursor-pointer">
            <img
              src="/src/assets/images/icons/settings.svg"
              alt="Settings"
              className="w-15 h-15"
            />
          </button>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center">
        <img
          src="/src/assets/images/hangman-parts/hangman-hs-text.svg"
          alt="Hang man text"
          className="md:w-80 md:h-auto"
        />
        <button className="cursor-pointer">
          <img
            src="/src/assets/images/icons/play.svg"
            alt="Play button"
            className="w-40 h-40 md:w-60 md:h-60"
          />
        </button>
      </div>

      <div className="flex items-center justify-between">
        <button className="cursor-pointer">
          <img
            src="/src/assets/images/icons/help.svg"
            alt="Help icon"
            className="w-15 h-15"
          />
        </button>
        <div className="bg-[url('/src/assets/images/icons/difficulty-board.svg')] bg-contain bg-center bg-no-repeat w-24 h-12 flex items-center justify-center">
          <span className="text-white font-bold">Easy ""</span>
        </div>
      </div>
    </div>
  );
}

export default HomeScreen;
