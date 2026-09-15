// data/demo.js
// Placeholder demo content for layout/UX purposes only — no real user, balance or
// transaction is represented. GameEarn has no account system, so this file only
// holds content that doesn't require a visitor to be "logged in": a public
// leaderboard showcase and the "Ways to Earn" explainer cards, both of which
// link out to real games/offers rather than to any personal account page.

const DEMO_LEADERBOARD = [
  { rank: 1, username: "NovaPlayer", points: 18420, level: 27 },
  { rank: 2, username: "PixelHunter", points: 17110, level: 25 },
  { rank: 3, username: "QuestRunner_", points: 16225, level: 24 },
  { rank: 4, username: "ByteChaser", points: 14980, level: 22 },
  { rank: 5, username: "EchoRider", points: 13590, level: 21 },
  { rank: 6, username: "LumenFox", points: 12870, level: 20 },
  { rank: 7, username: "DriftKid", points: 11940, level: 19 },
  { rank: 8, username: "TerraNova", points: 10850, level: 18 },
  { rank: 9, username: "GlacierWolf", points: 9760, level: 17 },
  { rank: 10, username: "SkyeVector", points: 8990, level: 16 },
];

const WAYS_TO_EARN = [
  { key: "games", title: "Play Games", desc: "Discover earning games with built-in reward programs run by their developers.", href: "/games/", cta: "Browse Games" },
  { key: "tasks", title: "Complete Tasks", desc: "Finish simple in-app tasks like account setup, streaks or activity logging — tracked by the app itself.", href: "/offers/?category=tasks", cta: "View Tasks" },
  { key: "surveys", title: "Surveys", desc: "Share your opinion in short surveys from verified research providers.", href: "/offers/?category=surveys", cta: "View Surveys" },
  { key: "app-offers", title: "App Offers", desc: "Try new apps and complete simple onboarding steps for a one-time reward.", href: "/offers/?category=app-offers", cta: "View App Offers" },
  { key: "cashback", title: "Cashback", desc: "Shop through tracked partner links to become eligible for cashback.", href: "/offers/?category=cashback", cta: "View Cashback" },
  { key: "quizzes", title: "Quizzes", desc: "Answer short knowledge quizzes from sponsors for quick, easy rewards.", href: "/offers/?category=surveys", cta: "Take a Quiz" },
];

module.exports = {
  DEMO_LEADERBOARD,
  WAYS_TO_EARN,
};
