/**
 * Service for local notifications (Notification API) & Pediatric appointment reminders
 */

export type AppointmentType = 'percentiles' | 'pediatric_checkup' | 'vaccination' | 'specialist' | 'medication';

export interface PediatricAppointment {
  id: string;
  childId: string;
  childName: string;
  title: string;
  type: AppointmentType;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  doctorOrCenter?: string;
  notes?: string;
  reminderAdvanceMinutes: number; // 0, 15, 60, 1440 (1 day)
  isCompleted?: boolean;
  notified?: boolean;
  repeatMonthly?: boolean;
  createdAt: string;
}

export type InAppNotificationListener = (notification: {
  id: string;
  title: string;
  body: string;
  type: AppointmentType;
  timestamp: string;
}) => void;

const APPOINTMENTS_STORAGE_KEY = 'amigos_unidos_appointments_v2';
const NOTIFICATION_HISTORY_KEY = 'amigos_unidos_notif_history_v2';

// In-app listeners
const listeners: Set<InAppNotificationListener> = new Set();

export const subscribeToInAppNotifications = (listener: InAppNotificationListener) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

/**
 * Check if the browser supports the Notification API
 */
export const isNotificationSupported = (): boolean => {
  return typeof window !== 'undefined' && 'Notification' in window;
};

/**
 * Get current notification permission state
 */
export const getNotificationPermission = (): NotificationPermission | 'unsupported' => {
  if (!isNotificationSupported()) return 'unsupported';
  try {
    return Notification.permission;
  } catch (e) {
    return 'unsupported';
  }
};

/**
 * Request permission from the user to display notifications
 */
export const requestNotificationPermission = async (): Promise<NotificationPermission | 'unsupported'> => {
  if (!isNotificationSupported()) return 'unsupported';
  try {
    const permission = await Notification.requestPermission();
    return permission;
  } catch (error) {
    console.warn('Error requesting notification permission:', error);
    return 'denied';
  }
};

/**
 * Play a gentle pediatric alert chime using Web Audio API
 */
export const playNotificationChime = () => {
  if (typeof window === 'undefined') return;
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();

    // Pleasant two-tone chime (E5 -> G#5 -> B5)
    const playTone = (freq: number, start: number, duration: number) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + start);

      gain.gain.setValueAtTime(0.001, ctx.currentTime + start);
      gain.gain.exponentialRampToValueAtTime(0.2, ctx.currentTime + start + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + start + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + start);
      osc.stop(ctx.currentTime + start + duration);
    };

    playTone(659.25, 0.0, 0.35); // E5
    playTone(830.61, 0.12, 0.35); // G#5
    playTone(987.77, 0.25, 0.5);  // B5
  } catch (err) {
    // AudioContext might be restricted by browser autoplay policy until user gesture
  }
};

/**
 * Send a notification via Notification API + In-App Fallback + Audio Chime
 */
export const sendLocalNotification = (
  title: string,
  options?: {
    body?: string;
    icon?: string;
    tag?: string;
    type?: AppointmentType;
    data?: any;
  }
): boolean => {
  const body = options?.body || 'Recordatorio pediátrico programado.';
  const type = options?.type || 'pediatric_checkup';
  const tag = options?.tag || `notif-${Date.now()}`;

  // 1. Play audio chime
  playNotificationChime();

  // 2. Broadcast to all active in-app listeners (banners / toasts)
  listeners.forEach(fn => {
    try {
      fn({
        id: tag,
        title,
        body,
        type,
        timestamp: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
      });
    } catch (err) {
      console.error('Error notifying in-app listener:', err);
    }
  });

  // 3. Trigger native Notification if supported and granted
  if (isNotificationSupported()) {
    try {
      if (Notification.permission === 'granted') {
        const notif = new Notification(title, {
          body,
          icon: options?.icon || 'https://images.unsplash.com/photo-1544126592-807ade215a0b?auto=format&fit=crop&w=128&q=80',
          tag,
          data: options?.data
        });

        notif.onclick = () => {
          window.focus();
          notif.close();
        };

        return true;
      }
    } catch (err) {
      console.warn('Native notification failed or blocked by iframe:', err);
    }
  }

  return false;
};

// ==========================================
// PRESET INITIAL APPOINTMENTS FOR FAMILIES
// ==========================================
export const DEFAULT_APPOINTMENTS: PediatricAppointment[] = [
  {
    id: 'apt-percentiles-1',
    childId: 'child-1',
    childName: 'Mateo',
    title: 'Toma Mensual de Percentiles y Curvas OMS',
    type: 'percentiles',
    date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // In 2 days
    time: '10:00',
    doctorOrCenter: 'Monitoreo en Casa (Amigos Unidos)',
    notes: 'Registrar peso y talla en la mañana antes del primer biberón para calibrar curvas OMS.',
    reminderAdvanceMinutes: 60,
    isCompleted: false,
    notified: false,
    repeatMonthly: true,
    createdAt: '2026-08-16'
  },
  {
    id: 'apt-checkup-1',
    childId: 'child-1',
    childName: 'Mateo',
    title: 'Control Pediátrico de los 12 Meses',
    type: 'pediatric_checkup',
    date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // In 5 days
    time: '11:30',
    doctorOrCenter: 'Clínica Pediátrica San Rafael - Dr. Carlos Silva',
    notes: 'Llevar cartilla de vacunación y registro de primeras palabras y marcha.',
    reminderAdvanceMinutes: 1440, // 1 day before
    isCompleted: false,
    notified: false,
    repeatMonthly: false,
    createdAt: '2026-08-16'
  },
  {
    id: 'apt-vaccine-1',
    childId: 'child-1',
    childName: 'Mateo',
    title: 'Vacunación 12 Meses (Triple Viral & Neumococo)',
    type: 'vaccination',
    date: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    time: '09:00',
    doctorOrCenter: 'Centro de Salud Materno Infantil',
    notes: 'Dosis reglamentaria según esquema nacional de vacunación infantil.',
    reminderAdvanceMinutes: 1440,
    isCompleted: false,
    notified: false,
    repeatMonthly: false,
    createdAt: '2026-08-16'
  },
  {
    id: 'apt-percentiles-2',
    childId: 'child-2',
    childName: 'Sofía',
    title: 'Control Antropométrico Trimestral (3.5 años)',
    type: 'percentiles',
    date: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    time: '16:00',
    doctorOrCenter: 'Casa - Báscula y Tallímetro',
    notes: 'Verificar ganancia ponderal y talla frente a curvas de percentil P50.',
    reminderAdvanceMinutes: 60,
    isCompleted: false,
    notified: false,
    repeatMonthly: true,
    createdAt: '2026-08-10'
  }
];

