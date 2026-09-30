import { Mascot } from '../types';

export const MASCOTS: Mascot[] = [
  {
    id: 'froggi',
    name: 'Froggi',
    species: 'Ranita Kawaii',
    role: 'Líder & Especialista Pediátrico',
    color: '#4ade80',
    avatarBg: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    description: 'La ranita sabia y empática que traduce directrices médicas complejas de la OMS y AAP a consejos claros para mamás y papás.',
    specialty: 'Pediatría preventiva, triaje médico y directrices OMS/AAP'
  },
  {
    id: 'pandita',
    name: 'Pandita',
    species: 'Osa Panda Dulce',
    role: 'Especialista Socioemocional',
    color: '#f472b6',
    avatarBg: 'bg-pink-100 text-pink-800 border-pink-300',
    description: 'Con su vestidito rosa, guía a las familias en apego seguro, gestión del llanto, contención emocional y berrinches respetuosos.',
    specialty: 'Desarrollo socioemocional UNICEF ECDI2030 y apego seguro'
  },
  {
    id: 'monito',
    name: 'Monito',
    species: 'Mono Curioso',
    role: 'Coach de Motricidad y Juego',
    color: '#60a5fa',
    avatarBg: 'bg-blue-100 text-blue-800 border-blue-300',
    description: 'Con su remerita celeste, lidera juegos de psicomotricidad gruesa y fina, gateo, primeros pasos y destreza deportiva.',
    specialty: 'Hitos motrices y dataset SmartLearn Preschool'
  },
  {
    id: 'caracolito',
    name: 'Caracolito',
    species: 'Caracol Dorado',
    role: 'Guía de Sueño & Ritmos Lentos',
    color: '#fbbf24',
    avatarBg: 'bg-amber-100 text-amber-800 border-amber-300',
    description: 'Enseña que cada bebé crece a su propio ritmo. Experto en rutinas de sueño seguro (AAP), ruido blanco y relajación sensorial.',
    specialty: 'Higiene del sueño infantil y estimulación sensorial'
  }
];
