import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle, Calendar, Clock, TrendingUp } from 'lucide-react';
import { useHabits } from '../context/HabitContext';
import { formatDate } from '../utils/dateUtils';
import HabitCard from '../components/HabitCard';
import RewardWidget from '../components/RewardWidget';
import { motion } from 'framer-motion';

const Dashboard: React.FC = () => {
  const { habits, calculateStreak } = useHabits();
  const today = formatDate(new Date());
  const [date, setDate] = useState(new Date());

  // Обновляем дату каждую минуту
  useEffect(() => {
    const interval = setInterval(() => {
      setDate(new Date());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  // Получаем только те привычки, которые ожидают выполнения сегодня
  const pendingHabits = habits.filter(
    (habit) => !habit.progress[today] || habit.progress[today] === 'pending'
  );

  // Получаем выполненные привычки на сегодня
  const completedHabits = habits.filter(
    (habit) => habit.progress[today] === 'completed'
  );

  // Считаем общую статистику
  const totalCompletions = habits.reduce((total, habit) => {
    return total + Object.values(habit.progress).filter(status => status === 'completed').length;
  }, 0);

  const totalHabits = habits.length;
  
  // Считаем самую длинную серию среди всех привычек
  const longestStreak = habits.length > 0
    ? Math.max(...habits.map(habit => calculateStreak(habit)))
    : 0;

  return (
    <div className="page-transition max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Добро пожаловать в Трекер Привычек!</h1>
        <p className="text-gray-600">
          Сегодня {date.toLocaleDateString('ru-RU', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </p>
      </div>
      
      {/* Виджет ежедневных наград */}
      <RewardWidget />
      
      {/* Статистика */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <motion.div 
          className="bg-white rounded-lg shadow-sm p-4 border border-gray-200"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center">
            <div className="bg-blue-100 rounded-lg p-3 mr-3">
              <PlusCircle className="text-blue-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Всего привычек</p>
              <p className="text-xl font-semibold text-gray-800">{totalHabits}</p>
            </div>
          </div>
        </motion.div>
        
        <motion.div 
          className="bg-white rounded-lg shadow-sm p-4 border border-gray-200"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center">
            <div className="bg-green-100 rounded-lg p-3 mr-3">
              <Calendar className="text-green-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Выполнено сегодня</p>
              <p className="text-xl font-semibold text-gray-800">{completedHabits.length}</p>
            </div>
          </div>
        </motion.div>
        
        <motion.div 
          className="bg-white rounded-lg shadow-sm p-4 border border-gray-200"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center">
            <div className="bg-purple-100 rounded-lg p-3 mr-3">
              <Clock className="text-purple-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Всего выполнений</p>
              <p className="text-xl font-semibold text-gray-800">{totalCompletions}</p>
            </div>
          </div>
        </motion.div>
        
        <motion.div 
          className="bg-white rounded-lg shadow-sm p-4 border border-gray-200"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-center">
            <div className="bg-orange-100 rounded-lg p-3 mr-3">
              <TrendingUp className="text-orange-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Лучшая серия</p>
              <p className="text-xl font-semibold text-gray-800">
                {longestStreak} {longestStreak === 1 ? 'день' : longestStreak >= 2 && longestStreak <= 4 ? 'дня' : 'дней'}
              </p>
            </div>
          </div>
        </motion.div>
      </div>
      
      {/* Ожидающие привычки */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">На сегодня ({pendingHabits.length})</h2>
          <Link 
            to="/add" 
            className="flex items-center text-blue-600 hover:text-blue-700 transition-colors duration-200"
          >
            <PlusCircle size={18} className="mr-1" />
            <span>Добавить привычку</span>
          </Link>
        </div>
        
        {habits.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-6 text-center border border-gray-200">
            <p className="text-gray-600 mb-4">У вас пока нет привычек для отслеживания.</p>
            <Link
              to="/add"
              className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200"
            >
              <PlusCircle size={18} className="mr-2" />
              Создать первую привычку
            </Link>
          </div>
        ) : pendingHabits.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-6 text-center border border-gray-200">
            <p className="text-gray-600">Все привычки на сегодня выполнены! 🎉</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pendingHabits.map((habit) => (
              <HabitCard key={habit.id} habit={habit} />
            ))}
          </div>
        )}
      </div>
      
      {/* Выполненные привычки */}
      {completedHabits.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Выполнено сегодня ({completedHabits.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {completedHabits.map((habit) => (
              <HabitCard key={habit.id} habit={habit} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;