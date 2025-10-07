import DifficultyScreen from "./components/screens/DifficultyScreen";
import LoseScreen from "./components/screens/LoseScreen";
import GameScreen from "./components/screens/GameScreen";
import HomeScreen from "./components/screens/HomeScreen";
import LoadingScreen from "./components/screens/LoadingScreen";
import WinScreen from "./components/screens/WinScreen";
import { useHangman } from "./contexts/HangManContext";
import { useSound } from "./cutom-hooks/useSound";

function App() {
  const { gameStatus } = useHangman();
  useSound();

  return (
    <div className="w-full min-h-screen bg-fixed bg-cover bg-center bg-no-repeat bg-[url('/assets/images/hangman-parts/homescreen-background-desktop.svg')]">
      {gameStatus === "loading" && <LoadingScreen />}

      {gameStatus === "home" && <HomeScreen />}
      {gameStatus === "playing" && <GameScreen />}
      {gameStatus === "won" && <WinScreen />}
      {gameStatus === "lost" && <LoseScreen />}
      {gameStatus === "difficulty" && <DifficultyScreen />}
    </div>
  );
}

export default App;
