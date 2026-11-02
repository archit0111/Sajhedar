import { useId } from "react";

// The S is the trip route (land); the plane flies it (air).
const S_PATH =
  "M118.5 44 C122.8 20 58.8 20 53 52 C48 80 112 80 107 108 C101.2 140 37.2 140 41.5 116";
const PLANE =
  "M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z";

// Colours: S route #fb923c, faint track #fdba74, dots #7c2d12, text black.
const ROUTE = "fill-none [stroke:#fb923c] [stroke-linecap:round] [stroke-linejoin:round]";

// Three travellers at equal distances along the route (position + staggered timing).
const STOPS = [
  { pos: "left-[118.5px] top-[44px]", hop: "animate-[sj-hop_3.6s_infinite]", ping: "animate-[sj-ping_3.6s_infinite]" },
  { pos: "left-[80px] top-[80px]", hop: "animate-[sj-hop_3.6s_1.332s_infinite]", ping: "animate-[sj-ping_3.6s_1.332s_infinite]" },
  { pos: "left-[41.5px] top-[116px]", hop: "animate-[sj-hop_3.6s_2.7s_infinite]", ping: "animate-[sj-ping_3.6s_2.7s_infinite]" },
];

// Rotating status lines.
const MESSAGES = [
  { text: "Packing the bags…", anim: "animate-[sj-msg_10.8s_ease-in-out_infinite] motion-reduce:opacity-100" },
  { text: "Calculating the adventure…", anim: "animate-[sj-msg_10.8s_ease-in-out_3.6s_infinite]" },
  { text: "Splitting it equally…", anim: "animate-[sj-msg_10.8s_ease-in-out_7.2s_infinite]" },
];

type Props = {
  /** Extra classes for the wrapper (spacing, width, etc.). */
  className?: string;
};

