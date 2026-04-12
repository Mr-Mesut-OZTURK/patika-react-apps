import React, { useState, useCallback, useEffect } from "react";
import { useTranslation } from "react-i18next";
import styles from "./RpsApp.module.css";

type Choice = "rock" | "paper" | "scissors";
type RoundResult = "win" | "lose" | "draw";
type Phase = "idle" | "thinking" | "result";

interface Round {
  id: number;
  player: Choice;
  computer: Choice;
  result: RoundResult;
  descKey: string;
}

const CHOICES: Choice[] = ["rock", "paper", "scissors"];
const WIN_SCORE = 3;

const EMOJI: Record<Choice, string> = {
  rock: "🪨",
  paper: "📄",
  scissors: "✂️",
};

function randomChoice(): Choice {
  return CHOICES[Math.floor(Math.random() * 3)];
}

function getResult(player: Choice, computer: Choice): RoundResult {
  if (player === computer) return "draw";
  if (
    (player === "rock" && computer === "scissors") ||
    (player === "paper" && computer === "rock") ||
    (player === "scissors" && computer === "paper")
  )
    return "win";
  return "lose";
}

function getDescKey(player: Choice, computer: Choice): string {
  if (player === computer) return "rps.desc_draw";
  const winner = getResult(player, computer) === "win" ? player : computer;
  if (winner === "rock") return "rps.desc_rock_scissors";
  if (winner === "scissors") return "rps.desc_scissors_paper";
  return "rps.desc_paper_rock";
}

