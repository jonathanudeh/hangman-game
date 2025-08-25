import React, {
  createContext,
  useContext,
  useEffect,
  useReducer,
  type Dispatch,
} from "react";
import { fetchWordFromWordnik, getStaticWord } from "../FetchFunc";

interface GameState {
  gameStatus: "playing" | "won" | "lost" | "loading";
  currentWord: string;
  guessedLetters: string[];
  wrongGuesses: number;
  maxWrongGuesses: number;
  level: number;
  score: number;
  hint: string;
  lives: number;
  difficulty: "easy" | "medium" | "hard";
}

interface HangmanContextType extends GameState {
  dispatch: Dispatch<GameAction>;
}

type GameAction =
  | { type: "GUESS_LETTER"; payload: string }
  | { type: "NEW_GAME"; payload: { word: string; hint: string } }
  | { type: "SET_LOADING" };

const initialState: GameState = {
  gameStatus: "loading",
  currentWord: "",
  guessedLetters: [],
  wrongGuesses: 0,
  maxWrongGuesses: 6,
  level: 1,
  score: 0,
  hint: "",
  lives: 6,
  difficulty: "easy",
};

const reducer = (state: GameState, action: GameAction): GameState => {
  switch (action.type) {
    case "GUESS_LETTER": {
      const letter = action.payload.toLowerCase();

      //   prevennt dupicate guesses
      if (
        state.guessedLetters.includes(letter) ||
        state.gameStatus !== "playing"
      )
        return state;

      const newGussedLetters = [...state.guessedLetters, letter];
      const isCorrectGuess = state.currentWord.toLowerCase().includes(letter);
      const newWrongGuesses = isCorrectGuess
        ? state.wrongGuesses
        : state.wrongGuesses + 1;
      const newLives = isCorrectGuess ? state.lives : state.lives - 1;

      const isWordComplete = state.currentWord
        .toLowerCase()
        .split("")
        .every((wordLetter) => newGussedLetters.includes(wordLetter));

      const isGameLost = newWrongGuesses >= state.maxWrongGuesses;

      let newGameStatus: GameState["gameStatus"] = "playing";
      let newScore = state.score;
      let newLevel = state.level;

      if (isWordComplete) {
        newGameStatus = "won";
        // Award points based on difficulty and remaining lives
        const basePoints =
          state.difficulty === "easy"
            ? 10
            : state.difficulty === "medium"
            ? 20
            : 30;
        const bonusPoints = newLives * 5;
        newScore = state.score + basePoints + bonusPoints;
        newLevel = state.level + 1;
      } else if (isGameLost) {
        newGameStatus = "lost";
      }

      return {
        ...state,
        guessedLetters: newGussedLetters,
        wrongGuesses: newWrongGuesses,
        lives: newLives,
        gameStatus: newGameStatus,
        score: newScore,
        level: newLevel,
      };
    }

    case "NEW_GAME":
      console.log(state.currentWord);
      return {
        ...state,
        currentWord: action.payload.word,
        hint: action.payload.hint,
        guessedLetters: [],
        wrongGuesses: 0,
        lives: 6,
        gameStatus: "playing",
      };

    case "SET_LOADING":
      return {
        ...state,
        gameStatus: "loading",
      };

    default:
      return state;
  }
};

const HangmanContext = createContext<HangmanContextType | undefined>(undefined);

const HangmanProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  //   fetchNewWord();
  useEffect(() => {
    // fetching word function  for game
    const fetchNewWord = async () => {
      dispatch({ type: "SET_LOADING" });

      try {
        const word = await fetchWordFromWordnik(state.difficulty);
        console.log(word);

        if (word) {
          dispatch({
            type: "NEW_GAME",
            payload: { word: word.word, hint: word.hint },
          });
          return;
        }
      } catch (err) {
        throw new Error(
          "Wordnik API failed, fall back to static words. Error: " + err
        );
      }

      // fallback to static words
      const staticWord = getStaticWord(state.difficulty);
      dispatch({
        type: "NEW_GAME",
        payload: {
          word: staticWord.word,
          hint: staticWord.hint,
        },
      });
    };

    // Only fetch on initial mount
    if (state.gameStatus === "loading" && state.currentWord === "") {
      fetchNewWord();
    }
  }, [state.currentWord, state.difficulty, state.gameStatus]);

  const value: HangmanContextType = {
    ...state,
    dispatch,
  };

  return (
    <HangmanContext.Provider value={value}>{children}</HangmanContext.Provider>
  );
};

const useHangman = () => {
  const context = useContext(HangmanContext);
  if (!context) {
    throw new Error("useHangman was used outside HangmanProvider");
  }
  return context;
};

export { HangmanProvider, useHangman };
