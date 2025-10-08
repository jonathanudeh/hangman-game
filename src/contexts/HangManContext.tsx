import React, {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useRef,
  useState,
  type Dispatch,
} from "react";
import { fetchWordsFromWordnik, getStaticWord } from "../FetchFunc";

interface GameState {
  gameStatus: "home" | "playing" | "won" | "lost" | "loading" | "difficulty";
  currentWord: string;
  guessedLetters: string[];
  autoRevealedLetters: string[];
  wrongGuesses: number;
  maxWrongGuesses: number;
  level: number;
  score: number;
  hint: string;
  category?: string;
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
  | { type: "WRONG_GUESS" }
  | { type: "RESET_GAME" }
  | { type: "NEXT_GAME" }
  | { type: "SET_LOADING" }
  | { type: "GAME_WON" }
  | { type: "GAME_LOST" }
  | { type: "SET_SOUND" }
  | { type: "SET_MUSIC" }
  | { type: "FETCH_NEW_WORD" }
  | { type: "ADD_TO_WORD_POOL"; payload: Array<{ word: string; hint: string }> }
  | { type: "UPDATE_USED_STATIC_WORDS"; payload: string[] }
  | { type: "RESET_TO_HOME" }
  | { type: "LOAD_FROM_STORAGE" };

const initialState: GameState = {
  gameStatus: "home",
  currentWord: "",
  guessedLetters: [],
  autoRevealedLetters: [],
  wrongGuesses: 0,
  maxWrongGuesses: 6,
  level: 1,
  score: 0,
  hint: "",
  category: "",
  showHint: false,
  difficulty: "easy",
  sound: true,
  music: true,
  wordPool: [],
  usedStaticWords: [],
};

const loadFromStorage = () => {
  try {
    const level = localStorage.getItem("hangman_level");
    const difficulty = localStorage.getItem("hangman_difficulty");
    const sound = localStorage.getItem("hangman_sound");
    const music = localStorage.getItem("hangman_music");

    return {
      level: level ? parseInt(level) : 1,
      difficulty: (difficulty as "easy" | "normal" | "hard") || "easy",
      sound: sound !== null ? JSON.parse(sound) : true,
      music: music !== null ? JSON.parse(music) : true,
    };
  } catch (err) {
    console.error("Error loading from localStorage: ", err);
    return {
      level: 1,
      difficulty: "easy" as const,
      sound: true,
      music: true,
    };
  }
};

// reusable Save to localStorage
const saveToStorage = (key: string, value: any) => {
  try {
    localStorage.setItem(
      key,
      typeof value === "string" ? value : JSON.stringify(value)
    );
  } catch (error) {
    console.error("Error saving to localStorage:", error);
  }
};

// helper func to reveal a few random letters when a game starts
const revealRandomLetters = (word: string, revealCount: number): string[] => {
  const letters = word.split("");
  const revealedIndexes = new Set<number>();
  while (revealedIndexes.size < Math.min(revealCount, word.length)) {
    revealedIndexes.add(Math.floor(Math.random() * word.length));
  }
  return letters
    .filter((_, i) => revealedIndexes.has(i))
    .map((l) => l.toLowerCase());
};

function revealExtraLetter(word: string, revealedLetters: string[]): string[] {
  const letters = word.toLowerCase().split("");

  // find letters that are not revealed yet
  const unrevealedLetters = letters.filter((l) => !revealedLetters.includes(l));

  if (unrevealedLetters.length === 0) return revealedLetters;

  // pick a random one to reveal
  const randomLetter =
    unrevealedLetters[Math.floor(Math.random() * unrevealedLetters.length)];

  return [...revealedLetters, randomLetter];
}

const reducer = (state: GameState, action: GameAction): GameState => {
  switch (action.type) {
    case "LOAD_FROM_STORAGE": {
      const savedData = loadFromStorage();

      // Load cached word pool and used static words for the current difficulty
      let cachedWordPool: Array<{ word: string; hint: string }> = [];
      let cachedUsedWords: string[] = [];

      try {
        const wordPoolData = localStorage.getItem(
          `hangman_wordPool_${savedData.difficulty}`
        );
        const usedWordsData = localStorage.getItem(
          `hangman_usedStatic_${savedData.difficulty}`
        );

        if (wordPoolData) {
          const parsed = JSON.parse(wordPoolData);
          if (Array.isArray(parsed)) {
            cachedWordPool = parsed;
          }
        }

        if (usedWordsData) {
          const parsed = JSON.parse(usedWordsData);
          if (Array.isArray(parsed)) {
            cachedUsedWords = parsed;
          }
        }
      } catch (err) {
        console.error("Error loading cached data: ", err);
      }
      return {
        ...state,
        ...savedData,
        wordPool: cachedWordPool,
        usedStaticWords: cachedUsedWords,
      };
    }

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
        ...state,
      };

    case "ADD_TO_WORD_POOL": {
      // Cache word pool to localStorage
      saveToStorage(`hangman_wordPool_${state.difficulty}`, action.payload);
      const newPool = [...state.wordPool, ...action.payload];

      return {
        ...state,
        wordPool: newPool,
      };
    }

    case "UPDATE_USED_STATIC_WORDS":
      // Cache used static words to localStorage
      saveToStorage(`hangman_usedStatic_${state.difficulty}`, action.payload);

      return {
        ...state,
        usedStaticWords: action.payload,
      };

    case "NEW_GAME": {
      console.log("New game started with word:", action.payload.word);
      const { word, hint } = action.payload;

      // number of letters per difficulty
      const revealCount =
        state.difficulty === "easy" ? 1 : state.difficulty === "normal" ? 1 : 1;

      const autoRevealed = revealRandomLetters(word, revealCount);

      // remove the used word from the pool
      const newWordPool = state.wordPool.slice(1);
      saveToStorage(`hangman_wordPool_${state.difficulty}`, newWordPool);

      return {
        ...state,
        currentWord: word,
        hint: hint,
        guessedLetters: [],
        autoRevealedLetters: autoRevealed,
        wrongGuesses: 0,
        gameStatus: "playing",
        showHint: false,
        level: state.level,
        wordPool: newWordPool,
        maxWrongGuesses:
          state.difficulty === "easy"
            ? 6
            : state.difficulty === "normal"
            ? 5
            : 4,
      };
    }

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

        // Save new level to localStorage
        saveToStorage("hangman_level", newLevel);
      } else if (isGameLost) {
        newGameStatus = "lost";
      }