const RpsApp: React.FC = () => {
  const { t } = useTranslation();
  const [score, setScore] = useState(0);
  const [rounds, setRounds] = useState<Round[]>([]);
  const [phase, setPhase] = useState<Phase>("idle");
  const [playerChoice, setPlayerChoice] = useState<Choice | null>(null);
  const [computerChoice, setComputerChoice] = useState<Choice | null>(null);
  const [currentResult, setCurrentResult] = useState<RoundResult | null>(null);
  const [gameOver, setGameOver] = useState<"player" | "computer" | null>(null);
  const [roundKey, setRoundKey] = useState(0);

  const play = useCallback(
    (choice: Choice) => {
      if (phase === "thinking" || gameOver) return;
      setPlayerChoice(choice);
      setComputerChoice(null);
      setCurrentResult(null);
      setPhase("thinking");
      setRoundKey((k) => k + 1);
    },
    [phase, gameOver],
  );

  useEffect(() => {
    if (phase !== "thinking" || !playerChoice) return;
    const timer = setTimeout(() => {
      const comp = randomChoice();
      const result = getResult(playerChoice, comp);
      const descKey = getDescKey(playerChoice, comp);

      setComputerChoice(comp);
      setCurrentResult(result);
      setPhase("result");

      setRounds((prev) => [
        {
          id: prev.length + 1,
          player: playerChoice,
          computer: comp,
          result,
          descKey,
        },
        ...prev,
      ]);

      setScore((prev) => {
        const next =
          result === "win" ? prev + 1 : result === "lose" ? prev - 1 : prev;
        if (next >= WIN_SCORE) setGameOver("player");
        else if (next <= -WIN_SCORE) setGameOver("computer");
        return next;
      });
    }, 850);

    return () => clearTimeout(timer);
  }, [phase, playerChoice]);

  const reset = useCallback(() => {
    setScore(0);
    setRounds([]);
    setPhase("idle");
    setPlayerChoice(null);
    setComputerChoice(null);
    setCurrentResult(null);
    setGameOver(null);
    setRoundKey((k) => k + 1);
  }, []);

  const playerScore = Math.max(0, score);
  const computerScore = Math.max(0, -score);

  return (
    <div className={styles.page}>
      {/* ── Header ── */}
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <h1 className={styles.title}>
            <span className={styles.titleEmoji}>✊</span>
            {t("rps.title")}
            <span className={styles.titleEmoji}>✌️</span>
          </h1>
          <p className={styles.subtitle}>{t("rps.subtitle")}</p>
        </div>
      </header>

      <main className={styles.main}>
        {/* ── Game Over ── */}
        {gameOver && (
          <div
            className={`${styles.gameOverOverlay} ${
              gameOver === "player" ? styles.gameOverWin : styles.gameOverLose
            }`}
          >
            <div className={styles.gameOverCard}>
              <span className={styles.gameOverEmoji}>
                {gameOver === "player" ? "🏆" : "💀"}
              </span>
              <p className={styles.gameOverText}>
                {gameOver === "player"
                  ? t("rps.you_win")
                  : t("rps.computer_wins")}
              </p>
              <button className={styles.resetBtn} onClick={reset} type="button">
                {t("rps.play_again")}
              </button>
            </div>
          </div>
        )}

        {/* ── Arena ── */}
        <div className={styles.arena}>
          {/* Player Side */}
          <div className={styles.fighter}>
            <span className={styles.fighterName}>{t("rps.you")}</span>
            <div className={styles.pips}>
              {Array.from({ length: WIN_SCORE }, (_, i) => (
                <div
                  key={i}
                  className={`${styles.pip} ${i < playerScore ? styles.pipPlayer : ""}`}
                />
              ))}
            </div>
            <div
              key={`p-${roundKey}`}
              className={`${styles.bubble} ${styles.bubbleLeft} ${
                playerChoice ? styles.bubbleHasChoice : ""
              } ${
                phase === "result" && currentResult === "win"
                  ? styles.bubbleWinner
                  : phase === "result" && currentResult === "lose"
                    ? styles.bubbleLoser
                    : phase === "result" && currentResult === "draw"
                      ? styles.bubbleDraw
                      : ""
              }`}
            >
              {playerChoice ? (
                <span className={styles.choiceDisplay}>
                  {EMOJI[playerChoice]}
                </span>
              ) : (
                <span className={styles.idleQ}>?</span>
              )}
            </div>
            <span className={styles.fighterScore}>{playerScore}</span>
          </div>

          {/* Center */}
          <div className={styles.center}>
            <div
              className={`${styles.vsLabel} ${
                phase === "result" ? styles.vsFlash : ""
              }`}
            >
              VS
            </div>
            {phase === "result" && currentResult && (
              <div key={`fx-${roundKey}`} className={styles.battleFx}>
                {currentResult === "win"
                  ? "💥"
                  : currentResult === "lose"
                    ? "💀"
                    : "🤝"}
              </div>
            )}
          </div>

          {/* Computer Side */}
          <div className={`${styles.fighter} ${styles.fighterRight}`}>
            <span className={styles.fighterName}>{t("rps.computer")}</span>
            <div className={styles.pips}>
              {Array.from({ length: WIN_SCORE }, (_, i) => (
                <div
                  key={i}
                  className={`${styles.pip} ${i < computerScore ? styles.pipComp : ""}`}
                />
              ))}
            </div>
            <div
              key={`c-${roundKey}`}
              className={`${styles.bubble} ${styles.bubbleRight} ${
                phase === "thinking" ? styles.bubbleThinking : ""
              } ${computerChoice ? styles.bubbleHasChoice : ""} ${
                phase === "result" && currentResult === "lose"
                  ? styles.bubbleWinner
                  : phase === "result" && currentResult === "win"
                    ? styles.bubbleLoser
                    : phase === "result" && currentResult === "draw"
                      ? styles.bubbleDraw
                      : ""
              }`}
            >
              {phase === "thinking" ? (
                <div className={styles.dots}>
                  <span
                    className={styles.dot}
                    style={{ animationDelay: "0ms" }}
                  />
                  <span
                    className={styles.dot}
                    style={{ animationDelay: "160ms" }}
                  />
                  <span
                    className={styles.dot}
                    style={{ animationDelay: "320ms" }}
                  />
                </div>
              ) : computerChoice ? (
                <span className={`${styles.choiceDisplay} ${styles.revealed}`}>
                  {EMOJI[computerChoice]}
                </span>
              ) : (
                <span className={styles.idleQ}>?</span>
              )}
            </div>
            <span className={styles.fighterScore}>{computerScore}</span>
          </div>
        </div>

        {/* ── Combat Description ── */}
        {phase === "result" && playerChoice && computerChoice && (
          <p
            key={`desc-${roundKey}`}
            className={`${styles.combatDesc} ${
              currentResult === "win"
                ? styles.descWin
                : currentResult === "lose"
                  ? styles.descLose
                  : styles.descDraw
            }`}
          >
            {t(getDescKey(playerChoice, computerChoice))}
          </p>
        )}

        {/* ── Round Result ── */}
        {phase === "result" && currentResult && (
          <div
            key={`rr-${roundKey}`}
            className={`${styles.roundResult} ${
              currentResult === "win"
                ? styles.rrWin
                : currentResult === "lose"
                  ? styles.rrLose
                  : styles.rrDraw
            }`}
          >
            {currentResult === "win"
              ? t("rps.round_win")
              : currentResult === "lose"
                ? t("rps.round_lose")
                : t("rps.round_draw")}
          </div>
        )}

        {/* ── Choice Buttons ── */}
        {!gameOver && (
          <div className={styles.choices}>
            {CHOICES.map((c) => (
              <button
                key={c}
                className={`${styles.choiceBtn} ${styles[`choiceBtn_${c}` as keyof typeof styles]} ${
                  playerChoice === c && phase !== "idle"
                    ? styles.choiceBtnActive
                    : ""
                } ${phase === "thinking" ? styles.choiceBtnDisabled : ""}`}
                onClick={() => play(c)}
                type="button"
                disabled={phase === "thinking"}
              >
                <span className={styles.btnEmoji}>{EMOJI[c]}</span>
                <span className={styles.btnLabel}>{t(`rps.${c}`)}</span>
              </button>
            ))}
          </div>
        )}

        {!gameOver && (
          <p className={styles.hint}>{t("rps.hint", { score: WIN_SCORE })}</p>
        )}

        {/* ── History ── */}
        {rounds.length > 0 && (
          <section className={styles.history}>
            <h2 className={styles.histTitle}>{t("rps.history")}</h2>
            <div className={styles.histList}>
              {rounds.map((r) => (
                <div
                  key={r.id}
                  className={`${styles.histRow} ${
                    r.result === "win"
                      ? styles.histWin
                      : r.result === "lose"
                        ? styles.histLose
                        : styles.histDraw
                  }`}
                >
                  <span className={styles.histNum}>#{r.id}</span>
                  <span className={styles.histPick}>
                    {EMOJI[r.player]} {t(`rps.${r.player}`)}
                  </span>
                  <span className={styles.histVs}>vs</span>
                  <span className={styles.histPick}>
                    {EMOJI[r.computer]} {t(`rps.${r.computer}`)}
                  </span>
                  <span className={styles.histTag}>
                    {r.result === "win" ? "✓" : r.result === "lose" ? "✗" : "="}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

export default RpsApp;
