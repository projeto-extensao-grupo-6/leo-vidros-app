import { useState, useMemo } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  isSameMonth,
  isSameDay,
  isToday,
} from "date-fns";
import { ptBR } from "date-fns/locale";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "../../../utils/cn";

export default function MiniCalendarAgendamentos({
  currentDate,
  selectedDate,
  onDateSelect,
  agendamentoDates = [],
}) {
  const [viewMonth, setViewMonth] = useState(currentDate || new Date());

  const monthStart = startOfMonth(viewMonth);
  const monthEnd = endOfMonth(viewMonth);
  const calStart = startOfWeek(monthStart, { weekStartsOn: 0 });
  const calEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });

  const days = useMemo(() => {
    const result = [];
    let day = calStart;
    while (day <= calEnd) {
      result.push(day);
      day = addDays(day, 1);
    }
    return result;
  }, [viewMonth]);

  const weekDayNames = ["D", "S", "T", "Q", "Q", "S", "S"];

  const prevMonth = () =>
    setViewMonth(
      new Date(viewMonth.getFullYear(), viewMonth.getMonth() - 1, 1),
    );
  const nextMonth = () =>
    setViewMonth(
      new Date(viewMonth.getFullYear(), viewMonth.getMonth() + 1, 1),
    );

  return (
    <div className="bg-gray-50 rounded-xl border border-gray-200 p-4 shadow-sm">
      {/* Header do mês */}
      <div className="flex items-center justify-between mb-3">
        <button
          onClick={prevMonth}
          className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors text-gray-500 cursor-pointer"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <span className="font-semibold text-gray-800 text-sm capitalize">
          {format(viewMonth, "MMMM yyyy", { locale: ptBR })}
        </span>
        <button
          onClick={nextMonth}
          className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors text-gray-500 cursor-pointer"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      {/* Dias da semana */}
      <div className="grid grid-cols-7 gap-1 mb-1">
        {weekDayNames.map((day, i) => (
          <div
            key={i}
            className="text-center text-[11px] text-gray-400 font-semibold py-1"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Dias do mês */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((day, i) => {
          const isCurrentMonth = isSameMonth(day, viewMonth);
          const isDateToday = isToday(day);
          const isSelected = selectedDate && isSameDay(day, selectedDate);
          const hasAgendamentos = agendamentoDates.includes(
            format(day, "yyyy-MM-dd"),
          );

          return (
            <button
              key={i}
              onClick={() => onDateSelect?.(day)}
              className={cn(
                "w-8 h-8 text-xs rounded-full flex items-center justify-center relative transition-all duration-150 cursor-pointer",
                !isCurrentMonth && "text-gray-300",
                isCurrentMonth &&
                  !isSelected &&
                  !isDateToday &&
                  "text-gray-700 hover:bg-gray-100",
                isDateToday &&
                  !isSelected &&
                  "bg-[#007EA7]/10 text-[#007EA7] font-bold",
                isSelected && "bg-[#007EA7] text-white font-bold shadow-md",
              )}
            >
              {format(day, "d")}
              {hasAgendamentos && !isSelected && (
                <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#007EA7]" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
