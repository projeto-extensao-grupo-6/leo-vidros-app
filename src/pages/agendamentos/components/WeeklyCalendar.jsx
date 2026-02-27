import { useMemo, useState, useEffect, useRef } from "react";
import { format, addDays, startOfWeek, isSameDay } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "../../../utils/cn";
import { Clock } from "lucide-react";
import {
  normalizeStatus,
  statusColors,
  tipoColors,
} from "../../../utils/agendamentoStatus";

const timeSlots = Array.from({ length: 25 }, (_, i) => {
  const hour = Math.floor(i / 2) + 7;
  const minutes = i % 2 === 0 ? "00" : "30";
  return `${hour.toString().padStart(2, "0")}:${minutes}`;
}).filter((_, i) => i < 25);

export default function WeeklyCalendar({
  agendamentos = [],
  currentDate,
  onAgendamentoClick,
  onSlotClick,
}) {
  const weekDays = useMemo(() => {
    const start = startOfWeek(currentDate, { weekStartsOn: 0 });
    return Array.from({ length: 7 }, (_, i) => addDays(start, i));
  }, [currentDate]);

  const appointmentGrid = useMemo(() => {
    const grid = {};

    weekDays.forEach((day) => {
      const dateKey = format(day, "yyyy-MM-dd");
      grid[dateKey] = {};
      timeSlots.forEach((time) => {
        grid[dateKey][time] = [];
      });
    });

    agendamentos.forEach((apt) => {
      const dateKey = apt.dataAgendamento;
      const time = apt.inicioAgendamento?.substring(0, 5);

      if (grid[dateKey] && time) {
        const matchingSlot = timeSlots.find((slot) => slot === time);
        if (matchingSlot && grid[dateKey][matchingSlot]) {
          grid[dateKey][matchingSlot].push(apt);
        } else {
          const toMin = (t) => {
            const [h, m] = t.split(":").map(Number);
            return h * 60 + m;
          };
          const tMin = toMin(time);
          const closestSlot = timeSlots.reduce((prev, curr) =>
            Math.abs(toMin(curr) - tMin) < Math.abs(toMin(prev) - tMin)
              ? curr
              : prev,
          );
          if (grid[dateKey][closestSlot]) {
            grid[dateKey][closestSlot].push(apt);
          }
        }
      }
    });

    return grid;
  }, [agendamentos, weekDays]);

  const today = new Date();

  const [currentTime, setCurrentTime] = useState(new Date());
  const scrollRef = useRef(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      const now = new Date();
      const h = now.getHours();
      const m = now.getMinutes();
      if (h >= 7 && h < 19) {
        const pos = ((h - 7) * 60 + m) * (80 / 30);
        scrollRef.current.scrollTop = Math.max(0, pos - 200);
      }
    }
  }, []);

  const nowHours = currentTime.getHours();
  const nowMinutes = currentTime.getMinutes();

  const isWithinWorkHours = nowHours >= 7 && nowHours <= 19;

  const SLOT_HEIGHT = 80;
  const PX_PER_MIN = SLOT_HEIGHT / 30;
  const timeLineTop = isWithinWorkHours
    ? ((nowHours - 7) * 60 + nowMinutes) * PX_PER_MIN
    : -1;

  const currentTimeLabel = `${String(nowHours).padStart(2, "0")}:${String(nowMinutes).padStart(2, "0")}`;

  const getStatusName = (apt) => {
    return normalizeStatus(apt.statusAgendamento?.nome);
  };

  const getServicoNome = (apt) => {
    if (apt.servico?.nome) return apt.servico.nome;
    if (apt.servico?.codigo) return apt.servico.codigo;
    return apt.tipoAgendamento === "ORCAMENTO" ? "Orçamento" : "Serviço";
  };

  const getFuncionarioNome = (apt) => {
    if (apt.funcionarios?.length > 0) {
      return apt.funcionarios[0].nome?.split(" ")[0] || "";
    }
    return "";
  };

  return (
    <div className="flex flex-col h-full border border-gray-200 rounded-xl overflow-hidden bg-white">
      {/* Header com dias da semana */}
      <div className="flex border-b border-gray-200 bg-gray-50 sticky top-0 z-10">
        <div className="w-16 shrink-0 border-r border-gray-200 p-2 text-center">
          <Clock className="h-4 w-4 text-gray-400 mx-auto" />
        </div>
        {weekDays.map((day) => {
          const isToday = isSameDay(day, today);
          return (
            <div
              key={day.toISOString()}
              className={cn(
                "flex-1 py-3 px-2 text-center border-r border-gray-200 last:border-r-0",
                isToday && "bg-blue-50/50",
              )}
            >
              <div className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                {format(day, "EEE", { locale: ptBR })}
              </div>
              <div
                className={cn(
                  "text-lg font-bold mt-1 transition-colors",
                  isToday
                    ? "w-9 h-9 mx-auto rounded-full bg-[#007EA7] text-white flex items-center justify-center shadow-md"
                    : "text-gray-800",
                )}
              >
                {format(day, "d")}
              </div>
            </div>
          );
        })}
      </div>

      {/* Grid de horários - scrollável */}
      <div className="flex-1 overflow-y-auto" ref={scrollRef}>
        <div className="flex relative">
          {/* Linha indicadora do horário atual */}
          {isWithinWorkHours && timeLineTop >= 0 && (
            <div
              className="absolute left-0 right-0 z-[1] pointer-events-none flex items-center"
              style={{ top: `${timeLineTop}px` }}
            >
              <div className="w-16 flex items-center justify-end pr-0.5">
                <span className="text-[9px] font-bold text-[#007EA7] mr-0.5 bg-white/80 rounded px-0.5">
                  {currentTimeLabel}
                </span>
                <div className="w-3 h-3 rounded-full bg-[#007EA7] shadow-md border-2 border-white shrink-0" />
              </div>
              <div className="flex-1 h-[2px] bg-[#007EA7] opacity-60" />
            </div>
          )}

          {/* Coluna de horários */}
          <div className="w-16 shrink-0 border-r border-gray-200">
            {timeSlots.map((time) => (
              <div
                key={time}
                className="h-20 border-b border-gray-100 flex items-start justify-center pt-1.5 text-xs text-gray-400 font-medium"
              >
                {time}
              </div>
            ))}
          </div>

          {/* Colunas dos dias */}
          {weekDays.map((day) => {
            const dateKey = format(day, "yyyy-MM-dd");
            const isToday = isSameDay(day, today);

            return (
              <div
                key={day.toISOString()}
                className={cn(
                  "flex-1 border-r border-gray-200 last:border-r-0",
                  isToday && "bg-blue-50/30",
                )}
              >
                {timeSlots.map((time) => {
                  const slotAppointments =
                    appointmentGrid[dateKey]?.[time] || [];

                  return (
                    <div
                      key={time}
                      className={cn(
                        "h-20 border-b border-gray-100 relative cursor-pointer transition-colors",
                        slotAppointments.length === 0 && "hover:bg-gray-50",
                      )}
                      onClick={() => {
                        if (slotAppointments.length === 0 && onSlotClick) {
                          onSlotClick(day, time);
                        }
                      }}
                    >
                      {slotAppointments.map((apt) => {
                        const statusName = getStatusName(apt);
                        const colors =
                          statusColors[normalizeStatus(statusName)] ||
                          statusColors.PENDENTE;
                        const tipoColor =
                          tipoColors[apt.tipoAgendamento] || tipoColors.SERVICO;

                        return (
                          <div
                            key={apt.id}
                            className={cn(
                              "absolute inset-x-1 top-1 bottom-1 rounded-lg border-l-4 p-2 cursor-pointer overflow-hidden",
                              colors.bg,
                              colors.border,
                              "hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5",
                            )}
                            onClick={(e) => {
                              e.stopPropagation();
                              onAgendamentoClick?.(apt);
                            }}
                            title={`${getServicoNome(apt)} - ${getFuncionarioNome(apt)}`}
                          >
                            <div className="flex items-center gap-1">
                              <span
                                className="w-2 h-2 rounded-full shrink-0"
                                style={{ backgroundColor: tipoColor }}
                              />
                              <span className="text-xs font-semibold text-gray-800 truncate">
                                {getServicoNome(apt)}
                              </span>
                            </div>
                            <div className="text-[10px] text-gray-500 truncate mt-0.5">
                              {getFuncionarioNome(apt)}
                            </div>
                            <div className="text-[10px] text-gray-400 truncate flex items-center gap-1 mt-0.5">
                              <span>
                                {apt.inicioAgendamento?.substring(0, 5)} -{" "}
                                {apt.fimAgendamento?.substring(0, 5)}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
