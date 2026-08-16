import { useState } from "react";
import { GameProvider, useGame } from "./state/GameContext";
import { useSound } from "./hooks/useSound";
import { WelcomeScreen } from "./screens/WelcomeScreen";
import { HomeMapScreen } from "./screens/HomeMapScreen";
import { PlayScreen } from "./screens/PlayScreen";
import { RoomScreen } from "./screens/RoomScreen";
import { ParentSettingsScreen } from "./screens/ParentSettingsScreen";
import { ParentGate } from "./screens/ParentGate";
import type { StageId } from "./types";
import { trackStart, trackComplete, trackReplay } from "./lib/track";

type Screen = "home" | "play" | "room" | "settings";

function AppShell() {
  const { state, dispatch } = useGame();
  useSound(); // settings.soundOn 값을 Web Audio 모듈과 동기화
  const [screen, setScreen] = useState<Screen>("home");
  const [playingStage, setPlayingStage] = useState<StageId | null>(null);
  // 같은 단계를 다시 고르면 '다시하기'로 센다. 이 게임은 결과 화면 대신
  // 지도로 돌아오는 구조라, 한 번 더 하는지가 지도에서 갈린다
  const [lastStage, setLastStage] = useState<StageId | null>(null);
  const [gateOpen, setGateOpen] = useState(false);

  if (!state.onboarded) {
    return (
      <WelcomeScreen
        reduceMotion={state.settings.reduceMotion}
        onDone={() => dispatch({ type: "COMPLETE_ONBOARDING" })}
      />
    );
  }

  if (screen === "play" && playingStage) {
    return (
      <PlayScreen
        stageId={playingStage}
        onExit={() => setScreen("home")}
        onStageComplete={() => {
          trackComplete();
          setScreen("home");
        }}
      />
    );
  }

  if (screen === "room") return <RoomScreen onBack={() => setScreen("home")} />;
  if (screen === "settings") return <ParentSettingsScreen onBack={() => setScreen("home")} />;

  return (
    <>
      <HomeMapScreen
        onPlayStage={(id) => {
          if (id === lastStage) trackReplay();
          trackStart();
          setLastStage(id);
          setPlayingStage(id);
          setScreen("play");
        }}
        onOpenRoom={() => setScreen("room")}
        onOpenSettings={() => setGateOpen(true)}
      />
      {gateOpen && (
        <ParentGate
          onPass={() => {
            setGateOpen(false);
            setScreen("settings");
          }}
          onCancel={() => setGateOpen(false)}
        />
      )}
    </>
  );
}

function App() {
  return (
    <div className="h-viewport w-full flex justify-center bg-[#e9dcc3]">
      <div className="relative w-full max-w-md h-full bg-[var(--color-cream)] shadow-2xl overflow-hidden">
        <GameProvider>
          <AppShell />
        </GameProvider>
      </div>
    </div>
  );
}

export default App;
