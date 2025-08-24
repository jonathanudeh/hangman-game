import LoseScreen from "./components/screens/GameOverScreen";
import GameScreen from "./components/screens/GameScreen";
import HomeScreen from "./components/screens/HomeScreen";
import LoadingScreen from "./components/screens/LoadingScreen";
import WinScreen from "./components/screens/WinScreen";

function App() {
  return (
    <div className="w-full min-h-screen bg-fixed bg-cover bg-center bg-no-repeat bg-[url('/src/assets/images/hangman-parts/homescreen-background-desktop.svg')] px-">
      {/* <LoadingScreen /> */}

      {/* <HomeScreen /> */}
      <GameScreen />
      {/* <WinScreen /> */}
      {/* <LoseScreen /> */}
    </div>
  );
}

export default App;
