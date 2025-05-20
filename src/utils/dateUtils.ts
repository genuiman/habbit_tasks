/**
 * Форматирует дату в формат YYYY-MM-DD
 */
export const formatDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Возвращает количество дней между двумя датами
 */
export const getDaysBetween = (start: Date, end: Date): number => {
  const diffTime = Math.abs(end.getTime() - start.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

/**
 * Возвращает массив дат за последние N дней (включая сегодня)
 */
export const getLastNDays = (n: number): Date[] => {
  const result: Date[] = [];
  for (let i = n - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    result.push(date);
  }
  return result;
};

/**
 * Форматирует время, прошедшее с указанной даты
 */
export const formatTimeSince = (date: Date): string => {
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  
  if (diffInDays === 0) {
    return 'сегодня';
  } else if (diffInDays === 1) {
    return 'вчера';
  } else if (diffInDays < 7) {
    return `${diffInDays} ${getDayWord(diffInDays)} назад`;
  } else if (diffInDays < 30) {
    const weeks = Math.floor(diffInDays / 7);
    return `${weeks} ${getWeekWord(weeks)} назад`;
  } else if (diffInDays < 365) {
    const months = Math.floor(diffInDays / 30);
    return `${months} ${getMonthWord(months)} назад`;
  } else {
    const years = Math.floor(diffInDays / 365);
    return `${years} ${getYearWord(years)} назад`;
  }
};

/**
 * Вспомогательные функции для правильного склонения слов
 */
const getDayWord = (days: number): string => {
  if (days % 10 === 1 && days % 100 !== 11) {
    return 'день';
  } else if ([2, 3, 4].includes(days % 10) && ![12, 13, 14].includes(days % 100)) {
    return 'дня';
  } else {
    return 'дней';
  }
};

const getWeekWord = (weeks: number): string => {
  if (weeks % 10 === 1 && weeks % 100 !== 11) {
    return 'неделю';
  } else if ([2, 3, 4].includes(weeks % 10) && ![12, 13, 14].includes(weeks % 100)) {
    return 'недели';
  } else {
    return 'недель';
  }
};

const getMonthWord = (months: number): string => {
  if (months % 10 === 1 && months % 100 !== 11) {
    return 'месяц';
  } else if ([2, 3, 4].includes(months % 10) && ![12, 13, 14].includes(months % 100)) {
    return 'месяца';
  } else {
    return 'месяцев';
  }
};

const getYearWord = (years: number): string => {
  if (years % 10 === 1 && years % 100 !== 11) {
    return 'год';
  } else if ([2, 3, 4].includes(years % 10) && ![12, 13, 14].includes(years % 100)) {
    return 'года';
  } else {
    return 'лет';
  }
};