      // Reveal extra letter when lives are getting low
      let updatedAutoRevealed = [...state.autoRevealedLetters];

      const maxAutoReveals =
        state.difficulty === "easy"
          ? [2, 4]
          : state.difficulty === "normal"
          ? [2, 5]
          : [3, 5];

      if (!isCorrectGuess && maxAutoReveals.includes(newWrongGuesses)) {
        updatedAutoRevealed = revealExtraLetter(
          state.currentWord,
          updatedAutoRevealed
        );
      }

      return {
        ...state,
        guessedLetters: newGussedLetters,
        wrongGuesses: newWrongGuesses,
        gameStatus: newGameStatus,
        score: newScore,
        level: newLevel,
        autoRevealedLetters: updatedAutoRevealed,
      };
    }

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

    case "SET_DIFFICULTY": {
      // Save new difficulty to localStorage
      saveToStorage("hangman_difficulty", action.payload);

      // Load word pool and used static words for the new difficulty
      let newWordPool: Array<{ word: string; hint: string }> = [];
      let newUsedStaticWords: string[] = [];

      try {
        const wordPoolData = localStorage.getItem(
          `hangman_wordPool_${action.payload}`
        );
        const usedWordsData = localStorage.getItem(
          `hangman_usedStatic_${action.payload}`
        );

        if (wordPoolData) {
          const parsed = JSON.parse(wordPoolData);
          if (Array.isArray(parsed)) {
            newWordPool = parsed;
          }
        }

        if (usedWordsData) {
          const parsed = JSON.parse(usedWordsData);
          if (Array.isArray(parsed)) {
            newUsedStaticWords = parsed;
          }
        }
      } catch (error) {
        console.error("Error loading data for new difficulty:", error);
      }

      return {
        ...state,
        difficulty: action.payload,
        maxWrongGuesses:
          action.payload === "easy" ? 6 : action.payload === "normal" ? 5 : 4,
        wordPool: newWordPool,
        usedStaticWords: newUsedStaticWords,
      };
    }

    case "GET_HINT": {
      if (state.showHint) return state;

      // If hint is "No definition available", show it without deducting life
      if (
        state.hint === "No definition available" ||
        state.hint === "" ||
        state.hint === undefined ||
        state.hint.includes("level word")
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

    case "SET_SOUND": {
      const newSound = !state.sound;
      saveToStorage("hangman_sound", newSound);
      return { ...state, sound: newSound };
    }

    case "SET_MUSIC": {
      const newMusic = !state.music;
      saveToStorage("hangman_music", newMusic);
      return { ...state, music: newMusic };
    }
    default:
      return state;
  }
};

