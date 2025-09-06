// fetch function
const fetchWordsFromWordnik = async (
  difficulty: string,
  limit: number = 10
) => {
  const API_KEY = import.meta.env.VITE_WORDNIK_API_KEY;

  if (!API_KEY) {
    console.warn("No Wordnik API key found");
    throw new Error("No API key");
  }

  const params = {
    easy: {
      minCorpusCount: 10000,
      maxLength: 6,
      hasDictionaryDef: true,
      includePartOfSpeech: "noun,verb,adjective",
    },
    normal: {
      minCorpusCount: 1000,
      maxCorpusCount: 10000,
      minLength: 5,
      maxLength: 8,
      hasDictionaryDef: true,
    },
    hard: {
      minCorpusCount: 100,
      maxCorpusCount: 1000,
      minLength: 7,
      maxLength: 12,
      hasDictionaryDef: true,
    },
  };

  const difficultyParams = params[difficulty as keyof typeof params];

  if (!difficultyParams) {
    throw new Error(`Invalid difficulty: ${difficulty}`);
  }

  // Helper function to check if word is valid (only a-z letters)
  const isValidWord = (word: string): boolean => {
    return /^[a-zA-Z]+$/.test(word);
  };

  // Reduce batch size to be gentler on API
  const fetchLimit = Math.min(limit * 2, 15);
  const queryParams = new URLSearchParams({
    ...difficultyParams,
    limit: fetchLimit.toString(),
    api_key: API_KEY,
  } as any);

  try {
    console.log(`Fetching ${fetchLimit} words from Wordnik API...`);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    const res = await fetch(
      `https://api.wordnik.com/v4/words.json/randomWords?${queryParams}`,
      {
        signal: controller.signal,
      }
    );

    clearTimeout(timeoutId);
    if (!res.ok) {
      throw new Error(`Wordnik API returned ${res.status}: ${res.statusText}`);
    }

    const data = await res.json();

    if (!data || !Array.isArray(data) || data.length === 0) {
      throw new Error("No words returned from API");
    }

    const wordsWithHints = [];

    for (let i = 0; i < data.length; i++) {
      const wordData = data[i];

      if (!wordData || !wordData.word) {
        continue;
      }

      // Filter out words with non-alphabetic characters
      if (!isValidWord(wordData.word)) {
        console.log(`Skipping word with invalid characters: ${wordData.word}`);
        continue;
      }

      //might remove
      // Stop if we have enough valid words
      if (wordsWithHints.length >= limit) {
        break;
      }

      // Fetch definitions for all words

      let hint = "No definition available";

      try {
        // Add delay between definition requests to avoid rate limiting
        if (i > 0) {
          await new Promise((resolve) => setTimeout(resolve, 200)); // 200ms delay
        }

        const defController = new AbortController();
        const defTimeoutId = setTimeout(() => defController.abort(), 5000);

        const defRes = await fetch(
          `https://api.wordnik.com/v4/word.json/${wordData.word}/definitions?limit=1&api_key=${API_KEY}`,
          {
            signal: defController.signal,
          }
        );

        clearTimeout(defTimeoutId);

        if (defRes.ok) {
          const definition = await defRes.json();
          if (
            definition &&
            Array.isArray(definition) &&
            definition.length > 0
          ) {
            const rawHint = definition[0].text;
            if (typeof rawHint === "string") {
              // Fix the TypeError
              hint = rawHint.replace(/<[^>]*>/g, "").substring(0, 200);
            } else {
              hint = "Definition format not supported";
            }
          }
        } else if (defRes.status === 429) {
          console.warn(`Rate limited for ${wordData.word}, using generic hint`);
          hint = `A ${difficulty} level word`;
        }
      } catch (defErr) {
        console.warn(
          `Failed to fetch definition for ${wordData.word}:`,
          defErr
        );
        hint = `A ${difficulty} level word`; // Generic fallback
      }
      wordsWithHints.push({ word: wordData.word, hint });
    }

    // Filter out failed requests and null values
    // const validWords = wordsWithHints
    //   .filter(
    //     (
    //       result
    //     ): result is PromiseFulfilledResult<{ word: string; hint: string }> =>
    //       result.status === "fulfilled" && result.value !== null
    //   )
    //   .map((result) => result.value);

    // console.log(
    //   `Successfully fetched ${validWords.length} words with definitions`
    // );
    // return validWords;

    console.log(`Successfully processed ${wordsWithHints.length} words`);
    return wordsWithHints;
  } catch (error) {
    console.error("Batch wordnik fetch failed:", error);
    throw error;
  }
};

