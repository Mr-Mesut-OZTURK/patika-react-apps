export interface CardType {
  id: number; // unique instance id (0–11)
  pairId: number; // which pair (0–5) — two cards share the same pairId
  emoji: string;
  isFlipped: boolean;
  isMatched: boolean;
}
