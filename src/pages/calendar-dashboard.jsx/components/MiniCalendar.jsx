import React, { useState } from 'react';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, isSameMonth, isSameDay, isToday } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import Icon from '../../../shared/components/AppIcon';
import Button from '../../../shared/components/buttons/button.component';

const MiniCalendar = ({ selectedDate, onDateSelect }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 0 });
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 0 });

  const dateFormat = "d";
  const rows = [];
  let days = [];
  let day = startDate;
  let formattedDate = "";

  while (day <= endDate) {
    for (let i = 0; i < 7; i++) {
      formattedDate = format(day, dateFormat);
      const cloneDay = day;
      
      days?.push(
        <div
          className={`aspect-square p-1 cursor-pointer rounded-modern transition-micro text-xs flex items-center justify-center hover-scale ${
            !isSameMonth(day, monthStart)
              ? 'text-text-secondary/50'
              : isSameDay(day, selectedDate)
              ? 'bg-primary text-primary-foreground'
              : isToday(day) 
              ? 'bg-warning/20 text-warning font-medium' :'text-text-primary hover:bg-muted'
          }`}
          key={day}
          onClick={() => onDateSelect?.(cloneDay)}
        >
          <span>{formattedDate}</span>
        </div>
      );
      day = addDays(day, 1);
    }
    rows?.push(
      <div className="grid grid-cols-7 gap-1" key={day}>
        {days}
      </div>
    );
    days = [];
  }

  const nextMonth = () => {
    const nextMonthDate = new Date(currentMonth?.getFullYear(), currentMonth?.getMonth() + 1, 1);
    setCurrentMonth(nextMonthDate);
  };

  const prevMonth = () => {
    const prevMonthDate = new Date(currentMonth?.getFullYear(), currentMonth?.getMonth() - 1, 1);
    setCurrentMonth(prevMonthDate);
  };

  const goToToday = () => {
    const today = new Date();
    setCurrentMonth(today);
    onDateSelect?.(today);
  };

  return (
    <div className="bg-card border border-hairline rounded-modern p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-text-primary">Calendário</h3>
        <button 
          onClick={goToToday}
          className="text-xs text-primary hover:bg-primary/10 px-2 py-1 rounded-modern transition-micro"
        >
          Hoje
        </button>
      </div>
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={prevMonth}
        >
          <Icon name="ChevronLeft" size={16} />
        </Button>
        
        <span className="font-medium text-text-primary text-sm">
          {format(currentMonth, 'MMMM yyyy', { locale: ptBR })}
        </span>
        
        <Button
          variant="ghost"
          size="icon"
          onClick={nextMonth}
        >
          <Icon name="ChevronRight" size={16} />
        </Button>
      </div>
      {/* Days of week */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']?.map((day) => (
          <div key={day} className="aspect-square p-1 text-xs font-medium text-text-secondary text-center flex items-center justify-center">
            {day}
          </div>
        ))}
      </div>
      {/* Calendar Grid */}
      <div className="space-y-1">
        {rows}
      </div>
      {/* Quick actions */}
      <div className="mt-4 pt-3 border-t border-hairline space-y-2">
        <button className="w-full text-left text-xs text-text-secondary hover:text-text-primary transition-micro flex items-center space-x-2 p-1 rounded-modern hover:bg-muted">
          <div className="w-2 h-2 bg-primary rounded-full"></div>
          <span>Meus Eventos</span>
        </button>
        <button className="w-full text-left text-xs text-text-secondary hover:text-text-primary transition-micro flex items-center space-x-2 p-1 rounded-modern hover:bg-muted">
          <div className="w-2 h-2 bg-success rounded-full"></div>
          <span>Equipe</span>
        </button>
        <button className="w-full text-left text-xs text-text-secondary hover:text-text-primary transition-micro flex items-center space-x-2 p-1 rounded-modern hover:bg-muted">
          <div className="w-2 h-2 bg-warning rounded-full"></div>
          <span>Feriados</span>
        </button>
      </div>
    </div>
  );
};

export default MiniCalendar;