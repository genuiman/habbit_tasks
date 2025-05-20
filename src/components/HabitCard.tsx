import React, { useState } from 'react';
import { CheckCircle, XCircle, MoreHorizontal, Edit, Trash2, Calendar } from 'lucide-react';
import { useHabits } from '../context/HabitContext';
import { Habit } from '../types/habit';
import { formatDate, formatTimeSince } from '../utils/dateUtils';

interface HabitCardProps {
  habit: Habit;
  onEdit?: (id: string) => void;
}

const HabitCard: React.FC<HabitCardProps> = ({ habit, onEdit }) => {
  const [showMenu, setShowMenu] = useState(false);
  const { completeHabit, skipHabit, deleteHabit, calculateStreak } = useHabits();
  const today = formatDate(new Date());
  const todayStatus = habit.progress[today];
  const streak = calculateStreak(habit);
  const timeSince = formatTimeSince(new Date(habit.createdAt));

  const getStatusColor = () => {
    if (todayStatus === 'completed') return 'bg-green-100 text-green-800 border-green-200';
    if (todayStatus === 'skipped') return 'bg-gray-100 text-gray-800 border-gray-200';
    return 'bg-blue-50 text-blue-800 border-blue-100';
  };

  const getStatusText = () => {
    if (todayStatus === 'completed') return 'Выполнено сегодня';
    if (todayStatus === 'skipped') return 'Пропущено сегодня';
    return 'Ожидает выполнения';
  };

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  const handleEdit = () => {
    if (onEdit) {
      onEdit(habit.id);
    }
    setShowMenu(false);
  };

  const handleDelete = () => {
    if (window.confirm('Вы уверены, что хотите удалить эту привычку?')) {
      deleteHabit(habit.id);
    }
    setShowMenu(false);
  };

  const handleComplete = () => {
    completeHabit(habit.id);
  };

  const handleSkip = () => {
    skipHabit(habit.id);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg">
      <div className="p-4">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-semibold text-gray-800 mb-1">{habit.name}</h3>
          <div className="relative">
            <button
              onClick={toggleMenu}
              className="p-1 rounded-full hover:bg-gray-100 transition-colors duration-200"
            >
              <MoreHorizontal size={20} className="text-gray-500" />
            </button>
            {showMenu && (
              <div className="absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                <div className="py-1">
                  <button
                    onClick={handleEdit}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <Edit size={16} className="mr-2" />
                    Редактировать
                  </button>
                  <button
                    onClick={handleDelete}
                    className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                  >
                    <Trash2 size={16} className="mr-2" />
                    Удалить
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
        
        <p className="text-gray-600 mb-3">{habit.description}</p>
        
        <div className="flex items-center mb-3 text-sm">
          <Calendar size={16} className="text-gray-500 mr-1" />
          <span className="text-gray-600">Отслеживается {timeSince}</span>
        </div>
        
        <div className="flex items-center justify-between mb-4">
          <div className={`text-sm px-3 py-1 rounded-full font-medium ${getStatusColor()}`}>
            {getStatusText()}
          </div>
          <div className="flex items-center text-sm font-medium text-blue-600">
            <span className="mr-1">Серия:</span>
            <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-md">
              {streak} {streak === 1 ? 'день' : streak >= 2 && streak <= 4 ? 'дня' : 'дней'}
            </span>
          </div>
        </div>
        
        {todayStatus !== 'completed' && todayStatus !== 'skipped' && (
          <div className="flex space-x-2 mt-2">
            <button
              onClick={handleComplete}
              className="flex-1 flex items-center justify-center py-2 bg-green-500 hover:bg-green-600 text-white rounded-md font-medium transition-colors duration-200"
            >
              <CheckCircle size={18} className="mr-1" />
              Выполнить
            </button>
            <button
              onClick={handleSkip}
              className="flex-1 flex items-center justify-center py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-md font-medium transition-colors duration-200"
            >
              <XCircle size={18} className="mr-1" />
              Пропустить
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default HabitCard;