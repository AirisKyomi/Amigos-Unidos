/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Humanized Natural Speech Synthesis & Suno-Style Melodic Singing Engine
 */

export interface SpeechOptions {
  rate?: number; // 0.8 to 1.5
  pitch?: number; // 0.8 to 1.3
  lang?: string;
  voiceURI?: string;
  mascot?: 'froggi' | 'monito' | 'pandita' | 'caracolito';
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (err: any) => void;
  onBoundary?: (charIndex: number, text: string) => void;
}

export interface SongSingingOptions {
  singerMascot?: 'froggi' | 'pandita' | 'monito' | 'caracolito';
  tempoBpm?: number;
  style?: string;
  volume?: number;
  includeLalalaIntro?: boolean;
  onSectionChange?: (section: 'verse1' | 'chorus' | 'verse2' | 'outro', lineIndex: number, lineText: string) => void;
  onNotePlay?: (note: { pitch: string; freq: number }) => void;
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (err: any) => void;
}

export interface SongDataToSing {
  title: string;
  style?: string;
  tempoBpm?: number;
  lyrics: {
    verse1?: string;
    chorus?: string;
    verse2?: string;
    outro?: string;
  };
  notes?: Array<{ pitch: string; freq: number; duration: number }>;
}

let isSpeakingActive = false;
let isSingingActive = false;
let globalSelectedVoiceURI: string | null = null;
let activeAudioContext: AudioContext | null = null;
let activeAudioOscillators: OscillatorNode[] = [];
let activeUtterance: SpeechSynthesisUtterance | null = null;

/**
 * Humanizes text for expressive, warm, and natural pediatric narration.
 * Converts technical symbols, expands abbreviations, removes markdown asterisks,
 * and sets up gentle conversational phrasing for children and parents.
 */
