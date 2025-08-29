import React, {
  createContext,
  useContext,
  useEffect,
  useReducer,
  type Dispatch,
} from "react";
import { fetchWordFromWordnik, getStaticWord } from "../FetchFunc";

interface GameState {
  gameStatus: "home" | "playing" | "won" | "lost" | "loading" | "difficulty";
  currentWord: string;
  guessedLetters: string[];
  wrongGuesses: number;
  maxWrongGuesses: number;
  level: number;
  score: number;
  hint: string;
  showHint: boolean;
  lives: number;
  difficulty: "easy" | "normal" | "hard";
}

interface HangmanContextType extends GameState {
  dispatch: Dispatch<GameAction>;
}

type GameAction =
  | {
      type: "BUTTON_NAV";
      payload: "home" | "playing" | "won" | "lost" | "loading" | "difficulty";
    }
  | { type: "GUESS_LETTER"; payload: string }
  | { type: "NEW_GAME"; payload: { word: string; hint: string } }
  | { type: "SET_DIFFICULTY"; payload: "easy" | "normal" | "hard" }
  | { type: "SET_LOADING" }
  | { type: "GET_HINT" }
  | { type: "RESET_GAME" }
  | { type: "NEXT_GAME" }
  | { type: "SET_LOADING" }
  | { type: "GAME_WON" }
  | { type: "GAME_LOST" };

const initialState: GameState = {
  gameStatus: "home",
  currentWord: "",
  guessedLetters: [],
  wrongGuesses: 0,
  maxWrongGuesses: 6,
  level: 1,
  score: 0,
  hint: "",
  showHint: false,
  lives: 6,
  difficulty: "easy",
};

const reducer = (state: GameState, action: GameAction): GameState => {
  switch (action.type) {
    case "BUTTON_NAV":
      return { ...state, gameStatus: action.payload };

    case "NEW_GAME":
      console.log(state.currentWord);
      return {
        ...state,
        currentWord: action.payload.word,
        hint: action.payload.hint,
        guessedLetters: [],
        wrongGuesses: 0,
        gameStatus: "playing",
        showHint: false,
        maxWrongGuesses:
          state.difficulty === "easy"
            ? 6
            : state.difficulty === "normal"
            ? 5
            : 4,
        lives:
          state.difficulty === "easy"
            ? 6
            : state.difficulty === "normal"
            ? 5
            : 4,
      };

    case "RESET_GAME":
      return {
        ...state,
        gameStatus: "playing",
        showHint: false,
        guessedLetters: [],
        difficulty: state.difficulty,
        level: state.level,
        wrongGuesses: 0,
        score: 0,
      };

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
            : state.difficulty === "normal"
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

    case "NEXT_GAME":
      return {
        ...state,
        gameStatus: "loading",
        level: state.level + 1,
        showHint: false,
        wrongGuesses: 0,
        maxWrongGuesses:
          state.difficulty === "easy"
            ? 6
            : state.difficulty === "normal"
            ? 5
            : 4,
        lives:
          state.difficulty === "easy"
            ? 6
            : state.difficulty === "normal"
            ? 5
            : 4,
      };

    case "SET_DIFFICULTY":
      return {
        ...state,
        difficulty: action.payload,
        maxWrongGuesses:
          action.payload === "easy" ? 6 : action.payload === "normal" ? 5 : 4,
        lives:
          action.payload === "easy" ? 6 : action.payload === "normal" ? 5 : 4,
      };

    case "GET_HINT": {
      if (state.hint === "" || state.hint === undefined || state.showHint)
        return state;

      // Hint costs 1 life
      const newWrongGuesses = state.wrongGuesses + 1;
      console.log(newWrongGuesses);

      return {
        ...state,
        wrongGuesses: newWrongGuesses,
        showHint: state.hint !== "" || state.hint !== undefined ? true : false,
      };
    }

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
