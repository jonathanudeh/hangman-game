const fetchWordFromWordnik = async (difficulty: string) => {
  const API_KEY = import.meta.env.VITE_WORDNIK_API_KEY;

  const params = {
    easy: {
      minCorpusCount: 10000,
      maxLength: 6,
      hasDictionaryDef: true,
      includePartOfSpeech: "noun,verb,adjective",
    },
    medium: {
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
  const queryParams = new URLSearchParams({
    ...difficultyParams,
    limit: "1",
    api_key: API_KEY,
  } as any);

  const res = await fetch(
    `https://api.wordnik.com/v4/words.json/randomWords?${queryParams}`
  );
  if (!res.ok) throw new Error("Wordnik API failed");

  const [wordData] = await res.json();

  // fetchign definition for hint
  let hint = "";
  try {
    const defRes = await fetch(
      `https://api.wordnik.com/v4/word.json/${wordData.word}/definitions?limit=1&api_key=${API_KEY}`
    );
    if (defRes.ok) {
      const definition = await defRes.json();
      if (definition.length > 0) {
        hint = definition[0].text;
      }
    }
  } catch (err) {
    throw new Error("Failed to fetch definition. Error: " + err);
  }

  return { word: wordData.word, hint };
};

const getStaticWord = (difficulty: string) => {
  console.log("static word");
  const staticWords = {
    easy: [
      {
        word: "cat",
        category: "Animals",
        hint: "A small furry pet that meows",
      },
      { word: "dog", category: "Animals", hint: "Mans best friend" },
      { word: "sun", category: "Nature", hint: "The star that lights our day" },
      {
        word: "car",
        category: "Transport",
        hint: "A vehicle with four wheels",
      },
      {
        word: "book",
        category: "Objects",
        hint: "You read this for knowledge",
      },
    ],
    medium: [
      {
        word: "elephant",
        category: "Animals",
        hint: "Largest land mammal with a trunk",
      },
      {
        word: "computer",
        category: "Technology",
        hint: "Electronic device for processing data",
      },
      {
        word: "rainbow",
        category: "Nature",
        hint: "Colorful arc in the sky after rain",
      },
      {
        word: "guitar",
        category: "Music",
        hint: "Six-stringed musical instrument",
      },
    ],
    hard: [
      {
        word: "javascript",
        category: "Programming",
        hint: "Popular web programming language",
      },
      {
        word: "mysterious",
        category: "Adjectives",
        hint: "Difficult to understand or explain",
      },
      {
        word: "adventure",
        category: "Activities",
        hint: "Exciting or unusual experience",
      },
      {
        word: "symphony",
        category: "Music",
        hint: "Large-scale musical composition",
      },
    ],
  };

  const words = staticWords[difficulty as keyof typeof staticWords];
  return words[Math.floor(Math.random() * words.length)];
};

export { fetchWordFromWordnik, getStaticWord };