// ==========================================
// LOCAL STORAGE APPOINTMENT MANAGEMENT
// ==========================================
export const loadAppointments = (): PediatricAppointment[] => {
  if (typeof window === 'undefined') return DEFAULT_APPOINTMENTS;
  try {
    const raw = localStorage.getItem(APPOINTMENTS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(APPOINTMENTS_STORAGE_KEY, JSON.stringify(DEFAULT_APPOINTMENTS));
      return DEFAULT_APPOINTMENTS;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error loading appointments:', err);
    return DEFAULT_APPOINTMENTS;
  }
};

export const saveAppointments = (appointments: PediatricAppointment[]): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(APPOINTMENTS_STORAGE_KEY, JSON.stringify(appointments));
  } catch (err) {
    console.error('Error saving appointments:', err);
  }
};

/**
 * Check due appointments and trigger notifications automatically
 */
export const checkDueAppointments = (): { notifiedCount: number } => {
  const list = loadAppointments();
  const now = new Date();
  let updated = false;
  let count = 0;

  const updatedList = list.map(apt => {
    if (apt.isCompleted || apt.notified) return apt;

    // Build target appointment datetime
    const [year, month, day] = apt.date.split('-').map(Number);
    const [hours, minutes] = apt.time.split(':').map(Number);
    const aptTime = new Date(year, month - 1, day, hours, minutes);

    // Calculate reminder time subtracting advance minutes
    const reminderTime = new Date(aptTime.getTime() - apt.reminderAdvanceMinutes * 60 * 1000);

    // If current time is past reminder time and not more than 24 hours overdue
    if (now >= reminderTime && now.getTime() - reminderTime.getTime() < 24 * 60 * 60 * 1000) {
      const typeLabel =
        apt.type === 'percentiles'
          ? '📊 Toma de Percentiles OMS'
          : apt.type === 'vaccination'
          ? '💉 Vacunación Infantil'
          : apt.type === 'specialist'
          ? '🩺 Cita con Especialista'
          : '🩺 Consulta Pediátrica';

      const advanceText =
        apt.reminderAdvanceMinutes === 0
          ? 'es ahora'
          : apt.reminderAdvanceMinutes === 1440
          ? 'es mañana'
          : `es en ${apt.reminderAdvanceMinutes} minutos`;

      sendLocalNotification(`Recordatorio: ${apt.title}`, {
        body: `Para ${apt.childName}. La cita ${advanceText} (${apt.time} hrs en ${apt.doctorOrCenter || 'Centro asignado'}).`,
        type: apt.type,
        tag: apt.id
      });

      count++;
      updated = true;
      return { ...apt, notified: true };
    }

    return apt;
  });

  if (updated) {
    saveAppointments(updatedList);
  }

  return { notifiedCount: count };
};

/**
 * Generate iCalendar (.ics) format file content for export
 */
export const generateICSFile = (apt: PediatricAppointment): string => {
  const [year, month, day] = apt.date.split('-').map(Number);
  const [hours, minutes] = apt.time.split(':').map(Number);

  const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);

  const startStr = `${year}${pad(month)}${pad(day)}T${pad(hours)}${pad(minutes)}00`;
  // Default 45 min duration
  const endHours = hours + (minutes + 45 >= 60 ? 1 : 0);
  const endMinutes = (minutes + 45) % 60;
  const endStr = `${year}${pad(month)}${pad(day)}T${pad(endHours)}${pad(endMinutes)}00`;

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Amigos Unidos//Pediatria IA y Percentiles OMS//ES',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${apt.id}@amigosunidos.app`,
    `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z`,
    `DTSTART:${startStr}`,
    `DTEND:${endStr}`,
    `SUMMARY:${apt.title} - ${apt.childName}`,
    `DESCRIPTION:${apt.notes || 'Recordatorio pediátrico generado por Amigos Unidos.'} Tipo: ${apt.type}.`,
    `LOCATION:${apt.doctorOrCenter || 'Consultorio / Casa'}`,
    'STATUS:CONFIRMED',
    'BEGIN:VALARM',
    `TRIGGER:-PT${apt.reminderAdvanceMinutes || 30}M`,
    'ACTION:DISPLAY',
    `DESCRIPTION:Recordatorio de cita: ${apt.title}`,
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');
};

/**
 * Trigger download of .ics file for Google Calendar, Apple Calendar, Outlook
 */
export const downloadICS = (apt: PediatricAppointment) => {
  const icsData = generateICSFile(apt);
  const blob = new Blob([icsData], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `cita-${apt.childName.toLowerCase()}-${apt.date}.ics`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};
