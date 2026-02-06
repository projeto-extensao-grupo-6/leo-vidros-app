import { format, parseISO, isValid, parse } from 'date-fns';
import { ptBR } from 'date-fns/locale';

/**
 * Formata uma data para o formato brasileiro (dd/MM/yyyy)
 * @param {Date|string} date - Data a ser formatada
 * @returns {string} Data formatada
 */
export const formatDate = (date) => {
  if (!date) return "N/A";
  
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    if (!isValid(dateObj)) return "N/A";
    
    return format(dateObj, 'dd/MM/yyyy', { locale: ptBR });
  } catch (error) {
    console.error('Error formatting date:', error);
    return "N/A";
  }
};

/**
 * Formata data com hora (dd/MM/yyyy HH:mm)
 * @param {Date|string} date - Data a ser formatada
 * @returns {string} Data e hora formatadas
 */
export const formatDateTime = (date) => {
  if (!date) return "N/A";
  
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    if (!isValid(dateObj)) return "N/A";
    
    return format(dateObj, 'dd/MM/yyyy HH:mm', { locale: ptBR });
  } catch (error) {
    console.error('Error formatting date time:', error);
    return "N/A";
  }
};

/**
 * Formata data por extenso (1 de janeiro de 2024)
 * @param {Date|string} date - Data a ser formatada
 * @returns {string} Data por extenso
 */
export const formatDateLong = (date) => {
  if (!date) return "N/A";
  
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    if (!isValid(dateObj)) return "N/A";
    
    return format(dateObj, "d 'de' MMMM 'de' yyyy", { locale: ptBR });
  } catch (error) {
    console.error('Error formatting date long:', error);
    return "N/A";
  }
};

/**
 * Converte data do formato brasileiro para ISO (yyyy-MM-dd)
 * @param {string} dateStr - Data no formato dd/MM/yyyy
 * @returns {string} Data no formato ISO
 */
export const toISODate = (dateStr) => {
  if (!dateStr) return null;
  
  try {
    const parsed = parse(dateStr, 'dd/MM/yyyy', new Date());
    if (!isValid(parsed)) return null;
    
    return format(parsed, 'yyyy-MM-dd');
  } catch (error) {
    console.error('Error converting to ISO date:', error);
    return null;
  }
};

/**
 * Formata hora (HH:mm)
 * @param {Date|string} date - Data/hora
 * @returns {string} Hora formatada
 */
export const formatTime = (date) => {
  if (!date) return "N/A";
  
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    if (!isValid(dateObj)) return "N/A";
    
    return format(dateObj, 'HH:mm', { locale: ptBR });
  } catch (error) {
    console.error('Error formatting time:', error);
    return "N/A";
  }
};

/**
 * Formata data relativa (hoje, ontem, etc)
 * @param {Date|string} date - Data
 * @returns {string} Data relativa
 */
export const formatRelativeDate = (date) => {
  if (!date) return "N/A";
  
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    if (!isValid(dateObj)) return "N/A";
    
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    const dateStr = format(dateObj, 'yyyy-MM-dd');
    const todayStr = format(today, 'yyyy-MM-dd');
    const yesterdayStr = format(yesterday, 'yyyy-MM-dd');
    
    if (dateStr === todayStr) return 'Hoje';
    if (dateStr === yesterdayStr) return 'Ontem';
    
    return formatDate(dateObj);
  } catch (error) {
    console.error('Error formatting relative date:', error);
    return "N/A";
  }
};
