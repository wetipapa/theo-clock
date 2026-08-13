import { createContext, useContext, useEffect, useMemo, useReducer } from "react";
import type { ReactNode } from "react";
import { gameReducer } from "./gameReducer";
import type { GameAction } from "./gameReducer";
import { createDefaultState } from "./gameState";
import type { GameState } from "./gameState";
import { loadState, saveState } from "../lib/storage";

interface GameContextValue {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
}

const GameContext = createContext<GameContextValue | null>(null);

function init(): GameState {
  const fallback = createDefaultState();
  if (typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
    fallback.settings.reduceMotion = true;
  }
  return loadState(fallback);
}

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(gameReducer, undefined, init);

  useEffect(() => {
    saveState(state);
  }, [state]);

  const value = useMemo(() => ({ state, dispatch }), [state]);

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGame(): GameContextValue {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error("useGame은 GameProvider 안에서만 사용할 수 있어요");
  return ctx;
}
