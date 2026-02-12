/**
 * Exportação centralizada de hooks relacionados ao calendário
 * Facilita importações: import { useEventDetails } from '@/features/calendar/hooks'
 */

export {
  useEventDetails,
  useDeleteAgendamento,
  useEventsByDate,
} from './useCalendarEvents';

// Re-export default para compatibilidade
export { default as useCalendarEventsDefault } from './useCalendarEvents';
