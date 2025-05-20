export type HabitProgress = 'completed' | 'skipped' | 'pending';

export interface Habit {
  id: string;
  name: string;
  description: string;
  frequency: string;
  color: string;
  createdAt: string;
  progress: {
    [date: string]: HabitProgress;
  };
}