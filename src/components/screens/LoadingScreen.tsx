function LoadingScreen() {
  return (
    <div className="bg-[#CCECFB] w-full h-screen flex flex-col items-center justify-center">
      <img
        src="/src/assets/images/hangman-parts/hook-logo.svg"
        alt="Pirate Hook"
      />
      <img src="/src/assets/images/hangman-parts/hangman-text.svg" />
    </div>
  );
}

export default LoadingScreen;
