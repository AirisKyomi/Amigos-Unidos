import React, { useState, useEffect } from 'react';
import { Sparkles } from 'lucide-react';

export const AnimatedRainbowCloud: React.FC<{
  autoPlayEntrance?: boolean;
}> = ({ autoPlayEntrance = true }) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [animationKey, setAnimationKey] = useState(0);

  // Progressive entrance initialization
  useEffect(() => {
    if (autoPlayEntrance) {
      setIsPlaying(true);
    }
  }, [autoPlayEntrance]);

  const handleReplay = () => {
    setIsPlaying(false);
    setTimeout(() => {
      setAnimationKey(prev => prev + 1);
      setIsPlaying(true);
    }, 60);
  };

  return (
    <>
      {/* 1. Full Screen Background Rainbow (En el fondo, cubre toda la pantalla y aparece progresivamente) */}
      <div 
        key={`rainbow-bg-${animationKey}`}
        className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none"
        aria-hidden="true"
      >
        {/* Full Viewport SVG Backdrop spanning from corner to corner */}
        <svg
          viewBox="0 0 1920 1080"
          preserveAspectRatio="none"
          className="w-full h-full absolute inset-0 opacity-0"
          style={{
            animation: isPlaying 
              ? 'progressiveRainbowFade 2.8s cubic-bezier(0.16, 1, 0.3, 1) forwards' 
              : 'none',
            opacity: isPlaying ? undefined : 0.65
          }}
        >
          <defs>
            {/* Luminous Pediatric Gradient Shaders */}
            <linearGradient id="fullRed" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ff4d6d" stopOpacity="0.45" />
              <stop offset="50%" stopColor="#ff5964" stopOpacity="0.65" />
              <stop offset="100%" stopColor="#e11d48" stopOpacity="0.3" />
            </linearGradient>
            <linearGradient id="fullOrange" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fb923c" stopOpacity="0.45" />
              <stop offset="50%" stopColor="#f97316" stopOpacity="0.65" />
              <stop offset="100%" stopColor="#ea580c" stopOpacity="0.3" />
            </linearGradient>
            <linearGradient id="fullYellow" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fde047" stopOpacity="0.5" />
              <stop offset="50%" stopColor="#facc15" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#ca8a04" stopOpacity="0.3" />
            </linearGradient>
            <linearGradient id="fullGreen" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#4ade80" stopOpacity="0.45" />
              <stop offset="50%" stopColor="#22c55e" stopOpacity="0.65" />
              <stop offset="100%" stopColor="#16a34a" stopOpacity="0.3" />
            </linearGradient>
            <linearGradient id="fullCyan" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.45" />
              <stop offset="50%" stopColor="#0ea5e9" stopOpacity="0.65" />
              <stop offset="100%" stopColor="#0284c7" stopOpacity="0.3" />
            </linearGradient>
            <linearGradient id="fullIndigo" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#818cf8" stopOpacity="0.45" />
              <stop offset="50%" stopColor="#6366f1" stopOpacity="0.65" />
              <stop offset="100%" stopColor="#4338ca" stopOpacity="0.3" />
            </linearGradient>
            <linearGradient id="fullViolet" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#c084fc" stopOpacity="0.45" />
              <stop offset="50%" stopColor="#a855f7" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#7e22ce" stopOpacity="0.25" />
            </linearGradient>

            {/* Ambient Radial Soft Glow */}
            <radialGradient id="sunGlow" cx="20%" cy="15%" r="60%">
              <stop offset="0%" stopColor="#fef08a" stopOpacity="0.35" />
              <stop offset="50%" stopColor="#fde047" stopOpacity="0.12" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Sun Glow in background */}
          <circle cx="360" cy="180" r="480" fill="url(#sunGlow)" />

          {/* 7 Majestic Concentric Arches Spanning the Whole Screen Width & Height */}
          <g className="rainbow-strokes">
            {/* Red Arch */}
            <path
              d="M -150 1150 C 350 -120, 1550 -120, 2070 1150"
              stroke="url(#fullRed)"
              strokeWidth="36"
              fill="none"
              strokeLinecap="round"
            />
            {/* Orange Arch */}
            <path
              d="M -120 1150 C 370 -70, 1530 -70, 2040 1150"
              stroke="url(#fullOrange)"
              strokeWidth="36"
              fill="none"
              strokeLinecap="round"
            />
            {/* Yellow Arch */}
            <path
              d="M -90 1150 C 390 -20, 1510 -20, 2010 1150"
              stroke="url(#fullYellow)"
              strokeWidth="36"
              fill="none"
              strokeLinecap="round"
            />
            {/* Green Arch */}
            <path
              d="M -60 1150 C 410 30, 1490 30, 1980 1150"
              stroke="url(#fullGreen)"
              strokeWidth="36"
              fill="none"
              strokeLinecap="round"
            />
            {/* Cyan Arch */}
            <path
              d="M -30 1150 C 430 80, 1470 80, 1950 1150"
              stroke="url(#fullCyan)"
              strokeWidth="36"
              fill="none"
              strokeLinecap="round"
            />
            {/* Indigo Arch */}
            <path
              d="M 0 1150 C 450 130, 1450 130, 1920 1150"
              stroke="url(#fullIndigo)"
              strokeWidth="36"
              fill="none"
              strokeLinecap="round"
            />
            {/* Violet Arch */}
            <path
              d="M 30 1150 C 470 180, 1430 180, 1890 1150"
              stroke="url(#fullViolet)"
              strokeWidth="36"
              fill="none"
              strokeLinecap="round"
            />
          </g>
        </svg>

        {/* Animated Cute Cloud drifting across the sky above the rainbow */}
        {isPlaying && (
          <div
            className="absolute top-10 sm:top-16 left-0 will-change-transform pointer-events-none"
            style={{
              animation: 'cloudDriftAcross 11s cubic-bezier(0.2, 0.8, 0.4, 1) forwards'
            }}
          >
            <div className="relative flex items-center">
              {/* Cloud Body SVG */}
              <svg width="150" height="95" viewBox="0 0 110 70" fill="none" className="drop-shadow-xl filter">
                {/* Cloud base & soft puffs */}
                <path
                  d="M 25 55 
                     C 12 55, 4 45, 10 32 
                     C 12 24, 20 18, 28 18 
                     C 34 8, 48 4, 60 12 
                     C 70 4, 86 6, 92 18 
                     C 102 20, 108 30, 104 42 
                     C 102 52, 92 56, 85 55 
                     Z"
                  fill="#FFFFFF"
                  stroke="#e2e8f0"
                  strokeWidth="2.5"
                />
                <ellipse cx="55" cy="52" rx="35" ry="5" fill="#cbd5e1" opacity="0.4" />
                
                {/* Smiling Face */}
                <circle cx="45" cy="32" r="3.2" fill="#1e293b" />
                <circle cx="68" cy="32" r="3.2" fill="#1e293b" />
                <path d="M 52 38 Q 56 44 61 38" stroke="#1e293b" strokeWidth="2.8" strokeLinecap="round" fill="none" />
                
                {/* Rosy Cheeks */}
                <circle cx="38" cy="36" r="4" fill="#f43f5e" opacity="0.5" />
                <circle cx="75" cy="36" r="4" fill="#f43f5e" opacity="0.5" />
              </svg>

              {/* Twinkles */}
              <div className="absolute -top-3 -right-2 text-amber-400 text-lg animate-pulse">
                ✨
              </div>
              <div className="absolute bottom-2 -left-3 text-yellow-400 text-sm animate-bounce">
                ⭐
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 2. Interactive Replay Badge in Hero */}
      <div className="relative z-10 flex items-center justify-center py-1.5 pointer-events-auto">
        <button
          type="button"
          onClick={handleReplay}
          className="group inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/90 dark:bg-slate-900/90 hover:bg-white border border-amber-300 dark:border-amber-600 shadow-2xs hover:shadow-sm transition-all cursor-pointer backdrop-blur-xs"
          title="Haz clic para volver a ver el arcoíris en pantalla completa aparecer progresivamente"
        >
          <span className="text-base group-hover:scale-125 transition-transform inline-block">🌈</span>
          <span className="text-xs font-black text-amber-950 dark:text-amber-100 font-rounded">
            ¡Bienvenido a Amigos Unidos!
          </span>
          <span className="text-sm animate-bounce">☁️</span>
          <span className="text-[10px] font-bold text-amber-900 dark:text-amber-200 bg-amber-100 dark:bg-amber-950/80 px-2.5 py-0.5 rounded-full group-hover:bg-amber-200 transition-colors">
            {isPlaying ? 'Arcoíris en el fondo' : 'Ver de nuevo'}
          </span>
        </button>
      </div>

      <style>{`
        @keyframes progressiveRainbowFade {
          0% {
            opacity: 0;
            transform: scale(0.96) translateY(20px);
            filter: blur(12px);
          }
          40% {
            opacity: 0.55;
            filter: blur(4px);
          }
          100% {
            opacity: 0.65;
            transform: scale(1) translateY(0);
            filter: blur(0px);
          }
        }

        @keyframes cloudDriftAcross {
          0% {
            transform: translateX(-15vw) translateY(20px) scale(0.85);
            opacity: 0;
          }
          15% {
            opacity: 1;
            transform: translateX(10vw) translateY(5px) scale(1);
          }
          60% {
            opacity: 1;
            transform: translateX(65vw) translateY(-10px) scale(1.05);
          }
          85% {
            opacity: 0.9;
          }
          100% {
            transform: translateX(115vw) translateY(-20px) scale(1.1);
            opacity: 0;
          }
        }
      `}</style>
    </>
  );
};
