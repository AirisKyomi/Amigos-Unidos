import React, { useState } from 'react';
import { FroggiAvatar, PanditaAvatar, MonitoAvatar, CaracolitoAvatar } from './MascotSVGs';
import confetti from 'canvas-confetti';
import {
  Check,
  Sparkles,
  CreditCard,
  ShieldCheck,
  HelpCircle,
  Zap,
  Heart
} from 'lucide-react';

export const PricingPlans: React.FC = () => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [selectedPlanModal, setSelectedPlanModal] = useState<string | null>(null);

  const handleSelectPlan = (planName: string) => {
    setSelectedPlanModal(planName);
    confetti({
      particleCount: 60,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  const plans = [
    {
      id: 'free',
      name: 'Plan Semillita',
      subtitle: 'Ideal para conocer la plataforma y primeros cuidados',
      price: 'Gratis',
      period: 'Para Siempre (Prototipo)',
      mascot: 'caracolito',
      color: 'border-slate-200 bg-white text-slate-900',
      badge: 'Acceso Gratuito',
      badgeBg: 'bg-slate-100 text-slate-700',
      btnText: 'Plan Activo Actual',
      btnClass: 'bg-slate-100 text-slate-600 cursor-default',
      features: [
        'Consultas pediátricas con Froggi (Transformer base)',
        'Calculadora de percentiles OMS (LMS Z-scores)',
        '3 análisis acústicos de llanto diarios (Infant Cry Corpus)',
        'Acceso al explorador de hitos UNICEF ECDI2030',
        'Pizarra de dibujo y música relajante básica'
      ]
    },
    {
      id: 'growth',
      name: 'Plan Crecimiento Froggi',
      subtitle: 'El favorito de las familias primerizas',
      price: billingCycle === 'monthly' ? '$8.99' : '$6.99',
      period: billingCycle === 'monthly' ? '/ mes' : '/ mes (facturado anual)',
      mascot: 'froggi',
      color: 'border-emerald-400 bg-emerald-50/50 text-emerald-950 shadow-md ring-2 ring-emerald-500/30',
      badge: 'Más Recomendado',
      badgeBg: 'bg-emerald-600 text-white',
      btnText: 'Comenzar Prueba de 7 Días',
      btnClass: 'bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer shadow-sm',
      features: [
        'Consultas ilimitadas 24/7 con Froggi IA Pediátrica',
        'Triaje dermatológico visual ilimitado (CNN AAP 52k dataset)',
        'Detector de llanto infantil en tiempo real sin límites',
        'Historial clínico y curvas de crecimiento multi-etapa (0-10+ años)',
        'Reportes pediátricos exportables para el médico de cabecera',
        'Acceso completo a la Zona Recreativa con los 4 Amigos'
      ]
    },
    {
      id: 'family',
      name: 'Plan Familia Amigos Unidos Plus',
      subtitle: 'Para hogares con más de un peque y máxima personalización',
      price: billingCycle === 'monthly' ? '$14.99' : '$11.99',
      period: billingCycle === 'monthly' ? '/ mes' : '/ mes (facturado anual)',
      mascot: 'pandita',
      color: 'border-pink-300 bg-white text-slate-900 shadow-xs',
      badge: 'Hasta 4 Niños',
      badgeBg: 'bg-pink-100 text-pink-800',
      btnText: 'Elegir Plan Familiar',
      btnClass: 'bg-pink-600 hover:bg-pink-700 text-white cursor-pointer shadow-sm',
      features: [
        'Todo lo incluido en el Plan Crecimiento',
        'Perfiles individuales para hasta 4 hermanos (0 a 10+ años)',
        'Acceso prioritario a las 15,400+ actividades de SmartLearn',
        'Planes de estimulación socioemocional y apego con Pandita',
        'Alertas de hitos evolutivos por email o calendario',
        'Soporte prioritario y nuevas funciones en vista previa'
      ]
    }
  ];

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 space-y-8">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-extrabold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Planes de Pago Transparentes & Flexibles</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Acompaña cada etapa de tu peque con el respaldo de la IA Pediátrica
        </h2>
        <p className="text-xs sm:text-sm text-slate-600">
          Elige el plan ideal para tu familia. Cancela o cambia de plan en cualquier momento con 1 solo clic.
        </p>

        {/* Billing Toggle */}
        <div className="flex items-center justify-center gap-3 pt-2">
          <span className={`text-xs font-bold ${billingCycle === 'monthly' ? 'text-slate-900' : 'text-slate-500'}`}>
            Pago Mensual
          </span>
          <button
            id="billing-cycle-toggle-btn"
            onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
            className="w-12 h-6 rounded-full bg-emerald-600 p-0.5 transition-colors cursor-pointer relative"
          >
            <div
              className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform ${
                billingCycle === 'yearly' ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
          <div className="flex items-center gap-1.5">
            <span className={`text-xs font-bold ${billingCycle === 'yearly' ? 'text-slate-900' : 'text-slate-500'}`}>
              Pago Anual
            </span>
            <span className="text-[10px] font-black bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
              Ahorra 25%
            </span>
          </div>
        </div>
      </div>

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`rounded-3xl p-6 border flex flex-col justify-between transition-all ${plan.color}`}
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider ${plan.badgeBg}`}>
                  {plan.badge}
                </span>

                {plan.mascot === 'froggi' && <FroggiAvatar size={36} />}
                {plan.mascot === 'pandita' && <PanditaAvatar size={36} />}
                {plan.mascot === 'caracolito' && <CaracolitoAvatar size={36} />}
              </div>

              <div>
                <h3 className="text-lg font-black">{plan.name}</h3>
                <p className="text-xs opacity-75 mt-0.5">{plan.subtitle}</p>
              </div>

              <div className="flex items-baseline gap-1 pt-2 pb-3 border-b border-slate-200/60">
                <span className="text-3xl font-black">{plan.price}</span>
                <span className="text-xs opacity-75">{plan.period}</span>
              </div>

              <div className="space-y-2.5">
                <span className="text-xs font-extrabold uppercase tracking-wide opacity-80 block">
                  Lo que incluye:
                </span>
                <ul className="space-y-2">
                  {plan.features.map((feat, i) => (
                    <li key={i} className="text-xs flex items-start gap-2 leading-snug">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="pt-6 mt-4 border-t border-slate-200/40">
              <button
                id={`btn-plan-${plan.id}`}
                onClick={() => handleSelectPlan(plan.name)}
                className={`w-full py-3 rounded-2xl font-bold text-xs transition-all ${plan.btnClass}`}
              >
                {plan.btnText}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Safety & Guarantee */}
      <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <ShieldCheck className="w-8 h-8 text-emerald-600 shrink-0" />
          <div className="text-xs">
            <h4 className="font-extrabold text-slate-800 text-sm">Garantía Médica & Privacidad Absoluta</h4>
            <p className="text-slate-600 mt-0.5">
              Tus datos de salud y consultas son 100% privados y encriptados, nunca compartidos con terceros ni aseguradoras.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-bold text-slate-600 bg-white px-3 py-2 rounded-xl border border-slate-200 shrink-0">
          <CreditCard className="w-4 h-4 text-emerald-600" />
          <span>Pagos Seguros SSL</span>
        </div>
      </div>

      {/* Checkout Simulation Modal */}
      {selectedPlanModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-emerald-200 text-center space-y-4 animate-in fade-in zoom-in">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
              <FroggiAvatar size={50} />
            </div>

            <h3 className="text-lg font-black text-slate-900">
              ¡Bienvenido a {selectedPlanModal}! 🐸
            </h3>

            <p className="text-xs text-slate-600 leading-relaxed">
              Has seleccionado el plan para acompañar a tu peque. En este entorno de prototipo, todas las funciones de IA médica, análisis acústico de llanto y percentiles OMS están <strong>100% desbloqueadas y activas</strong> para ti.
            </p>

            <button
              onClick={() => setSelectedPlanModal(null)}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-2xl text-xs transition-colors cursor-pointer"
            >
              ¡Comenzar a Usar Amigos Unidos!
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
