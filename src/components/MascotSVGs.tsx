import React from 'react';

interface MascotProps {
  className?: string;
  size?: number | string;
  mood?: 'happy' | 'thinking' | 'speaking' | 'waving';
  expression?: string;
}

const parseMascotSize = (size?: number | string): number => {
  if (typeof size === 'number') return size;
  if (typeof size === 'string') {
    if (size === 'xs') return 20;
    if (size === 'sm') return 28;
    if (size === 'md') return 40;
    if (size === 'lg') return 56;
    if (size === 'xl') return 72;
    const parsed = parseInt(size, 10);
    if (!isNaN(parsed) && parsed > 0) return parsed;
  }
  return 40;
};

export const FroggiAvatar: React.FC<MascotProps> = ({ className = '', size = 40 }) => {
  const pixelSize = parseMascotSize(size);
  return (
    <svg
      width={pixelSize}
      height={pixelSize}
      style={{ width: `${pixelSize}px`, height: `${pixelSize}px`, maxWidth: `${pixelSize}px`, maxHeight: `${pixelSize}px` }}
      viewBox="0 0 120 120"
      className={`inline-block select-none shrink-0 ${className}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Glow / Shadow */}
      <ellipse cx="60" cy="105" rx="38" ry="8" fill="#000" fillOpacity="0.08" />
      {/* Frog Body & Head (Kawaii Star/Froggy shape) */}
      <path
        d="M20 70 C 15 50, 30 25, 45 35 C 52 28, 68 28, 75 35 C 90 25, 105 50, 100 70 C 105 85, 95 102, 60 102 C 25 102, 15 85, 20 70 Z"
        fill="#5dd879"
        stroke="#38a169"
        strokeWidth="3"
      />
      {/* Frog Tummy Belly */}
      <ellipse cx="60" cy="78" rx="26" ry="18" fill="#d9f99d" stroke="#a3e635" strokeWidth="2" />
      {/* Large Kawaii Eyes */}
      <ellipse cx="40" cy="52" rx="10" ry="14" fill="#1e293b" />
      <ellipse cx="80" cy="52" rx="10" ry="14" fill="#1e293b" />
      {/* Eye Highlights */}
      <circle cx="37" cy="46" r="4.5" fill="#ffffff" />
      <circle cx="43" cy="55" r="2" fill="#ffffff" />
      <circle cx="77" cy="46" r="4.5" fill="#ffffff" />
      <circle cx="83" cy="55" r="2" fill="#ffffff" />
      {/* Rosy Cheeks */}
      <ellipse cx="26" cy="66" rx="7" ry="4" fill="#86efac" fillOpacity="0.9" />
      <ellipse cx="94" cy="66" rx="7" ry="4" fill="#86efac" fillOpacity="0.9" />
      {/* Cute Open Mouth Smile */}
      <path
        d="M 52 64 Q 60 74 68 64 Z"
        fill="#1e293b"
      />
      <path
        d="M 55 69 Q 60 73 65 69"
        fill="#f87171"
      />
      {/* Cute Eyebrows */}
      <path d="M 36 34 Q 40 31 44 34" stroke="#1e293b" strokeWidth="2" strokeLinecap="round" />
      <path d="M 76 34 Q 80 31 84 34" stroke="#1e293b" strokeWidth="2" strokeLinecap="round" />
      {/* Tiny hands */}
      <circle cx="15" cy="65" r="7" fill="#5dd879" stroke="#38a169" strokeWidth="2" />
      <circle cx="105" cy="65" r="7" fill="#5dd879" stroke="#38a169" strokeWidth="2" />
    </svg>
  );
};

export const PanditaAvatar: React.FC<MascotProps> = ({ className = '', size = 64 }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      className={`inline-block select-none ${className}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <ellipse cx="60" cy="105" rx="36" ry="7" fill="#000" fillOpacity="0.08" />
      {/* Panda Ears */}
      <circle cx="34" cy="32" r="14" fill="#1e293b" />
      <circle cx="86" cy="32" r="14" fill="#1e293b" />
      {/* Pink Dress */}
      <path d="M 40 80 L 80 80 L 92 104 L 28 104 Z" fill="#f472b6" stroke="#db2777" strokeWidth="2.5" />
      {/* Little legs */}
      <rect x="42" y="100" width="12" height="14" rx="6" fill="#1e293b" />
      <rect x="66" y="100" width="12" height="14" rx="6" fill="#1e293b" />
      {/* Panda Head */}
      <ellipse cx="60" cy="56" rx="38" ry="32" fill="#ffffff" stroke="#1e293b" strokeWidth="3" />
      {/* Cute Black Eye Patches */}
      <ellipse cx="44" cy="56" rx="13" ry="15" fill="#1e293b" transform="rotate(-12 44 56)" />
      <ellipse cx="76" cy="56" rx="13" ry="15" fill="#1e293b" transform="rotate(12 76 56)" />
      {/* Big Kawaii Eyes */}
      <ellipse cx="43" cy="55" rx="8" ry="10" fill="#ffffff" />
      <ellipse cx="77" cy="55" rx="8" ry="10" fill="#ffffff" />
      <ellipse cx="44" cy="56" rx="6" ry="8" fill="#1e293b" />
      <ellipse cx="76" cy="56" rx="6" ry="8" fill="#1e293b" />
      {/* Sparkles in eyes */}
      <circle cx="42" cy="52" r="3" fill="#ffffff" />
      <circle cx="74" cy="52" r="3" fill="#ffffff" />
      {/* Cute nose and mouth */}
      <ellipse cx="60" cy="66" rx="3.5" ry="2.5" fill="#1e293b" />
      <path d="M 56 71 Q 60 76 64 71" stroke="#f43f5e" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      {/* Eyebrows */}
      <path d="M 40 38 Q 44 35 48 38" stroke="#1e293b" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M 72 38 Q 76 35 80 38" stroke="#1e293b" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
};

export const MonitoAvatar: React.FC<MascotProps> = ({ className = '', size = 64 }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      className={`inline-block select-none ${className}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <ellipse cx="60" cy="105" rx="36" ry="7" fill="#000" fillOpacity="0.08" />
      {/* Big Monkey Ears */}
      <circle cx="22" cy="55" r="18" fill="#d97706" stroke="#b45309" strokeWidth="2.5" />
      <circle cx="22" cy="55" r="11" fill="#fde68a" />
      <circle cx="98" cy="55" r="18" fill="#d97706" stroke="#b45309" strokeWidth="2.5" />
      <circle cx="98" cy="55" r="11" fill="#fde68a" />
      {/* Blue Shirt Body */}
      <ellipse cx="60" cy="92" rx="26" ry="18" fill="#60a5fa" stroke="#3b82f6" strokeWidth="2.5" />
      {/* Monkey Head */}
      <ellipse cx="60" cy="56" rx="34" ry="30" fill="#d97706" stroke="#b45309" strokeWidth="2.5" />
      {/* Monkey Face Area */}
      <path
        d="M 38 48 C 38 38, 52 38, 60 48 C 68 38, 82 38, 82 48 C 86 64, 80 76, 60 76 C 40 76, 34 64, 38 48 Z"
        fill="#fef3c7"
      />
      {/* Cute tuft of hair */}
      <path d="M 60 26 Q 55 18 64 22 Q 60 25 60 28" fill="#d97706" stroke="#b45309" strokeWidth="2" />
      {/* Big Expressive Eyes */}
      <ellipse cx="48" cy="54" rx="8" ry="11" fill="#1e293b" />
      <ellipse cx="72" cy="54" rx="8" ry="11" fill="#1e293b" />
      {/* Eye glints */}
      <circle cx="46" cy="49" r="3.5" fill="#ffffff" />
      <circle cx="70" cy="49" r="3.5" fill="#ffffff" />
      {/* Nose and Happy Open Smile */}
      <ellipse cx="60" cy="64" rx="2.5" ry="2" fill="#78350f" />
      <path d="M 54 68 Q 60 77 66 68 Z" fill="#b91c1c" />
    </svg>
  );
};

export const CaracolitoAvatar: React.FC<MascotProps> = ({ className = '', size = 64 }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      className={`inline-block select-none ${className}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <ellipse cx="60" cy="105" rx="44" ry="7" fill="#000" fillOpacity="0.08" />
      {/* Big Golden Spiral Shell */}
      <circle cx="82" cy="62" r="28" fill="#f59e0b" stroke="#d97706" strokeWidth="3" />
      <circle cx="82" cy="62" r="19" fill="#fbbf24" stroke="#d97706" strokeWidth="2.5" />
      <circle cx="82" cy="62" r="10" fill="#fde68a" stroke="#d97706" strokeWidth="2" />
      {/* Snail Body (Yellow/Peach slug shape) */}
      <path
        d="M 18 95 C 18 85, 30 82, 42 75 C 44 60, 48 45, 52 40 C 56 36, 64 36, 68 40 C 72 45, 74 60, 78 75 C 95 80, 110 88, 110 96 C 110 102, 20 102, 18 95 Z"
        fill="#fef08a"
        stroke="#eab308"
        strokeWidth="3"
      />
      {/* Eyestalks & Big Kawaii Eyes */}
      <circle cx="48" cy="32" r="8" fill="#ffffff" stroke="#eab308" strokeWidth="2" />
      <ellipse cx="49" cy="32" rx="5" ry="6" fill="#1e293b" />
      <circle cx="47" cy="30" r="2" fill="#ffffff" />

      <circle cx="72" cy="32" r="8" fill="#ffffff" stroke="#eab308" strokeWidth="2" />
      <ellipse cx="71" cy="32" rx="5" ry="6" fill="#1e293b" />
      <circle cx="69" cy="30" r="2" fill="#ffffff" />

      {/* Cheeks and Smile */}
      <circle cx="44" cy="52" r="4" fill="#fca5a5" />
      <circle cx="76" cy="52" r="4" fill="#fca5a5" />
      <path d="M 55 52 Q 60 58 65 52 Z" fill="#1e293b" />
    </svg>
  );
};

export const RainbowBanner: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-b from-sky-200 via-sky-100 to-amber-50 p-4 border border-sky-300 shadow-sm ${className}`}>
      {/* Rainbow Arches */}
      <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-[600px] h-[300px] pointer-events-none opacity-40">
        <svg viewBox="0 0 500 250" className="w-full h-full">
          <ellipse cx="250" cy="250" rx="230" ry="180" fill="none" stroke="#f87171" strokeWidth="14" />
          <ellipse cx="250" cy="250" rx="216" ry="168" fill="none" stroke="#fb923c" strokeWidth="14" />
          <ellipse cx="250" cy="250" rx="202" ry="156" fill="none" stroke="#facc15" strokeWidth="14" />
          <ellipse cx="250" cy="250" rx="188" ry="144" fill="none" stroke="#4ade80" strokeWidth="14" />
          <ellipse cx="250" cy="250" rx="174" ry="132" fill="none" stroke="#60a5fa" strokeWidth="14" />
          <ellipse cx="250" cy="250" rx="160" ry="120" fill="none" stroke="#c084fc" strokeWidth="14" />
        </svg>
      </div>

      {/* Cloud shapes */}
      <div className="absolute top-2 left-4 w-16 h-8 bg-white/70 rounded-full blur-[1px]" />
      <div className="absolute top-4 right-8 w-20 h-10 bg-white/70 rounded-full blur-[1px]" />

      <div className="relative z-10 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex -space-x-4">
            <div className="bg-white/80 rounded-full p-1 shadow-sm border border-emerald-200 hover:scale-105 transition-transform">
              <FroggiAvatar size={48} />
            </div>
            <div className="bg-white/80 rounded-full p-1 shadow-sm border border-pink-200 hover:scale-105 transition-transform">
              <PanditaAvatar size={48} />
            </div>
            <div className="bg-white/80 rounded-full p-1 shadow-sm border border-blue-200 hover:scale-105 transition-transform">
              <MonitoAvatar size={48} />
            </div>
            <div className="bg-white/80 rounded-full p-1 shadow-sm border border-amber-200 hover:scale-105 transition-transform">
              <CaracolitoAvatar size={48} />
            </div>
          </div>
          <div>
            <span className="text-xs font-bold tracking-wide uppercase px-2.5 py-0.5 rounded-full bg-emerald-600 text-white shadow-xs">
              Mascotas Oficiales
            </span>
            <h3 className="font-extrabold text-slate-800 text-base sm:text-lg flex items-center gap-1.5 mt-0.5">
              Amigos Unidos <span className="text-emerald-600">con Froggi 🐸</span>
            </h3>
            <p className="text-xs text-slate-600">
              Acompañamiento pediátrico amoroso de 0 a 10+ años con evidencia OMS, AAP y UNICEF.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl bg-white/90 text-emerald-800 border border-emerald-300 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            IA Médica Activa
          </span>
        </div>
      </div>
    </div>
  );
};