const HangmanContext = createContext<HangmanContextType | undefined>(undefined);

const HangmanProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  // const [hasLoaded, setHasLoaded] = useState(false);
  const isFetchingRef = useRef(false);
  const hasPrefetchedRef = useRef(false);

  // Load from localStorage on mount
  useEffect(() => {
    dispatch({ type: "LOAD_FROM_STORAGE" });
    // setHasLoaded(true);
  }, []);

  // Pre-fetch words on initial load
  useEffect(() => {
    if (hasPrefetchedRef.current) return;
    if (state.wordPool.length > 0) {
      console.log(`Already have ${state.wordPool.length} words cached`);
      hasPrefetchedRef.current = true;
      return;
    }

    const preFetchWords = async () => {
      if (isFetchingRef.current) return;

      isFetchingRef.current = true;
      hasPrefetchedRef.current = true;

      try {
        console.log("Pre-fetching words for", state.difficulty);
        const words = await fetchWordsFromWordnik(state.difficulty, 8);

        if (words && words.length > 0) {
          console.log(`Pre-fetched ${words.length} words`);
          dispatch({ type: "ADD_TO_WORD_POOL", payload: words });
        }
      } catch (err) {
        console.error("Pre-fetch failed:", err);
      } finally {
        isFetchingRef.current = false;
      }
    };

    preFetchWords();
  }, [state.wordPool.length, state.difficulty]);

  // Handle word fetching when pool is low or when starting a game
  useEffect(() => {
    const shouldFetchMore =
      state.wordPool.length > 0 && state.wordPool.length <= 3;

    if (shouldFetchMore && !isFetchingRef.current) {
      const fetchMore = async () => {
        isFetchingRef.current = true;

        try {
          console.log("Pool low, fetching more words");
          const words = await fetchWordsFromWordnik(state.difficulty, 8);

          if (words && words.length > 0) {
            console.log(
              `Fetched ${words.length} more words. Adding to existing ${state.wordPool.length}`
            );
            dispatch({ type: "ADD_TO_WORD_POOL", payload: words });
          }
        } catch (err) {
          console.error("Background fetch failed:", err);
        } finally {
          isFetchingRef.current = false;
        }
      };

      fetchMore();
    }
  }, [state.wordPool.length, state.difficulty]);

  // useEffect(() => {
  //   const getNextWord = () => {
  //     if (state.wordPool.length > 0) {
  //       const wordData = state.wordPool[0];

  //       //remove the word from pool
  //       const newPool = state.wordPool.slice(1);
  //       dispatch({ type: "SET_WORD_POOL", payload: newPool });

  //       dispatch({
  //         type: "NEW_GAME",
  //         payload: {
  //           word: wordData.word,
  //           hint: wordData.hint || "No definition available",
  //         },
  //       });
  //       return;
  //     }

  //     // If pool is empty, get static word with rotation
  //     console.log("Using static word fallback");
  //     try {
  //       const { staticWord, updatedUsedWords } = getStaticWord(
  //         state.difficulty,
  //         state.usedStaticWords
  //       );

  //       dispatch({
  //         type: "UPDATE_USED_STATIC_WORDS",
  //         payload: updatedUsedWords,
  //       });

  //       dispatch({
  //         type: "NEW_GAME",
  //         payload: {
  //           word: staticWord.word,
  //           hint: staticWord.hint,
  //         },
  //       });
  //     } catch (err) {
  //       console.error("Static word fallback failed:", err);
  //       dispatch({
  //         type: "NEW_GAME",
  //         payload: {
  //           word: "fallback",
  //           hint: "Emergency word when all else fails",
  //         },
  //       });
  //     }
  //   };

  //   // fetching words in batch function  for game
  //   const fetchWordBatch = async () => {
  //     try {
  //       const words = await fetchWordsFromWordnik(state.difficulty, 8);
  //       console.log("Batch API words received: ", words);

  //       if (words && words.length > 0) {
  //         // dispatch({ type: "SET_WORD_POOL", payload: words });

  //         const firstWord = words[0];
  //         const remainingWords = words.slice(1);
  //         dispatch({ type: "SET_WORD_POOL", payload: remainingWords });

  //         dispatch({
  //           type: "NEW_GAME",
  //           payload: {
  //             word: firstWord.word,
  //             hint: firstWord.hint || "No hint available",
  //           },
  //         });
  //         return;
  //       }
  //     } catch (err) {
  //       console.error("Batch fetch failed:", err);
  //       // if error then I just fall through to static words
  //     }

  //     // fallback to static words
  //     getNextWord();
  //   };

  //   // Only fetch when we need a new word
  //   const shouldFetchWord =
  //     state.gameStatus === "loading" && state.currentWord === "";

  //   if (shouldFetchWord) {
  //     if (state.wordPool.length <= 5) {
  //       fetchWordBatch();
  //     } else {
  //       getNextWord();
  //     }
  //   }
  // }, [
  //   state.currentWord,
  //   state.gameStatus,
  //   state.difficulty,
  //   state.wordPool,
  //   state.usedStaticWords,
  // ]);

  // Handle game start - use word from pool or fallback

  useEffect(() => {
    if (state.gameStatus !== "loading") return;

    const startGame = async () => {
      // Try to use word from pool first
      if (state.wordPool.length > 0) {
        const wordData = state.wordPool[0];
        console.log(
          `Using word from pool: ${wordData.word}. ${
            state.wordPool.length - 1
          } remaining`
        );

        dispatch({
          type: "NEW_GAME",
          payload: {
            word: wordData.word,
            hint: wordData.hint || "No definition available",
          },
        });
        return;
      }

      // Pool is empty - try to fetch immediately
      if (!isFetchingRef.current) {
        isFetchingRef.current = true;

        try {
          console.log("Pool empty, fetching words now");
          const words = await fetchWordsFromWordnik(state.difficulty, 8);

          if (words && words.length > 0) {
            const firstWord = words[0];
            const remaining = words.slice(1);

            console.log(
              `Fetched ${words.length} words, using first, storing ${remaining.length}`
            );
            dispatch({ type: "ADD_TO_WORD_POOL", payload: remaining });

            dispatch({
              type: "NEW_GAME",
              payload: {
                word: firstWord.word,
                hint: firstWord.hint || "No definition available",
              },
            });
            isFetchingRef.current = false;
            return;
          }
        } catch (err) {
          console.error("Fetch failed, using static word:", err);
        } finally {
          isFetchingRef.current = false;
        }
      }

      // Final fallback - use static word
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
            hint: "Emergency word",
          },
        });
      }
    };

    startGame();
  }, [state.gameStatus, state.difficulty]);

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
