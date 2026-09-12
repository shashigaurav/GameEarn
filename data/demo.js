// data/demo.js
// Everything in this file is placeholder demo content for layout/UX purposes only. None of it
// represents a real user, a real balance, or a real transaction. Every page that reads from here
// must render a visible "Demo data" label next to it.

const DEMO_DASHBOARD = {
  totalRewards: 1248,
  availableRewards: 1068,
  pendingRewards: 180,
  completedTasks: 24,
  currentStreak: 4,
  unit: "points",
};

const DEMO_DAILY_REWARDS = [
  { day: 1, label: "Day 1", reward: "10 pts", state: "claimed" },
  { day: 2, label: "Day 2", reward: "10 pts", state: "claimed" },
  { day: 3, label: "Day 3", reward: "15 pts", state: "claimed" },
  { day: 4, label: "Day 4", reward: "15 pts", state: "today" },
  { day: 5, label: "Day 5", reward: "20 pts", state: "locked" },
  { day: 6, label: "Day 6", reward: "20 pts", state: "locked" },
  { day: 7, label: "Day 7", reward: "Bonus", state: "locked" },
];

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

const DEMO_PROFILE = {
  username: "Player_2847",
  level: 12,
  totalRewards: 1248,
  completedOffers: 24,
  referralCount: 6,
  streak: 4,
};

const DEMO_ACHIEVEMENTS = [
  { name: "First Steps", unlocked: true },
  { name: "5-Day Streak", unlocked: true },
  { name: "10 Offers Done", unlocked: true },
  { name: "First Referral", unlocked: true },
  { name: "50 Offers Done", unlocked: false },
  { name: "30-Day Streak", unlocked: false },
];

const DEMO_REFERRAL = {
  code: "GAMEEARN-DEMO123",
  totalReferred: 6,
  pendingReferred: 2,
  rewardsEarnedFromReferrals: 180,
  rewardPerReferral: "30 points once your friend completes their first verified offer",
};

const DEMO_TRANSACTIONS = [
  { date: "2026-09-08", description: "FitTrack 7-Day Habit Challenge completed", type: "Earned", amount: "+200 pts", status: "Completed" },
  { date: "2026-09-06", description: "Daily reward — Day 3", type: "Earned", amount: "+15 pts", status: "Completed" },
  { date: "2026-09-04", description: "Consumer Pulse Weekly Survey", type: "Earned", amount: "+120 pts", status: "Pending" },
  { date: "2026-09-01", description: "Referral bonus — NovaPlayer joined", type: "Earned", amount: "+30 pts", status: "Completed" },
  { date: "2026-08-28", description: "Redeemed for gift card", type: "Redeemed", amount: "-500 pts", status: "Completed" },
  { date: "2026-08-24", description: "Wordly Daily Puzzle streak", type: "Earned", amount: "+70 pts", status: "Completed" },
];

const WAYS_TO_EARN = [
  { key: "games", title: "Play Games", desc: "Discover earning games with built-in reward programs run by their developers.", href: "/games/", cta: "Browse Games" },
  { key: "tasks", title: "Complete Tasks", desc: "Finish simple in-app tasks like account setup, streaks or activity logging.", href: "/offers/?category=tasks", cta: "View Tasks" },
  { key: "surveys", title: "Surveys", desc: "Share your opinion in short surveys from verified research providers.", href: "/offers/?category=surveys", cta: "View Surveys" },
  { key: "app-offers", title: "App Offers", desc: "Try new apps and complete simple onboarding steps for a one-time reward.", href: "/offers/?category=app-offers", cta: "View App Offers" },
  { key: "cashback", title: "Cashback", desc: "Shop through tracked partner links to become eligible for cashback.", href: "/offers/?category=cashback", cta: "View Cashback" },
  { key: "referral", title: "Referral Rewards", desc: "Invite friends to GameEarn and earn a bonus once they complete their first offer.", href: "/referrals/", cta: "Get Your Link" },
  { key: "daily", title: "Daily Challenges", desc: "Check in daily to build a streak and unlock small bonus rewards.", href: "/dashboard/", cta: "View Streak" },
  { key: "quizzes", title: "Quizzes", desc: "Answer short knowledge quizzes from sponsors for quick, easy rewards.", href: "/offers/?category=surveys", cta: "Take a Quiz" },
];

module.exports = {
  DEMO_DASHBOARD,
  DEMO_DAILY_REWARDS,
  DEMO_LEADERBOARD,
  DEMO_PROFILE,
  DEMO_ACHIEVEMENTS,
  DEMO_REFERRAL,
  DEMO_TRANSACTIONS,
  WAYS_TO_EARN,
};