export function cleanTextForSpeech(text: string): string {
  if (!text) return '';
  let cleaned = text;

  // 1. Remove markdown formatting, bold/italics, asterisks and emojis
  cleaned = cleaned
    .replace(/\*{1,3}([^*]+)\*{1,3}/g, '$1')
    .replace(/\*/g, '')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/`{1,3}[^`]*`{1,3}/g, '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/[🐸🧸🐵🐌👶❤️🌟⚡⚠️🩺🍼🤰✨🩹🔬🛡️💊🎶🎵🎲🎨🧠💡]/gu, '');

  // 2. Humanize clinical abbreviations and units into conversational phonetic phrasing
  cleaned = cleaned
    .replace(/\bAAP\b/g, 'Academia Americana de Pediatría')
    .replace(/\bOMS\b/g, 'Organización Mundial de la Salud')
    .replace(/\bWHO\b/g, 'Organización Mundial de la Salud')
    .replace(/\bUNICEF\b/g, 'Unicef')
    .replace(/\bACOG\b/g, 'Colegio de Obstetras')
    .replace(/\bBLW\b/g, 'alimentación autorregulada')
    .replace(/\bSMSL\b/g, 'síndrome de muerte súbita del lactante')
    .replace(/\bSEPEAP\b/g, 'Sociedad de Pediatría')
    .replace(/\bAEP\b/g, 'Asociación Española de Pediatría')
    .replace(/\bmg\/kg\b/g, 'miligramos por kilo')
    .replace(/\bml\b/g, 'mililitros')
    .replace(/\bmg\b/g, 'miligramos')
    .replace(/\bkg\b/g, 'kilos')
    .replace(/\bcm\b/g, 'centímetros')
    .replace(/\b°C\b/g, 'grados centígrados')
    .replace(/\blpm\b/g, 'latidos por minuto')
    .replace(/\brpm\b/g, 'respiraciones por minuto');

  // 3. Humanize list numbers and bullet points into natural rhythmic pauses
  cleaned = cleaned.replace(/^(\d+)\.\s+/gm, 'Paso $1: ');
  cleaned = cleaned.replace(/^[•\-+]\s+/gm, 'Punto: ');

  // 4. Humanize punctuation pauses
  cleaned = cleaned.replace(/[:;]\s+/g, ', ');
  cleaned = cleaned.replace(/[\n\r]+/g, '. ');
  cleaned = cleaned.replace(/\s+/g, ' ').trim();

  return cleaned;
}

/**
 * Splits text into natural expressive sentence chunks with conversational breath units
 */
export function splitTextIntoSpeechChunks(text: string, maxLength: number = 140): string[] {
  const clean = cleanTextForSpeech(text);
  if (!clean) return [];

  const sentences = clean.match(/[^.!?]+[.!?]+|[^.!?]+$/g) || [clean];
  const chunks: string[] = [];
  let currentChunk = '';

  for (const sentence of sentences) {
    const trimmed = sentence.trim();
    if (!trimmed) continue;

    if ((currentChunk + ' ' + trimmed).length > maxLength) {
      if (currentChunk.trim()) {
        chunks.push(currentChunk.trim());
      }
      currentChunk = trimmed;
    } else {
      currentChunk = currentChunk ? `${currentChunk} ${trimmed}` : trimmed;
    }
  }

  if (currentChunk.trim()) {
    chunks.push(currentChunk.trim());
  }

  return chunks.length > 0 ? chunks : [clean];
}

/**
 * Returns all available Spanish voices in browser
 */
export function getAllSpanishVoices(): SpeechSynthesisVoice[] {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return [];
  const voices = window.speechSynthesis.getVoices() || [];
  return voices.filter(
    (v) => v.lang.toLowerCase().startsWith('es') || v.lang.toLowerCase().includes('spanish')
  );
}

/**
 * Sets user preferred voice URI
 */
export function setSelectedVoiceURI(uri: string | null): void {
  globalSelectedVoiceURI = uri;
}

/**
 * Gets the most human, natural-sounding, neural/high-quality Spanish voice available
 */
export function getBestSpanishVoice(preferredUri?: string): SpeechSynthesisVoice | null {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return null;

  const voices = window.speechSynthesis.getVoices();
  if (!voices || voices.length === 0) return null;

  const targetUri = preferredUri || globalSelectedVoiceURI;
  if (targetUri) {
    const userChoice = voices.find((v) => v.voiceURI === targetUri);
    if (userChoice) return userChoice;
  }

  // Premium neural / natural human voice candidates in order of warmth and quality
  const preferredVoiceSignatures = [
    'Google español',
    'Google Spanish',
    'Microsoft Sabina',
    'Microsoft Dalia',
    'Microsoft Jorge',
    'Microsoft Helena',
    'Microsoft Alvaro',
    'Paulina',
    'Monica',
    'Lucia',
    'Soledad',
    'Francisca',
    'Carlos',
    'Natural',
    'Neural'
  ];

  for (const sig of preferredVoiceSignatures) {
    const match = voices.find(
      (v) =>
        (v.lang.toLowerCase().startsWith('es') || v.lang.toLowerCase().includes('spanish')) &&
        v.name.toLowerCase().includes(sig.toLowerCase())
    );
    if (match) return match;
  }

  // Regional Spanish priority
  const preferredLocales = ['es-MX', 'es-US', 'es-419', 'es-ES', 'es-CO', 'es-AR', 'es'];
  for (const loc of preferredLocales) {
    const localeVoice = voices.find((v) => v.lang.replace('_', '-').startsWith(loc));
    if (localeVoice) return localeVoice;
  }

  const anySpanish = voices.find((v) => v.lang.toLowerCase().startsWith('es'));
  if (anySpanish) return anySpanish;

  return voices[0] || null;
}

export function isSpeechSupported(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window;
}

export function isSpeaking(): boolean {
  return isSpeakingActive;
}

export function isSinging(): boolean {
  return isSingingActive;
}

export function stopSpeech(): void {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
  isSpeakingActive = false;
  activeUtterance = null;
}

export function stopAllAudioAndSinging(): void {
  stopSpeech();
  isSingingActive = false;

  activeAudioOscillators.forEach((osc) => {
    try {
      osc.stop();
      osc.disconnect();
    } catch (e) {}
  });
  activeAudioOscillators = [];

  if (activeAudioContext && activeAudioContext.state !== 'closed') {
    try {
      activeAudioContext.close();
    } catch (e) {}
    activeAudioContext = null;
  }
}

/**
 * Speaks text with humanized pacing, warm pitch modulation, and natural rhythm
 */
export function speakHumanizedText(text: string, options: SpeechOptions = {}): void {
  if (!isSpeechSupported()) {
    console.warn('Speech synthesis not supported on this browser.');
    options.onError?.('Speech not supported');
    return;
  }

  stopAllAudioAndSinging();

  const chunks = splitTextIntoSpeechChunks(text);
  if (chunks.length === 0) {
    options.onEnd?.();
    return;
  }

  const voice = getBestSpanishVoice(options.voiceURI);

  // Humanized prosody profiles according to mascot persona or warm pediatric default
  let humanRate = options.rate || 0.96; // Calm, conversational human pacing
  let humanPitch = options.pitch || 1.05; // Warm, friendly, welcoming tone

  if (options.mascot === 'froggi') {
    humanRate = (options.rate || 1.0) * 0.98;
    humanPitch = (options.pitch || 1.05) * 1.06; // Enthusiastic and friendly
  } else if (options.mascot === 'monito') {
    humanRate = (options.rate || 1.0) * 1.04;
    humanPitch = (options.pitch || 1.05) * 1.12; // Playful and lively
  } else if (options.mascot === 'pandita') {
    humanRate = (options.rate || 1.0) * 0.90;
    humanPitch = (options.pitch || 1.05) * 0.96; // Soothing and sweet
  } else if (options.mascot === 'caracolito') {
    humanRate = (options.rate || 1.0) * 0.88;
    humanPitch = (options.pitch || 1.05) * 0.98; // Peaceful and meditative
  }

  let currentChunkIndex = 0;
  isSpeakingActive = true;
  options.onStart?.();

  const speakNextChunk = () => {
    if (currentChunkIndex >= chunks.length || !isSpeakingActive) {
      isSpeakingActive = false;
      options.onEnd?.();
      return;
    }

    const chunkText = chunks[currentChunkIndex];
    const utterance = new SpeechSynthesisUtterance(chunkText);
    activeUtterance = utterance;

    if (voice) {
      utterance.voice = voice;
      utterance.lang = voice.lang;
    } else {
      utterance.lang = options.lang || 'es-MX';
    }

    utterance.rate = Math.max(0.7, Math.min(1.5, humanRate));
    utterance.pitch = Math.max(0.7, Math.min(1.4, humanPitch));

    utterance.onboundary = (event) => {
      options.onBoundary?.(event.charIndex, chunkText);
    };

    utterance.onend = () => {
      currentChunkIndex++;
      // Natural human breathing pause between sentences (70ms)
      setTimeout(() => {
        if (isSpeakingActive) {
          speakNextChunk();
        }
      }, 70);
    };

    utterance.onerror = (err) => {
      console.warn('Speech synthesis chunk warning:', err);
      currentChunkIndex++;
      if (currentChunkIndex < chunks.length && isSpeakingActive) {
        speakNextChunk();
      } else {
        isSpeakingActive = false;
        options.onError?.(err);
      }
    };

    window.speechSynthesis.speak(utterance);
  };

  speakNextChunk();
}

/**
 * Backward compatibility alias
 */
export const speakText = speakHumanizedText;

// =========================================================================
// SUNO-STYLE MELODIC VOCAL & HARMONIC MUSIC SYNTHESIS ENGINE
// =========================================================================

/**
 * Musical scale mapping for harmonic accompaniment
 */
const MUSICAL_CHORDS = {
  cuna: [
    [261.63, 329.63, 392.0], // C major (C4, E4, G4)
    [220.0, 261.63, 329.63], // A minor (A3, C4, E4)
    [174.61, 220.0, 261.63], // F major (F3, A3, C4)
    [196.0, 246.94, 293.66], // G major (G3, B3, D4)
  ],
  alegre: [
    [261.63, 329.63, 392.0, 523.25], // C major arpeggio
    [196.0, 246.94, 293.66, 392.0],  // G major
    [220.0, 261.63, 329.63, 440.0],  // A minor
    [174.61, 220.0, 261.63, 349.23], // F major
  ],
  calma: [
    [220.0, 277.18, 329.63], // A major warm
    [164.81, 220.0, 277.18], // F# minor
    [146.83, 185.0, 220.0],  // D major
    [164.81, 207.65, 246.94] // E major
  ]
};

/**
 * Plays a continuous harmonic background instrumental track via Web Audio API
 */
function startHarmonicBackingTrack(
  ctx: AudioContext,
  style: string = 'cancion_cuna',
  tempoBpm: number = 80
): () => void {
  const isLullaby = /cuna|sueño|dormir|calma/i.test(style);
  const chordSet = isLullaby ? MUSICAL_CHORDS.cuna : MUSICAL_CHORDS.alegre;
  const beatDuration = 60 / Math.max(60, Math.min(140, tempoBpm));
  const barDuration = beatDuration * 4;

  let chordIndex = 0;
  let isPlayingLoop = true;
  let nextChordTime = ctx.currentTime + 0.05;

  const scheduleNextChord = () => {
    if (!isPlayingLoop || !isSingingActive) return;

    while (nextChordTime < ctx.currentTime + 3.0) {
      const chord = chordSet[chordIndex % chordSet.length];

      // 1. Warm Soft Pad Root Chords
      chord.forEach((freq, noteIdx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = isLullaby ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(freq, nextChordTime);

        // Soft ADSR envelope
        const vol = isLullaby ? 0.035 : 0.045;
        gain.gain.setValueAtTime(0.001, nextChordTime);
        gain.gain.linearRampToValueAtTime(vol / (noteIdx + 1), nextChordTime + 0.3);
        gain.gain.setValueAtTime(vol / (noteIdx + 1), nextChordTime + barDuration - 0.4);
        gain.gain.exponentialRampToValueAtTime(0.001, nextChordTime + barDuration);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(nextChordTime);
        osc.stop(nextChordTime + barDuration);
        activeAudioOscillators.push(osc);
      });

      // 2. Gentle Arpeggiated Chimes / Glockenspiel notes on beats
      chord.forEach((freq, arpegIdx) => {
        const chimeOsc = ctx.createOscillator();
        const chimeGain = ctx.createGain();
        const chimeTime = nextChordTime + arpegIdx * beatDuration;

        chimeOsc.type = 'sine';
        chimeOsc.frequency.setValueAtTime(freq * 2, chimeTime); // 1 octave higher for music-box feel

        chimeGain.gain.setValueAtTime(0.001, chimeTime);
        chimeGain.gain.linearRampToValueAtTime(0.05, chimeTime + 0.02);
        chimeGain.gain.exponentialRampToValueAtTime(0.001, chimeTime + beatDuration * 0.85);

        chimeOsc.connect(chimeGain);
        chimeGain.connect(ctx.destination);
        chimeOsc.start(chimeTime);
        chimeOsc.stop(chimeTime + beatDuration);
        activeAudioOscillators.push(chimeOsc);
      });

      nextChordTime += barDuration;
      chordIndex++;
    }

    if (isPlayingLoop) {
      setTimeout(scheduleNextChord, 800);
    }
  };

  scheduleNextChord();

  return () => {
    isPlayingLoop = false;
  };
}

/**
 * Suno-Style Singing Synthesis Engine:
 * Sings song lyrics rhythmically with pitch & melodic cadence accompanied by WebAudio instrumental backing.
 */
export function singSongWithMusic(
  song: SongDataToSing,
  options: SongSingingOptions = {}
): void {
  if (!isSpeechSupported()) {
    options.onError?.('Speech not supported on this device');
    return;
  }

  stopAllAudioAndSinging();

  isSingingActive = true;
  options.onStart?.();

  // 1. Initialize Web Audio Context for instrumental accompaniment
  const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
  let stopBackingTrack: (() => void) | null = null;

  if (AudioCtx) {
    try {
      const ctx = new AudioCtx();
      activeAudioContext = ctx;
      stopBackingTrack = startHarmonicBackingTrack(
        ctx,
        song.style || options.style || 'cancion_cuna',
        song.tempoBpm || options.tempoBpm || 76
      );
    } catch (e) {
      console.warn('AudioContext initialization note:', e);
    }
  }

  // 2. Prepare Lyrics Sections to Sing in Sequence
  const sectionsToSing: Array<{
    sectionKey: 'verse1' | 'chorus' | 'verse2' | 'outro';
    sectionTitle: string;
    lines: string[];
    pitchMod: number;
    rateMod: number;
  }> = [];

  const mascot = options.singerMascot || 'froggi';
  let basePitch = 1.1;
  let baseRate = 0.95;

  if (mascot === 'froggi') {
    basePitch = 1.18; // Joyful melodic frog voice
    baseRate = 0.96;
  } else if (mascot === 'pandita') {
    basePitch = 0.98; // Gentle lullaby panda voice
    baseRate = 0.88;
  } else if (mascot === 'monito') {
    basePitch = 1.25; // High-energy monkey pop voice
    baseRate = 1.05;
  } else if (mascot === 'caracolito') {
    basePitch = 1.02; // Peaceful snail lullaby
    baseRate = 0.84;
  }

  // Suno style melodic vocal intro
  const isLullaby = /cuna|sueño|dormir|calma/i.test(song.style || '');
  const vocalIntro = isLullaby
    ? 'La, la, la... Duérmete mi sol, la, la, la.'
    : '¡La, la, la! ¡A cantar con alegría, la, la, la!';

  const splitLyricsIntoLines = (text?: string): string[] => {
    if (!text) return [];
    return text
      .split('\n')
      .map((l) => l.trim().replace(/[.,;:!?]+$/, ''))
      .filter((l) => l.length > 0);
  };

  if (options.includeLalalaIntro !== false) {
    sectionsToSing.push({
      sectionKey: 'verse1',
      sectionTitle: 'Introducción Melódica',
      lines: [vocalIntro],
      pitchMod: 1.05,
      rateMod: 0.92,
    });
  }

  if (song.lyrics.verse1) {
    sectionsToSing.push({
      sectionKey: 'verse1',
      sectionTitle: 'Estrofa 1',
      lines: splitLyricsIntoLines(song.lyrics.verse1),
      pitchMod: 1.0,
      rateMod: 1.0,
    });
  }

  if (song.lyrics.chorus) {
    sectionsToSing.push({
      sectionKey: 'chorus',
      sectionTitle: 'Estribillo / Coro',
      lines: splitLyricsIntoLines(song.lyrics.chorus),
      pitchMod: 1.12, // Higher pitch on chorus
      rateMod: 0.98,
    });
  }

  if (song.lyrics.verse2) {
    sectionsToSing.push({
      sectionKey: 'verse2',
      sectionTitle: 'Estrofa 2',
      lines: splitLyricsIntoLines(song.lyrics.verse2),
      pitchMod: 1.02,
      rateMod: 1.0,
    });
  }

  if (song.lyrics.outro) {
    sectionsToSing.push({
      sectionKey: 'outro',
      sectionTitle: 'Cierre / Outro',
      lines: splitLyricsIntoLines(song.lyrics.outro),
      pitchMod: 0.95,
      rateMod: 0.88,
    });
  }

  const voice = getBestSpanishVoice();
  let currentSectionIdx = 0;
  let currentLineIdx = 0;

  const singNextLine = () => {
    if (!isSingingActive) {
      if (stopBackingTrack) stopBackingTrack();
      return;
    }

    if (currentSectionIdx >= sectionsToSing.length) {
      // Completed full song!
      isSingingActive = false;
      if (stopBackingTrack) stopBackingTrack();
      setTimeout(() => {
        stopAllAudioAndSinging();
        options.onEnd?.();
      }, 500);
      return;
    }

    const currentSection = sectionsToSing[currentSectionIdx];
    if (currentLineIdx >= currentSection.lines.length) {
      currentSectionIdx++;
      currentLineIdx = 0;
      setTimeout(singNextLine, 140); // Musical breath pause between sections
      return;
    }

    const rawLine = currentSection.lines[currentLineIdx];
    const lineToSing = cleanTextForSpeech(rawLine);

    options.onSectionChange?.(
      currentSection.sectionKey,
      currentLineIdx,
      rawLine
    );

    const utterance = new SpeechSynthesisUtterance(lineToSing);
    activeUtterance = utterance;

    if (voice) {
      utterance.voice = voice;
      utterance.lang = voice.lang;
    } else {
      utterance.lang = 'es-MX';
    }

    // Melodic pitch and tempo inflection
    const linePitch = basePitch * currentSection.pitchMod;
    const lineRate = baseRate * currentSection.rateMod;

    utterance.pitch = Math.max(0.7, Math.min(1.45, linePitch));
    utterance.rate = Math.max(0.7, Math.min(1.3, lineRate));

    utterance.onend = () => {
      currentLineIdx++;
      // Musical bar pause between lines (110ms)
      setTimeout(() => {
        if (isSingingActive) {
          singNextLine();
        }
      }, 110);
    };

    utterance.onerror = (err) => {
      console.warn('Singing line warning:', err);
      currentLineIdx++;
      if (isSingingActive) {
        singNextLine();
      }
    };

    window.speechSynthesis.speak(utterance);
  };

  singNextLine();
}

/**
 * Emits an audible pediatric emergency alarm chime / alert sound via Web Audio API.
 * Uses a double-pulsed attention chime (880Hz -> 1174Hz) that is clear, clinical, and noticeable.
 */
export function playEmergencyAlarmSound(): void {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    const playTone = (freq: number, startTime: number, duration: number, vol: number = 0.22) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, startTime);
      
      gain.gain.setValueAtTime(0.001, startTime);
      gain.gain.linearRampToValueAtTime(vol, startTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(startTime);
      osc.stop(startTime + duration);
    };

    const now = ctx.currentTime;
    // Pulse 1
    playTone(880, now, 0.20, 0.25);
    playTone(1174.66, now + 0.20, 0.26, 0.28);
    // Pulse 2 (urgent follow-up chime)
    playTone(880, now + 0.55, 0.20, 0.25);
    playTone(1318.51, now + 0.75, 0.35, 0.30);
  } catch (err) {
    console.error('No se pudo reproducir el sonido de alarma de urgencias:', err);
  }
}


