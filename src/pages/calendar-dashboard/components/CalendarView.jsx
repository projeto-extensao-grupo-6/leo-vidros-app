import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import {
  format,
  addDays,
  startOfWeek,
  endOfWeek,
  isSameDay,
  isToday,
  startOfMonth,
  endOfMonth,
  addMonths,
  isSameMonth,
  eachDayOfInterval,
  parseISO,
} from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Clock,
  MapPin,
  FileText,
  Users,
  Loader2,
  AlertTriangle,
  Calendar as CalendarIcon,
} from "lucide-react";
import agendamentosService from "../../../services/agendamentosService";

// ------------------------------------------------------------------
// Delete Confirmation Modal
// ------------------------------------------------------------------
const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, isDeleting }) => {
  if (!isOpen) return null;
  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-100"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-red-100 rounded-full shrink-0">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">Excluir Agendamento?</h3>
          </div>
          <p className="text-gray-600 mb-6 leading-relaxed">
            Esta ação é irreversível e removerá o agendamento permanentemente.
          </p>
          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              disabled={isDeleting}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              onClick={onConfirm}
              disabled={isDeleting}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 flex items-center gap-2 disabled:opacity-70"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Excluindo...
                </>
              ) : (
                "Sim, excluir"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ------------------------------------------------------------------
// Event Details Modal
// ------------------------------------------------------------------
const EventDetailsModal = ({ initialEvent, onClose, onGeoLocationClick, onEventDeleted }) => {
  const [details, setDetails] = useState(initialEvent);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  useEffect(() => {
    const fetchDetails = async () => {
      if (!initialEvent?.id) return;
      setLoading(true);
      try {
        const res = await fetch(`http://localhost:3000/api/agendamentos/${initialEvent.id}`);
        if (res.ok) {
          const data = await res.json();
          // Preserve funcionários caso a API não retorne
            const merged = {
            ...initialEvent,
            ...data,
            funcionarios: data.funcionarios?.length
              ? data.funcionarios
              : initialEvent.funcionarios || [],
          };
          setDetails(merged);
        } else {
          setDetails(initialEvent);
        }
      } catch {
        setDetails(initialEvent);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [initialEvent]);

  const handleDeleteClick = () => setIsDeleteModalOpen(true);

  const handleConfirmDelete = async () => {
    setDeleting(true);
    try {
      await agendamentosService.delete(details.id);
      onEventDeleted?.(details.id);
      setIsDeleteModalOpen(false);
      onClose?.();
    } catch (e) {
      setError("Erro ao deletar. Tente novamente.");
    } finally {
      setDeleting(false);
    }
  };

  if (!details) return null;

  const getBadgeColor = (type) => {
    const v = type?.value || type;
    if (v === "SERVICO") return "bg-blue-50 text-blue-700 border-blue-200";
    if (v === "ORCAMENTO") return "bg-amber-50 text-amber-700 border-amber-200";
    return "bg-gray-50 text-gray-700 border-gray-200";
  };

  const formatAddress = (end) => {
    if (!end) return "Endereço não informado";
    return `${end.rua || ""}${end.numero ? ", " + end.numero : ""}${
      end.complemento ? " - " + end.complemento : ""
    } - ${end.bairro || ""}, ${end.cidade || ""}/${end.uf || ""}`;
  };

  const getPedidoLabel = (pedido) => {
    if (!pedido) return "Nenhum pedido vinculado";
    if (pedido.label) return pedido.label;
    if (pedido.descricao) return pedido.descricao;
    if (pedido.nome) return pedido.nome;
    if (pedido.id) return `Pedido #${pedido.id}`;
    return String(pedido);
  };

  return (
    <>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
        onClick={onClose}
      >
        <div
          className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh] border border-gray-200"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
            <div className="relative bg-white px-8 py-6 border-b border-gray-100">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full p-2 transition"
            >
              <X size={20} />
            </button>
            <div className="pr-10">
              <p className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">
                Agendamento
              </p>
              <h2 className="text-2xl font-bold text-gray-900">
                {details.title || "Sem título"}
              </h2>
              <div className="flex flex-wrap gap-2 mt-4">
                <span
                  className={`text-xs font-semibold px-3 py-1.5 rounded-full border ${getBadgeColor(
                    details.tipoAgendamento
                  )}`}
                >
                  {details.tipoAgendamento?.label ||
                    details.tipoAgendamento ||
                    "Agendamento"}
                </span>
                {details.statusAgendamento && (
                  <span className="text-xs font-semibold px-3 py-1.5 rounded-full border bg-green-50 text-green-700 border-green-200">
                    ✓ {details.statusAgendamento.nome || details.statusAgendamento}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="p-8 space-y-6 overflow-y-auto">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-16">
                <Loader2 size={40} className="animate-spin mb-3 text-gray-400" />
                <span className="text-gray-500 text-sm font-medium">Carregando...</span>
              </div>
            ) : (
              <>
                {error && (
                  <div className="p-4 bg-red-50 text-red-700 border border-red-100 rounded-lg text-sm font-medium flex items-center gap-2">
                    <AlertTriangle size={16} />
                    {error}
                  </div>
                )}

                <div className="grid grid-cols-2 gap-8 w-full">
                  <div className="space-y-1">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Data
                    </p>
                    <p className="text-base font-semibold text-gray-900">
                      {details.date
                        ? format(
                            parseISO(
                              details.date.includes("T")
                                ? details.date
                                : `${details.date}T00:00:00`
                            ),
                            "dd 'de' MMMM 'de' yyyy",
                            { locale: ptBR }
                          )
                        : "-"}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Horário
                    </p>
                    <p className="text-base font-semibold text-gray-900">
                      {details.startTime} - {details.endTime}
                    </p>
                  </div>
                </div>

                <div className="border-t border-gray-100"></div>

                <div className="space-y-1">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                    <FileText size={14} />
                    Pedido Vinculado
                  </p>
                  <p className="text-base font-medium text-gray-900">
                    {getPedidoLabel(details.pedido)}
                  </p>
                </div>

                <div className="space-y-1">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                    <MapPin size={14} />
                    Localização
                  </p>
                  <p className="text-sm font-medium text-gray-900 leading-relaxed">
                    {details.endereco
                      ? formatAddress(details.endereco)
                      : "Endereço não disponível"}
                  </p>
                  {details.endereco?.cep && (
                    <p className="text-xs text-gray-500 mt-2.5">
                      CEP: {details.endereco.cep}
                    </p>
                  )}
                </div>

                <div className="space-y-2.5">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                    <Users size={14} />
                    Equipe Responsável
                  </p>
                  {details.funcionarios && details.funcionarios.length > 0 ? (
                    <div className="flex flex-wrap gap-2.5">
                      {details.funcionarios.map((func, idx) => {
                        const nome = func.label || func.nome || func;
                        return (
                          <div
                            key={idx}
                            className="inline-flex items-center gap-2.5 bg-gray-50 border border-gray-200 rounded-full px-3.5 py-1.5 text-sm font-medium text-gray-700"
                          >
                            <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center text-xs font-bold text-blue-700">
                              {String(nome).charAt(0).toUpperCase()}
                            </div>
                            <span className="truncate">{nome}</span>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">Nenhum funcionário atribuído</p>
                  )}
                </div>

                {details.observacao && (
                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Observações
                    </p>
                    <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap bg-gray-50 p-3.5 rounded-lg border border-gray-100">
                      {details.observacao}
                    </p>
                  </div>
                )}
              </>
            )}
          </div>

          <div className="p-6 bg-gray-50 border-t border-gray-100 flex gap-3">
            <button
              onClick={handleDeleteClick}
              disabled={loading || deleting}
              className="px-5 py-2.5 rounded-lg font-medium text-red-600 hover:bg-red-50 border border-red-200 hover:border-red-300 text-sm disabled:opacity-50"
            >
              Excluir
            </button>
            <button
              onClick={() => onGeoLocationClick?.(details.endereco)}
              disabled={!details.endereco || loading}
              className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2.5 px-4 rounded-lg font-medium text-sm disabled:bg-gray-300"
            >
              <MapPin size={16} />
              Ver no Mapa
            </button>
          </div>
        </div>
      </div>

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        isDeleting={deleting}
      />
    </>
  );
};

// ------------------------------------------------------------------
// Month View
// ------------------------------------------------------------------
const MonthView = ({ currentMonth, events, onDateClick, onEventClick }) => {
  const start = startOfWeek(startOfMonth(currentMonth), { weekStartsOn: 0 });
  const end = startOfWeek(addDays(endOfMonth(currentMonth), 6), { weekStartsOn: 0 });
  const days = eachDayOfInterval({ start, end });

  const eventsByDate = useMemo(() => {
    const map = {};
    events?.forEach((e) => {
      const d =
        e.eventDate ||
        e.dataAgendamento ||
        e.date ||
        (e.start && format(parseISO(e.start), "yyyy-MM-dd"));
      if (!d) return;
      map[d] = map[d] || [];
      map[d].push(e);
    });
    return map;
  }, [events]);

  const weekDaysNames = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

  return (
    <div className="flex-1 flex flex-col">
      <div className="grid grid-cols-7 bg-white border-b border-gray-200">
        {weekDaysNames.map((w) => (
          <div
            key={w}
            className="py-3 text-center text-xs font-bold text-gray-400 uppercase tracking-widest"
          >
            {w}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 flex-1 auto-rows-fr gap-px bg-gray-200 overflow-y-auto">
        {days.map((day) => {
          const dateKey = format(day, "yyyy-MM-dd");
          const dayEvents = eventsByDate[dateKey] || [];
          const isCurrent = isSameMonth(day, currentMonth);
          const isCurrentToday = isToday(day);
          return (
            <div
              key={dateKey}
              className={`bg-white relative flex flex-col p-2 min-h-[120px] group transition-colors hover:bg-gray-50 border border-gray-200 ${
                !isCurrent ? "opacity-60" : ""
              }`}
              onClick={() => onDateClick?.(day)}
            >
              <div className="flex justify-between items-start mb-2">
                <span
                  className={`text-sm font-semibold w-8 h-8 flex items-center justify-center rounded-lg ${
                    isCurrentToday
                      ? "bg-blue-600 text-white shadow-md"
                      : "text-gray-700"
                  }`}
                >
                  {format(day, "d")}
                </span>
                <button
                  className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full p-1.5 transition"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDateClick?.(day);
                  }}
                >
                  <Plus size={16} />
                </button>
              </div>
              <div className="flex-1 space-y-1.5 overflow-hidden">
                {dayEvents.slice(0, 3).map((evt) => (
                  <div
                    key={evt.id}
                    className="text-xs px-2 py-1 rounded-md truncate cursor-pointer hover:opacity-90 transition border-l-4 shadow-sm hover:shadow-md"
                    style={{
                      backgroundColor: `${evt.backgroundColor || "#3b82f6"}15`,
                      borderLeftColor: evt.backgroundColor || "#3b82f6",
                      color: "#1f2937",
                    }}
                    title={evt.title}
                    onClick={(e) => {
                      e.stopPropagation();
                      onEventClick?.(evt);
                    }}
                  >
                    <span className="font-bold mr-1.5 opacity-75">{evt.startTime}</span>
                    <span className="font-medium">{evt.title}</span>
                  </div>
                ))}
                {dayEvents.length > 3 && (
                  <div className="text-[10px] text-gray-500 font-semibold pl-2">
                    + {dayEvents.length - 3} mais
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ------------------------------------------------------------------
// Week View (simplificado)
// ------------------------------------------------------------------
const WeekView = ({ currentDate, events, timeSlots, onTimeSlotClick, onDayNavigate }) => {
  const containerRef = useRef(null);
  const start = startOfWeek(currentDate, { weekStartsOn: 0 });
  const weekDays = Array.from({ length: 7 }).map((_, i) => addDays(start, i));

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const now = new Date();
    const h = now.getHours();
    const m = now.getMinutes();
    const minutesFromStart = (h - 6) * 60 + m;
    const slotIndex = Math.max(0, Math.floor(minutesFromStart / 30) - 2);
    el.scrollTop = slotIndex * 28;
  }, [currentDate]);

  const eventsByDate = useMemo(() => {
    const m = {};
    events.forEach((e) => {
      const k = getEventDateKey(e);
      if (!k) return;
      m[k] = m[k] || [];
      m[k].push(e);
    });
    return m;
  }, [events]);

  const dayLayouts = useMemo(() => {
    const map = {};
    weekDays.forEach((day) => {
      const key = normalizeDate(day);
      const list = eventsByDate[key] || [];
      map[key] = layoutOverlappingEvents(list);
    });
    return map;
  }, [weekDays, eventsByDate]);

  return (
    <div className="flex flex-col h-full overflow-hidden border border-hairline rounded-modern">
      <div className="grid grid-cols-8 bg-muted border-b border-hairline rounded-t-modern">
        <div className="p-2 text-center text-xs font-semibold text-text-secondary">Horário</div>
        {weekDays.map((d) => (
          <div
            key={d.toISOString()}
            className={`p-2 text-center border-l border-hairline ${
              isToday(d) ? "bg-primary/10" : ""
            }`}
          >
            <div className="text-[11px] font-medium text-text-secondary">
              {format(d, "EEE", { locale: ptBR })}
            </div>
            <div
              className={`text-sm font-semibold mt-1 ${
                isToday(d) ? "text-primary" : "text-text-primary"
              }`}
            >
              {format(d, "d")}
            </div>
          </div>
        ))}
      </div>

      <div ref={containerRef} className="flex-1 overflow-y-auto border-t border-hairline relative">
        <NowLine startHour={6} endHour={20} slotHeight={28} />
        <div className="grid grid-cols-8 min-h-full">
          <div className="flex flex-col">
            {timeSlots.map((t, idx) => {
              const isHour = t.endsWith(":00");
              return (
                <div
                  key={t}
                  className={`border-r border-b border-hairline h-[28px] ${
                    isHour ? "bg-white" : "bg-muted/40"
                  }`}
                >
                  <div className="text-[10px] text-right pr-2 text-text-secondary leading-[28px]">
                    {isHour ? t : ""}
                  </div>
                </div>
              );
            })}
          </div>

          {weekDays.map((day) => {
            const dayKey = normalizeDate(day);
            const dayEvents = dayLayouts[dayKey] || [];
            return (
              <div key={dayKey} className="relative border-r border-hairline">
                {timeSlots.map((t) => (
                  <div
                    key={dayKey + t}
                    className="border-b border-hairline h-[28px] hover:bg-muted/20 cursor-pointer transition-micro"
                    onClick={() => onTimeSlotClick(day, t)}
                  />
                ))}

                <div className="absolute inset-0 p-1">
                  {dayEvents.map((evt) => {
                    const start = evt._start;
                    const end = evt._end;
                    const top = ((start - 6 * 60) / 30) * 28;
                    const height = Math.max(28, ((end - start) / 30) * 28 - 2);
                    const colCount = evt._colCount || 1;
                    const col = evt._col || 0;
                    const widthPct = 100 / colCount;
                    const leftPct = (100 / colCount) * col;

                    return (
                      <div
                        key={evt.id || `${evt._start}-${evt._idx}`}
                        className="absolute rounded-[6px] px-2 py-1 shadow-sm border-l-4 bg-blue-50 text-[11px] leading-tight overflow-hidden hover:shadow-md cursor-pointer"
                        style={{
                          top,
                          height,
                          left: `${leftPct}%`,
                          width: `calc(${widthPct}% - 4px)`,
                          borderLeftColor: evt.backgroundColor || "#3b82f6",
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          // Se precisar abrir detalhes do evento, use onEventClick
                        }}
                        title={`${evt.startTime} - ${evt.endTime} ${evt.title || ""}`}
                      >
                        <div className="font-semibold truncate">
                          {evt.title || "Evento"}
                        </div>
                        <div className="opacity-70 text-[10px]">
                          {evt.startTime} - {evt.endTime || ""}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// ------------------------------------------------------------------
// Day View (simplificado)
// ------------------------------------------------------------------
const DayView = ({ currentDay, timeSlots, events, onEventClick, onTimeSlotClick }) => {
  const dayKey = format(currentDay, "yyyy-MM-dd");
  const dayEvents = events?.filter((e) => {
    const d =
      e.eventDate ||
      e.dataAgendamento ||
      e.date ||
      (e.start && format(parseISO(e.start), "yyyy-MM-dd"));
    return d === dayKey;
  });

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="grid grid-cols-[100px_1fr] border-b border-gray-200 bg-white py-4">
        <div className="text-center text-gray-400 text-xs font-bold uppercase tracking-widest pt-2">
          Horário
        </div>
        <div className="pl-6">
          <div className="text-sm font-bold text-blue-600 uppercase tracking-widest mb-1">
            {format(currentDay, "EEEE", { locale: ptBR })}
          </div>
          <div className="text-2xl font-normal text-gray-900">
            {format(currentDay, "d 'de' MMMM", { locale: ptBR })}
          </div>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        <div className="grid grid-cols-[100px_1fr] relative">
          <div className="border-r border-gray-100 bg-white">
            {timeSlots.map((t) => (
              <div
                key={t}
                className="h-[80px] border-b border-gray-50 text-sm text-gray-500 font-medium text-center pt-3"
              >
                {t}
              </div>
            ))}
          </div>
          <div className="relative bg-white">
            {timeSlots.map((t) => (
              <div
                key={t}
                className="h-[80px] border-b border-gray-50 hover:bg-gray-50/50 cursor-pointer relative"
                onClick={() => onTimeSlotClick?.(currentDay, t)}
              >
                <div className="absolute top-1/2 w-full border-t border-dotted border-gray-100 pointer-events-none" />
              </div>
            ))}
            {dayEvents?.map((evt, i) => (
              <div
                key={evt.id || i}
                className="absolute left-4 right-4 rounded-md px-3 py-1 shadow-sm border-l-4 bg-blue-50 hover:shadow-md cursor-pointer"
                style={{ top: 6 + i * 66, borderLeftColor: evt.backgroundColor || "#3b82f6" }}
                onClick={(e) => {
                  e.stopPropagation();
                  onEventClick?.(evt);
                }}
              >
                <div className="font-semibold text-gray-900 text-sm truncate">
                  {evt.title}
                </div>
                <div className="text-gray-600 text-xs flex items-center gap-1">
                  <Clock size={12} />
                  {evt.startTime} - {evt.endTime}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// ------------------------------------------------------------------
// Calendar View Main
// ------------------------------------------------------------------
const CalendarView = ({
  selectedDate,
  onDateSelect,
  onEventCreate,
  events = [],
  onEventDeleted,
}) => {
  const [currentDate, setCurrentDate] = useState(selectedDate || new Date());
  const [viewType, setViewType] = useState("month");
  const [selectedEvent, setSelectedEvent] = useState(null);

  const timeSlots = useMemo(() => {
    const slots = [];
    for (let h = 6; h < 20; h++) {
      slots.push(`${String(h).padStart(2, "0")}:00`);
    }
    return slots;
  }, []);

  const handlePrev = () => {
    setCurrentDate((d) =>
      viewType === "month" ? addMonths(d, -1) : addDays(d, viewType === "week" ? -7 : -1)
    );
  };

  const handleNext = () => {
    setCurrentDate((d) =>
      viewType === "month" ? addMonths(d, 1) : addDays(d, viewType === "week" ? 7 : 1)
    );
  };

  const handleTodayClick = () => setCurrentDate(new Date());

  const handleViewChange = (type) => setViewType(type);

  const renderHeaderTitle = () => {
    if (viewType === "month") return format(currentDate, "MMMM yyyy", { locale: ptBR });
    if (viewType === "week") {
      const start = startOfWeek(currentDate, { weekStartsOn: 0 });
      const end = endOfWeek(currentDate, { weekStartsOn: 0 });
      return `${format(start, "d MMM", { locale: ptBR })} - ${format(end, "d MMM", {
        locale: ptBR,
      })}`;
    }
    if (viewType === "day") return format(currentDate, "d 'de' MMMM yyyy", { locale: ptBR });
    return "";
  };

  const handleDayClick = (day) => {
    setCurrentDate(day);
    onDateSelect?.(day);
    onEventCreate?.({
      eventDate: format(day, "yyyy-MM-dd"),
      startTime: "",
      endTime: "",
    });
  };

  const handleTimeSlotClick = (day, time) => {
    // garante que o Dashboard saiba a data selecionada
    onDateSelect?.(day);

    // abre o modal CreateTask com data e início preenchidos
    onEventCreate?.({
      eventDate: format(day, "yyyy-MM-dd"),
      startTime: time, // vem do slot clicado (ex: "08:00")
      endTime: "",     // usuário define no modal
    });
  };

  const handleEventClick = (evt) => {
    setSelectedEvent(evt);
  };

  const handleCloseModal = () => setSelectedEvent(null);

  return (
    <div className="h-full flex flex-col bg-white border border-gray-200 relative">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 bg-white">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-1 border border-gray-100">
            <button
              onClick={handlePrev}
              className="p-1.5 hover:bg-white hover:shadow-sm rounded-md text-gray-600 transition"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={handleNext}
              className="p-1.5 hover:bg-white hover:shadow-sm rounded-md text-gray-600 transition"
            >
              <ChevronRight size={18} />
            </button>
          </div>
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-bold text-gray-900 capitalize tracking-tight">
              {renderHeaderTitle()}
            </h2>
            <button
              onClick={handleTodayClick}
              className="px-4 py-1.5 text-sm font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-100 rounded-full transition-colors"
            >
              Hoje
            </button>
          </div>
        </div>
        <div className="flex bg-gray-50 p-1.5 rounded-xl border border-gray-100">
          {["day", "week", "month"].map((type) => (
            <button
              key={type}
              onClick={() => handleViewChange(type)}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition ${
                viewType === type
                  ? "bg-white text-blue-600 shadow-sm ring-1 ring-black/5"
                  : "text-gray-500 hover:text-gray-900 hover:bg-gray-200/50"
              }`}
            >
              {{ day: "Dia", week: "Semana", month: "Mês" }[type]}
            </button>
          ))}
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-hidden">
        {viewType === "day" && (
          <DayView
            currentDay={currentDate}
            timeSlots={timeSlots}
            events={events}
            onEventClick={handleEventClick}
            onTimeSlotClick={handleTimeSlotClick} // ✅ abre modal com dia+hora
          />
        )}
        {viewType === "week" && (
          <WeekView
            currentDate={currentDate}
            events={events}
            timeSlots={timeSlots}
            onTimeSlotClick={handleTimeSlotClick} // ✅ idem na semana
            onDayNavigate={handleDayClick}
          />
        )}
        {viewType === "month" && (
          <MonthView
            currentMonth={currentDate}
            events={events}
            onDateClick={handleDayClick}
            onEventClick={handleEventClick}
          />
        )}
      </div>

      {selectedEvent && (
        <EventDetailsModal
          initialEvent={selectedEvent}
          onClose={handleCloseModal}
          onGeoLocationClick={(endereco) => {
            if (!endereco) return;
            const q = encodeURIComponent(
              `${endereco.rua || ""} ${endereco.numero || ""} ${endereco.cidade || ""} ${
                endereco.uf || ""
              }`
            );
            window.open(`https://www.google.com/maps/search/?api=1&query=${q}`, "_blank");
          }}
          onEventDeleted={onEventDeleted}
        />
      )}
    </div>
  );
};

export default CalendarView;
