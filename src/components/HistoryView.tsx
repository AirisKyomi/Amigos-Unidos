import React, { useState } from 'react';
import { useFamily } from '../context/FamilyContext';
import { BaseHistoryRecord, HistoryRecordType } from '../types';
import { FroggiAvatar } from './MascotSVGs';
import {
  History,
  MessageSquareHeart,
  Volume2,
  ScanEye,
  TrendingUp,
  Award,
  Trash2,
  Filter,
  Calendar,
  User,
  Search,
  ChevronRight,
  Sparkles,
  Info,
  Clock,
  ArrowUpDown,
  AlertTriangle,
  CheckCircle2,
  FileText,
  Heart,
  Dna
} from 'lucide-react';

interface HistoryViewProps {
  onNavigateToTab?: (tab: string) => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({ onNavigateToTab }) => {
  const { historyRecords, deleteHistoryRecord, clearHistory, user, activeChild } = useFamily();
  const [selectedType, setSelectedType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedChildFilter, setSelectedChildFilter] = useState<string>('all');
  const [selectedRecord, setSelectedRecord] = useState<BaseHistoryRecord | null>(null);

  const typeConfig: Record<HistoryRecordType, { label: string; icon: any; color: string; bg: string; border: string }> = {
    chat: {
      label: 'Consultas Froggi IA',
      icon: MessageSquareHeart,
      color: 'text-emerald-700',
      bg: 'bg-emerald-50',
      border: 'border-emerald-200'
    },
    cry: {
      label: 'Análisis de Llanto',
      icon: Volume2,
      color: 'text-sky-700',
      bg: 'bg-sky-50',
      border: 'border-sky-200'
    },
    derma: {
      label: 'Triaje de Piel AAP',
      icon: ScanEye,
      color: 'text-amber-700',
      bg: 'bg-amber-50',
      border: 'border-amber-200'
    },
    growth: {
      label: 'Percentiles OMS',
      icon: TrendingUp,
      color: 'text-indigo-700',
      bg: 'bg-indigo-50',
      border: 'border-indigo-200'
    },
    milestones: {
      label: 'Hitos UNICEF',
      icon: Award,
      color: 'text-purple-700',
      bg: 'bg-purple-50',
      border: 'border-purple-200'
    },
    pregnancy: {
      label: 'Embarazo & Maternidad',
      icon: Heart,
      color: 'text-rose-700',
      bg: 'bg-rose-50',
      border: 'border-rose-200'
    },
    genetic: {
      label: 'Optimizador Genético',
      icon: Dna,
      color: 'text-emerald-700',
      bg: 'bg-emerald-50',
      border: 'border-emerald-200'
    },
    appointment: {
      label: 'Citas & Recordatorios',
      icon: Calendar,
      color: 'text-blue-700',
      bg: 'bg-blue-50',
      border: 'border-blue-200'
    }
  };

  const filteredRecords = historyRecords.filter((record) => {
    if (selectedType !== 'all' && record.type !== selectedType) return false;
    if (selectedChildFilter !== 'all' && record.childName !== selectedChildFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = record.title.toLowerCase().includes(q);
      const matchSummary = record.summary.toLowerCase().includes(q);
      const matchChild = record.childName.toLowerCase().includes(q);
      return matchTitle || matchSummary || matchChild;
    }
    return true;
  });

  const childrenNames = Array.from(new Set(historyRecords.map((r) => r.childName).filter(Boolean)));

  return (
    <div className="max-w-6xl mx-auto px-3 sm:px-4 py-4 sm:py-6 space-y-6">
      {/* Top Banner Header */}
      <div className="bg-gradient-to-r from-emerald-700 via-teal-700 to-cyan-800 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-xs shrink-0">
              <History className="w-8 h-8 sm:w-10 sm:h-10 text-emerald-100" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-900/60 text-emerald-200 text-xs font-bold uppercase tracking-wider mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                Expediente Pediátrico Continuo
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
                Historial de Evaluaciones & Consultas
              </h1>
              <p className="text-emerald-100 text-xs sm:text-sm font-medium mt-1 max-w-2xl">
                Revisa todas las dudas resueltas por Froggi, diagnósticos diferenciales de llanto acústico, curvas de percentiles OMS, triajes dermatológicos y evaluaciones de desarrollo.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto">
            {historyRecords.length > 0 && (
              <button
                id="clear-all-history-btn"
                onClick={() => {
                  if (window.confirm('¿Deseas limpiar todos los registros del historial?')) {
                    clearHistory();
                  }
                }}
                className="flex items-center gap-2 bg-white/15 hover:bg-white/25 text-white px-4 py-2.5 rounded-2xl text-xs font-bold transition-all border border-white/20 cursor-pointer"
              >
                <Trash2 className="w-4 h-4 text-rose-300" />
                <span>Vaciar Historial</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/80 shadow-xs space-y-4">
        {/* Module Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          <button
            id="filter-type-all"
            onClick={() => setSelectedType('all')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              selectedType === 'all'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Todos los Registros ({historyRecords.length})
          </button>
          {(Object.keys(typeConfig) as HistoryRecordType[]).map((typeKey) => {
            const cfg = typeConfig[typeKey];
            const Icon = cfg.icon;
            const count = historyRecords.filter((r) => r.type === typeKey).length;
            const isActive = selectedType === typeKey;
            return (
              <button
                key={typeKey}
                id={`filter-type-${typeKey}`}
                onClick={() => setSelectedType(typeKey)}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-slate-50 text-slate-700 border border-slate-200/80 hover:bg-slate-100'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{cfg.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    isActive ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search input & Child Selector */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-100">
          <div className="sm:col-span-2 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              id="history-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por pregunta, diagnóstico, síntomas o palabras clave..."
              className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="relative">
            <select
              id="history-child-filter-select"
              value={selectedChildFilter}
              onChange={(e) => setSelectedChildFilter(e.target.value)}
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 cursor-pointer"
            >
              <option value="all">Todos los Hijos</option>
              {childrenNames.map((name) => (
                <option key={name} value={name}>
                  👶 {name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Record List */}
      {filteredRecords.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-xs space-y-4">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400">
            <History className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-800">No hay registros con este filtro</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
              Las consultas realizadas en Froggi IA, los análisis de llanto del bebé y las evaluaciones pediátricas se guardarán automáticamente aquí.
            </p>
          </div>
          {onNavigateToTab && (
            <button
              onClick={() => onNavigateToTab('chat')}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-xs transition-colors cursor-pointer"
            >
              Realizar una Consulta a Froggi
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredRecords.map((record) => {
            const cfg = typeConfig[record.type] || typeConfig.chat;
            const Icon = cfg.icon;
            return (
              <div
                key={record.id}
                id={`history-item-${record.id}`}
                className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 hover:border-emerald-300 shadow-xs hover:shadow-md transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group"
              >
                <div className="flex items-start gap-3.5 flex-1 min-w-0">
                  <div className={`p-3 rounded-2xl shrink-0 ${cfg.bg} ${cfg.border} border`}>
                    <Icon className={`w-5 h-5 ${cfg.color}`} />
                  </div>

                  <div className="space-y-1 min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${cfg.bg} ${cfg.color} border ${cfg.border}`}>
                        {cfg.label}
                      </span>
                      {record.childName && (
                        <span className="text-[11px] font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md flex items-center gap-1">
                          <User className="w-3 h-3 text-slate-500" />
                          {record.childName}
                        </span>
                      )}
                      <span className="text-[11px] text-slate-400 flex items-center gap-1 ml-auto sm:ml-0">
                        <Clock className="w-3 h-3" />
                        {record.timestamp}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-slate-900 leading-snug truncate">
                      {record.title}
                    </h4>
                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {record.summary}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center shrink-0 w-full sm:w-auto justify-end pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                  <button
                    id={`view-detail-btn-${record.id}`}
                    onClick={() => setSelectedRecord(record)}
                    className="flex items-center gap-1 bg-slate-50 hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 border border-slate-200 hover:border-emerald-300 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer"
                  >
                    <span>Ver Detalles</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    id={`delete-history-btn-${record.id}`}
                    onClick={() => deleteHistoryRecord(record.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                    title="Eliminar este registro"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Detail Modal */}
      {selectedRecord && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 my-auto">
            {/* Header */}
            <div className="bg-gradient-to-r from-emerald-700 to-teal-800 text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-2xl">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-200 block">
                    Detalle del Registro Histórico
                  </span>
                  <h3 className="text-base font-black truncate max-w-xs sm:max-w-sm">
                    {selectedRecord.title}
                  </h3>
                </div>
              </div>
              <button
                onClick={() => setSelectedRecord(null)}
                className="text-white/80 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4 text-xs text-slate-700 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Hijo Evaluado</span>
                  <span className="font-bold text-slate-800 text-xs">👶 {selectedRecord.childName || 'Mi Peque'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Fecha & Hora</span>
                  <span className="font-bold text-slate-800 text-xs">🕒 {selectedRecord.timestamp}</span>
                </div>
              </div>

              <div>
                <span className="text-slate-500 font-bold uppercase text-[10px] block mb-1">
                  Resumen Pediátrico
                </span>
                <div className="p-3.5 bg-emerald-50/70 border border-emerald-200 rounded-2xl text-slate-800 leading-relaxed text-xs">
                  {selectedRecord.summary}
                </div>
              </div>

              {selectedRecord.details && (
                <div>
                  <span className="text-slate-500 font-bold uppercase text-[10px] block mb-1">
                    Parámetros Clínicos Registrados
                  </span>
                  <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-2">
                    {Object.entries(selectedRecord.details).map(([key, val]) => (
                      <div key={key} className="flex justify-between items-center py-1 border-b border-slate-200/60 last:border-0 text-xs">
                        <span className="text-slate-500 font-medium capitalize">{key.replace(/([A-Z])/g, ' $1')}:</span>
                        <span className="font-bold text-slate-900">{typeof val === 'object' ? JSON.stringify(val) : String(val)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="bg-slate-50 px-6 py-4 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setSelectedRecord(null)}
                className="bg-slate-900 hover:bg-slate-800 text-white px-5 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
