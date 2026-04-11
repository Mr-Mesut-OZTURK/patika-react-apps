export type NoteColor =
  | "default"
  | "red"
  | "orange"
  | "yellow"
  | "green"
  | "blue"
  | "purple"
  | "pink";

export interface Note {
  id: string;
  title: string;
  content: string;
  emoji: string;
  color: NoteColor;
  createdAt: string; // ISO
  updatedAt: string; // ISO
  pinned: boolean;
}

export const NOTE_COLORS: Record<
  NoteColor,
  { gradient: string; accent: string }
> = {
  default: {
    gradient: "linear-gradient(135deg, #1e1e2e 0%, #16213e 100%)",
    accent: "#7c7cdc",
  },
  red: {
    gradient: "linear-gradient(135deg, #2d0d0d 0%, #1a0505 100%)",
    accent: "#e63950",
  },
  orange: {
    gradient: "linear-gradient(135deg, #2d1200 0%, #1a0a00 100%)",
    accent: "#f39c12",
  },
  yellow: {
    gradient: "linear-gradient(135deg, #2d2500 0%, #1a1500 100%)",
    accent: "#f7c948",
  },
  green: {
    gradient: "linear-gradient(135deg, #0a2010 0%, #051008 100%)",
    accent: "#2ecc71",
  },
  blue: {
    gradient: "linear-gradient(135deg, #0a1828 0%, #050c18 100%)",
    accent: "#3498db",
  },
  purple: {
    gradient: "linear-gradient(135deg, #180a28 0%, #0c0515 100%)",
    accent: "#9b59b6",
  },
  pink: {
    gradient: "linear-gradient(135deg, #280a18 0%, #14050c 100%)",
    accent: "#e91e8b",
  },
};

export const EMOJI_LIST = [
  "📝",
  "✅",
  "💡",
  "🔖",
  "🎯",
  "📌",
  "🗒️",
  "📚",
  "💼",
  "🎨",
  "🌟",
  "🔥",
  "💬",
  "🧠",
  "🏆",
  "🎵",
  "🌈",
  "🌿",
  "☕",
  "🚀",
  "💻",
  "📱",
  "🔑",
  "🎭",
  "🌙",
  "☀️",
  "🎪",
  "🦋",
  "🌺",
  "🎂",
  "📷",
  "🎮",
  "🔬",
  "📊",
  "🗺️",
  "🧩",
];