export default function SajhedarLoader({ className = "[--sj-scale:0.7]" }: Props) {
  const maskId = `sj-reveal-${useId().replace(/:/g, "")}`;

  return (
    <div
      role="status"
      aria-live="polite"
      className={`flex flex-col items-center justify-center opacity-0 animate-[sj-fade-in_250ms_ease-out_150ms_forwards] [contain:layout] motion-reduce:opacity-100 motion-reduce:animate-none ${className}`}
    >
      <style dangerouslySetInnerHTML={{ __html: KEYFRAMES }} />
      <span className="sr-only">Loading Sajhedar</span>

      <div aria-hidden="true" className="relative my-[26px] h-35 w-35 scale-[var(--sj-scale,1.18)]">
        <svg viewBox="0 0 160 160" className="absolute inset-0 h-40 w-40 overflow-visible">
          <defs>
            <mask id={maskId} maskUnits="userSpaceOnUse" x="0" y="0" width="160" height="160">
              <path
                d={S_PATH}
                pathLength={100}
                className="fill-none [stroke:#fff] [stroke-linejoin:round] [stroke-width:34] [stroke-dasharray:100_100] [stroke-dashoffset:100] animate-[sj-reveal_3.6s_infinite] motion-reduce:animate-none motion-reduce:[stroke-dashoffset:0]"
              />
            </mask>
          </defs>
          <path
            d={S_PATH}
            className="fill-none [stroke:#fdba74] [stroke-width:8] [stroke-opacity:.45] [stroke-linecap:round] [stroke-linejoin:round]"
          />
          {/* Vapour trail: only the part the plane has flown over is revealed (mask) */}
          <g mask={`url(#${maskId})`} className="animate-[sj-fogfade_3.6s_infinite] motion-reduce:animate-none">
            <path d={S_PATH} pathLength={100} className={`${ROUTE} [stroke-width:20] [stroke-opacity:.2]`} />
            <path d={S_PATH} pathLength={100} className={`${ROUTE} [stroke-width:12] [stroke-opacity:.5] [stroke-dasharray:0.01_4.2]`} />
            <path d={S_PATH} pathLength={100} className={`${ROUTE} [stroke-width:8] [stroke-opacity:.8] [stroke-dasharray:0.01_2.9] [stroke-dashoffset:1.4]`} />
            <path d={S_PATH} pathLength={100} className={`${ROUTE} [stroke-width:4.5] [stroke-opacity:1]`} />
          </g>
        </svg>

        {STOPS.map((s) => (
          <span
            key={s.pos}
            className={`absolute -ml-[7px] -mt-[7px] h-[14px] w-[14px] rounded-full bg-[#7c2d12] [box-shadow:0_0_0_3px_#fff] motion-reduce:animate-none ${s.pos} ${s.hop}`}
          >
            {/* ring that pulses out when the plane reaches the stop */}
            <span
              className={`absolute -inset-[3px] rounded-full border-2 border-[#fb923c] opacity-0 motion-reduce:animate-none ${s.ping}`}
            />
          </span>
        ))}

        {/* The plane rides the same path as the S and banks along it */}
        <span className="absolute left-0 top-0 h-[38px] w-[38px] opacity-0 [offset-path:path('M118.5_44_C122.8_20_58.8_20_53_52_C48_80_112_80_107_108_C101.2_140_37.2_140_41.5_116')] [offset-rotate:auto] animate-[sj-travel_3.6s_infinite] motion-reduce:animate-none motion-reduce:opacity-100 motion-reduce:[offset-distance:50%] [@supports(not_(offset-path:path('M0_0')))]:hidden">
          <svg viewBox="0 0 24 24" className="block h-[38px] w-[38px] rotate-90">
            <path d={PLANE} transform="translate(1.2 1.8)" className="fill-[rgba(124,45,18,0.4)]" />
            <path d={PLANE} className="fill-white [stroke:#7c2d12] [stroke-width:.9] [stroke-linejoin:round] [paint-order:stroke]" />
          </svg>
        </span>
      </div>

      <div
        aria-hidden="true"
        className="indent-[0.32em] text-[13px] font-bold uppercase leading-none tracking-[0.32em] text-black"
      >
        Sajhedar
      </div>

      <div aria-hidden="true" className="relative mt-1 h-[14px] w-[260px]">
        {MESSAGES.map((m) => (
          <span
            key={m.text}
            className={`absolute inset-0 text-center text-sm font-medium leading-[18px] text-black opacity-0 motion-reduce:animate-none ${m.anim}`}
          >
            {m.text}
          </span>
        ))}
      </div>
    </div>
  );
}

// The only plain CSS: keyframes (the Tailwind classes above reference them by name).
// Speed profile: sprint out -> glide to a near-stop at the middle stop -> brief hover
// -> released: strong acceleration all the way to the end.
const KEYFRAMES = `
@keyframes sj-fade-in { to { opacity: 1; } }
@keyframes sj-travel {
  0%  { offset-distance: 0%;   opacity: 0; transform: scale(0.5); animation-timing-function: ease-out; }
  3%  { offset-distance: 0%;   opacity: 1; transform: scale(1);   animation-timing-function: cubic-bezier(0.16, 1, 0.3, 1); }
  38% { offset-distance: 50%;  opacity: 1; transform: scale(1); }
  44% { offset-distance: 50%;  opacity: 1; transform: scale(1);   animation-timing-function: cubic-bezier(0.5, 0, 0.9, 0.35); }
  78% { offset-distance: 100%; opacity: 1; transform: scale(1); }
  82%, 100% { offset-distance: 100%; opacity: 0; transform: scale(0.7); }
}
@keyframes sj-reveal {
  0%, 3% { stroke-dashoffset: 100; animation-timing-function: cubic-bezier(0.16, 1, 0.3, 1); }
  38%    { stroke-dashoffset: 53.5; }
  44%    { stroke-dashoffset: 53.5; animation-timing-function: cubic-bezier(0.5, 0, 0.9, 0.35); }
  78%    { stroke-dashoffset: 3.5; }
  84%, 100% { stroke-dashoffset: 0; }
}
@keyframes sj-fogfade { 0%, 84% { opacity: 1; } 97%, 100% { opacity: 0; } }
@keyframes sj-hop { 0%, 18%, 100% { transform: scale(1); } 4% { transform: scale(1.4); } }
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
`;