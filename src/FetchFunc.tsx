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

  const queryParams = new URLSearchParams({
    ...difficultyParams,
    limit: limit.toString(),
    api_key: API_KEY,
  } as any);

  try {
    console.log(`Fetching ${limit} words from Wordnik API...`);

    const res = await fetch(
      `https://api.wordnik.com/v4/words.json/randomWords?${queryParams}`
    );

    if (!res.ok) {
      throw new Error(`Wordnik API returned ${res.status}: ${res.statusText}`);
    }

    const data = await res.json();

    if (!data || !Array.isArray(data) || data.length === 0) {
      throw new Error("No words returned from API");
    }

    // Fetch definitions for all words
    const wordsWithHints = await Promise.allSettled(
      data.map(async (wordData: any) => {
        if (!wordData || !wordData.word) {
          return null;
        }

        let hint = "No definition available";

        try {
          const defRes = await fetch(
            `https://api.wordnik.com/v4/word.json/${wordData.word}/definitions?limit=1&api_key=${API_KEY}`
          );

          if (defRes.ok) {
            const definition = await defRes.json();
            if (
              definition &&
              Array.isArray(definition) &&
              definition.length > 0
            ) {
              hint = definition[0].text || "No definition available";
              // cleaning up the hint (remove HTML tags, etc.)
              hint = hint.replace(/<[^>]*>/g, "").substring(0, 100);
            }
          }
        } catch (defErr) {
          console.warn("Failed to fetch definition:", defErr);
          // Continue with default hint
        }
        return { word: wordData.word, hint };
      })
    );

    // Filter out failed requests and null values
    const validWords = wordsWithHints
      .filter(
        (
          result
        ): result is PromiseFulfilledResult<{ word: string; hint: string }> =>
          result.status === "fulfilled" && result.value !== null
      )
      .map((result) => result.value);

    console.log(
      `Successfully fetched ${validWords.length} words with definitions`
    );
    return validWords;
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
