// fetch function
const fetchWordsFromWordnik = async (difficulty: string, limit: number = 8) => {
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
  const fetchLimit = Math.min(limit * 2, 8);
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

      let hint = "";

      try {
        // Add delay between definition requests to avoid rate limiting
        if (i > 0) {
          await new Promise((resolve) => setTimeout(resolve, 300));
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

        if (!defRes.ok) continue; // skip invalid

        const defs = await defRes.json();
        if (!Array.isArray(defs) || defs.length === 0) continue; // skip if none

        // Filter valid definitions only
        const validDefs = defs
          .filter(
            (def) =>
              def.text &&
              typeof def.text === "string" &&
              !def.text
                .toLowerCase()
                .includes("definition format not supported") &&
              !def.text.toLowerCase().includes("wordnik") &&
              !def.text.toLowerCase().includes("see also") &&
              def.text.trim().length > 10
          )
          .map((def) => def.text.replace(/<[^>]*>/g, "").trim());

        if (validDefs.length === 0) continue; // skip if no clean defs

        hint = validDefs[0].substring(0, 200);
      } catch (defErr) {
        console.warn(
          `Failed to fetch definition for ${wordData.word}:`,
          defErr
        );
      }
      wordsWithHints.push({ word: wordData.word, hint });
    }

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
      { word: "planet", hint: "A large body orbiting a star" },
      { word: "garden", hint: "An area where flowers or vegetables grow" },
      { word: "mirror", hint: "Reflective surface that shows your image" },
      { word: "bridge", hint: "Structure built over a river or road" },
      { word: "rocket", hint: "Vehicle that travels into space" },
      { word: "pencil", hint: "Used for writing or drawing" },
      { word: "island", hint: "Land surrounded by water" },
      { word: "forest", hint: "Large area covered with trees" },
      { word: "castle", hint: "Fortified building from medieval times" },
      { word: "desert", hint: "Dry, sandy region with little rain" },
      { word: "window", hint: "Glass-covered opening in a wall" },
      { word: "pirate", hint: "Sailor who steals from ships" },
      { word: "planet", hint: "A large object that orbits a star" },
      {
        word: "museum",
        hint: "Building where historical objects are displayed",
      },
      { word: "market", hint: "Place where goods are bought and sold" },
    ],

    normal: [
      { word: "volcano", hint: "Mountain that erupts lava" },
      { word: "diamond", hint: "Hard precious stone used in jewelry" },
      { word: "tornado", hint: "Violent rotating column of air" },
      { word: "hospital", hint: "Place where sick people are treated" },
      { word: "airplane", hint: "Flying vehicle with wings" },
      { word: "triangle", hint: "Shape with three sides" },
      { word: "merchant", hint: "Person involved in trade" },
      { word: "festival", hint: "Public celebration or event" },
      { word: "machine", hint: "Device that performs tasks" },
      { word: "harvest", hint: "Gathering of ripe crops" },
      { word: "journey", hint: "Act of traveling from one place to another" },
      { word: "paradise", hint: "Place of perfect happiness" },
      { word: "umbrella", hint: "Used to protect against rain" },
      { word: "adventure", hint: "Exciting experience or activity" },
      { word: "language", hint: "System of communication using words" },
    ],

    hard: [
      { word: "philosophy", hint: "Study of fundamental nature of reality" },
      { word: "metaphor", hint: "Figure of speech comparing unlike things" },
      { word: "hierarchy", hint: "System where people are ranked by status" },
      { word: "conscience", hint: "Inner sense of right and wrong" },
      { word: "psychiatrist", hint: "Doctor specializing in mental health" },
      { word: "catastrophe", hint: "Sudden disaster or tragedy" },
      { word: "hemisphere", hint: "Half of the Earth or a sphere" },
      {
        word: "ecosystem",
        hint: "Community of living organisms and environment",
      },
      { word: "benevolent", hint: "Well-meaning and kindly" },
      { word: "architecture", hint: "Art and science of building design" },
      {
        word: "photosynthesis",
        hint: "Process plants use to make food from sunlight",
      },
      {
        word: "transparency",
        hint: "Quality of being clear or easy to see through",
      },
      { word: "equilibrium", hint: "State of balance between forces" },
      { word: "perseverance", hint: "Persistence despite difficulties" },
      { word: "jurisdiction", hint: "Legal authority to make decisions" },
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
