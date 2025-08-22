function WinScreen() {
  return (
    <div className="w-full h-screen flex flex-col items-center gap-10 md:gap-10">
      <button className="cursor-pointer self-end">
        <img
          src="/src/assets/images/icons/settings.svg"
          alt=""
          className="w-15 h-15"
        />
      </button>

      <div className="flex flex-col items-center justify-between h-4/5 md:h-5/6">
        <img
          src="/src/assets/images/hangman-parts/win-man.svg"
          alt="A happy doll man"
        />
        <span className="w-60 text-black font-bold text-3xl text-center tracking-[2.2rem] ">
          APPLE
        </span>

        <div className="w-81 h-82 md:w-150 bg-[#E68929] rounded-2xl border-2 border-[#FFB01C] flex flex-col items-center justify-between">
          <div className="text-white font-bold text-3xl h-1/5 w-full flex items-center justify-center">
            YOU WON !
          </div>

          <div className="flex flex-col items-center justify-around w-full h-4/5 border-t-2 border-[#FFB01C]">
            <div className="bg-[#B0670B] w-70 h-14 rounded-lg text-white font-bold text-2xl flex items-center justify-between px-6">
              Level: <span>01</span>
            </div>
            <div className="bg-[#B0670B] w-70 h-14 rounded-lg text-white font-bold text-2xl flex items-center justify-between px-6">
              Progress: <span>40%</span>
            </div>

            <button className="mt-3 cursor-pointer">
              <img
                src="/src/assets/images/hangman-parts/win-next-btn.svg"
                alt="Next button"
                className="w-64 md:w-66 h-16 md:h-20"
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WinScreen;
