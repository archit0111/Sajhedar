import { useId } from "react";

// The S is the trip route (land); the plane flies it (air).
const S_PATH =
  "M118.5 44 C122.8 20 58.8 20 53 52 C48 80 112 80 107 108 C101.2 140 37.2 140 41.5 116";
const PLANE =
  "M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z";
const MESSAGES = ["Packing the bags…", "Calculating the adventure…", "Splitting it equally…"];

type Props = {
  fullScreen?: boolean;
  className?: string;
};

export default function SajhedarLoader({ fullScreen = true, className = "" }: Props) {
  const maskId = `sj-reveal-${useId().replace(/:/g, "")}`;

  return (
    <div
      role="status"
      aria-live="polite"
      className={`sj-loader ${fullScreen ? "fixed" : "absolute"} inset-0 z-50 flex flex-col items-center justify-center backdrop-blur-xl ${className}`}
    >
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <span className="sr-only">Loading Sajhedar</span>

      <div aria-hidden="true" className="relative my-[26px] h-40 w-40 scale-[1.3]">
        <svg viewBox="0 0 160 160" className="absolute inset-0 h-40 w-40 overflow-visible">
          <defs>
            <mask id={maskId} maskUnits="userSpaceOnUse" x="0" y="0" width="160" height="160">
              <path className="sj-reveal" d={S_PATH} pathLength={100} />
            </mask>
          </defs>
          <path className="sj-track" d={S_PATH} />
          <g className="sj-fog" mask={`url(#${maskId})`}>
            <path className="sj-halo" d={S_PATH} pathLength={100} />
            <path className="sj-puffA" d={S_PATH} pathLength={100} />
            <path className="sj-puffB" d={S_PATH} pathLength={100} />
            <path className="sj-core" d={S_PATH} pathLength={100} />
          </g>
        </svg>

        <span className="sj-stop sj-s1" />
        <span className="sj-stop sj-s2" />
        <span className="sj-stop sj-s3" />

        <span className="sj-plane">
          <svg viewBox="0 0 24 24" className="block h-[38px] w-[38px] rotate-90">
            <path className="sj-plane-shadow" d={PLANE} transform="translate(1.2 1.8)" />
            <path className="sj-plane-body" d={PLANE} />
          </svg>
        </span>
      </div>

      <div
        aria-hidden="true"
        className="sj-text mt-[26px] indent-[0.32em] text-[13px] font-bold uppercase leading-none tracking-[0.32em]"
      >
        Sajhedar
      </div>

      <div aria-hidden="true" className="relative mt-3 h-[18px] w-[260px]">
        {MESSAGES.map((t) => (
          <span
            key={t}
            className="sj-msg sj-text absolute inset-0 text-center text-sm font-medium leading-[18px]"
          >
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}

// Animation + SVG styling (Tailwind can't express keyframes inline, so it lives here).
const CSS = `
.sj-loader {
  --sj-s: #fb923c;        /* S route colour: soft orange (Tailwind orange-400). Try #f97316 for stronger */
  --sj-s-soft: #fdba74;   /* faint track under the S (orange-300) */
  --sj-stop: #7c2d12;     /* traveller dots (orange-900) */
  --sj-text: #000;        /* "Sajhedar" + status text: black */

  background: transparent;          /* no background colour: only the blur shows */
  contain: layout;
  opacity: 0;
  animation: sj-fade-in 250ms ease-out 150ms forwards; /* waits 150ms: no flash on fast loads */
}
.sj-text { color: var(--sj-text); }

.sj-track, .sj-halo, .sj-puffA, .sj-puffB, .sj-core {
  fill: none; stroke: var(--sj-s); stroke-linejoin: round; stroke-linecap: round;
}
.sj-reveal { fill: none; stroke: #fff; stroke-linejoin: round; }  /* mask only, never visible */
.sj-track { stroke: var(--sj-s-soft); stroke-width: 8; stroke-opacity: 0.45; }

/* Vapour trail: only the part the plane has flown over is revealed (SVG mask) */
.sj-reveal { stroke-linecap: butt; stroke-width: 34; stroke-dasharray: 100 100; stroke-dashoffset: 100; animation: sj-reveal 3.6s infinite; }
.sj-fog   { animation: sj-fogfade 3.6s infinite; }
.sj-halo  { stroke-width: 20; stroke-opacity: 0.2; }
.sj-puffA { stroke-width: 12; stroke-opacity: 0.5; stroke-dasharray: 0.01 4.2; }
.sj-puffB { stroke-width: 8;  stroke-opacity: 0.8; stroke-dasharray: 0.01 2.9; stroke-dashoffset: 1.4; }
.sj-core  { stroke-width: 4.5; stroke-opacity: 1; }

/* Three travellers at equal distances along the route */
.sj-stop {
  position: absolute; width: 14px; height: 14px; margin: -7px 0 0 -7px;
  border-radius: 50%; background: var(--sj-stop); box-shadow: 0 0 0 3px #fff;
  animation: sj-hop 3.6s infinite;
}
.sj-stop::after {
  content: ""; position: absolute; inset: -3px; border-radius: 50%;
  border: 2px solid var(--sj-s); opacity: 0; animation: sj-ping 3.6s infinite;
}
.sj-s1 { left: 118.5px; top: 44px; }
.sj-s2 { left: 80px;    top: 80px;  animation-delay: 1.332s; }
.sj-s3 { left: 41.5px;  top: 116px; animation-delay: 2.7s; }
.sj-s2::after { animation-delay: 1.332s; }
.sj-s3::after { animation-delay: 2.7s; }

/* The plane rides the same path as the S and banks along it */
.sj-plane {
  position: absolute; top: 0; left: 0; width: 38px; height: 38px;
  offset-path: path("M118.5 44 C122.8 20 58.8 20 53 52 C48 80 112 80 107 108 C101.2 140 37.2 140 41.5 116");
  offset-rotate: auto; opacity: 0; animation: sj-travel 3.6s infinite;
}
.sj-plane-shadow { fill: rgba(124, 45, 18, 0.4); }
.sj-plane-body { fill: #fff; stroke: var(--sj-stop); stroke-width: 0.9; stroke-linejoin: round; paint-order: stroke; }
@supports not (offset-path: path("M0 0")) { .sj-plane { display: none; } }

/* Rotating status lines (CSS only) */
.sj-msg { opacity: 0; animation: sj-msg 10.8s ease-in-out infinite; }
.sj-msg:nth-child(2) { animation-delay: 3.6s; }
.sj-msg:nth-child(3) { animation-delay: 7.2s; }

@keyframes sj-fade-in { to { opacity: 1; } }

/* Speed profile: sprint out -> glide to a near-stop at the middle stop ->
   brief hover -> released: strong acceleration all the way to the end. */
@keyframes sj-travel {
  0%  { offset-distance: 0%;   opacity: 0; transform: scale(0.5); animation-timing-function: ease-out; }
  3%  { offset-distance: 0%;   opacity: 1; transform: scale(1);   animation-timing-function: cubic-bezier(0.16, 1, 0.3, 1); }
  38% { offset-distance: 50%;  opacity: 1; transform: scale(1); }
  44% { offset-distance: 50%;  opacity: 1; transform: scale(1);   animation-timing-function: cubic-bezier(0.5, 0, 0.9, 0.35); }
  78% { offset-distance: 100%; opacity: 1; transform: scale(1); }
  82%, 100% { offset-distance: 100%; opacity: 0; transform: scale(0.7); }
}
/* Same timing, trailing ~3.5% behind so the vapour starts at the plane's tail */
@keyframes sj-reveal {
  0%, 3% { stroke-dashoffset: 100; animation-timing-function: cubic-bezier(0.16, 1, 0.3, 1); }
  38%    { stroke-dashoffset: 53.5; }
  44%    { stroke-dashoffset: 53.5; animation-timing-function: cubic-bezier(0.5, 0, 0.9, 0.35); }
  78%    { stroke-dashoffset: 3.5; }
  84%, 100% { stroke-dashoffset: 0; }
}
@keyframes sj-fogfade { 0%, 84% { opacity: 1; } 97%, 100% { opacity: 0; } }
@keyframes sj-hop  { 0%, 18%, 100% { transform: scale(1); } 4% { transform: scale(1.4); } }
@keyframes sj-ping {
  0%, 100% { transform: scale(1); opacity: 0; }
  3%       { transform: scale(1); opacity: 0.9; }
  20%      { transform: scale(2.6); opacity: 0; }
}
@keyframes sj-msg {
  0%        { opacity: 0; transform: translateY(6px); }
  4%, 30%   { opacity: 1; transform: translateY(0); }
  34%, 100% { opacity: 0; transform: translateY(-6px); }
}

@media (prefers-reduced-motion: reduce) {
  .sj-reveal { animation: none; stroke-dashoffset: 0; }
  .sj-fog { animation: none; }
  .sj-plane { animation: none; opacity: 1; offset-distance: 50%; }
  .sj-stop, .sj-stop::after { animation: none; }
  .sj-msg { animation: none; }
  .sj-msg:first-child { opacity: 1; }
}`;