import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { formatDate } from '../utils/dateUtils';

interface RewardState {
  points: number;
  lastClaimDate: string | null;
  streak: number;
}

interface RewardContextProps {
  points: number;
  lastClaimDate: string | null;
  streak: number;
  canClaimDaily: boolean;
  claimDailyReward: () => number;
}

const RewardContext = createContext<RewardContextProps | undefined>(undefined);

export const useRewards = () => {
  const context = useContext(RewardContext);
  if (!context) {
    throw new Error('useRewards должен использоваться внутри RewardProvider');
  }
  return context;
};

interface RewardProviderProps {
  children: ReactNode;
}

export const RewardProvider: React.FC<RewardProviderProps> = ({ children }) => {
  const [rewardState, setRewardState] = useState<RewardState>({
    points: 0,
    lastClaimDate: null,
    streak: 0
  });

  const [canClaimDaily, setCanClaimDaily] = useState<boolean>(false);

  // Загрузка данных о наградах из localStorage
  useEffect(() => {
    const savedRewards = localStorage.getItem('rewards');
    if (savedRewards) {
      try {
        const parsed = JSON.parse(savedRewards);
        setRewardState(parsed);
      } catch (error) {
        console.error('Ошибка при загрузке данных о наградах:', error);
      }
    }
  }, []);

  // Сохранение данных о наградах в localStorage
  useEffect(() => {
    localStorage.setItem('rewards', JSON.stringify(rewardState));
  }, [rewardState]);

  // Проверка возможности получения ежедневной награды
  useEffect(() => {
    const today = formatDate(new Date());
    const canClaim = !rewardState.lastClaimDate || rewardState.lastClaimDate !== today;
    setCanClaimDaily(canClaim);
  }, [rewardState.lastClaimDate]);

  // Получение ежедневной награды
  const claimDailyReward = () => {
    const today = formatDate(new Date());
    const yesterday = formatDate(new Date(Date.now() - 86400000));
    
    let newStreak = rewardState.streak;
    let reward = 10; // Базовая награда
    
    // Проверяем, является ли последний день получения награды вчерашним днем
    if (rewardState.lastClaimDate === yesterday) {
      newStreak += 1;
      
      // Бонус за серию дней
      if (newStreak >= 7) {
        reward = 50;
      } else if (newStreak >= 3) {
        reward = 20;
      }
    } else if (rewardState.lastClaimDate !== today) {
      // Если награда не получена вчера и сегодня, сбрасываем серию
      newStreak = 1;
    }
    
    setRewardState(prev => ({
      points: prev.points + reward,
      lastClaimDate: today,
      streak: newStreak
    }));
    
    setCanClaimDaily(false);
    return reward;
  };

  const value = {
    points: rewardState.points,
    lastClaimDate: rewardState.lastClaimDate,
    streak: rewardState.streak,
    canClaimDaily,
    claimDailyReward
  };

  return <RewardContext.Provider value={value}>{children}</RewardContext.Provider>;
};