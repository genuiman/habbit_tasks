import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart2, TrendingUp, Calendar, ArrowLeft, CheckCircle, XCircle, Clock } from 'lucide-react';
import { useHabits } from '../context/HabitContext';
import { formatDate, getDaysBetween, getLastNDays } from '../utils/dateUtils';
import { motion } from 'framer-motion';

const Statistics: React.FC = () => {
  const navigate = useNavigate();
  const { habits, calculateStreak } = useHabits();
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'year'>('week');
  const chartRef = useRef<HTMLCanvasElement>(null);
  const [chartInstance, setChartInstance] = useState<any>(null);

  // Получаем общую статистику
  const totalHabits = habits.length;
  
  const totalCompletions = habits.reduce((total, habit) => {
    return total + Object.values(habit.progress).filter(status => status === 'completed').length;
  }, 0);
  
  const totalSkipped = habits.reduce((total, habit) => {
    return total + Object.values(habit.progress).filter(status => status === 'skipped').length;
  }, 0);
  
  const streaks = habits.map(habit => ({
    name: habit.name,
    streak: calculateStreak(habit)
  })).sort((a, b) => b.streak - a.streak);
  
  const bestStreak = streaks.length > 0 ? streaks[0] : null;
  
  // Получаем данные для графика по дням
  const getDaysForSelectedPeriod = () => {
    switch (selectedPeriod) {
      case 'week':
        return 7;
      case 'month':
        return 30;
      case 'year':
        return 365;
      default:
        return 7;
    }
  };
  
  // Подготавливаем данные для графика
  const prepareDailyCompletionData = () => {
    const days = getDaysForSelectedPeriod();
    const dateLabels = getLastNDays(days).map(date => formatDate(date));
    
    // Инициализируем счётчики для каждого дня
    const completionsPerDay: { [key: string]: number } = {};
    dateLabels.forEach(date => {
      completionsPerDay[date] = 0;
    });
    
    // Считаем выполненные привычки для каждого дня
    habits.forEach(habit => {
      Object.entries(habit.progress).forEach(([date, status]) => {
        if (dateLabels.includes(date) && status === 'completed') {
          completionsPerDay[date] += 1;
        }
      });
    });
    
    // Преобразуем в формат для графика
    return {
      labels: dateLabels.map(date => new Date(date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })),
      values: dateLabels.map(date => completionsPerDay[date])
    };
  };
  
  // Отрисовка графика
  useEffect(() => {
    const loadAndRenderChart = async () => {
      try {
        // Импортируем Chart.js динамически
        const chartModule = await import('chart.js');
        const { Chart, registerables } = chartModule;
        Chart.register(...registerables);
        
        // Получаем данные для графика
        const { labels, values } = prepareDailyCompletionData();
        
        // Если уже есть экземпляр графика, уничтожаем его
        if (chartInstance) {
          chartInstance.destroy();
        }
        
        // Создаем новый график
        if (chartRef.current) {
          const ctx = chartRef.current.getContext('2d');
          if (ctx) {
            const newChartInstance = new Chart(ctx, {
              type: 'bar',
              data: {
                labels,
                datasets: [
                  {
                    label: 'Выполненных привычек',
                    data: values,
                    backgroundColor: 'rgba(59, 130, 246, 0.7)',
                    borderColor: 'rgba(59, 130, 246, 1)',
                    borderWidth: 1,
                    borderRadius: 4,
                  }
                ]
              },
              options: {
                responsive: true,
                plugins: {
                  legend: {
                    display: false
                  },
                  tooltip: {
                    callbacks: {
                      title: function(tooltipItems) {
                        return tooltipItems[0].label;
                      },
                      label: function(context) {
                        const value = context.raw as number;
                        return `Выполнено: ${value} ${getNumEnding(value, ['привычка', 'привычки', 'привычек'])}`;
                      }
                    }
                  }
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    ticks: {
                      precision: 0
                    }
                  }
                }
              }
            });
            
            setChartInstance(newChartInstance);
          }
        }
      } catch (error) {
        console.error('Ошибка при загрузке Chart.js:', error);
      }
    };
    
    loadAndRenderChart();
    
    return () => {
      if (chartInstance) {
        chartInstance.destroy();
      }
    };
  }, [habits, selectedPeriod]);
  
  // Функция для правильного склонения слов
  const getNumEnding = (number: number, endings: [string, string, string]): string => {
    const cases = [2, 0, 1, 1, 1, 2];
    return endings[
      number % 100 > 4 && number % 100 < 20 
        ? 2 
        : cases[Math.min(number % 10, 5)]
    ];
  };
  
  return (
    <div className="page-transition max-w-4xl mx-auto">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-gray-600 hover:text-blue-600 mb-6 transition-colors duration-200"
      >
        <ArrowLeft size={20} className="mr-1" />
        Назад
      </button>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-lg shadow-md p-6 mb-6"
      >
        <div className="flex items-center mb-6">
          <div className="bg-blue-100 rounded-full p-3 mr-4">
            <BarChart2 className="text-blue-600" size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Статистика привычек</h1>
            <p className="text-gray-600">Обзор вашего прогресса и достижений</p>
          </div>
        </div>
        
        {habits.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">У вас пока нет привычек для отображения статистики.</p>
            <button
              onClick={() => navigate('/add')}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200"
            >
              Создать первую привычку
            </button>
          </div>
        ) : (
          <>
            {/* Общая статистика */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-blue-50 rounded-lg p-4 border border-blue-100"
              >
                <div className="flex items-center mb-3">
                  <div className="bg-blue-100 rounded-lg p-2 mr-2">
                    <TrendingUp size={18} className="text-blue-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-600">Привычек</span>
                </div>
                <p className="text-2xl font-bold text-gray-800">{totalHabits}</p>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-green-50 rounded-lg p-4 border border-green-100"
              >
                <div className="flex items-center mb-3">
                  <div className="bg-green-100 rounded-lg p-2 mr-2">
                    <CheckCircle size={18} className="text-green-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-600">Выполнено</span>
                </div>
                <p className="text-2xl font-bold text-gray-800">{totalCompletions}</p>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-gray-50 rounded-lg p-4 border border-gray-200"
              >
                <div className="flex items-center mb-3">
                  <div className="bg-gray-200 rounded-lg p-2 mr-2">
                    <XCircle size={18} className="text-gray-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-600">Пропущено</span>
                </div>
                <p className="text-2xl font-bold text-gray-800">{totalSkipped}</p>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-orange-50 rounded-lg p-4 border border-orange-100"
              >
                <div className="flex items-center mb-3">
                  <div className="bg-orange-100 rounded-lg p-2 mr-2">
                    <Calendar size={18} className="text-orange-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-600">Лучшая серия</span>
                </div>
                <p className="text-2xl font-bold text-gray-800">
                  {bestStreak ? bestStreak.streak : 0}
                </p>
                {bestStreak && bestStreak.streak > 0 && (
                  <p className="text-xs text-gray-500 truncate mt-1">{bestStreak.name}</p>
                )}
              </motion.div>
            </div>
            
            {/* График выполнения привычек */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-800">
                  Динамика выполнения привычек
                </h2>
                <div className="flex space-x-1">
                  <button
                    onClick={() => setSelectedPeriod('week')}
                    className={`px-3 py-1 text-sm rounded-md transition-colors ${
                      selectedPeriod === 'week'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Неделя
                  </button>
                  <button
                    onClick={() => setSelectedPeriod('month')}
                    className={`px-3 py-1 text-sm rounded-md transition-colors ${
                      selectedPeriod === 'month'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Месяц
                  </button>
                  <button
                    onClick={() => setSelectedPeriod('year')}
                    className={`px-3 py-1 text-sm rounded-md transition-colors ${
                      selectedPeriod === 'year'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Год
                  </button>
                </div>
              </div>
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <canvas ref={chartRef}></canvas>
              </div>
            </div>
            
            {/* Топ привычек */}
            {streaks.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold text-gray-800 mb-4">
                  Лучшие серии привычек
                </h2>
                <div className="space-y-3">
                  {streaks.slice(0, 5).map((item, index) => (
                    <div 
                      key={index}
                      className="bg-white p-3 rounded-lg border border-gray-200 flex justify-between items-center"
                    >
                      <div className="flex items-center">
                        <div className="bg-blue-100 rounded-full w-8 h-8 flex items-center justify-center text-blue-700 font-bold mr-3">
                          {index + 1}
                        </div>
                        <span className="font-medium text-gray-800">{item.name}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock size={16} className="text-blue-500 mr-1" />
                        <span className="font-semibold text-blue-700">
                          {item.streak} {getNumEnding(item.streak, ['день', 'дня', 'дней'])}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </motion.div>
    </div>
  );
};

export default Statistics;