import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Habit, HabitProgress } from '../types/habit';
import { formatDate, getDaysBetween } from '../utils/dateUtils';

interface HabitContextProps {
  habits: Habit[];
  addHabit: (habit: Omit<Habit, 'id' | 'createdAt' | 'progress'>) => void;
  updateHabit: (id: string, updates: Partial<Habit>) => void;
  deleteHabit: (id: string) => void;
  completeHabit: (id: string, date?: string) => void;
  skipHabit: (id: string, date?: string) => void;
  getHabitById: (id: string) => Habit | undefined;
  clearHabits: () => void;
  calculateStreak: (habit: Habit) => number;
}

const HabitContext = createContext<HabitContextProps | undefined>(undefined);

export const useHabits = () => {
  const context = useContext(HabitContext);
  if (!context) {
    throw new Error('useHabits должен использоваться внутри HabitProvider');
  }
  return context;
};

interface HabitProviderProps {
  children: ReactNode;
}

export const HabitProvider: React.FC<HabitProviderProps> = ({ children }) => {
  const [habits, setHabits] = useState<Habit[]>([]);

  // Загрузка привычек из localStorage при инициализации
  useEffect(() => {
    const savedHabits = localStorage.getItem('habits');
    if (savedHabits) {
      try {
        setHabits(JSON.parse(savedHabits));
      } catch (error) {
        console.error('Ошибка при загрузке привычек:', error);
        setHabits([]);
      }
    }
  }, []);

  // Сохранение привычек в localStorage при их изменении
  useEffect(() => {
    localStorage.setItem('habits', JSON.stringify(habits));
  }, [habits]);

  const addHabit = (habit: Omit<Habit, 'id' | 'createdAt' | 'progress'>) => {
    const newHabit: Habit = {
      ...habit,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      progress: {},
    };
    setHabits((prevHabits) => [...prevHabits, newHabit]);
  };

  const updateHabit = (id: string, updates: Partial<Habit>) => {
    setHabits((prevHabits) =>
      prevHabits.map((habit) =>
        habit.id === id ? { ...habit, ...updates } : habit
      )
    );
  };

  const deleteHabit = (id: string) => {
    setHabits((prevHabits) => prevHabits.filter((habit) => habit.id !== id));
  };

  const completeHabit = (id: string, date = formatDate(new Date())) => {
    setHabits((prevHabits) =>
      prevHabits.map((habit) => {
        if (habit.id === id) {
          return {
            ...habit,
            progress: {
              ...habit.progress,
              [date]: 'completed',
            },
          };
        }
        return habit;
      })
    );
  };

  const skipHabit = (id: string, date = formatDate(new Date())) => {
    setHabits((prevHabits) =>
      prevHabits.map((habit) => {
        if (habit.id === id) {
          return {
            ...habit,
            progress: {
              ...habit.progress,
              [date]: 'skipped',
            },
          };
        }
        return habit;
      })
    );
  };

  const getHabitById = (id: string) => {
    return habits.find((habit) => habit.id === id);
  };

  const clearHabits = () => {
    setHabits([]);
  };

  const calculateStreak = (habit: Habit) => {
    let currentStreak = 0;
    const today = new Date();
    let checkDate = new Date(today);
    
    // Пересчитываем текущую серию
    while (true) {
      const dateStr = formatDate(checkDate);
      const status = habit.progress[dateStr];
      
      // Если привычка была выполнена в этот день, увеличиваем серию
      if (status === 'completed') {
        currentStreak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } 
      // Если привычка была пропущена с разрешения, не засчитываем день, но и не обрываем серию
      else if (status === 'skipped') {
        checkDate.setDate(checkDate.getDate() - 1);
      } 
      // Если привычка не выполнена, обрываем серию
      else {
        break;
      }
    }

    return currentStreak;
  };

  const value = {
    habits,
    addHabit,
    updateHabit,
    deleteHabit,
    completeHabit,
    skipHabit,
    getHabitById,
    clearHabits,
    calculateStreak,
  };

  return <HabitContext.Provider value={value}>{children}</HabitContext.Provider>;
};