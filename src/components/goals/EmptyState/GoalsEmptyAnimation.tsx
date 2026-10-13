"use client";

import React from "react";

/**
 * Premium vector animation for the Goals empty-state.
 * Replaces the static GIF with an elegant, responsive SVG composition
 * featuring a circular savings progress ring, central goal bullseye,
 * floating currency coins, progress badge, and subtle ambient sparkles.
 * 
 * Runs entirely on GPU-accelerated CSS keyframes without heavy external libraries.
 * Fully supports dark mode, responsive scaling, and prefers-reduced-motion.
 */
export default function GoalsEmptyAnimation() {
  return (
    <div
      className="relative flex items-center justify-center w-full max-w-[260px] sm:max-w-[300px] aspect-[5/4] mx-auto select-none"
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 320 256"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full overflow-visible drop-shadow-[0_12px_28px_rgba(5,150,105,0.18)] dark:drop-shadow-[0_16px_36px_rgba(4,120,87,0.3)]"
      >
        <defs>
          {/* Ambient background glow */}
          <radialGradient
            id="sm-bg-glow"
            cx="50%"
            cy="50%"
            r="50%"
            fx="50%"
            fy="50%"
          >
            <stop offset="0%" stopColor="#10b981" stopOpacity="0.22" />
            <stop offset="55%" stopColor="#059669" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#059669" stopOpacity="0" />
          </radialGradient>

          {/* Central target sphere gradient */}
          <radialGradient
            id="sm-target-disc"
            cx="35%"
            cy="30%"
            r="65%"
          >
            <stop offset="0%" stopColor="#065f46" />
            <stop offset="65%" stopColor="#064e3b" />
            <stop offset="100%" stopColor="#022c22" />
          </radialGradient>

          {/* Progress ring gradient */}
          <linearGradient
            id="sm-ring-grad"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor="#059669" />
            <stop offset="45%" stopColor="#10b981" />
            <stop offset="85%" stopColor="#34d399" />
            <stop offset="100%" stopColor="#6ee7b7" />
          </linearGradient>

          {/* Coin 1 gradient */}
          <linearGradient
            id="sm-coin-grad-1"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor="#34d399" />
            <stop offset="40%" stopColor="#10b981" />
            <stop offset="100%" stopColor="#047857" />
          </linearGradient>

          {/* Coin 2 gradient */}
          <linearGradient
            id="sm-coin-grad-2"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor="#6ee7b7" />
            <stop offset="50%" stopColor="#10b981" />
            <stop offset="100%" stopColor="#065f46" />
          </linearGradient>

          {/* Upward trend dash line gradient */}
          <linearGradient
            id="sm-trend-grad"
            x1="0%"
            y1="100%"
            x2="100%"
            y2="0%"
          >
            <stop offset="0%" stopColor="#10b981" stopOpacity="0" />
            <stop offset="50%" stopColor="#34d399" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#6ee7b7" stopOpacity="0.8" />
          </linearGradient>

          {/* Subtle drop shadows for depth */}
          <filter id="sm-disc-shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="6" stdDeviation="8" floodColor="#064e3b" floodOpacity="0.4" />
          </filter>

          <filter id="sm-coin-shadow" x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="0" dy="4" stdDeviation="5" floodColor="#047857" floodOpacity="0.35" />
          </filter>

          <filter id="sm-badge-shadow" x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="0" dy="3" stdDeviation="4" floodColor="#022c22" floodOpacity="0.3" />
          </filter>

          <style>{`
            @keyframes smPulseRing {
              0%, 100% {
                stroke-dashoffset: 215;
              }
              50% {
                stroke-dashoffset: 85;
              }
            }

            @keyframes smTargetPulse {
              0%, 100% {
                transform: scale(1);
                transform-origin: 160px 128px;
              }
              50% {
                transform: scale(1.05);
                transform-origin: 160px 128px;
              }
            }

            @keyframes smCoinFloat1 {
              0%, 100% {
                transform: translate(0px, 0px) rotate(-4deg);
                transform-origin: 82px 146px;
              }
              50% {
                transform: translate(2px, -11px) rotate(3deg);
                transform-origin: 82px 146px;
              }
            }

            @keyframes smCoinFloat2 {
              0%, 100% {
                transform: translate(0px, 0px) rotate(4deg);
                transform-origin: 236px 98px;
              }
              50% {
                transform: translate(-3px, -13px) rotate(-4deg);
                transform-origin: 236px 98px;
              }
            }

            @keyframes smCoinFloat3 {
              0%, 100% {
                transform: translate(0px, 0px) rotate(-2deg);
                transform-origin: 228px 182px;
              }
              50% {
                transform: translate(2px, -8px) rotate(4deg);
                transform-origin: 228px 182px;
              }
            }

            @keyframes smBadgeFloat {
              0%, 100% {
                transform: translate(0px, 0px) scale(1);
                transform-origin: 206px 74px;
              }
              50% {
                transform: translate(1px, -7px) scale(1.04);
                transform-origin: 206px 74px;
              }
            }

            @keyframes smSparkle1 {
              0%, 100% {
                transform: scale(0.65) rotate(0deg);
                transform-origin: 76px 60px;
                opacity: 0.3;
              }
              50% {
                transform: scale(1.15) rotate(18deg);
                transform-origin: 76px 60px;
                opacity: 1;
              }
            }

            @keyframes smSparkle2 {
              0%, 100% {
                transform: scale(0.6) rotate(0deg);
                transform-origin: 252px 142px;
                opacity: 0.35;
              }
              50% {
                transform: scale(1.12) rotate(-16deg);
                transform-origin: 252px 142px;
                opacity: 0.95;
              }
            }

            @keyframes smSparkle3 {
              0%, 100% {
                transform: scale(0.5) rotate(0deg);
                transform-origin: 222px 38px;
                opacity: 0.25;
              }
              50% {
                transform: scale(1.18) rotate(22deg);
                transform-origin: 222px 38px;
                opacity: 1;
              }
            }

            @keyframes smParticleRise1 {
              0% {
                transform: translateY(0);
                opacity: 0;
              }
              25% {
                opacity: 0.75;
              }
              75% {
                opacity: 0.75;
              }
              100% {
                transform: translateY(-22px);
                opacity: 0;
              }
            }

            @keyframes smParticleRise2 {
              0% {
                transform: translateY(0);
                opacity: 0;
              }
              25% {
                opacity: 0.8;
              }
              75% {
                opacity: 0.8;
              }
              100% {
                transform: translateY(-20px);
                opacity: 0;
              }
            }

            @keyframes smAuraPulse {
              0%, 100% {
                transform: scale(0.96);
                transform-origin: 160px 128px;
                opacity: 0.65;
              }
              50% {
                transform: scale(1.05);
                transform-origin: 160px 128px;
                opacity: 1;
              }
            }

            .sm-anim-ring {
              animation: smPulseRing 5.4s cubic-bezier(0.4, 0, 0.2, 1) infinite;
            }

            .sm-anim-target {
              animation: smTargetPulse 5.4s ease-in-out infinite;
            }

            .sm-anim-coin-1 {
              animation: smCoinFloat1 4.8s ease-in-out infinite;
            }

            .sm-anim-coin-2 {
              animation: smCoinFloat2 5.2s ease-in-out 0.6s infinite;
            }

            .sm-anim-coin-3 {
              animation: smCoinFloat3 4.5s ease-in-out 1.2s infinite;
            }

            .sm-anim-badge {
              animation: smBadgeFloat 5s ease-in-out 0.3s infinite;
            }

            .sm-anim-sparkle-1 {
              animation: smSparkle1 3.8s ease-in-out infinite;
            }

            .sm-anim-sparkle-2 {
              animation: smSparkle2 4.2s ease-in-out 1.1s infinite;
            }

            .sm-anim-sparkle-3 {
              animation: smSparkle3 3.6s ease-in-out 0.7s infinite;
            }

            .sm-anim-particle-1 {
              animation: smParticleRise1 4.6s ease-out infinite;
            }

            .sm-anim-particle-2 {
              animation: smParticleRise2 4.4s ease-out 2.2s infinite;
            }

            .sm-anim-aura {
              animation: smAuraPulse 5.4s ease-in-out infinite;
            }

            /* Reduced motion static fallback */
            @media (prefers-reduced-motion: reduce) {
              .sm-anim-ring,
              .sm-anim-target,
              .sm-anim-coin-1,
              .sm-anim-coin-2,
              .sm-anim-coin-3,
              .sm-anim-badge,
              .sm-anim-sparkle-1,
              .sm-anim-sparkle-2,
              .sm-anim-sparkle-3,
              .sm-anim-particle-1,
              .sm-anim-particle-2,
              .sm-anim-aura {
                animation: none !important;
              }
              .sm-anim-ring {
                stroke-dashoffset: 110 !important;
              }
              .sm-anim-sparkle-1,
              .sm-anim-sparkle-2,
              .sm-anim-sparkle-3 {
                opacity: 0.75 !important;
                transform: scale(1) !important;
              }
            }
          `}</style>
        </defs>

        {/* 1. Ambient Background Glow Aura */}
        <circle
          cx="160"
          cy="128"
          r="105"
          fill="url(#sm-bg-glow)"
          className="sm-anim-aura"
        />

        {/* 2. Upward Trajectory / Growth Guideline (dotted curve) */}
        <path
          d="M 68 184 C 95 190, 115 160, 138 152 C 165 142, 195 125, 240 82"
          stroke="url(#sm-trend-grad)"
          strokeWidth="2"
          strokeDasharray="4 6"
          strokeLinecap="round"
          opacity="0.6"
        />

        {/* 3. Outer Subtle Halo Ring */}
        <circle
          cx="160"
          cy="128"
          r="76"
          stroke="#10b981"
          strokeWidth="1.25"
          strokeOpacity="0.18"
          strokeDasharray="3 7"
        />

        {/* 4. Background Progress Ring Track */}
        <circle
          cx="160"
          cy="128"
          r="56"
          stroke="#10b981"
          strokeWidth="7"
          strokeOpacity="0.12"
          fill="none"
        />

        {/* 5. Active Animated Savings Progress Ring Arc */}
        <circle
          cx="160"
          cy="128"
          r="56"
          stroke="url(#sm-ring-grad)"
          strokeWidth="7"
          strokeLinecap="round"
          strokeDasharray="352"
          strokeDashoffset="180"
          fill="none"
          transform="rotate(-90 160 128)"
          className="sm-anim-ring"
        />

        {/* 6. Central Financial Target Core Disc */}
        <g className="sm-anim-target">
          {/* Outer target casing */}
          <circle
            cx="160"
            cy="128"
            r="40"
            fill="url(#sm-target-disc)"
            stroke="#34d399"
            strokeWidth="1.75"
            strokeOpacity="0.35"
            filter="url(#sm-disc-shadow)"
          />

          {/* Target Inner Bullseye Concentric Ring */}
          <circle
            cx="160"
            cy="128"
            r="26"
            stroke="#10b981"
            strokeWidth="1.5"
            strokeOpacity="0.4"
            strokeDasharray="3 3"
            fill="none"
          />

          {/* Middle Ring */}
          <circle
            cx="160"
            cy="128"
            r="16"
            stroke="#34d399"
            strokeWidth="1.5"
            strokeOpacity="0.75"
            fill="rgba(16, 185, 129, 0.12)"
          />

          {/* Central Target Bullseye with Flag / Star */}
          {/* Center Goal Flag / Pin Vector */}
          <g transform="translate(150, 117)">
            {/* Flagpole */}
            <line
              x1="3"
              y1="2"
              x2="3"
              y2="20"
              stroke="#6ee7b7"
              strokeWidth="2"
              strokeLinecap="round"
            />
            {/* Flag banner with savings chevron */}
            <path
              d="M 4 3 L 17 7.5 L 4 12 Z"
              fill="#10b981"
              stroke="#6ee7b7"
              strokeWidth="1.2"
              strokeLinejoin="round"
            />
            {/* Stand base */}
            <circle cx="3" cy="20" r="2" fill="#a7f3d0" />
            {/* Golden apex dot */}
            <circle cx="3" cy="2" r="1.5" fill="#fef08a" />
          </g>
        </g>

        {/* 7. Milestone Progress Checkmark Pill Badge */}
        <g className="sm-anim-badge">
          {/* Badge Capsule Pill */}
          <rect
            x="192"
            y="61"
            width="28"
            height="26"
            rx="13"
            fill="#064e3b"
            stroke="#34d399"
            strokeWidth="1.5"
            filter="url(#sm-badge-shadow)"
          />
          {/* Checkmark Icon inside pill */}
          <path
            d="M 200 74 L 204.5 78.5 L 212 70"
            stroke="#6ee7b7"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>

        {/* 8. Floating Coin 1 (Left Primary Coin) */}
        <g className="sm-anim-coin-1">
          {/* Coin outer body */}
          <circle
            cx="82"
            cy="146"
            r="17"
            fill="url(#sm-coin-grad-1)"
            stroke="#6ee7b7"
            strokeWidth="1.5"
            filter="url(#sm-coin-shadow)"
          />
          {/* Coin inner milled rim */}
          <circle
            cx="82"
            cy="146"
            r="12.5"
            stroke="#a7f3d0"
            strokeWidth="1"
            strokeOpacity="0.75"
            strokeDasharray="2.5 2"
            fill="none"
          />
          {/* Crisp INR (₹) Currency Emblem */}
          <text
            x="82"
            y="151.5"
            textAnchor="middle"
            fill="#ffffff"
            fontSize="12.5"
            fontWeight="700"
            fontFamily="system-ui, -apple-system, sans-serif"
            className="select-none"
          >
            ₹
          </text>
        </g>

        {/* 9. Floating Coin 2 (Top-Right Secondary Coin) */}
        <g className="sm-anim-coin-2">
          {/* Coin outer body */}
          <circle
            cx="236"
            cy="98"
            r="14"
            fill="url(#sm-coin-grad-2)"
            stroke="#a7f3d0"
            strokeWidth="1.25"
            filter="url(#sm-coin-shadow)"
          />
          {/* Coin inner rim */}
          <circle
            cx="236"
            cy="98"
            r="10"
            stroke="#6ee7b7"
            strokeWidth="0.85"
            strokeOpacity="0.7"
            fill="none"
          />
          {/* Currency Symbol */}
          <text
            x="236"
            y="102.5"
            textAnchor="middle"
            fill="#ffffff"
            fontSize="10"
            fontWeight="700"
            fontFamily="system-ui, -apple-system, sans-serif"
            className="select-none"
          >
            ₹
          </text>
        </g>

        {/* 10. Floating Coin 3 (Bottom-Right Accent Coin) */}
        <g className="sm-anim-coin-3">
          <circle
            cx="228"
            cy="182"
            r="11"
            fill="url(#sm-coin-grad-1)"
            stroke="#34d399"
            strokeWidth="1.2"
            filter="url(#sm-coin-shadow)"
          />
          <circle
            cx="228"
            cy="182"
            r="7.5"
            stroke="#a7f3d0"
            strokeWidth="0.75"
            strokeOpacity="0.6"
            fill="none"
          />
          <text
            x="228"
            y="185.5"
            textAnchor="middle"
            fill="#ffffff"
            fontSize="8.5"
            fontWeight="700"
            fontFamily="system-ui, -apple-system, sans-serif"
            className="select-none"
          >
            ₹
          </text>
        </g>

        {/* 11. Upward Floating Micro Savings Particles */}
        <g className="sm-anim-particle-1">
          <circle cx="106" cy="116" r="2.2" fill="#6ee7b7" />
        </g>
        <g className="sm-anim-particle-2">
          <circle cx="218" cy="144" r="2" fill="#34d399" />
        </g>

        {/* 12. Decorative 4-Point Geometric SaaS Sparkles */}
        {/* Sparkle 1 (Top-Left) */}
        <g className="sm-anim-sparkle-1">
          <path
            d="M 76 52 Q 76 60 84 60 Q 76 60 76 68 Q 76 60 68 60 Q 76 60 76 52 Z"
            fill="#6ee7b7"
          />
        </g>

        {/* Sparkle 2 (Right Mid) */}
        <g className="sm-anim-sparkle-2">
          <path
            d="M 252 135 Q 252 142 259 142 Q 252 142 252 149 Q 252 142 245 142 Q 252 142 252 135 Z"
            fill="#34d399"
          />
        </g>

        {/* Sparkle 3 (Top-Right Micro Sparkle) */}
        <g className="sm-anim-sparkle-3">
          <path
            d="M 222 32 Q 222 38 228 38 Q 222 38 222 44 Q 222 38 216 38 Q 222 38 222 32 Z"
            fill="#a7f3d0"
          />
        </g>
      </svg>
    </div>
  );
}
