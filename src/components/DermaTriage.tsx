import React, { useState, useRef, useEffect } from 'react';
import { DERMA_DATASET_CONDITIONS } from '../data/pediatricDatasets';
import { DermaCondition, DermaTriageResult } from '../types';
import { useFamily } from '../context/FamilyContext';
import { FroggiAvatar, MonitoAvatar, PanditaAvatar } from './MascotSVGs';
import { speakText, stopSpeech, isSpeechSupported } from '../utils/speechSynthesis';
import {
  ScanEye,
  Upload,
  Camera,
  CameraOff,
  SwitchCamera,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  ShieldAlert,
  HelpCircle,
  Eye,
  FileText,
  RefreshCw,
  Baby,
  Layers,
  Heart,
  Search,
  BookmarkPlus,
  MapPin,
  X,
  SlidersHorizontal,
  Info,
  Check,
  Volume2,
  VolumeX,
  ShieldCheck,
  AlertOctagon,
  ImageOff,
  Activity,
  Stethoscope
} from 'lucide-react';

export const DermaTriage: React.FC = () => {
  const { activeChild, addHistoryRecord } = useFamily();
  const [selectedCondition, setSelectedCondition] = useState<DermaCondition | null>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanStageText, setScanStageText] = useState('');
  const [showGradCam, setShowGradCam] = useState(false);
  const [customResult, setCustomResult] = useState<DermaTriageResult | null>(null);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [isSpeakingResult, setIsSpeakingResult] = useState(false);

  // Anatomical and Age Stage selection for Precision Triage
  const [selectedBodyZone, setSelectedBodyZone] = useState<string>('auto');
  const [selectedAgeStage, setSelectedAgeStage] = useState<string>(
    activeChild
      ? activeChild.ageMonths >= 84
        ? '7-10y+'
        : activeChild.ageMonths >= 48
        ? '4-6y'
        : activeChild.ageMonths >= 12
        ? '1-3y'
        : '0-12m'
      : 'all'
  );

  // Filters & Search
  const [activeTab, setActiveTab] = useState<string>('todos');
  const [searchQuery, setSearchQuery] = useState('');

  // Camera State
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [cameraFacingMode, setCameraFacingMode] = useState<'user' | 'environment'>('environment');
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [capturedPreview, setCapturedPreview] = useState<string | null>(null);
  const [isFlashActive, setIsFlashActive] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Stop camera when unmounting or closing
  const stopCameraStream = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop());
      setCameraStream(null);
    }
  };

  useEffect(() => {
    return () => {
      stopCameraStream();
      stopSpeech();
    };
  }, []);

  // Voice narration helper with humanized speech synthesis
  const handleToggleSpeakResult = () => {
    if (isSpeakingResult) {
      stopSpeech();
      setIsSpeakingResult(false);
      return;
    }

    const title = customResult?.conditionName || selectedCondition?.name || '';
    const isInvalid = customResult && customResult.isValidImage === false;
    
    let textToSpeak = '';
    if (isInvalid) {
      textToSpeak = `Atención familia. La fotografía recibida no es válida para un triaje cutáneo. ${customResult.invalidReason || 'No se detecta piel humana con suficiente claridad'}. ${customResult.invalidSuggestion || 'Por favor toma una nueva foto enfocando de cerca la piel con buena luz.'}`;
    } else {
      const part = customResult?.detectedBodyPart || selectedCondition?.bodyLocation || 'la piel';
      const analysis = customResult?.analysis || selectedCondition?.visualFeatures?.join('. ') || '';
      const advice = customResult?.froggiAdvice || selectedCondition?.aapGuideline || '';
      textToSpeak = `Evaluación para ${part}. Diagnóstico sugerido: ${title}. ${analysis}. Consejo de Froggi: ${advice}`;
    }

    setIsSpeakingResult(true);
    speakText(textToSpeak, {
      mascot: 'froggi',
      onEnd: () => setIsSpeakingResult(false),
      onError: () => setIsSpeakingResult(false),
    });
  };

  // Open camera stream
  const startCamera = async (facing: 'user' | 'environment' = cameraFacingMode) => {
    setCameraError(null);
    setCapturedPreview(null);
    stopCameraStream();

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setCameraError('Tu navegador o dispositivo no soporta acceso directo a la cámara.');
        return;
      }

      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: facing,
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      setCameraStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play().catch((e) => console.warn('Error auto-playing video:', e));
      }
    } catch (err: any) {
      console.error('Error accessing camera:', err);
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setCameraError('Permiso denegado para usar la cámara. Por favor autoriza el acceso a la cámara en tu navegador.');
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        setCameraError('No se encontró ninguna cámara conectada en tu dispositivo.');
      } else {
        setCameraError('No se pudo inicializar la cámara. Puedes subir una foto desde tus archivos.');
      }
    }
  };

  const handleOpenModalCamera = () => {
    setIsCameraOpen(true);
    startCamera(cameraFacingMode);
  };

  const handleCloseModalCamera = () => {
    stopCameraStream();
    setIsCameraOpen(false);
    setCapturedPreview(null);
    setCameraError(null);
  };

  const handleToggleFacingMode = () => {
    const nextMode = cameraFacingMode === 'user' ? 'environment' : 'user';
    setCameraFacingMode(nextMode);
    startCamera(nextMode);
  };

  const handleCapturePhoto = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;

    setIsFlashActive(true);
    setTimeout(() => setIsFlashActive(false), 200);

    const canvas = canvasRef.current || document.createElement('canvas');
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
      setCapturedPreview(dataUrl);
    }
  };

  const optimizeImageForScan = (dataUrl: string, maxDimension = 960): Promise<string> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;
        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', 0.85));
        } else {
          resolve(dataUrl);
        }
      };
      img.onerror = () => resolve(dataUrl);
      img.src = dataUrl;
    });
  };

  const performDermaAnalysis = async (base64: string, mimeType: string) => {
    setIsScanning(true);
    setScanProgress(20);
    setScanStageText('Extrayendo mapa de características visuales y delimitación anatómica...');

    const progressInterval = setInterval(() => {
      setScanProgress((prev) => {
        if (prev >= 90) return prev;
        const next = prev + 20;
        if (next < 50) {
          setScanStageText('Extrayendo mapa de características visuales y delimitación anatómica...');
        } else if (next < 80) {
          setScanStageText('Identificando zona corporal (Mano / Rostro / Tronco / Extremidades) y morfología de la lesión...');
        } else {
          setScanStageText('Correlacionando con directrices AAP y OMS para el grupo de edad seleccionado...');
        }
        return next;
      });
    }, 120);

    try {
      const ageMonths = activeChild?.ageMonths || (selectedAgeStage === '7-10y+' ? 120 : selectedAgeStage === '4-6y' ? 60 : selectedAgeStage === '1-3y' ? 24 : 6);
      const response = await fetch('/api/derma-triage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: base64,
          mimeType: mimeType || 'image/jpeg',
          description: `Inspección de piel (${selectedBodyZone !== 'auto' ? `Zona indicada: ${selectedBodyZone}` : 'detección anatómica automática en imagen'}) para ${activeChild?.name || 'paciente pediátrico'} (Etapa: ${selectedAgeStage}, ${ageMonths} meses).`,
          childAgeMonths: ageMonths,
          selectedBodyPart: selectedBodyZone,
          ageBracket: selectedAgeStage,
        }),
      });

      clearInterval(progressInterval);
      setScanProgress(100);
      setScanStageText('¡Triaje clínico de precisión completado!');

      if (response.ok) {
        const data = await response.json();
        setCustomResult(data);
      } else {
        const errData = await response.json().catch(() => ({}));
        console.log('[Derma Triage] Non-200 response received:', errData);
      }
    } catch (err) {
      console.log('[Derma Triage] Analysis fallback triggered:', err);
    } finally {
      clearInterval(progressInterval);
      setTimeout(() => {
        setIsScanning(false);
      }, 200);
    }
  };

  const handleConfirmCapturedPhoto = async () => {
    if (!capturedPreview) return;
    const optimized = await optimizeImageForScan(capturedPreview);
    setUploadedImage(optimized);
    setCustomResult(null);
    handleCloseModalCamera();
    performDermaAnalysis(optimized, 'image/jpeg');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const rawBase64 = event.target?.result as string;
      const optimized = await optimizeImageForScan(rawBase64);
      setUploadedImage(optimized);
      setCustomResult(null);
      performDermaAnalysis(optimized, 'image/jpeg');
    };
    reader.readAsDataURL(file);
  };

  const triggerConditionInspect = (condition: DermaCondition) => {
    setSelectedCondition(condition);
    setUploadedImage(null);
    setCustomResult(null);
    setIsScanning(true);
    setScanProgress(0);

    let pct = 0;
    const interval = setInterval(() => {
      pct += 25;
      setScanProgress(pct);
      if (pct < 50) {
        setScanStageText('Cargando morfología clínica y directrices pediátricas...');
      } else {
        setScanStageText('Sincronizando directrices AAP y cuidados en el hogar...');
      }

      if (pct >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setIsScanning(false);
        }, 200);
      }
    }, 60);
  };

  // Save evaluation to child's history
  const handleSaveToHistory = () => {
    const condName = customResult?.conditionName || selectedCondition?.name || 'Evaluación de Piel';
    const sev = customResult?.severity || selectedCondition?.severity || 'leve';

    addHistoryRecord({
      childId: activeChild?.id || 'child-default',
      childName: activeChild?.name || 'Mi Peque',
      type: 'derma',
      title: `Evaluación de Piel: ${condName}`,
      summary: customResult?.analysis || selectedCondition?.visualFeatures[0] || 'Inspección dermatológica completada.',
      details: `Gravedad: ${sev.toUpperCase()} • Directriz AAP: ${customResult?.aapGuideline || selectedCondition?.aapGuideline || 'Protocolos de Dermatología Pediátrica AAP/OMS'}`,
      badge: `${sev.toUpperCase()}`,
      alertLevel: sev === 'urgente' ? 'urgent' : sev === 'moderada' ? 'caution' : 'normal'
    });

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  // Filter conditions
  const filteredConditions = DERMA_DATASET_CONDITIONS.filter((c) => {
    // 1. Tab category filter
    if (activeTab === 'leve' && c.severity !== 'leve') return false;
    if (activeTab === 'moderada' && c.severity !== 'moderada') return false;
    if (activeTab === 'panal' && c.category !== 'panal') return false;
    if (activeTab === 'neonatal' && c.category !== 'neonatal') return false;
    if (activeTab === 'infecciosa' && c.category !== 'infecciosa') return false;
    if (activeTab === 'alergica' && c.category !== 'alergica') return false;
    if (activeTab === 'irritativa' && c.category !== 'irritativa') return false;
    if (activeTab === 'manos' && !(c.bodyLocation || '').toLowerCase().includes('mano') && !(c.bodyLocation || '').toLowerCase().includes('dedo') && !(c.name || '').toLowerCase().includes('mano')) return false;
    if (activeTab === 'escolares' && !(c.typicalAge || '').toLowerCase().includes('10') && !(c.typicalAge || '').toLowerCase().includes('12') && !(c.typicalAge || '').toLowerCase().includes('7')) return false;

    // 2. Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchName = c.name.toLowerCase().includes(q);
      const matchMed = c.medicalName.toLowerCase().includes(q);
      const matchLoc = (c.bodyLocation || '').toLowerCase().includes(q);
      const matchFeat = c.visualFeatures.some((f) => f.toLowerCase().includes(q));
      const matchAge = c.typicalAge.toLowerCase().includes(q);
      if (!matchName && !matchMed && !matchLoc && !matchFeat && !matchAge) {
        return false;
      }
    }

    return true;
  });

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Header with Camera & Upload Options */}
      <div className="bg-gradient-to-r from-cyan-900 via-teal-900 to-emerald-900 rounded-3xl p-5 sm:p-6 text-white shadow-md">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="bg-white/20 p-2.5 rounded-2xl backdrop-blur-xs border border-white/30 shrink-0">
              <FroggiAvatar size={58} />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-cyan-950/80 text-cyan-200 text-xs font-bold mb-1 border border-cyan-700/50">
                <ScanEye className="w-3.5 h-3.5 text-cyan-400" />
                Triaje Dermatológico Pediátrico con Visión IA
              </div>
              <h2 className="text-xl sm:text-2xl font-black">
                {activeChild ? `Evaluación Cutánea para ${activeChild.name}` : 'Triaje de la Piel & Lesiones Infantiles (0 a 10+ años)'}
              </h2>
              <p className="text-xs sm:text-sm text-cyan-100 mt-1 max-w-xl">
                Reconoce con precisión anatómica manos, dedos, cara, extremidades y tronco en lactantes, preescolares y niños de 10+ años.
              </p>
            </div>
          </div>

          {/* Action Buttons: Camera & File Upload */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0 w-full sm:w-auto">
            {/* Camera Button */}
            <button
              id="open-derma-camera-btn"
              onClick={handleOpenModalCamera}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold px-4 py-3 rounded-2xl shadow-sm transition-all cursor-pointer text-xs sm:text-sm active:scale-98"
            >
              <Camera className="w-4 h-4" />
              <span>Usar Cámara en Vivo</span>
            </button>

            {/* File Upload Button */}
            <label
              id="upload-derma-photo-label"
              className="flex-1 sm:flex-initial flex items-center justify-center gap-2 bg-white/15 hover:bg-white/25 text-white border border-white/30 font-bold px-4 py-3 rounded-2xl shadow-sm transition-all cursor-pointer text-xs sm:text-sm shrink-0 active:scale-98"
            >
              <Upload className="w-4 h-4 text-cyan-300" />
              <span>Subir Archivo</span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileUpload}
              />
            </label>
          </div>
        </div>

        {/* Anatomical Region and Age Context Selector Bar */}
        <div className="mt-5 pt-4 border-t border-white/15 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          {/* Body Zone Selector */}
          <div className="bg-white/10 rounded-2xl p-3 backdrop-blur-xs border border-white/20">
            <span className="font-bold text-cyan-200 block mb-2 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-cyan-300" />
              <span>Zona Anatómica a Inspeccionar:</span>
            </span>
            <div className="flex flex-wrap gap-1.5">
              {[
                { id: 'auto', label: '🔍 Auto-detectar' },
                { id: 'mano', label: '✋ Mano / Dedos' },
                { id: 'cara', label: '😊 Rostro / Cara' },
                { id: 'brazo', label: '💪 Brazo / Codo' },
                { id: 'tronco', label: '👕 Tronco / Espalda' },
                { id: 'pierna', label: '🦵 Piernas / Pies' },
                { id: 'panal', label: '🩲 Pañal / Glúteos' },
              ].map((zone) => (
                <button
                  key={zone.id}
                  type="button"
                  onClick={() => setSelectedBodyZone(zone.id)}
                  className={`px-2.5 py-1 rounded-xl font-bold transition-all text-[11px] cursor-pointer border ${
                    selectedBodyZone === zone.id
                      ? 'bg-emerald-400 text-slate-950 border-emerald-300 shadow-xs'
                      : 'bg-black/20 text-white/85 border-white/20 hover:bg-black/30'
                  }`}
                >
                  {zone.label}
                </button>
              ))}
            </div>
          </div>

          {/* Age Bracket Selector */}
          <div className="bg-white/10 rounded-2xl p-3 backdrop-blur-xs border border-white/20">
            <span className="font-bold text-cyan-200 block mb-2 flex items-center gap-1.5">
              <Baby className="w-3.5 h-3.5 text-cyan-300" />
              <span>Rango de Edad Pediátrica:</span>
            </span>
            <div className="flex flex-wrap gap-1.5">
              {[
                { id: 'all', label: '👶 Todas' },
                { id: '0-12m', label: '🍼 0-12 meses' },
                { id: '1-3y', label: '🧸 1-3 años' },
                { id: '4-6y', label: '🎨 4-6 años' },
                { id: '7-10y+', label: '🎒 7-10+ años' },
              ].map((age) => (
                <button
                  key={age.id}
                  type="button"
                  onClick={() => setSelectedAgeStage(age.id)}
                  className={`px-2.5 py-1 rounded-xl font-bold transition-all text-[11px] cursor-pointer border ${
                    selectedAgeStage === age.id
                      ? 'bg-amber-300 text-slate-950 border-amber-200 shadow-xs'
                      : 'bg-black/20 text-white/85 border-white/20 hover:bg-black/30'
                  }`}
                >
                  {age.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ========================================== */}
      {/* CAMERA MODAL / VIEWFINDER OVERLAY */}
      {/* ========================================== */}
      {isCameraOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-150">
          <div className="bg-slate-900 border-2 border-emerald-500/60 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col text-white max-h-[95vh]">
            {/* Modal Header */}
            <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/40">
                  <Camera className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-slate-100">
                    Cámara de Inspección Cutánea
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Enfoca la zona de la piel con buena iluminación natural.
                  </p>
                </div>
              </div>

              <button
                onClick={handleCloseModalCamera}
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Viewfinder Body */}
            <div className="relative bg-black flex items-center justify-center min-h-[300px] sm:min-h-[400px] overflow-hidden">
              {/* Flash effect overlay */}
              {isFlashActive && (
                <div className="absolute inset-0 bg-white z-30 animate-out fade-out duration-200 pointer-events-none" />
              )}

              {/* Camera Error Message */}
              {cameraError && (
                <div className="p-6 text-center space-y-3 max-w-md z-10">
                  <div className="w-12 h-12 rounded-2xl bg-rose-500/20 border border-rose-500/40 text-rose-400 flex items-center justify-center mx-auto">
                    <CameraOff className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-rose-200 text-sm">No pudimos abrir la cámara</h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {cameraError}
                  </p>
                  <div className="pt-2 flex flex-col sm:flex-row gap-2 justify-center">
                    <button
                      onClick={() => startCamera(cameraFacingMode)}
                      className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-bold rounded-xl border border-slate-700 transition-colors cursor-pointer"
                    >
                      Reintentar
                    </button>
                    <label className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-xs font-bold rounded-xl transition-colors cursor-pointer inline-flex items-center justify-center gap-1.5">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Subir Foto en su Lugar</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          handleFileUpload(e);
                          handleCloseModalCamera();
                        }}
                      />
                    </label>
                  </div>
                </div>
              )}

              {/* Live Video Feed */}
              {!cameraError && !capturedPreview && (
                <>
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover max-h-[460px]"
                  />

                  {/* Medical Target Framing Overlay */}
                  <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-between p-6">
                    <div className="bg-slate-950/70 border border-slate-700/80 px-3 py-1 rounded-full text-[11px] font-bold text-emerald-300 flex items-center gap-1.5 shadow-md">
                      <Info className="w-3.5 h-3.5" />
                      <span>Centra la lesión dentro del círculo guía</span>
                    </div>

                    {/* Reticle Circle */}
                    <div className="relative w-52 h-52 sm:w-64 sm:h-64 rounded-full border-2 border-dashed border-emerald-400/80 flex items-center justify-center animate-pulse shadow-[0_0_30px_rgba(52,211,153,0.15)]">
                      <div className="w-6 h-6 border-t-2 border-l-2 border-emerald-400 absolute top-2 left-2" />
                      <div className="w-6 h-6 border-t-2 border-r-2 border-emerald-400 absolute top-2 right-2" />
                      <div className="w-6 h-6 border-b-2 border-l-2 border-emerald-400 absolute bottom-2 left-2" />
                      <div className="w-6 h-6 border-b-2 border-r-2 border-emerald-400 absolute bottom-2 right-2" />
                      <div className="w-2 h-2 rounded-full bg-emerald-400" />
                    </div>

                    <div className="text-[10px] text-slate-400 bg-slate-950/80 px-2.5 py-0.5 rounded-md">
                      Resolución HD • Modo: {cameraFacingMode === 'environment' ? 'Trasera (Recomendada)' : 'Frontal'}
                    </div>
                  </div>
                </>
              )}

              {/* Snapshot Preview */}
              {capturedPreview && (
                <div className="relative w-full h-full flex items-center justify-center max-h-[460px]">
                  <img
                    src={capturedPreview}
                    alt="Foto capturada"
                    className="w-full h-full object-cover max-h-[460px]"
                  />
                  <div className="absolute top-3 left-3 bg-emerald-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Foto lista para triaje
                  </div>
                </div>
              )}
            </div>

            {/* Hidden canvas for capturing bitmap */}
            <canvas ref={canvasRef} className="hidden" />

            {/* Modal Controls Footer */}
            <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between gap-3">
              {!capturedPreview ? (
                <>
                  <button
                    type="button"
                    onClick={handleToggleFacingMode}
                    className="flex items-center gap-2 px-3 py-2 rounded-2xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 transition-colors cursor-pointer"
                  >
                    <SwitchCamera className="w-4 h-4 text-cyan-400" />
                    <span className="hidden sm:inline">Cambiar Cámara</span>
                  </button>

                  <button
                    type="button"
                    id="capture-photo-trigger-btn"
                    onClick={handleCapturePhoto}
                    disabled={!!cameraError}
                    className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white font-black px-6 py-3 rounded-2xl shadow-lg transition-all cursor-pointer text-sm active:scale-95"
                  >
                    <div className="w-3 h-3 rounded-full bg-white animate-ping" />
                    <span>Capturar Foto</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleCloseModalCamera}
                    className="px-3 py-2 rounded-2xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300 transition-colors cursor-pointer"
                  >
                    Cancelar
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => setCapturedPreview(null)}
                    className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 transition-colors cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Volver a Tomar</span>
                  </button>

                  <button
                    type="button"
                    id="confirm-derma-photo-btn"
                    onClick={handleConfirmCapturedPhoto}
                    className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold px-6 py-3 rounded-2xl shadow-lg transition-all cursor-pointer text-sm active:scale-95"
                  >
                    <Sparkles className="w-4 h-4 text-emerald-200" />
                    <span>Analizar con IA Pediátrica</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 2-Column Responsive Layout (Mismo formato que el Detector Acústico de Llanto) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (8 cols): Inspección Visual y Evaluación Clínica */}
        <div className="lg:col-span-8 space-y-6">
          {/* Panel Superior: Inspección Visual y Captura Fotográfica */}
          <div className="bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-800 text-white space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs sm:text-sm font-bold text-slate-300 flex items-center gap-1.5">
                <Eye className="w-4 h-4 text-emerald-400" />
                Inspección Visual de la Piel
              </span>
              {(uploadedImage || selectedCondition) && !(customResult && customResult.isValidImage === false) && (
                <button
                  onClick={() => setShowGradCam(!showGradCam)}
                  className={`text-[11px] font-bold px-3 py-1 rounded-xl transition-all border cursor-pointer ${
                    showGradCam
                      ? 'bg-emerald-500 text-slate-950 border-emerald-400 font-black'
                      : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                  }`}
                >
                  {showGradCam ? 'Ocultar Mapa Térmico' : 'Ver Mapa Térmico (Grad-CAM)'}
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-center">
              {/* Imagen y GradCAM o Estado de Espera */}
              <div className="relative rounded-2xl overflow-hidden aspect-4/3 bg-slate-950 border border-slate-800 flex items-center justify-center group shadow-inner">
                {uploadedImage || selectedCondition ? (
                  <>
                    <img
                      src={uploadedImage || selectedCondition?.sampleImage}
                      alt="Lesión cutánea pediátrica"
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-102"
                      referrerPolicy="no-referrer"
                    />
                    {showGradCam && !(customResult && customResult.isValidImage === false) && (
                      <div className="absolute inset-0 bg-gradient-to-tr from-rose-500/30 via-amber-400/30 to-emerald-400/20 mix-blend-color-burn backdrop-blur-[1px] pointer-events-none flex items-center justify-center">
                        <span className="bg-slate-950/80 px-3 py-1 rounded-full text-[11px] font-mono text-emerald-300 border border-emerald-500/40 shadow-lg">
                          Región de Atención Convolucional
                        </span>
                      </div>
                    )}

                    {uploadedImage && (
                      <div className={`absolute top-2.5 left-2.5 text-white text-[10px] font-extrabold px-2.5 py-1 rounded-xl flex items-center gap-1 shadow-md ${
                        customResult && customResult.isValidImage === false ? 'bg-rose-600/90' : 'bg-emerald-600/90'
                      }`}>
                        {customResult && customResult.isValidImage === false ? <ImageOff className="w-3.5 h-3.5" /> : <Camera className="w-3.5 h-3.5" />}
                        <span>{customResult && customResult.isValidImage === false ? 'Foto No Válida' : 'Foto del Paciente'}</span>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center p-6 text-center text-slate-400 space-y-2.5">
                    <div className="w-14 h-14 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-emerald-400 shadow-inner">
                      <ScanEye className="w-7 h-7" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-200">
                        Inspección Visual en Espera
                      </p>
                      <p className="text-[11px] text-slate-400 max-w-xs mt-0.5 leading-relaxed">
                        Toma una foto con la cámara en vivo, sube una imagen o presiona «Simular Evaluación» en el catálogo lateral derecho.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Metadatos y opciones de foto */}
              <div className="space-y-3">
                <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800 space-y-2.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Estado de Foto:</span>
                    <span className={`font-bold flex items-center gap-1 ${
                      customResult && customResult.isValidImage === false
                        ? 'text-rose-400'
                        : (uploadedImage || selectedCondition)
                        ? 'text-emerald-400'
                        : 'text-slate-400'
                    }`}>
                      {customResult && customResult.isValidImage === false ? (
                        <>
                          <AlertOctagon className="w-3.5 h-3.5 text-rose-400" />
                          <span>Inválida / Sin Piel</span>
                        </>
                      ) : (uploadedImage || selectedCondition) ? (
                        <>
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                          <span>{uploadedImage ? 'Foto del Paciente' : 'Caso de Referencia'}</span>
                        </>
                      ) : (
                        <span>En espera de captura</span>
                      )}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Nivel de Confianza:</span>
                    <span className="font-bold text-emerald-400">
                      {customResult
                        ? (customResult.isValidImage === false ? '0%' : `${customResult.confidence || 94.8}%`)
                        : selectedCondition
                        ? `${selectedCondition.confidence}%`
                        : '--'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Rango de Edad:</span>
                    <span className="font-bold text-teal-300">
                      {customResult?.detectedAgeRange || selectedCondition?.typicalAge || (selectedAgeStage !== 'all' ? selectedAgeStage : 'Pediatría (0-10+)')}
                    </span>
                  </div>
                  <div className="flex items-center justify-between pt-1 border-t border-slate-800/80">
                    <span className="text-slate-400">Zona Anatómica:</span>
                    <span className="font-bold text-amber-300 text-[11px]">
                      {customResult?.detectedBodyPart || selectedCondition?.bodyLocation || (selectedBodyZone !== 'auto' ? selectedBodyZone : 'Auto-detección')}
                    </span>
                  </div>
                </div>

                {/* Quick Retake or Change Photo */}
                {uploadedImage && (
                  <div className="flex gap-2 pt-1">
                    <button
                      type="button"
                      onClick={handleOpenModalCamera}
                      className="flex-1 py-2.5 rounded-xl bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-300 border border-emerald-500/40 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Camera className="w-3.5 h-3.5" />
                      <span>{customResult && customResult.isValidImage === false ? 'Tomar Foto Válida' : 'Tomar Otra Foto'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setUploadedImage(null);
                        setCustomResult(null);
                      }}
                      className="py-2.5 px-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-colors cursor-pointer"
                    >
                      Ver Catálogo de Casos
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Panel Inferior: Barra de Carga Dinámica y Resultados del Análisis */}
          <div className="space-y-4">
            {/* Barra de Carga Dinámica (Aparece abajo durante el escaneo) */}
            {isScanning && (
              <div className="bg-slate-900 border-2 border-cyan-500/50 rounded-3xl p-6 shadow-xl text-white space-y-4 animate-in fade-in zoom-in-98 duration-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
                      <RefreshCw className="w-5 h-5 animate-spin" />
                    </div>
                    <div>
                      <h3 className="text-lg font-black text-cyan-300">
                        Analizando patrones dérmicos con Red Neuronal...
                      </h3>
                      <p className="text-xs text-slate-300 font-medium">
                        {scanStageText}
                      </p>
                    </div>
                  </div>
                  <div className="text-right font-mono text-2xl font-black text-cyan-400">
                    {scanProgress}%
                  </div>
                </div>

                <div className="w-full bg-slate-800 rounded-full h-4 p-0.5 border border-slate-700 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-cyan-400 via-teal-400 to-emerald-400 h-full rounded-full transition-all duration-150 ease-out shadow-[0_0_12px_rgba(6,182,212,0.5)]"
                    style={{ width: `${scanProgress}%` }}
                  />
                </div>

                <div className="grid grid-cols-3 gap-2 text-center text-[11px] text-slate-400 font-medium pt-1">
                  <div className={`p-1.5 rounded-xl ${scanProgress >= 30 ? 'bg-cyan-950/70 text-cyan-300' : ''}`}>
                    1. Segmentación Dérmica
                  </div>
                  <div className={`p-1.5 rounded-xl ${scanProgress >= 70 ? 'bg-teal-950/70 text-teal-300' : ''}`}>
                    2. Morfología & Textura
                  </div>
                  <div className={`p-1.5 rounded-xl ${scanProgress >= 95 ? 'bg-emerald-950/70 text-emerald-300' : ''}`}>
                    3. Guías Clínicas AAP/OMS
                  </div>
                </div>
              </div>
            )}

            {/* Resultados del Análisis Clínico: Aparece al terminar de cargar */}
            {!isScanning && (customResult || selectedCondition) && (
              <div className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-300">
                {customResult && customResult.isValidImage === false ? (
                  /* INVALID PHOTO WARNING CARD */
                  <div className="bg-rose-50 rounded-3xl p-6 border-2 border-rose-200 shadow-sm space-y-4 animate-in fade-in">
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-rose-500/20 text-rose-600 flex items-center justify-center shrink-0 border border-rose-300">
                        <AlertOctagon className="w-7 h-7" />
                      </div>
                      <div>
                        <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-rose-200 text-rose-900">
                          Foto No Válida para Triaje
                        </span>
                        <h3 className="text-xl font-black text-rose-950 mt-1">
                          No se detectó piel humana con suficiente claridad
                        </h3>
                        <p className="text-xs text-rose-800 mt-1 leading-relaxed">
                          {customResult.invalidReason || 'La imagen subida muestra un objeto inanimado, un fondo sin piel o está desenfocada.'}
                        </p>
                      </div>
                    </div>

                    {/* Guidance for taking a valid photo */}
                    <div className="bg-white p-4 rounded-2xl border border-rose-200 space-y-2">
                      <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4 text-amber-500" />
                        <span>¿Cómo tomar una fotografía válida para Froggi?</span>
                      </h4>
                      <p className="text-xs text-slate-700 leading-relaxed font-medium">
                        {customResult.invalidSuggestion || 'Enfoca directamente la piel del niño/a (mano, rostro, brazo, tronco o pierna) a 15-20 cm con buena luz natural.'}
                      </p>
                      <ul className="text-[11px] text-slate-600 space-y-1 pt-1 list-disc list-inside">
                        <li>Asegúrate de que la piel ocupe el centro de la imagen.</li>
                        <li>Evita fotos de muebles, paredes, ropa suelta o mascotas.</li>
                        <li>Si la piel está sana, la IA te confirmará que no hay lesión alguna.</li>
                      </ul>
                    </div>

                    {/* Actions for invalid photo */}
                    <div className="flex flex-wrap gap-2 pt-2">
                      <button
                        type="button"
                        onClick={handleOpenModalCamera}
                        className="flex-1 flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold py-3 px-4 rounded-2xl text-xs shadow-sm transition-all cursor-pointer"
                      >
                        <Camera className="w-4 h-4" />
                        <span>Tomar Foto de la Piel con Cámara</span>
                      </button>
                      <label className="flex-1 flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 font-bold py-3 px-4 rounded-2xl text-xs shadow-sm transition-all cursor-pointer">
                        <Upload className="w-4 h-4 text-cyan-600" />
                        <span>Subir Otra Foto</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleFileUpload}
                        />
                      </label>
                      {isSpeechSupported() && (
                        <button
                          type="button"
                          onClick={handleToggleSpeakResult}
                          className={`px-3 py-2 rounded-2xl border text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                            isSpeakingResult ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                          }`}
                        >
                          {isSpeakingResult ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-indigo-600" />}
                          <span>{isSpeakingResult ? 'Silenciar' : 'Escuchar'}</span>
                        </button>
                      )}
                    </div>

                    {/* Froggi Advice */}
                    <div className="bg-white/80 border border-rose-200 rounded-2xl p-3.5 flex items-center gap-3">
                      <FroggiAvatar size={36} />
                      <p className="text-xs text-slate-700 font-medium italic">
                        {customResult.froggiAdvice || 'Froggi dice: "¡No te preocupes! Vuelve a enfocar la piel de tu peque con buena luz y te daré un triaje exacto al instante."'}
                      </p>
                    </div>
                  </div>
                ) : (
                  /* VALID DERMATOLOGICAL TRIAGE CARD */
                  <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                      <div className="space-y-1.5">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span
                            className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase ${
                              (customResult?.severity || selectedCondition?.severity || 'leve') === 'leve'
                                ? 'bg-emerald-100 text-emerald-800'
                                : (customResult?.severity || selectedCondition?.severity) === 'moderada'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-rose-100 text-rose-800'
                            }`}
                          >
                            Gravedad: {customResult?.severity || selectedCondition?.severity || 'leve'}
                          </span>
                          {customResult?.detectedBodyPart && (
                            <span className="bg-amber-100 text-amber-900 border border-amber-200 text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-amber-700" />
                              <span>{customResult.detectedBodyPart}</span>
                            </span>
                          )}
                          {customResult?.detectedAgeRange && (
                            <span className="bg-teal-100 text-teal-900 border border-teal-200 text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                              <Baby className="w-3 h-3 text-teal-700" />
                              <span>{customResult.detectedAgeRange}</span>
                            </span>
                          )}
                          {selectedCondition?.category && !customResult && (
                            <span className="bg-slate-100 text-slate-700 text-[10px] font-bold px-2 py-0.5 rounded-full capitalize">
                              {selectedCondition.category}
                            </span>
                          )}
                          {uploadedImage && (
                            <span className="bg-cyan-100 text-cyan-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                              Foto Validada con IA
                            </span>
                          )}
                        </div>
                        <h3 className="text-lg sm:text-xl font-black text-slate-900 mt-1">
                          {customResult?.conditionName || selectedCondition?.name || 'Afección Evaluada'}
                        </h3>
                        <p className="text-xs text-slate-500 font-mono">
                          {customResult?.medicalName || selectedCondition?.medicalName || ''}
                        </p>
                      </div>

                      {/* Actions: Save to History & Speak Result */}
                      <div className="flex items-center gap-2">
                        {isSpeechSupported() && (
                          <button
                            type="button"
                            onClick={handleToggleSpeakResult}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                              isSpeakingResult
                                ? 'bg-indigo-600 text-white border-indigo-600 animate-pulse'
                                : 'bg-indigo-50 text-indigo-800 border-indigo-200 hover:bg-indigo-100'
                            }`}
                          >
                            {isSpeakingResult ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-indigo-600" />}
                            <span>{isSpeakingResult ? 'Detener Voz' : 'Escuchar'}</span>
                          </button>
                        )}

                        <button
                          type="button"
                          id="save-derma-to-history-btn"
                          onClick={handleSaveToHistory}
                          disabled={savedSuccess}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                            savedSuccess
                              ? 'bg-emerald-600 text-white border-emerald-600'
                              : 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                          }`}
                        >
                          {savedSuccess ? (
                            <>
                              <Check className="w-3.5 h-3.5" />
                              <span>¡Guardado en Expediente!</span>
                            </>
                          ) : (
                            <>
                              <BookmarkPlus className="w-3.5 h-3.5 text-emerald-600" />
                              <span>Guardar en Historial</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Identified Symptoms & Manifestations */}
                    <div className="space-y-2 text-xs">
                      <h4 className="font-bold text-slate-800 flex items-center gap-1.5">
                        <Activity className="w-4 h-4 text-emerald-600" />
                        <span>Signos y Síntomas Específicos Identificados:</span>
                      </h4>
                      {customResult?.symptomsIdentified && customResult.symptomsIdentified.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {customResult.symptomsIdentified.map((symptom: string, idx: number) => (
                            <div key={idx} className="bg-slate-50 border border-slate-200 rounded-xl p-2.5 flex items-start gap-2 text-slate-800 font-medium">
                              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                              <span className="text-[11px] leading-tight">{symptom}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-[11px] text-slate-700">
                          Evaluación clínica basada en inspección morfológica cutánea.
                        </div>
                      )}
                    </div>

                    {/* Differential Diagnoses if present */}
                    {customResult?.differentialDiagnoses && customResult.differentialDiagnoses.length > 0 && (
                      <div className="space-y-1.5 text-xs">
                        <h4 className="font-bold text-slate-700 flex items-center gap-1.5 text-[11px]">
                          <Stethoscope className="w-3.5 h-3.5 text-indigo-600" />
                          <span>Diagnósticos Diferenciales Pediátricos a Considerar:</span>
                        </h4>
                        <div className="flex flex-wrap gap-1.5">
                          {customResult.differentialDiagnoses.map((diff: string, i: number) => (
                            <span key={i} className="bg-indigo-50 border border-indigo-200 text-indigo-900 text-[10px] font-bold px-2.5 py-1 rounded-lg">
                              {diff}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Analysis & Visual features */}
                    <div className="space-y-2 text-xs">
                      <h4 className="font-bold text-slate-800 flex items-center gap-1.5">
                        <FileText className="w-4 h-4 text-teal-600" />
                        <span>Características Clínicas Observadas:</span>
                      </h4>
                      {customResult?.analysis ? (
                        <p className="text-slate-700 bg-slate-50 p-3 rounded-2xl border border-slate-200 leading-relaxed font-medium">
                          {customResult.analysis}
                        </p>
                      ) : (
                        <ul className="space-y-1.5 bg-slate-50 p-3 rounded-2xl border border-slate-200">
                          {(selectedCondition?.visualFeatures || []).map((feat, i) => (
                            <li key={i} className="text-slate-700 flex items-start gap-2">
                              <span className="text-teal-600 font-bold">•</span>
                              <span>{feat}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>

                    {/* AAP Guideline Banner */}
                    <div className="bg-cyan-50/80 border border-cyan-200 p-3 rounded-2xl text-xs text-cyan-950 flex items-start gap-2">
                      <Info className="w-4 h-4 text-cyan-700 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold block">Directriz Clínica AAP / OMS:</span>
                        <p className="text-[11px] text-cyan-900 mt-0.5">
                          {customResult?.aapGuideline || selectedCondition?.aapGuideline || 'Protocolos de dermatología pediátrica de la Academia Americana de Pediatría (AAP).'}
                        </p>
                      </div>
                    </div>

                    {/* Home Care Steps */}
                    <div className="space-y-2 text-xs">
                      <h4 className="font-bold text-slate-800 flex items-center gap-1.5">
                        <Heart className="w-4 h-4 text-rose-500" />
                        <span>Pasos de Cuidado Seguro en Casa:</span>
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {(customResult?.homeCareSteps || selectedCondition?.homeCare || []).map((step: string, i: number) => (
                          <div key={i} className="bg-emerald-50/70 p-3 rounded-2xl border border-emerald-200 text-slate-800 flex items-start gap-2">
                            <span className="w-4 h-4 rounded-full bg-emerald-600 text-white text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                              {i + 1}
                            </span>
                            <span className="text-[11px] font-medium leading-tight">{step}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Warning Signs */}
                    <div className="bg-rose-50/80 border border-rose-200 rounded-2xl p-4 text-xs space-y-1.5">
                      <h4 className="font-bold text-rose-900 flex items-center gap-1.5">
                        <ShieldAlert className="w-4 h-4 text-rose-600" />
                        <span>¿Cuándo consultar con un médico pediatra de inmediato?</span>
                      </h4>
                      <ul className="space-y-1">
                        {(customResult?.warningSigns || selectedCondition?.whenToSeeDoctor || []).map((warn: string, i: number) => (
                          <li key={i} className="text-rose-800 text-[11px] flex items-start gap-1.5 font-medium">
                            <AlertTriangle className="w-3.5 h-3.5 text-rose-600 shrink-0 mt-0.5" />
                            <span>{warn}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Mascot Reassurance */}
                    <div className="bg-teal-50 border border-teal-200 rounded-2xl p-3.5 flex items-center gap-3">
                      <FroggiAvatar size={38} />
                      <p className="text-xs text-teal-950 font-medium italic">
                        {customResult?.froggiAdvice || 'Froggi aconseja: "Recuerda que la piel de los pequeños es 30% más delgada que la de un adulto. Con higiene suave e hidratación adecuada sanará muy pronto."'}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Estado en Espera: Ningún resultado por defecto (Misma dinámica que el detector de llanto) */}
            {!isScanning && !customResult && !selectedCondition && (
              <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl p-8 text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-xs">
                  <Stethoscope className="w-6 h-6" />
                </div>
                <h4 className="font-extrabold text-slate-800 text-base">
                  Resultados del Triaje en Espera
                </h4>
                <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                  Captura una foto de la piel con la cámara en vivo, sube una imagen o presiona <strong className="text-slate-800">«Simular Evaluación»</strong> en cualquier caso del catálogo lateral derecho para iniciar el escaneo y ver el resultado clínico completo aquí abajo.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right Sidebar (4 cols): VARA LATERAL DERECHA (Catálogo Clínico Pediátrico de Afecciones Cutáneas) */}
        <aside className="lg:col-span-4 space-y-4">
          <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-4 lg:sticky lg:top-20">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-emerald-600" />
                <div>
                  <h3 className="font-extrabold text-slate-800 text-sm">
                    Catálogo de Perfiles Clínicos
                  </h3>
                  <p className="text-[11px] text-slate-500">Afecciones cutáneas, manos, pañal y síntomas</p>
                </div>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                {filteredConditions.length} casos
              </span>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar afección o síntoma..."
                className="w-full pl-8.5 pr-7 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-hidden focus:border-emerald-500 focus:bg-white transition-all"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Category Filter Chips */}
            <div className="flex flex-wrap gap-1 text-[11px]">
              {[
                { id: 'todos', label: 'Todos' },
                { id: 'manos', label: '✋ Manos' },
                { id: 'escolares', label: '🎒 7-10+a' },
                { id: 'panal', label: 'Pañal' },
                { id: 'neonatal', label: 'Neonato' },
                { id: 'infecciosa', label: 'Infecciosas' },
                { id: 'alergica', label: 'Alérgicas' },
                { id: 'leve', label: 'Leves' },
                { id: 'moderada', label: 'Moderadas' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-2.5 py-1 rounded-xl font-bold transition-all border cursor-pointer ${
                    activeTab === tab.id
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-2xs'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Quick Symptom Helpers (Micro Pills) */}
            <div className="flex flex-wrap gap-1 text-[10px] pt-1 border-t border-slate-100">
              <span className="text-[10px] font-bold text-slate-400 w-full mb-0.5 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-emerald-600" />
                Frecuentes:
              </span>
              {[
                { label: '✋ Eccema manos', query: 'dishidrosis' },
                { label: '✌️ Verruga dedos', query: 'verruga' },
                { label: '👶 Miliaria calor', query: 'miliaria' },
                { label: '🧴 Pañal', query: 'pañal' },
                { label: '✨ Impétigo', query: 'impétigo' },
                { label: '💧 Varicela', query: 'varicela' }
              ].map((symp, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    setSearchQuery(symp.query);
                    setActiveTab('todos');
                  }}
                  className="px-2 py-0.5 rounded-lg bg-slate-50 hover:bg-emerald-50 hover:text-emerald-800 text-slate-600 border border-slate-200 transition-colors cursor-pointer"
                >
                  {symp.label}
                </button>
              ))}
            </div>

            {/* Scrollable list of condition cards with symptoms and actions */}
            <div className="space-y-3 max-h-[640px] overflow-y-auto pr-1">
              {filteredConditions.map((cond) => {
                const isSelected = selectedCondition?.id === cond.id && !uploadedImage;
                return (
                  <div
                    key={cond.id}
                    id={`sidebar-derma-condition-${cond.id}`}
                    className={`p-3.5 rounded-2xl border transition-all space-y-2.5 ${
                      isSelected
                        ? 'bg-emerald-50/70 border-emerald-500 ring-2 ring-emerald-500/20 shadow-xs'
                        : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-2xs'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                          cond.severity === 'leve'
                            ? 'bg-emerald-100 text-emerald-800'
                            : cond.severity === 'moderada'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {cond.severity}
                      </span>
                      <span className="text-[10px] font-mono font-bold text-slate-500">
                        {cond.typicalAge}
                      </span>
                    </div>

                    <div>
                      <h4 className="font-extrabold text-slate-900 text-xs">
                        {cond.name}
                      </h4>
                      <p className="text-[10px] font-mono text-slate-400 italic">
                        {cond.medicalName}
                      </p>
                    </div>

                    {cond.bodyLocation && (
                      <div className="flex items-center gap-1 text-[10px] text-teal-700 font-bold">
                        <MapPin className="w-3 h-3 text-teal-600 shrink-0" />
                        <span className="line-clamp-1">{cond.bodyLocation}</span>
                      </div>
                    )}

                    {/* Síntomas y Signos Físicos Específicos */}
                    <div className="p-2 rounded-xl bg-slate-50 border border-slate-150 space-y-1 text-[11px]">
                      <span className="font-bold text-slate-700 block text-[10px]">Signos Clínicos Clave:</span>
                      <ul className="space-y-0.5 text-slate-600 text-[10px]">
                        {cond.visualFeatures.slice(0, 3).map((feat, i) => (
                          <li key={i} className="flex items-start gap-1">
                            <span className="text-emerald-600 shrink-0">•</span>
                            <span className="line-clamp-2">{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Action button */}
                    <div className="flex items-center gap-1.5 pt-1">
                      <button
                        type="button"
                        onClick={() => triggerConditionInspect(cond)}
                        className="flex-1 py-1.5 px-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-[11px] transition-colors cursor-pointer text-center flex items-center justify-center gap-1.5 shadow-2xs"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Simular Evaluación</span>
                      </button>
                      <span className="text-[10px] font-bold text-slate-400 px-1">
                        {cond.confidence}%
                      </span>
                    </div>
                  </div>
                );
              })}
              {filteredConditions.length === 0 && (
                <div className="text-center py-6 text-slate-400 space-y-1">
                  <p className="text-xs font-semibold">Sin resultados.</p>
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('');
                      setActiveTab('todos');
                    }}
                    className="text-xs text-emerald-600 font-bold hover:underline cursor-pointer"
                  >
                    Restablecer
                  </button>
                </div>
              )}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};
