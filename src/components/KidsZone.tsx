import React, { useState, useRef, useEffect } from 'react';
import { FroggiAvatar, PanditaAvatar, MonitoAvatar, CaracolitoAvatar, RainbowBanner } from './MascotSVGs';
import { AgeBracket, GeneratedStory, GeneratedSong, MascotLetter } from '../types';
import { useFamily } from '../context/FamilyContext';
import { useTheme } from '../context/ThemeContext';
import confetti from 'canvas-confetti';
import {
  Sparkles,
  Music,
  Palette,
  Gamepad2,
  BookOpen,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Wand2,
  RefreshCw,
  Eraser,
  Heart,
  Headphones,
  Sliders,
  CheckCircle2,
  Feather,
  Mail,
  Send,
  Download,
  PlusCircle,
  Type,
  Lightbulb,
  ArrowRight
} from 'lucide-react';

export const KidsZone: React.FC = () => {
  const { activeChild } = useFamily();
  const [activeTab, setActiveTab] = useState<'story' | 'music' | 'letters' | 'drawing' | 'memory'>('story');

  // ==========================================
  // 1. AI TRANSFORMER STORY GENERATOR STATE
  // ==========================================
  const [storyAge, setStoryAge] = useState<AgeBracket>('4-6y');
  const [storyProtagonist, setStoryProtagonist] = useState<string>('Froggi');
  const [storyTheme, setStoryTheme] = useState<string>('valentía y superar el miedo a equivocarse');
  const [customStoryIdea, setCustomStoryIdea] = useState<string>('');
  const [childName, setChildName] = useState<string>('Lucas');
  const [isGeneratingStory, setIsGeneratingStory] = useState(false);

  useEffect(() => {
    if (activeChild) {
      setChildName(activeChild.name);
      if (activeChild.ageMonths <= 12) setStoryAge('0-12m');
      else if (activeChild.ageMonths <= 36) setStoryAge('1-3y');
      else if (activeChild.ageMonths <= 72) setStoryAge('4-6y');
      else setStoryAge('7-10y+');
    }
  }, [activeChild]);
  
  // Interactive Choice for continuing stories
  const [typedChoice, setTypedChoice] = useState<string>('');
  const [isContinuingStory, setIsContinuingStory] = useState(false);

  const [currentStory, setCurrentStory] = useState<GeneratedStory | null>({
    title: 'Froggi y el Gran Salto del Lirio Mágico',
    targetAge: '4-6y',
    protagonist: 'Froggi',
    theme: 'Superar el miedo a equivocarse y perseverancia',
    summary: 'Froggi ayuda a Lucas a descubrir que cometer pequeños errores es el secreto para aprender a saltar más alto.',
    chapters: [
      {
        title: 'Capítulo 1: El Estanque de los Colores',
        text: 'En el estanque brillante de Amigos Unidos, el sol brillaba con destellos dorados. Froggi la ranita preparó un camino de lirios flotantes para jugar con Lucas. "Hoy aprenderemos el salto de la ranita alegre", dijo Froggi con una gran sonrisa. Lucas miró el agua con un poquito de duda en sus ojitos.'
      },
      {
        title: 'Capítulo 2: El Tropezón y la Risa',
        text: 'Lucas dio su primer brinco... ¡y cayó suavemente sobre una almohadilla de musgo verde! Froggi no se preocupó, dio dos saltitos y exclamó: "¡Qué aterrizaje tan gracioso! Cada vez que tropezamos, nuestras piernas se hacen más fuertes". Pandita se acercó con unas galletitas de avena y Caracolito aplaudió contento.'
      },
      {
        title: 'Capítulo 3: El Gran Vuelo del Arcoíris',
        text: 'Lucas respiró hondo como un globito inflado, tomó impulso con las rodillas y dio un salto majestuoso hasta el lirio más grande. Todos los Amigos Unidos aplaudieron entusiasmados. Lucas sintió una alegría inmensa en el pecho y entendió que lo más valiente es volver a intentarlo con amor.'
      }
    ],
    familyQuestion: '¿Recuerdas alguna vez que te dio miedo intentar algo nuevo y luego te sentiste muy orgulloso/a al lograrlo?',
    pediatricBenefit: 'Refuerza la autoeficacia, la tolerancia a la frustración y el apego seguro (Harvard Child Development & UNICEF ECDI2030).'
  });

  // Story TTS
  const [isNarrating, setIsNarrating] = useState(false);

  const handleNarrateStory = () => {
    if (!('speechSynthesis' in window) || !currentStory) return;

    if (isNarrating) {
      window.speechSynthesis.cancel();
      setIsNarrating(false);
      return;
    }

    const fullText = `${currentStory.title}. ${currentStory.chapters.map(c => `${c.title}. ${c.text}`).join(' ')} Pregunta para conversar en familia: ${currentStory.familyQuestion}`;
    const utterance = new SpeechSynthesisUtterance(fullText);
    utterance.lang = 'es-ES';
    utterance.rate = 0.95;
    utterance.onend = () => setIsNarrating(false);
    utterance.onerror = () => setIsNarrating(false);
    setIsNarrating(true);
    window.speechSynthesis.speak(utterance);
  };

  const handleGenerateStory = async () => {
    setIsGeneratingStory(true);
    if (isNarrating) {
      window.speechSynthesis.cancel();
      setIsNarrating(false);
    }

    try {
      const res = await fetch('/api/generate-story', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetAge: storyAge,
          protagonist: storyProtagonist,
          theme: storyTheme,
          childName: childName.trim() || 'mi peque',
          customIdea: customStoryIdea.trim()
        })
      });

      if (!res.ok) throw new Error('Error en servidor');
      const data: GeneratedStory = await res.json();
      setCurrentStory(data);
      setTypedChoice('');
      confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
    } catch (e) {
      console.error(e);
    } finally {
      setIsGeneratingStory(false);
    }
  };

  const handleContinueStory = async () => {
    if (!typedChoice.trim() || !currentStory) return;
    setIsContinuingStory(true);

    try {
      const res = await fetch('/api/continue-story', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          storyTitle: currentStory.title,
          previousChapters: currentStory.chapters,
          childChoice: typedChoice.trim(),
          childName: childName.trim() || 'mi peque',
          protagonist: currentStory.protagonist
        })
      });

      if (!res.ok) throw new Error('Error continuando el cuento');
      const data = await res.json();

      setCurrentStory((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          chapters: [
            ...prev.chapters,
            {
              title: data.chapterTitle || `Capítulo ${prev.chapters.length + 1}: Una Nueva Elección`,
              text: data.chapterText
            }
          ],
          familyQuestion: data.newFamilyQuestion || prev.familyQuestion,
          pediatricBenefit: data.pediatricBenefit || prev.pediatricBenefit
        };
      });

      setTypedChoice('');
      confetti({ particleCount: 50, spread: 50, origin: { y: 0.7 } });
    } catch (e) {
      console.error(e);
    } finally {
      setIsContinuingStory(false);
    }
  };

  // ==========================================
  // 2. AI TRANSFORMER MUSIC & NURSERY GENERATOR
  // ==========================================
  const [musicAge, setMusicAge] = useState<AgeBracket>('1-3y');
  const [musicStyle, setMusicStyle] = useState<string>('cancion_cuna');
  const [musicTopic, setMusicTopic] = useState<string>('sueño tranquilo y respiración');
  const [customLyricsPrompt, setCustomLyricsPrompt] = useState<string>('');
  const [isGeneratingMusic, setIsGeneratingMusic] = useState(false);
  const [currentSong, setCurrentSong] = useState<GeneratedSong | null>({
    title: 'Nanas de Luna y Estrellas con Froggi',
    targetAge: '1-3y',
    style: 'Canción de Cuna Relajante',
    tempoBpm: 74,
    lyrics: {
      verse1: 'Duerme mi cielo en tu cuna de paz,\nFroggi en el estanque velando estará.\nLas estrellitas comienzan a brillar,\nCierra tus ojitos, es hora de soñar.',
      chorus: 'Nube de algodón, suspiro de amor,\nDuerme tranquilo mi tierno pimpollo.\nPandita te abraza con suave calor,\nMañana jugamos bajo el resplandor.',
      verse2: 'Caracolito camina despacio y sin prisa,\nEn tu carita dibuja una dulce sonrisa.\nEl viento te canta un arrullo sutil,\nQue tengas mil sueños de plata y marfil.',
      outro: 'Buenas noches mi tesoro, descansa feliz... zzz.'
    },
    notes: [
      { pitch: 'C4', freq: 261.63, duration: 0.6 },
      { pitch: 'E4', freq: 329.63, duration: 0.6 },
      { pitch: 'G4', freq: 392.00, duration: 0.6 },
      { pitch: 'A4', freq: 440.00, duration: 0.6 },
      { pitch: 'G4', freq: 392.00, duration: 0.8 },
      { pitch: 'E4', freq: 329.63, duration: 0.6 },
      { pitch: 'F4', freq: 349.23, duration: 0.6 },
      { pitch: 'D4', freq: 293.66, duration: 0.8 },
      { pitch: 'C4', freq: 261.63, duration: 1.2 }
    ],
    pediatricBenefit: 'Frecuencias armónicas suaves que desaceleran el ritmo cardíaco y estimulan el sueño profundo (AAP Safe Sleep).'
  });

  const [isPlayingSynthNotes, setIsPlayingSynthNotes] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const currentOscsRef = useRef<OscillatorNode[]>([]);

  const handlePlayGeneratedNotes = () => {
    if (!currentSong || !currentSong.notes || currentSong.notes.length === 0) return;

    if (isPlayingSynthNotes) {
      stopSoundTrack();
      setIsPlayingSynthNotes(false);
      return;
    }

    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      audioContextRef.current = ctx;
      setIsPlayingSynthNotes(true);

      let accumulatedTime = ctx.currentTime + 0.1;
      const oscs: OscillatorNode[] = [];

      currentSong.notes.forEach((note) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = currentSong.style.toLowerCase().includes('cuna') ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(note.freq, accumulatedTime);

        gain.gain.setValueAtTime(0.001, accumulatedTime);
        gain.gain.linearRampToValueAtTime(0.08, accumulatedTime + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, accumulatedTime + note.duration);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(accumulatedTime);
        osc.stop(accumulatedTime + note.duration);
        oscs.push(osc);

        accumulatedTime += note.duration;
      });

      currentOscsRef.current = oscs;

      setTimeout(() => {
        setIsPlayingSynthNotes(false);
      }, (accumulatedTime - ctx.currentTime) * 1000);

    } catch (e) {
      console.error(e);
      setIsPlayingSynthNotes(false);
    }
  };

  const stopSoundTrack = () => {
    currentOscsRef.current.forEach((osc) => {
      try {
        osc.stop();
        osc.disconnect();
      } catch (e) {}
    });
    currentOscsRef.current = [];
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close();
    }
    setIsPlayingSynthNotes(false);
  };

  const handleGenerateMusic = async () => {
    setIsGeneratingMusic(true);
    stopSoundTrack();

    try {
      const res = await fetch('/api/generate-music', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetAge: musicAge,
          style: musicStyle,
          topic: musicTopic,
          childName: childName.trim() || 'mi peque',
          customLyricsPrompt: customLyricsPrompt.trim()
        })
      });

      if (!res.ok) throw new Error('Error generando música');
      const data: GeneratedSong = await res.json();
      setCurrentSong(data);
      confetti({ particleCount: 60, spread: 50, origin: { y: 0.6 } });
    } catch (e) {
      console.error(e);
    } finally {
      setIsGeneratingMusic(false);
    }
  };

  // ==========================================
  // 3. MASCOT LETTERS / BUZÓN DE CARTAS
  // ==========================================
  const [selectedMascotLetter, setSelectedMascotLetter] = useState<string>('Froggi');
  const [letterSenderName, setLetterSenderName] = useState<string>('Lucas');
  const [letterSenderAge, setLetterSenderAge] = useState<string>('5 años');
  const [letterMessage, setLetterMessage] = useState<string>('¡Hola Froggi! Hoy en la escuela aprendí a dibujar un arcoíris, pero me dio un poco de vergüenza mostrárselo a mis amigos. ¿Qué puedo hacer?');
  const [isSendingLetter, setIsSendingLetter] = useState(false);
  const [lettersList, setLettersList] = useState<MascotLetter[]>([
    {
      id: 'letter-sample',
      senderName: 'Sofía',
      senderAge: '4 años',
      mascot: 'Pandita',
      childMessage: 'Hola Pandita, anoche tuve una pesadilla con monstruos oscuros y me dio mucho miedo.',
      mascotReply: '¡Hola Sofi querida! 🐼 Te mando el abrazo más suavecito del mundo. Los monstruos de los sueños son solo sombras traviesas que desaparecen cuando encendemos una lucecita o abrazamos nuestro peluche favorito. ¡Eres muy valiente por contarme lo que sentiste!',
      timestamp: 'Hoy, 10:30 AM',
      pedagogicalAdvice: 'Validar los miedos nocturnos sin minimizarlos reduce los niveles de cortisol en la amígdala.',
      activityProposal: 'Dibuja al monstruo con un sombrero de payaso muy gracioso para quitarle el miedo con risas.'
    }
  ]);

  const handleSendLetter = async () => {
    if (!letterMessage.trim()) return;
    setIsSendingLetter(true);

    try {
      const res = await fetch('/api/mascot-letter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mascot: selectedMascotLetter,
          senderName: letterSenderName.trim() || 'un amiguito',
          senderAge: letterSenderAge.trim() || '4 años',
          message: letterMessage.trim()
        })
      });

      if (!res.ok) throw new Error('Error enviando carta');
      const letterData: MascotLetter = await res.json();
      setLettersList(prev => [letterData, ...prev]);
      setLetterMessage('');
      confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
    } catch (e) {
      console.error(e);
    } finally {
      setIsSendingLetter(false);
    }
  };

  // ==========================================
  // 4. DRAWING CANVAS STATE
  // ==========================================
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [brushColor, setBrushColor] = useState('#10b981');
  const [brushSize, setBrushSize] = useState(6);
  const [stampText, setStampText] = useState<string>('¡Soy Valiente! 🐸');

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.strokeStyle = brushColor;
    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => setIsDrawing(false);

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const handleStampTextOnCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas || !stampText.trim()) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.font = 'bold 24px sans-serif';
    ctx.fillStyle = brushColor;
    ctx.fillText(stampText, 30, 60);
  };

  const handleDownloadCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = `dibujo-amigos-unidos-${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  // ==========================================
  // 5. MEMORY GAME STATE
  // ==========================================
  const MASCOT_CARDS = [
    { id: '1', mascot: 'froggi', name: 'Froggi' },
    { id: '2', mascot: 'froggi', name: 'Froggi' },
    { id: '3', mascot: 'pandita', name: 'Pandita' },
    { id: '4', mascot: 'pandita', name: 'Pandita' },
    { id: '5', mascot: 'monito', name: 'Monito' },
    { id: '6', mascot: 'monito', name: 'Monito' },
    { id: '7', mascot: 'caracolito', name: 'Caracolito' },
    { id: '8', mascot: 'caracolito', name: 'Caracolito' },
  ];

  const [cards, setCards] = useState<any[]>([]);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [matched, setMatched] = useState<string[]>([]);
  const [moves, setMoves] = useState(0);

  useEffect(() => {
    resetMemoryGame();
  }, []);

  const resetMemoryGame = () => {
    const shuffled = [...MASCOT_CARDS].sort(() => Math.random() - 0.5);
    setCards(shuffled);
    setFlipped([]);
    setMatched([]);
    setMoves(0);
  };

  const handleCardClick = (index: number) => {
    if (flipped.length === 2 || flipped.includes(index) || matched.includes(cards[index].mascot)) {
      return;
    }

    const newFlipped = [...flipped, index];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setMoves((m) => m + 1);
      const first = cards[newFlipped[0]];
      const second = cards[newFlipped[1]];

      if (first.mascot === second.mascot) {
        setMatched((m) => {
          const next = [...m, first.mascot];
          if (next.length === 4) {
            confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
          }
          return next;
        });
        setFlipped([]);
      } else {
        setTimeout(() => {
          setFlipped([]);
        }, 1000);
      }
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Mascot Rainbow Banner */}
      <RainbowBanner />

      {/* Interactive Tabs for Kids Zone */}
      <div className="flex flex-wrap gap-2 justify-center">
        <button
          id="kids-tab-story"
          onClick={() => setActiveTab('story')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl font-extrabold text-xs sm:text-sm transition-all border cursor-pointer ${
            activeTab === 'story'
              ? 'bg-sky-500 text-white border-sky-600 shadow-sm scale-105'
              : 'bg-white text-slate-700 border-slate-200 hover:bg-sky-50'
          }`}
        >
          <BookOpen className="w-4 h-4 text-sky-200" />
          <span>Cuentos IA Transformer</span>
        </button>

        <button
          id="kids-tab-music"
          onClick={() => setActiveTab('music')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl font-extrabold text-xs sm:text-sm transition-all border cursor-pointer ${
            activeTab === 'music'
              ? 'bg-amber-400 text-amber-950 border-amber-500 shadow-sm scale-105'
              : 'bg-white text-slate-700 border-slate-200 hover:bg-amber-50'
          }`}
        >
          <Music className="w-4 h-4 text-amber-700" />
          <span>Música & Rondas IA</span>
        </button>

        <button
          id="kids-tab-letters"
          onClick={() => setActiveTab('letters')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl font-extrabold text-xs sm:text-sm transition-all border cursor-pointer ${
            activeTab === 'letters'
              ? 'bg-indigo-500 text-white border-indigo-600 shadow-sm scale-105'
              : 'bg-white text-slate-700 border-slate-200 hover:bg-indigo-50'
          }`}
        >
          <Mail className="w-4 h-4 text-indigo-200" />
          <span>Buzón de Cartas a Mascotas</span>
        </button>

        <button
          id="kids-tab-drawing"
          onClick={() => setActiveTab('drawing')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl font-extrabold text-xs sm:text-sm transition-all border cursor-pointer ${
            activeTab === 'drawing'
              ? 'bg-emerald-500 text-white border-emerald-600 shadow-sm scale-105'
              : 'bg-white text-slate-700 border-slate-200 hover:bg-emerald-50'
          }`}
        >
          <Palette className="w-4 h-4 text-emerald-800" />
          <span>Pizarra & Textos</span>
        </button>

        <button
          id="kids-tab-memory"
          onClick={() => setActiveTab('memory')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl font-extrabold text-xs sm:text-sm transition-all border cursor-pointer ${
            activeTab === 'memory'
              ? 'bg-pink-500 text-white border-pink-600 shadow-sm scale-105'
              : 'bg-white text-slate-700 border-slate-200 hover:bg-pink-50'
          }`}
        >
          <Gamepad2 className="w-4 h-4 text-pink-800" />
          <span>Juego de Memoria</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* 1. AI TRANSFORMER STORY GENERATOR WITH TYPED IDEAS & CONTINUATIONS */}
      {/* ========================================================================= */}
      {activeTab === 'story' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-sky-100 text-sky-800 text-xs font-extrabold mb-1">
                <Wand2 className="w-3.5 h-3.5" />
                Motor Generativo Transformer & Texto Libre
              </div>
              <h3 className="text-xl font-black text-slate-900">
                Creador de Cuentos Pedagógicos Personalizados
              </h3>
              <p className="text-xs text-slate-500">
                Digita tus propias ideas, personajes o temas mágicos y la IA Transformer creará una historia interactiva única.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-600">Nombre de tu peque:</span>
              <input
                id="child-name-input"
                type="text"
                value={childName}
                onChange={(e) => setChildName(e.target.value)}
                placeholder="Ej. Lucas, Sofía"
                className="bg-slate-50 border border-slate-300 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-800 w-32 focus:outline-none focus:border-sky-500"
              />
            </div>
          </div>

          {/* Generator Controls */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-sky-50/60 p-4 rounded-2xl border border-sky-100">
            {/* Age Selection */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                1. Rango de Edad:
              </label>
              <select
                id="story-age-select"
                value={storyAge}
                onChange={(e) => setStoryAge(e.target.value as AgeBracket)}
                className="w-full bg-white border border-slate-300 rounded-xl p-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-sky-500"
              >
                <option value="0-12m">0 a 12 meses (Nanas & Sensorial)</option>
                <option value="1-3y">1 a 3 años (Primera Infancia & Emociones)</option>
                <option value="4-6y">4 a 6 años (Preescolar & Imaginación)</option>
                <option value="7-10y+">7 a 10+ años (Escolar & Amistad)</option>
              </select>
            </div>

            {/* Protagonist Selection */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                2. Personaje Guía:
              </label>
              <select
                id="story-protagonist-select"
                value={storyProtagonist}
                onChange={(e) => setStoryProtagonist(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-xl p-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-sky-500"
              >
                <option value="Froggi">🐸 Froggi (Curiosidad & Valentía)</option>
                <option value="Pandita">🐼 Pandita (Abrazos & Emociones)</option>
                <option value="Monito">🐒 Monito (Juegos & Motricidad)</option>
                <option value="Caracolito">🐌 Caracolito (Calma & Paciencia)</option>
              </select>
            </div>

            {/* Pedagogical Theme */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                3. Valor o Moraleja:
              </label>
              <select
                id="story-theme-select"
                value={storyTheme}
                onChange={(e) => setStoryTheme(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-xl p-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-sky-500"
              >
                <option value="valentía y superar el miedo a equivocarse">Valentía y Superar Errores</option>
                <option value="manejo del enojo y la frustración">Manejo de Enojo y Rabietas</option>
                <option value="compartir y hacer amigos en la escuela">Compartir y Amistad</option>
                <option value="rutina de sueño y relajación nocturna">Rutina de Sueño y Calma</option>
                <option value="higiene dental y comer verduras ricas">Alimentación y Cepillado Dental</option>
                <option value="curiosidad científica y amor a la naturaleza">Exploración y Naturaleza</option>
              </select>
            </div>
          </div>

          {/* Custom Text Prompt Input (Free-form typing for story creation) */}
          <div className="bg-sky-50/40 p-4 rounded-2xl border border-sky-200/70 space-y-2">
            <label className="flex items-center gap-2 text-xs font-black text-sky-950">
              <Type className="w-4 h-4 text-sky-600" />
              <span>✍️ Digita tu propia idea, detalles o escenario para el cuento (Opcional):</span>
            </label>
            <textarea
              id="custom-story-idea-input"
              value={customStoryIdea}
              onChange={(e) => setCustomStoryIdea(e.target.value)}
              placeholder="Ej. Froggi y Lucas construyen un submarino amarillo de cartón para buscar un tesoro de caracoles mágicos en el fondo del estanque..."
              rows={2}
              className="w-full bg-white border border-sky-200 rounded-xl p-3 text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-400 placeholder:text-slate-400 leading-relaxed font-medium"
            />
            <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500">
              <span>💡 Tip: Puedes escribir sobre lo que tu peque vivió hoy en el parque o la escuela.</span>
              <div className="flex gap-1.5">
                <button
                  type="button"
                  onClick={() => setCustomStoryIdea('Viaje en cohete a la luna de queso')}
                  className="px-2 py-0.5 bg-white border border-sky-200 rounded-lg text-sky-700 hover:bg-sky-100 cursor-pointer font-bold"
                >
                  🚀 Cohete a la luna
                </button>
                <button
                  type="button"
                  onClick={() => setCustomStoryIdea('Rescate de un pajarito herido en el jardín')}
                  className="px-2 py-0.5 bg-white border border-sky-200 rounded-lg text-sky-700 hover:bg-sky-100 cursor-pointer font-bold"
                >
                  🐦 Pajarito en el jardín
                </button>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div className="flex justify-center">
            <button
              id="generate-story-btn"
              onClick={handleGenerateStory}
              disabled={isGeneratingStory}
              className="bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-700 hover:to-indigo-700 disabled:opacity-50 text-white font-extrabold px-6 py-3 rounded-2xl flex items-center gap-2 shadow-md transition-all cursor-pointer text-sm"
            >
              {isGeneratingStory ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Creando cuento con IA Transformer...</span>
                </>
              ) : (
                <>
                  <Wand2 className="w-4 h-4" />
                  <span>Generar Nuevo Cuento con Froggi & Amigos</span>
                </>
              )}
            </button>
          </div>

          {/* Generated Story Display */}
          {currentStory && (
            <div className="bg-gradient-to-b from-sky-50/70 via-white to-sky-50/40 border border-sky-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-sky-100 pb-4">
                <div className="flex items-center gap-3">
                  {currentStory.protagonist === 'Froggi' ? (
                    <FroggiAvatar size={52} />
                  ) : currentStory.protagonist.toLowerCase().includes('panda') ? (
                    <PanditaAvatar size={52} />
                  ) : currentStory.protagonist.toLowerCase().includes('mono') ? (
                    <MonitoAvatar size={52} />
                  ) : (
                    <CaracolitoAvatar size={52} />
                  )}
                  <div>
                    <span className="text-[10px] font-extrabold text-sky-700 uppercase tracking-wider block">
                      Etapa {currentStory.targetAge} • Tema: {currentStory.theme}
                    </span>
                    <h4 className="text-xl sm:text-2xl font-black text-slate-900">
                      {currentStory.title}
                    </h4>
                  </div>
                </div>

                <button
                  id="narrate-story-btn"
                  onClick={handleNarrateStory}
                  className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-extrabold transition-all cursor-pointer shadow-xs ${
                    isNarrating
                      ? 'bg-rose-500 hover:bg-rose-600 text-white'
                      : 'bg-sky-600 hover:bg-sky-700 text-white'
                  }`}
                >
                  {isNarrating ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  <span>{isNarrating ? 'Pausar Narración' : 'Escuchar Cuento con Voz'}</span>
                </button>
              </div>

              {/* Story Chapters */}
              <div className="space-y-4 text-slate-800 leading-relaxed text-sm sm:text-base">
                {currentStory.chapters.map((chapter, idx) => (
                  <div key={idx} className="bg-white/80 border border-sky-100 p-4 sm:p-5 rounded-2xl space-y-1.5 shadow-xs">
                    <h5 className="font-extrabold text-sky-900 text-sm sm:text-base flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-sky-100 text-sky-800 text-xs font-black flex items-center justify-center">
                        {idx + 1}
                      </span>
                      <span>{chapter.title}</span>
                    </h5>
                    <p className="text-slate-700 text-xs sm:text-sm pl-8 leading-relaxed">
                      {chapter.text}
                    </p>
                  </div>
                ))}
              </div>

              {/* Interactive Story Continuation (Type Next Action) */}
              <div className="bg-gradient-to-r from-indigo-50 via-sky-50 to-emerald-50 border border-indigo-200 rounded-3xl p-5 space-y-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-indigo-600" />
                  <span className="text-xs sm:text-sm font-black text-indigo-950">
                    🎲 ¿Qué quieres que hagan los personajes ahora? ¡Digita la siguiente acción!
                  </span>
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    id="typed-story-choice-input"
                    type="text"
                    value={typedChoice}
                    onChange={(e) => setTypedChoice(e.target.value)}
                    placeholder="Ej. Deciden abrir la puerta de cristal dorado con la llave mágica..."
                    className="flex-1 bg-white border border-indigo-200 rounded-2xl px-4 py-2.5 text-xs sm:text-sm text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-400 shadow-inner"
                  />
                  <button
                    id="continue-story-btn"
                    onClick={handleContinueStory}
                    disabled={isContinuingStory || !typedChoice.trim()}
                    className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-extrabold px-5 py-2.5 rounded-2xl text-xs sm:text-sm transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer whitespace-nowrap"
                  >
                    {isContinuingStory ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Escribiendo...</span>
                      </>
                    ) : (
                      <>
                        <PlusCircle className="w-4 h-4" />
                        <span>Escribir Siguiente Capítulo</span>
                      </>
                    )}
                  </button>
                </div>
                <div className="flex flex-wrap gap-2 text-[11px] text-slate-500 items-center">
                  <span>Sugerencias rápidas para digitar:</span>
                  <button
                    type="button"
                    onClick={() => setTypedChoice('Caracolito encuentra un mapa secreto dentro de una nuez')}
                    className="text-indigo-700 bg-white/80 border border-indigo-200 px-2 py-0.5 rounded-md hover:bg-indigo-100 cursor-pointer font-semibold"
                  >
                    🗺️ Mapa en la nuez
                  </button>
                  <button
                    type="button"
                    onClick={() => setTypedChoice('Pandita prepara una fiesta de panqueques de plátano para todos')}
                    className="text-indigo-700 bg-white/80 border border-indigo-200 px-2 py-0.5 rounded-md hover:bg-indigo-100 cursor-pointer font-semibold"
                  >
                    🥞 Fiesta de panqueques
                  </button>
                </div>
              </div>

              {/* Family Reflection Box */}
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 sm:p-5 flex items-start gap-3">
                <Heart className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <span className="font-extrabold text-amber-950 text-xs sm:text-sm block">
                    💬 Momento de Diálogo Familiar:
                  </span>
                  <p className="text-xs text-amber-900">
                    {currentStory.familyQuestion}
                  </p>
                  <span className="text-[10px] font-bold text-amber-800/80 block pt-1">
                    🌟 Respaldo Pediátrico: {currentStory.pediatricBenefit}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. AI TRANSFORMER MUSIC & NURSERY RHYMES WITH CUSTOM LYRICS PROMPT */}
      {/* ========================================================================= */}
      {activeTab === 'music' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-100 text-amber-900 text-xs font-extrabold mb-1">
                <Music className="w-3.5 h-3.5" />
                Compositor Transformer & Síntesis WebAudio
              </div>
              <h3 className="text-xl font-black text-slate-900">
                Estudio de Canciones y Rondas Infantiles con IA
              </h3>
              <p className="text-xs text-slate-500">
                Digita letras, rimas o motivos y el modelo Transformer compondrá estrofas y melodías armónicas.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                id="play-synth-notes-btn"
                onClick={handlePlayGeneratedNotes}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-extrabold transition-all cursor-pointer shadow-xs ${
                  isPlayingSynthNotes
                    ? 'bg-rose-500 hover:bg-rose-600 text-white'
                    : 'bg-amber-500 hover:bg-amber-600 text-amber-950'
                }`}
              >
                {isPlayingSynthNotes ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                <span>{isPlayingSynthNotes ? 'Detener Melodía' : 'Reproducir Melodía Sintetizada'}</span>
              </button>
            </div>
          </div>

          {/* Music Generator Controls */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-amber-50/60 p-4 rounded-2xl border border-amber-100">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                1. Rango de Edad:
              </label>
              <select
                id="music-age-select"
                value={musicAge}
                onChange={(e) => setMusicAge(e.target.value as AgeBracket)}
                className="w-full bg-white border border-slate-300 rounded-xl p-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-amber-500"
              >
                <option value="0-12m">0 a 12 meses (Nanas de Cuna)</option>
                <option value="1-3y">1 a 3 años (Rondas Rítmicas & Sonidos)</option>
                <option value="4-6y">4 a 6 años (Canciones de Aprendizaje & Movimiento)</option>
                <option value="7-10y+">7 a 10+ años (Himnos de Autoestima & Energía)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                2. Estilo Musical:
              </label>
              <select
                id="music-style-select"
                value={musicStyle}
                onChange={(e) => setMusicStyle(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-xl p-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-amber-500"
              >
                <option value="cancion_cuna">Canción de Cuna Relajante (432 Hz)</option>
                <option value="ronda_alegre">Ronda Alegre de Saltos y Danza</option>
                <option value="rutina_cepillado">Canción de Rutinas (Dientes & Manos)</option>
                <option value="calma_emocional">Melodía para Respirar y Calmar la Rabia</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                3. Motivo Principal:
              </label>
              <input
                id="music-topic-input"
                type="text"
                value={musicTopic}
                onChange={(e) => setMusicTopic(e.target.value)}
                placeholder="Ej. Sueño tranquilo, saltar charcos"
                className="w-full bg-white border border-slate-300 rounded-xl p-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* Custom Lyrics Text Input (Free-form typing for songs) */}
          <div className="bg-amber-50/40 p-4 rounded-2xl border border-amber-200/70 space-y-2">
            <label className="flex items-center gap-2 text-xs font-black text-amber-950">
              <Type className="w-4 h-4 text-amber-600" />
              <span>✍️ Digita rimas, palabras clave o frases especiales para la letra de la canción:</span>
            </label>
            <input
              id="custom-lyrics-prompt-input"
              type="text"
              value={customLyricsPrompt}
              onChange={(e) => setCustomLyricsPrompt(e.target.value)}
              placeholder="Ej. Incluir a su perrito Toby, hablar de las estrellas y cepillarse los dientes..."
              className="w-full bg-white border border-amber-200 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-amber-400 shadow-inner"
            />
          </div>

          <div className="flex justify-center">
            <button
              id="generate-music-btn"
              onClick={handleGenerateMusic}
              disabled={isGeneratingMusic}
              className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 disabled:opacity-50 text-white font-extrabold px-6 py-3 rounded-2xl flex items-center gap-2 shadow-md transition-all cursor-pointer text-sm"
            >
              {isGeneratingMusic ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Componiendo música con IA Transformer...</span>
                </>
              ) : (
                <>
                  <Wand2 className="w-4 h-4" />
                  <span>Componer Nueva Canción Infantil</span>
                </>
              )}
            </button>
          </div>

          {/* Generated Song Display */}
          {currentSong && (
            <div className="bg-gradient-to-b from-amber-50/60 via-white to-amber-50/30 border border-amber-200 rounded-3xl p-6 sm:p-8 space-y-6">
              <div className="flex items-center gap-4 border-b border-amber-100 pb-4">
                <CaracolitoAvatar size={50} />
                <div>
                  <span className="text-[10px] font-extrabold text-amber-700 uppercase tracking-wider block">
                    Estilo: {currentSong.style} • Tempo: {currentSong.tempoBpm} BPM
                  </span>
                  <h4 className="text-xl sm:text-2xl font-black text-slate-900">
                    {currentSong.title}
                  </h4>
                </div>
              </div>

              {/* Lyrics Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
                <div className="bg-white border border-amber-100 p-4 rounded-2xl space-y-1">
                  <span className="text-[11px] font-bold text-amber-700 block uppercase">Estrofa 1</span>
                  <p className="text-slate-800 whitespace-pre-line leading-relaxed font-medium">
                    {currentSong.lyrics.verse1}
                  </p>
                </div>

                <div className="bg-amber-100/70 border border-amber-200 p-4 rounded-2xl space-y-1">
                  <span className="text-[11px] font-extrabold text-amber-900 block uppercase">Estribillo / Coro ⭐</span>
                  <p className="text-amber-950 whitespace-pre-line leading-relaxed font-bold">
                    {currentSong.lyrics.chorus}
                  </p>
                </div>

                <div className="bg-white border border-amber-100 p-4 rounded-2xl space-y-1">
                  <span className="text-[11px] font-bold text-amber-700 block uppercase">Estrofa 2</span>
                  <p className="text-slate-800 whitespace-pre-line leading-relaxed font-medium">
                    {currentSong.lyrics.verse2}
                  </p>
                </div>

                <div className="bg-white border border-amber-100 p-4 rounded-2xl space-y-1">
                  <span className="text-[11px] font-bold text-amber-700 block uppercase">Cierre / Outro</span>
                  <p className="text-slate-800 whitespace-pre-line leading-relaxed font-medium">
                    {currentSong.lyrics.outro}
                  </p>
                </div>
              </div>

              {/* Rhythmic notes visualizer */}
              <div className="bg-slate-900 text-white p-4 rounded-2xl space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Secuencia de Notas Sintetizadas WebAudio:</span>
                  <span className="text-emerald-400 font-mono text-[11px]">{currentSong.notes.length} notas musicales</span>
                </div>
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {currentSong.notes.map((note, idx) => (
                    <div key={idx} className="bg-slate-800 border border-slate-700 px-3 py-1.5 rounded-xl text-center shrink-0">
                      <span className="text-xs font-black text-amber-400 block font-mono">{note.pitch}</span>
                      <span className="text-[10px] text-slate-400 block font-mono">{note.freq.toFixed(1)} Hz</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-xs text-emerald-900 flex items-center gap-2.5 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span><strong>Beneficio del Desarrollo Pediátrico:</strong> {currentSong.pediatricBenefit}</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. MASCOT LETTERS / BUZÓN DE CARTAS A LOS AMIGOS */}
      {/* ========================================================================= */}
      {activeTab === 'letters' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-indigo-100 text-indigo-900 text-xs font-extrabold mb-1">
                <Mail className="w-3.5 h-3.5" />
                Buzón Mágico de Escritura & Socioemocional
              </div>
              <h3 className="text-xl font-black text-slate-900">
                Escribe una Carta a tu Mascota Favorita
              </h3>
              <p className="text-xs text-slate-500">
                Los niños y padres pueden escribir sus pensamientos, emociones o anécdotas y recibirán una carta de respuesta llena de cariño.
              </p>
            </div>
          </div>

          {/* Letter Writer Form */}
          <div className="bg-gradient-to-br from-indigo-50/80 via-white to-purple-50/50 p-5 rounded-3xl border border-indigo-100 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  1. ¿A quién le escribes?
                </label>
                <select
                  id="mascot-letter-select"
                  value={selectedMascotLetter}
                  onChange={(e) => setSelectedMascotLetter(e.target.value)}
                  className="w-full bg-white border border-indigo-200 rounded-xl p-2.5 text-xs font-bold text-slate-800 focus:outline-none focus:border-indigo-500"
                >
                  <option value="Froggi">🐸 Froggi (La Ranita Valiente)</option>
                  <option value="Pandita">🐼 Pandita (El Osito de los Abrazos)</option>
                  <option value="Monito">🐒 Monito (El Amigo Alegre y Juguetón)</option>
                  <option value="Caracolito">🐌 Caracolito (El Guía de la Calma)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  2. Tu Nombre:
                </label>
                <input
                  id="letter-sender-name"
                  type="text"
                  value={letterSenderName}
                  onChange={(e) => setLetterSenderName(e.target.value)}
                  placeholder="Ej. Lucas"
                  className="w-full bg-white border border-indigo-200 rounded-xl p-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  3. Tu Edad:
                </label>
                <input
                  id="letter-sender-age"
                  type="text"
                  value={letterSenderAge}
                  onChange={(e) => setLetterSenderAge(e.target.value)}
                  placeholder="Ej. 5 años"
                  className="w-full bg-white border border-indigo-200 rounded-xl p-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                ✍️ Escribe tu mensaje o carta con tus propias palabras:
              </label>
              <textarea
                id="letter-message-input"
                value={letterMessage}
                onChange={(e) => setLetterMessage(e.target.value)}
                placeholder="Querido Froggi, hoy me pasó algo en la escuela..."
                rows={3}
                className="w-full bg-white border border-indigo-200 rounded-2xl p-3 text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-400 font-medium leading-relaxed shadow-inner"
              />
            </div>

            <div className="flex justify-end">
              <button
                id="send-letter-btn"
                onClick={handleSendLetter}
                disabled={isSendingLetter || !letterMessage.trim()}
                className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-extrabold px-6 py-2.5 rounded-2xl text-xs sm:text-sm transition-all flex items-center gap-2 shadow-md cursor-pointer"
              >
                {isSendingLetter ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Llevando carta al buzón...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Enviar Carta al Buzón Mágico</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Letter Exchanges Feed */}
          <div className="space-y-4">
            <h4 className="font-black text-slate-900 text-sm flex items-center gap-2">
              <Feather className="w-4 h-4 text-indigo-600" />
              <span>Cartas Recibidas y Respuestas de los Amigos:</span>
            </h4>

            {lettersList.map((letter) => (
              <div key={letter.id} className="bg-gradient-to-br from-white via-indigo-50/20 to-purple-50/30 border border-indigo-100 rounded-3xl p-5 sm:p-6 space-y-4 shadow-xs">
                <div className="flex items-center justify-between border-b border-indigo-50 pb-3 text-xs">
                  <div className="flex items-center gap-2 font-bold text-slate-800">
                    <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                    <span>De: <strong>{letter.senderName}</strong> ({letter.senderAge}) para <strong>{letter.mascot}</strong></span>
                  </div>
                  <span className="text-slate-400 text-[11px]">{letter.timestamp}</span>
                </div>

                <div className="bg-white/80 border border-slate-100 rounded-2xl p-3.5 text-xs sm:text-sm text-slate-700 italic">
                  "{letter.childMessage}"
                </div>

                <div className="bg-indigo-100/50 border border-indigo-200 rounded-2xl p-4 sm:p-5 flex items-start gap-3.5">
                  {letter.mascot === 'Froggi' ? (
                    <FroggiAvatar size={46} />
                  ) : letter.mascot.toLowerCase().includes('panda') ? (
                    <PanditaAvatar size={46} />
                  ) : letter.mascot.toLowerCase().includes('mono') ? (
                    <MonitoAvatar size={46} />
                  ) : (
                    <CaracolitoAvatar size={46} />
                  )}
                  <div className="space-y-2 flex-1">
                    <span className="text-xs font-black text-indigo-950 block">
                      💌 Respuesta de {letter.mascot}:
                    </span>
                    <p className="text-xs sm:text-sm text-indigo-900 leading-relaxed font-medium">
                      {letter.mascotReply}
                    </p>
                    <div className="bg-white/80 rounded-xl p-3 text-xs text-indigo-950 space-y-1">
                      <span className="font-bold flex items-center gap-1.5 text-indigo-700">
                        <Lightbulb className="w-3.5 h-3.5" />
                        Misión del día:
                      </span>
                      <p className="text-slate-700 font-medium">
                        {letter.activityProposal}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. DRAWING & TRACING CANVAS WITH CUSTOM TEXT STAMP */}
      {/* ========================================================================= */}
      {activeTab === 'drawing' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <Palette className="w-5 h-5 text-emerald-600" />
                <span>Pizarra Creativa de Estimulación Fina & Textos</span>
              </h3>
              <p className="text-xs text-slate-500">
                Dibuja libremente o estampa mensajes positivos para decorar tus obras de arte.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-2xl">
                {['#10b981', '#f43f5e', '#3b82f6', '#f59e0b', '#8b5cf6', '#1e293b'].map((color) => (
                  <button
                    key={color}
                    onClick={() => setBrushColor(color)}
                    className={`w-6 h-6 rounded-full transition-transform cursor-pointer ${
                      brushColor === color ? 'scale-125 ring-2 ring-slate-800' : 'hover:scale-110'
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>

              <button
                onClick={clearCanvas}
                className="flex items-center gap-1 bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                <Eraser className="w-3.5 h-3.5" />
                <span>Limpiar</span>
              </button>

              <button
                onClick={handleDownloadCanvas}
                className="flex items-center gap-1 bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Guardar</span>
              </button>
            </div>
          </div>

          {/* Stamp Text Controls */}
          <div className="bg-emerald-50/60 border border-emerald-200 p-3 rounded-2xl flex flex-col sm:flex-row items-center gap-2 text-xs">
            <span className="font-bold text-emerald-950 whitespace-nowrap">Estampar texto en dibujo:</span>
            <input
              type="text"
              value={stampText}
              onChange={(e) => setStampText(e.target.value)}
              placeholder="Escribe tu texto..."
              className="bg-white border border-emerald-300 rounded-xl px-3 py-1.5 text-xs text-slate-800 flex-1 font-medium focus:outline-none"
            />
            <button
              onClick={handleStampTextOnCanvas}
              className="bg-emerald-700 hover:bg-emerald-800 text-white px-4 py-1.5 rounded-xl font-extrabold cursor-pointer whitespace-nowrap"
            >
              Estampar en Lienzo
            </button>
          </div>

          <div className="relative border-2 border-dashed border-emerald-300 rounded-3xl overflow-hidden bg-emerald-50/20">
            <canvas
              ref={canvasRef}
              width={800}
              height={400}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onTouchStart={startDrawing}
              onTouchMove={draw}
              onTouchEnd={stopDrawing}
              className="w-full h-80 sm:h-96 touch-none cursor-crosshair bg-white"
            />
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. MEMORY GAME */}
      {/* ========================================================================= */}
      {activeTab === 'memory' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <Gamepad2 className="w-5 h-5 text-pink-600" />
                <span>Juego de Memoria & Asociación de Amigos Unidos</span>
              </h3>
              <p className="text-xs text-slate-500">
                Fortalece la memoria de trabajo, atención sostenida y reconocimiento visual.
              </p>
            </div>

            <div className="flex items-center gap-4 text-xs font-bold">
              <span className="text-slate-600">Intentos: <strong className="text-slate-900">{moves}</strong></span>
              <button
                onClick={resetMemoryGame}
                className="flex items-center gap-1 bg-pink-100 hover:bg-pink-200 text-pink-800 px-3 py-1.5 rounded-xl transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reiniciar</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl mx-auto">
            {cards.map((card, idx) => {
              const isFlipped = flipped.includes(idx) || matched.includes(card.mascot);
              return (
                <button
                  key={idx}
                  id={`memory-card-${idx}`}
                  onClick={() => handleCardClick(idx)}
                  className={`h-32 rounded-3xl border-2 transition-all flex flex-col items-center justify-center p-3 cursor-pointer ${
                    isFlipped
                      ? 'bg-emerald-50 border-emerald-400 rotate-0 shadow-sm'
                      : 'bg-gradient-to-br from-emerald-500 to-teal-600 border-emerald-600 text-white shadow-md hover:scale-105'
                  }`}
                >
                  {isFlipped ? (
                    <>
                      {card.mascot === 'froggi' && <FroggiAvatar size={54} />}
                      {card.mascot === 'pandita' && <PanditaAvatar size={54} />}
                      {card.mascot === 'monito' && <MonitoAvatar size={54} />}
                      {card.mascot === 'caracolito' && <CaracolitoAvatar size={54} />}
                      <span className="text-xs font-extrabold text-slate-800 mt-1">{card.name}</span>
                    </>
                  ) : (
                    <div className="text-center">
                      <Sparkles className="w-8 h-8 text-amber-300 mx-auto animate-pulse" />
                      <span className="text-[11px] font-black tracking-wider uppercase mt-1 block">
                        Amigos
                      </span>
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {matched.length === 4 && (
            <div className="bg-emerald-100 border border-emerald-300 rounded-2xl p-4 text-center text-emerald-950 font-bold text-sm">
              🎉 ¡Felicidades! Completaste el juego en {moves} intentos. ¡Excelente estimulación cognitiva!
            </div>
          )}
        </div>
      )}
    </div>
  );
};

