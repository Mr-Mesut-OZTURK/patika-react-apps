import { useState, useCallback, useEffect, useRef } from "react";
import { CardType } from "../types";

const EMOJIS = ["🍎", "🍊", "🍋", "🍇", "🍓", "🍒"];
const LS_KEY = "memory_best_score";

function buildDeck(): CardType[] {
  const deck: CardType[] = [];
  EMOJIS.forEach((emoji, pairId) => {
    deck.push({
      id: pairId * 2,
      pairId,
      emoji,
      isFlipped: false,
      isMatched: false,
    });
    deck.push({
      id: pairId * 2 + 1,
      pairId,
      emoji,
      isFlipped: false,
      isMatched: false,
    });
  });
  // Fisher-Yates shuffle
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
}

function loadBestScore(): number | null {
  const raw = localStorage.getItem(LS_KEY);
  if (raw === null) return null;
  const n = parseInt(raw, 10);
  return isNaN(n) ? null : n;
}

export function useMemoryGame() {
  const [cards, setCards] = useState<CardType[]>(buildDeck);
  const [flippedIds, setFlippedIds] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [bestScore, setBestScore] = useState<number | null>(loadBestScore);
  const [isChecking, setIsChecking] = useState(false);
  const [isNewRecord, setIsNewRecord] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isGameOver = cards.every((c) => c.isMatched);

  // Save best score when game ends
  useEffect(() => {
    if (!isGameOver || moves === 0) return;
    const current = loadBestScore();
    if (current === null || moves < current) {
      localStorage.setItem(LS_KEY, String(moves));
      setBestScore(moves);
      setIsNewRecord(true);
    }
  }, [isGameOver]); // eslint-disable-line react-hooks/exhaustive-deps

  const flipCard = useCallback(
    (id: number) => {
      if (isChecking) return;
      if (flippedIds.includes(id)) return;
      if (cards.find((c) => c.id === id)?.isMatched) return;

      const newFlipped = [...flippedIds, id];

      setCards((prev) =>
        prev.map((c) => (c.id === id ? { ...c, isFlipped: true } : c)),
      );

      if (newFlipped.length === 1) {
        setFlippedIds(newFlipped);
        return;
      }

      // Second card picked — evaluate
      setFlippedIds([]);
      setMoves((m) => m + 1);
      setIsChecking(true);

      const [firstId, secondId] = newFlipped;
      const firstCard = cards.find((c) => c.id === firstId)!;
      const secondCard = cards.find((c) => c.id === secondId)!;

      if (firstCard.pairId === secondCard.pairId) {
        // Match — mark immediately
        setCards((prev) =>
          prev.map((c) =>
            c.id === firstId || c.id === secondId
              ? { ...c, isFlipped: true, isMatched: true }
              : c,
          ),
        );
        setIsChecking(false);
      } else {
        // No match — flip back after delay
        timerRef.current = setTimeout(() => {
          setCards((prev) =>
            prev.map((c) =>
              c.id === firstId || c.id === secondId
                ? { ...c, isFlipped: false }
                : c,
            ),
          );
          setIsChecking(false);
        }, 900);
      }
    },
    [cards, flippedIds, isChecking],
  );

  const restart = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setCards(buildDeck());
    setFlippedIds([]);
    setMoves(0);
    setIsChecking(false);
    setIsNewRecord(false);
  }, []);

  return {
    cards,
    moves,
    bestScore,
    isGameOver,
    isNewRecord,
    flipCard,
    restart,
  };
}