const getStaticWord = (difficulty: string, usedWords: string[]) => {
  console.log("Using static word by difficulty:", difficulty);

  const staticWords = {
    easy: [
      { word: "cat", hint: "A small furry pet that meows" },
      { word: "dog", hint: "Man's best friend" },
      { word: "sun", hint: "The star that lights our day" },
      { word: "car", hint: "A vehicle with four wheels" },
      { word: "book", hint: "You read this for knowledge" },
      { word: "tree", hint: "Tall plant with branches and leaves" },
      { word: "house", hint: "Where people live" },
      { word: "water", hint: "Clear liquid you drink" },
      { word: "fire", hint: "Hot, bright flames" },
      { word: "earth", hint: "The planet we live on" },
      { word: "happy", hint: "Feeling joy and contentment" },
      { word: "music", hint: "Sounds arranged in harmony" },
      { word: "chair", hint: "Furniture you sit on" },
      { word: "phone", hint: "Device for calling people" },
      { word: "door", hint: "You open this to enter" },
    ],
    normal: [
      { word: "elephant", hint: "Largest land mammal with a trunk" },
      { word: "computer", hint: "Electronic device for processing data" },
      { word: "rainbow", hint: "Colorful arc in the sky after rain" },
      { word: "guitar", hint: "Six-stringed musical instrument" },
      { word: "mountain", hint: "Very tall natural elevation of land" },
      { word: "kitchen", hint: "Room where you cook food" },
      { word: "library", hint: "Place with many books to borrow" },
      { word: "garden", hint: "Area where plants are grown" },
      { word: "camera", hint: "Device used to take pictures" },
      { word: "bicycle", hint: "Two-wheeled vehicle you pedal" },
      { word: "sandwich", hint: "Food between two slices of bread" },
      { word: "butterfly", hint: "Colorful insect with large wings" },
      { word: "calendar", hint: "Shows days, weeks, and months" },
      { word: "package", hint: "Something wrapped for delivery" },
      { word: "blanket", hint: "Keeps you warm in bed" },
    ],
    hard: [
      { word: "javascript", hint: "Popular web programming language" },
      { word: "mysterious", hint: "Difficult to understand or explain" },
      { word: "adventure", hint: "Exciting or unusual experience" },
      { word: "symphony", hint: "Large-scale musical composition" },
      { word: "algorithm", hint: "Step-by-step procedure for calculations" },
      {
        word: "photosynthesis",
        hint: "Process plants use to make food from sunlight",
      },
      { word: "architecture", hint: "Design and construction of buildings" },
      {
        word: "philosophy",
        hint: "Study of fundamental questions about existence",
      },
      { word: "psychology", hint: "Scientific study of mind and behavior" },
      {
        word: "technology",
        hint: "Application of scientific knowledge for practical purposes",
      },
      {
        word: "imagination",
        hint: "Ability to form mental images or concepts",
      },
      { word: "extraordinary", hint: "Very unusual or remarkable" },
      { word: "sophisticated", hint: "Having great knowledge or experience" },
      { word: "encyclopedia", hint: "Comprehensive reference book" },
      { word: "constellation", hint: "Group of stars forming a pattern" },
    ],
  };

  const words = staticWords[difficulty as keyof typeof staticWords];

  if (!words || words.length === 0) {
    console.warn(`No static words found for difficulty: ${difficulty}`);

    // Return a default word if difficulty not found
    return {
      staticWord: { word: "default", hint: "This is a fallback word" },
      updatedUsedWords: usedWords,
    };
  }

  // Filter out already used words
  const availableWords = words.filter(
    (wordObj) => !usedWords.includes(wordObj.word)
  );

  // If all words have been used, reset the used words list
  let finalAvailableWords = availableWords;
  let updatedUsedWords = [...usedWords];

  if (availableWords.length === 0) {
    console.log("All static words used, resetting rotation");
    finalAvailableWords = words;
    updatedUsedWords = [];
  }

  // Pick a random word from available words
  const randomWord =
    finalAvailableWords[Math.floor(Math.random() * finalAvailableWords.length)];

  // Add the selected word to used words list
  updatedUsedWords.push(randomWord.word);

  console.log("Selected static word:", randomWord.word);
  console.log("Used words count:", updatedUsedWords.length);

  return {
    staticWord: randomWord,
    updatedUsedWords,
  };
};

export { fetchWordsFromWordnik, getStaticWord };
