import React, {
  createContext,
  useContext,
  useEffect,
  useReducer,
  type Dispatch,
} from "react";
import { fetchWordsFromWordnik, getStaticWord } from "../FetchFunc";

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
  difficulty: "easy" | "normal" | "hard";
  sound: boolean;
  music: boolean;
  wordPool: Array<{ word: string; hint: string }>;
  usedStaticWords: string[];
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
  | { type: "GAME_LOST" }
  | { type: "SET_SOUND" }
  | { type: "SET_MUSIC" }
  | { type: "FETCH_NEW_WORD" }
  | { type: "SET_WORD_POOL"; payload: Array<{ word: string; hint: string }> }
  | { type: "UPDATE_USED_STATIC_WORDS"; payload: string[] }
  | { type: "RESET_TO_HOME" };

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
  difficulty: "easy",
  sound: true,
  music: true,
  wordPool: [],
  usedStaticWords: [],
};

const reducer = (state: GameState, action: GameAction): GameState => {
  switch (action.type) {
    case "BUTTON_NAV":
      if (action.payload === "home") {
        return {
          ...state,
          gameStatus: "home",
          currentWord: "",
          guessedLetters: [],
          wrongGuesses: 0,
          showHint: false,
        };
      }
      return { ...state, gameStatus: action.payload };

    case "RESET_TO_HOME":
      return {
        ...initialState,
        wordPool: state.wordPool,
        usedStaticWords: state.usedStaticWords,
        difficulty: state.difficulty,
        sound: state.sound,
        music: state.music,
      };

    case "SET_WORD_POOL":
      return {
        ...state,
        wordPool: action.payload,
      };

    case "UPDATE_USED_STATIC_WORDS":
      return {
        ...state,
        usedStaticWords: action.payload,
      };

    case "NEW_GAME":
      console.log("New game started with word:", action.payload.word);

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
        const mistakesPenalty = newWrongGuesses * 2;
        const bonusPoints = Math.max(0, 30 - mistakesPenalty);
        newScore = state.score + basePoints + bonusPoints;
        newLevel = state.level + 1;
      } else if (isGameLost) {
        newGameStatus = "lost";
      }

      return {
        ...state,
        guessedLetters: newGussedLetters,
        wrongGuesses: newWrongGuesses,
        gameStatus: newGameStatus,
        score: newScore,
        level: newLevel,
      };
    }

    case "NEXT_GAME":
      return {
        ...state,
        currentWord: "",
        gameStatus: "loading",
        guessedLetters: [],
        showHint: false,
        wrongGuesses: 0,
        maxWrongGuesses:
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
        // wordPool and used words resets when difficulty changes
        wordPool: [],
        usedStaticWords: [],
      };

    case "GET_HINT": {
      if (state.showHint) return state;

      // If hint is "No definition available", show it without deducting life
      if (
        state.hint === "No definition available" ||
        state.hint === "" ||
        state.hint === undefined
      ) {
        return {
          ...state,
          showHint: true,
        };
      }

      // Only deduct life if there's an actual hint
      const newWrongGuesses = state.wrongGuesses + 1;

      return {
        ...state,
        wrongGuesses: newWrongGuesses,
        showHint: true,
      };
    }

    case "FETCH_NEW_WORD":
      return {
        ...state,
        gameStatus: "loading",
        currentWord: "",
      };

    case "SET_LOADING":
      return {
        ...state,
        gameStatus: "loading",
      };

    case "SET_SOUND":
      return { ...state, sound: !state.sound };

    case "SET_MUSIC":
      return { ...state, music: !state.music };

    default:
      return state;
  }
};

const HangmanContext = createContext<HangmanContextType | undefined>(undefined);

const HangmanProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Pre-fetch words on initial load
  useEffect(() => {
    const preFetchWords = async () => {
      try {
        console.log("Pre-fetching words on app load...");
        const words = await fetchWordsFromWordnik(state.difficulty, 8);
        if (words && words.length > 0) {
          dispatch({ type: "SET_WORD_POOL", payload: words });
          console.log(`Pre-fetched ${words.length} words`);
        }
      } catch (err) {
        console.log(
          "Pre-fetch failed, will use static words when needed " + err
        );
      }
    };

    // Only pre-fetch once on mount
    if (state.wordPool.length === 0 && state.gameStatus === "home") {
      preFetchWords();
    }
  }, []);

  useEffect(() => {
    const getNextWord = () => {
      if (state.wordPool.length > 0) {
        const wordData = state.wordPool[0];

        //remove the word from pool
        const newPool = state.wordPool.slice(1);
        dispatch({ type: "SET_WORD_POOL", payload: newPool });

        dispatch({
          type: "NEW_GAME",
          payload: {
            word: wordData.word,
            hint: wordData.hint || "No hint available",
          },
        });
        return;
      }

      // If pool is empty, get static word with rotation
      console.log("Using static word fallback");
      try {
        const { staticWord, updatedUsedWords } = getStaticWord(
          state.difficulty,
          state.usedStaticWords
        );

        dispatch({
          type: "UPDATE_USED_STATIC_WORDS",
          payload: updatedUsedWords,
        });

        dispatch({
          type: "NEW_GAME",
          payload: {
            word: staticWord.word,
            hint: staticWord.hint,
          },
        });
      } catch (err) {
        console.error("Static word fallback failed:", err);
        dispatch({
          type: "NEW_GAME",
          payload: {
            word: "fallback",
            hint: "Emergency word when all else fails",
          },
        });
      }
    };

    // fetching words in batch function  for game
    const fetchWordBatch = async () => {
      try {
        const words = await fetchWordsFromWordnik(state.difficulty, 20);
        console.log("Batch API words received: ", words);

        if (words && words.length > 0) {
          dispatch({ type: "SET_WORD_POOL", payload: words });

          const firstWord = words[0];
          const remainingWords = words.slice(1);
          dispatch({ type: "SET_WORD_POOL", payload: remainingWords });

          dispatch({
            type: "NEW_GAME",
            payload: {
              word: firstWord.word,
              hint: firstWord.hint || "No hint available",
            },
          });
          return;
        }
      } catch (err) {
        console.error("Batch fetch failed:", err);
        // if error then I just fall through to static words
      }

      // fallback to static words
      getNextWord();
    };

    // Only fetch when we need a new word
    const shouldFetchWord =
      state.gameStatus === "loading" && state.currentWord === "";

    if (shouldFetchWord) {
      if (state.wordPool.length <= 5) {
        fetchWordBatch();
      } else {
        getNextWord();
      }
    }
  }, [
    state.currentWord,
    state.gameStatus,
    state.difficulty,
    state.wordPool,
    state.usedStaticWords,
  ]);

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
