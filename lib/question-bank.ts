export type Difficulty = "easy" | "medium" | "hard";

export type BankQuestion = {
  id: string;
  category: string;
  difficulty: Difficulty;
  prompt: string;
  /** Placeholder options the creator edits to fit their own answer. */
  placeholderOptions: string[];
};

/**
 * ~30 starter templates, per spec Section 06. The creator picks a prompt,
 * then fills in 4 options and marks which one is correct — the bank exists
 * to remove blank-page friction, not to be used verbatim.
 */
export const QUESTION_BANK: BankQuestion[] = [
  // Favorites — easy
  { id: "fav-food", category: "Favorites", difficulty: "easy", prompt: "What's my go-to comfort food?", placeholderOptions: ["", "", "", ""] },
  { id: "fav-color", category: "Favorites", difficulty: "easy", prompt: "What's my favorite color?", placeholderOptions: ["", "", "", ""] },
  { id: "fav-movie", category: "Favorites", difficulty: "easy", prompt: "What's my favorite movie?", placeholderOptions: ["", "", "", ""] },
  { id: "fav-snack", category: "Favorites", difficulty: "easy", prompt: "What snack do I always have on hand?", placeholderOptions: ["", "", "", ""] },
  { id: "fav-drink", category: "Favorites", difficulty: "easy", prompt: "What's my usual order at a cafe?", placeholderOptions: ["", "", "", ""] },
  { id: "fav-song", category: "Favorites", difficulty: "easy", prompt: "What song do I have on repeat lately?", placeholderOptions: ["", "", "", ""] },

  // Habits / quirks — medium
  { id: "habit-exam", category: "Habits & quirks", difficulty: "medium", prompt: "What do I always do right before an exam?", placeholderOptions: ["", "", "", ""] },
  { id: "habit-morning", category: "Habits & quirks", difficulty: "medium", prompt: "What's the first thing I do after waking up?", placeholderOptions: ["", "", "", ""] },
  { id: "habit-stress", category: "Habits & quirks", difficulty: "medium", prompt: "What do I do when I'm stressed?", placeholderOptions: ["", "", "", ""] },
  { id: "habit-phrase", category: "Habits & quirks", difficulty: "medium", prompt: "What's a phrase I say way too often?", placeholderOptions: ["", "", "", ""] },
  { id: "habit-sleep", category: "Habits & quirks", difficulty: "medium", prompt: "What time do I actually fall asleep?", placeholderOptions: ["", "", "", ""] },
  { id: "habit-app", category: "Habits & quirks", difficulty: "medium", prompt: "Which app do I open first when I'm bored?", placeholderOptions: ["", "", "", ""] },

  // Most likely to — medium
  { id: "ml-call", category: "Most likely to", difficulty: "medium", prompt: "Who am I most likely to call at 2am?", placeholderOptions: ["", "", "", ""] },
  { id: "ml-late", category: "Most likely to", difficulty: "medium", prompt: "What am I most likely to be late for?", placeholderOptions: ["", "", "", ""] },
  { id: "ml-crisis", category: "Most likely to", difficulty: "medium", prompt: "What's my go-to move in a group project crisis?", placeholderOptions: ["", "", "", ""] },
  { id: "ml-splurge", category: "Most likely to", difficulty: "medium", prompt: "What am I most likely to overspend on?", placeholderOptions: ["", "", "", ""] },

  // Embarrassing / funny — hard
  { id: "emb-excuse", category: "Embarrassing & funny", difficulty: "hard", prompt: "What's my most-used excuse for being late?", placeholderOptions: ["", "", "", ""] },
  { id: "emb-fear", category: "Embarrassing & funny", difficulty: "hard", prompt: "What's something I'm irrationally afraid of?", placeholderOptions: ["", "", "", ""] },
  { id: "emb-embarrass", category: "Embarrassing & funny", difficulty: "hard", prompt: "What's the most embarrassing thing that's happened to me in public?", placeholderOptions: ["", "", "", ""] },
  { id: "emb-nickname", category: "Embarrassing & funny", difficulty: "hard", prompt: "What's a nickname only close friends know about?", placeholderOptions: ["", "", "", ""] },
  { id: "emb-cry", category: "Embarrassing & funny", difficulty: "hard", prompt: "What's a movie that made me cry that I'd never admit to?", placeholderOptions: ["", "", "", ""] },

  // Predictions — hard
  { id: "pred-5yr", category: "Predictions", difficulty: "hard", prompt: "Where do I see myself in 5 years?", placeholderOptions: ["", "", "", ""] },
  { id: "pred-job", category: "Predictions", difficulty: "hard", prompt: "What job would I have in an alternate life?", placeholderOptions: ["", "", "", ""] },
  { id: "pred-famous", category: "Predictions", difficulty: "hard", prompt: "What would I most likely become famous for?", placeholderOptions: ["", "", "", ""] },
  { id: "pred-city", category: "Predictions", difficulty: "hard", prompt: "What city would I move to if I could move anywhere?", placeholderOptions: ["", "", "", ""] },

  // Extra favorites / habits to round out the bank to ~30
  { id: "fav-hobby", category: "Favorites", difficulty: "easy", prompt: "What's my current hobby obsession?", placeholderOptions: ["", "", "", ""] },
  { id: "fav-season", category: "Favorites", difficulty: "easy", prompt: "What's my favorite season?", placeholderOptions: ["", "", "", ""] },
  { id: "habit-procrastinate", category: "Habits & quirks", difficulty: "medium", prompt: "How do I procrastinate the most?", placeholderOptions: ["", "", "", ""] },
  { id: "habit-order", category: "Habits & quirks", difficulty: "medium", prompt: "What do I always order when I can't decide?", placeholderOptions: ["", "", "", ""] },
  { id: "ml-forget", category: "Most likely to", difficulty: "medium", prompt: "What do I always forget to bring?", placeholderOptions: ["", "", "", ""] },
  { id: "pred-decade", category: "Predictions", difficulty: "hard", prompt: "What trend from now will I be embarrassed by in 10 years?", placeholderOptions: ["", "", "", ""] },
];

export const CATEGORIES = Array.from(
  new Set(QUESTION_BANK.map((q) => q.category))
);

export const MIN_QUESTIONS = 8;
export const MAX_QUESTIONS = 10;

/** Recommended difficulty mix per spec Section 06: 2-3 easy, 4-5 medium, 2-3 hard. */
export const RECOMMENDED_MIX = { easy: 3, medium: 5, hard: 2 };
