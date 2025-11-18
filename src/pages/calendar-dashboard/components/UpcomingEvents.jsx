import React from 'react';
import { format, addDays, isToday, isTomorrow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import Icon from '../../../shared/components/AppIcon';
const UpcomingEvents = () => {
  const mockEvents = [
    {
      id: 1,
      title: 'Reunião de Standup da Equipe',
      time: '09:00',
      duration: 30,
      type: 'meeting',
      attendees: ['João Silva', 'Maria Santos', 'Pedro Costa'],
      location: 'Sala de Conferência A',
      priority: 'high',
      date: new Date()
    },
    {
      id: 2,
      title: 'Revisão do Código',
      time: '14:00',
      duration: 60,
      type: 'work',
      attendees: ['Ana Oliveira', 'Carlos Lima'],
      location: 'Online - Zoom',
      priority: 'medium',
      date: new Date()
    },
    {
      id: 3,
      title: 'Almoço com Cliente',
      time: '12:30',
      duration: 90,
      type: 'business',
      attendees: ['Cliente ABC'],
      location: 'Restaurante Central',
      priority: 'high',
      date: addDays(new Date(), 1)
    },
    {
      id: 4,
      title: 'Planejamento Sprint',
      time: '10:00',
      duration: 120,
      type: 'meeting',
      attendees: ['Toda a Equipe'],
      location: 'Sala Principal',
      priority: 'medium',
      date: addDays(new Date(), 1)
    },
    {
      id: 5,
      title: 'Treinamento Técnico',
      time: '15:00',
      duration: 90,
      type: 'training',
      attendees: ['Equipe de Dev'],
      location: 'Auditório',
      priority: 'low',
      date: addDays(new Date(), 2)
    }
  ];

  const getEventIcon = (type) => {
    switch (type) {
      case 'meeting':
        return 'Users';
      case 'work':
        return 'Code';
      case 'business':
        return 'Briefcase';
      case 'training':
        return 'BookOpen';
      default:
        return 'Calendar';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'border-l-error';
      case 'medium':
        return 'border-l-warning';
      case 'low':
        return 'border-l-success';
      default:
        return 'border-l-muted';
    }
  };

  const getDateLabel = (date) => {
    if (isToday(date)) {
      return 'Hoje';
    } else if (isTomorrow(date)) {
      return 'Amanhã';
    } else {
      return format(date, 'dd/MM', { locale: ptBR });
    }
  };

  const formatDuration = (minutes) => {
    if (minutes < 60) {
      return `${minutes}min`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}min` : `${hours}h`;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-text-primary">Próximos Eventos</h3>
        <button className="text-xs text-primary hover:bg-primary/10 px-2 py-1 rounded-modern transition-micro">
          Ver Todos
        </button>
      </div>

      <div className="space-y-3 max-h-96 overflow-y-auto">
        {mockEvents?.map((event) => (
          <div
            key={event?.id}
            className={`bg-card border border-hairline rounded-modern p-3 hover:shadow-soft transition-micro cursor-pointer group border-l-4 ${getPriorityColor(event?.priority)}`}
          >
            <div className="flex items-start space-x-3">
              <div className="shrink-0 mt-1">
                <div className="w-8 h-8 bg-muted rounded-modern flex items-center justify-center">
                  <Icon name={getEventIcon(event?.type)} size={16} className="text-text-secondary" />
                </div>
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="text-sm font-medium text-text-primary truncate">
                    {event?.title}
                  </h4>
                  <span className="text-xs text-text-secondary shrink-0 ml-2">
                    {getDateLabel(event?.date)}
                  </span>
                </div>
                
                <div className="flex items-center space-x-3 text-xs text-text-secondary mb-2">
                  <div className="flex items-center space-x-1">
                    <Icon name="Clock" size={12} />
                    <span>{event?.time}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Icon name="Timer" size={12} />
                    <span>{formatDuration(event?.duration)}</span>
                  </div>
                </div>
                
                {event?.location && (
                  <div className="flex items-center space-x-1 text-xs text-text-secondary mb-2">
                    <Icon name="MapPin" size={12} />
                    <span className="truncate">{event?.location}</span>
                  </div>
                )}
                
                <div className="flex items-center space-x-1 text-xs text-text-secondary">
                  <Icon name="Users" size={12} />
                  <span className="truncate">
                    {event?.attendees?.slice(0, 2)?.join(', ')}
                    {event?.attendees?.length > 2 && ` +${event?.attendees?.length - 2}`}
                  </span>
                </div>
              </div>
              
              <button className="opacity-0 group-hover:opacity-100 p-1 hover:bg-muted rounded-modern transition-micro">
                <Icon name="MoreVertical" size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="pt-3 border-t border-hairline">
        <button className="w-full flex items-center justify-center space-x-2 p-2 text-sm text-primary hover:bg-primary/10 rounded-modern transition-micro">
          <Icon name="Calendar" size={16} />
          <span>Ver Calendário Completo</span>
        </button>
      </div>
    </div>
  );
};

export default UpcomingEvents;