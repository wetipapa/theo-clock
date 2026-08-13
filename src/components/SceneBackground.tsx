import type { SceneId } from "../types";

interface SceneConfig {
  gradient: string;
  ground: string;
  celestial: "sun" | "moon" | null;
  celestialCx: number;
  celestialCy: number;
  stars: boolean;
  cloudOpacity: number;
}

const SCENES: Record<SceneId, SceneConfig> = {
  "home-morning": { gradient: "linear-gradient(180deg,#ffd9a8 0%,#ffb98d 55%,#ffe8c9 100%)", ground: "#e8c48a", celestial: "sun", celestialCx: 78, celestialCy: 22, stars: false, cloudOpacity: 0.55 },
  "bus-stop": { gradient: "linear-gradient(180deg,#bfe6f2 0%,#eaf6ee 100%)", ground: "#bfe0a6", celestial: "sun", celestialCx: 20, celestialCy: 16, stars: false, cloudOpacity: 0.8 },
  kindergarten: { gradient: "linear-gradient(180deg,#8fd3e8 0%,#d7f0ee 100%)", ground: "#a8dba0", celestial: "sun", celestialCx: 50, celestialCy: 12, stars: false, cloudOpacity: 0.85 },
  lunch: { gradient: "linear-gradient(180deg,#ffe8a3 0%,#fff3d6 100%)", ground: "#f0c98a", celestial: "sun", celestialCx: 60, celestialCy: 10, stars: false, cloudOpacity: 0.5 },
  snack: { gradient: "linear-gradient(180deg,#ffcf8f 0%,#ffe3b0 100%)", ground: "#e3b06a", celestial: "sun", celestialCx: 30, celestialCy: 20, stars: false, cloudOpacity: 0.6 },
  bath: { gradient: "linear-gradient(180deg,#b394d6 0%,#f2b98f 60%,#ffd9a8 100%)", ground: "#c68f6a", celestial: "sun", celestialCx: 78, celestialCy: 30, stars: false, cloudOpacity: 0.35 },
  night: { gradient: "linear-gradient(180deg,#1d2049 0%,#3a3170 60%,#5b4b8a 100%)", ground: "#2c2a55", celestial: "moon", celestialCx: 75, celestialCy: 18, stars: true, cloudOpacity: 0.15 },
};

export function SceneBackground({ sceneId, className }: { sceneId: SceneId; className?: string }) {
  const cfg = SCENES[sceneId];
  return (
    <div className={`absolute inset-0 overflow-hidden ${className ?? ""}`} style={{ background: cfg.gradient }} aria-hidden="true">
      {cfg.stars && <Stars />}
      {cfg.celestial && <Celestial kind={cfg.celestial} cx={cfg.celestialCx} cy={cfg.celestialCy} />}
      <Clouds opacity={cfg.cloudOpacity} />
      <svg className="absolute bottom-0 left-0 w-full" viewBox="0 0 400 60" preserveAspectRatio="none" style={{ height: "14%" }}>
        <path d="M0 30 Q100 0 200 22 T400 15 V60 H0 Z" fill={cfg.ground} />
      </svg>
    </div>
  );
}

function Celestial({ kind, cx, cy }: { kind: "sun" | "moon"; cx: number; cy: number }) {
  if (kind === "sun") {
    return (
      <svg className="absolute" style={{ left: `${cx}%`, top: `${cy}%`, width: 64, height: 64 }} viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="7" fill="#ffe9b0" opacity="0.9" />
        <circle cx="12" cy="12" r="5" fill="#ffd166" />
      </svg>
    );
  }
  return (
    <svg className="absolute" style={{ left: `${cx}%`, top: `${cy}%`, width: 52, height: 52 }} viewBox="0 0 24 24">
      <path d="M20 13.5A8.5 8.5 0 1 1 10.5 4a7 7 0 1 0 9.5 9.5z" fill="#f5efd6" />
    </svg>
  );
}

function Clouds({ opacity }: { opacity: number }) {
  const clouds = [
    { x: 8, y: 12, s: 1 },
    { x: 62, y: 8, s: 0.75 },
    { x: 40, y: 20, s: 0.6 },
  ];
  return (
    <>
      {clouds.map((c, i) => (
        <svg
          key={i}
          className="absolute"
          style={{ left: `${c.x}%`, top: `${c.y}%`, width: 90 * c.s, height: 45 * c.s, opacity }}
          viewBox="0 0 90 45"
        >
          <ellipse cx="30" cy="28" rx="26" ry="15" fill="#fff" />
          <ellipse cx="55" cy="20" rx="20" ry="18" fill="#fff" />
          <ellipse cx="70" cy="30" rx="18" ry="12" fill="#fff" />
        </svg>
      ))}
    </>
  );
}

function Stars() {
  const stars = Array.from({ length: 18 }, (_, i) => ({
    x: (i * 37) % 100,
    y: (i * 53) % 70,
    r: 0.6 + ((i * 7) % 5) * 0.25,
  }));
  return (
    <svg className="absolute inset-0 w-full h-full">
      {stars.map((s, i) => (
        <circle key={i} cx={`${s.x}%`} cy={`${s.y}%`} r={s.r} fill="#fff" opacity={0.5 + (i % 3) * 0.15} />
      ))}
    </svg>
  );
}
