import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Settings, Pencil, Trash2, ChevronDown, ArrowLeft, 
  ChevronUp, Calendar, CheckCircle, XCircle, Info, Save
} from 'lucide-react';
import { useHabits } from '../context/HabitContext';
import { formatDate, getDaysBetween } from '../utils/dateUtils';
import { Habit } from '../types/habit';
import { motion, AnimatePresence } from 'framer-motion';

interface EditingHabit extends Habit {
  isEditing: boolean;
  newName: string;
  newDescription: string;
  newColor: string;
}

const ManageHabits: React.FC = () => {
  const navigate = useNavigate();
  const { habits, updateHabit, deleteHabit } = useHabits();
  const [expandedHabit, setExpandedHabit] = useState<string | null>(null);
  const [editingHabits, setEditingHabits] = useState<{ [key: string]: EditingHabit }>({});

  const toggleExpand = (id: string) => {
    setExpandedHabit(expandedHabit === id ? null : id);
  };

  const startEditing = (habit: Habit) => {
    setEditingHabits({
      ...editingHabits,
      [habit.id]: {
        ...habit,
        isEditing: true,
        newName: habit.name,
        newDescription: habit.description,
        newColor: habit.color
      }
    });
  };

  const cancelEditing = (id: string) => {
    const updatedEditing = { ...editingHabits };
    delete updatedEditing[id];
    setEditingHabits(updatedEditing);
  };

  const saveEditing = (id: string) => {
    const editedHabit = editingHabits[id];
    if (editedHabit) {
      updateHabit(id, {
        name: editedHabit.newName,
        description: editedHabit.newDescription,
        color: editedHabit.newColor
      });
      
      cancelEditing(id);
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Вы уверены, что хотите удалить эту привычку?')) {
      deleteHabit(id);
      if (expandedHabit === id) {
        setExpandedHabit(null);
      }
    }
  };

  const getProgressStatistics = (habit: Habit) => {
    const totalDays = getDaysBetween(new Date(habit.createdAt), new Date());
    const completedDays = Object.values(habit.progress).filter(
      (status) => status === 'completed'
    ).length;
    const skippedDays = Object.values(habit.progress).filter(
      (status) => status === 'skipped'
    ).length;
    
    const completionRate = totalDays > 0 ? Math.round((completedDays / totalDays) * 100) : 0;
    
    return {
      totalDays,
      completedDays,
      skippedDays,
      completionRate
    };
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
            <Settings className="text-blue-600" size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Управление привычками</h1>
            <p className="text-gray-600">Редактируйте или удаляйте свои привычки</p>
          </div>
        </div>
        
        {habits.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">У вас пока нет привычек для управления.</p>
            <button
              onClick={() => navigate('/add')}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200"
            >
              Создать первую привычку
            </button>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {habits.map((habit) => {
              const { totalDays, completedDays, skippedDays, completionRate } = getProgressStatistics(habit);
              const isEditing = editingHabits[habit.id]?.isEditing || false;
              
              return (
                <div key={habit.id} className="py-4">
                  <div className="flex items-center justify-between">
                    <div 
                      className="flex items-center cursor-pointer flex-1"
                      onClick={() => !isEditing && toggleExpand(habit.id)}
                    >
                      <div 
                        className="w-4 h-10 rounded-sm mr-3"
                        style={{ backgroundColor: habit.color }}
                      ></div>
                      
                      {isEditing ? (
                        <input
                          type="text"
                          value={editingHabits[habit.id].newName}
                          onChange={(e) => {
                            setEditingHabits({
                              ...editingHabits,
                              [habit.id]: {
                                ...editingHabits[habit.id],
                                newName: e.target.value
                              }
                            });
                          }}
                          className="flex-1 px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          onClick={(e) => e.stopPropagation()}
                        />
                      ) : (
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-800">{habit.name}</h3>
                          <p className="text-sm text-gray-500 truncate">{habit.description}</p>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {isEditing ? (
                        <>
                          <button
                            onClick={() => saveEditing(habit.id)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-full"
                            title="Сохранить"
                          >
                            <Save size={18} />
                          </button>
                          <button
                            onClick={() => cancelEditing(habit.id)}
                            className="p-2 text-gray-500 hover:bg-gray-100 rounded-full"
                            title="Отмена"
                          >
                            <XCircle size={18} />
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => startEditing(habit)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-full"
                            title="Редактировать"
                          >
                            <Pencil size={18} />
                          </button>
                          <button
                            onClick={() => handleDelete(habit.id)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-full"
                            title="Удалить"
                          >
                            <Trash2 size={18} />
                          </button>
                          <button
                            onClick={() => toggleExpand(habit.id)}
                            className="p-2 text-gray-500 hover:bg-gray-100 rounded-full"
                            title={expandedHabit === habit.id ? "Свернуть" : "Развернуть"}
                          >
                            {expandedHabit === habit.id ? (
                              <ChevronUp size={18} />
                            ) : (
                              <ChevronDown size={18} />
                            )}
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                  
                  <AnimatePresence>
                    {(expandedHabit === habit.id || isEditing) && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="mt-4 pl-7 overflow-hidden"
                      >
                        {isEditing ? (
                          <div className="space-y-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Описание
                              </label>
                              <textarea
                                value={editingHabits[habit.id].newDescription}
                                onChange={(e) => {
                                  setEditingHabits({
                                    ...editingHabits,
                                    [habit.id]: {
                                      ...editingHabits[habit.id],
                                      newDescription: e.target.value
                                    }
                                  });
                                }}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                rows={3}
                              ></textarea>
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Цвет
                              </label>
                              <div className="flex items-center">
                                <div
                                  className="w-8 h-8 rounded-full mr-3 border"
                                  style={{ backgroundColor: editingHabits[habit.id].newColor }}
                                ></div>
                                <input
                                  type="color"
                                  value={editingHabits[habit.id].newColor}
                                  onChange={(e) => {
                                    setEditingHabits({
                                      ...editingHabits,
                                      [habit.id]: {
                                        ...editingHabits[habit.id],
                                        newColor: e.target.value
                                      }
                                    });
                                  }}
                                  className="h-8"
                                />
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="bg-gray-50 p-3 rounded-lg">
                                <div className="flex items-center mb-2">
                                  <Calendar size={16} className="text-gray-500 mr-1" />
                                  <span className="text-sm font-medium text-gray-700">
                                    Всего дней отслеживания
                                  </span>
                                </div>
                                <p className="text-xl font-semibold text-gray-800">{totalDays}</p>
                              </div>
                              
                              <div className="bg-gray-50 p-3 rounded-lg">
                                <div className="flex items-center mb-2">
                                  <Info size={16} className="text-gray-500 mr-1" />
                                  <span className="text-sm font-medium text-gray-700">
                                    Процент выполнения
                                  </span>
                                </div>
                                <p className="text-xl font-semibold text-gray-800">{completionRate}%</p>
                              </div>
                              
                              <div className="bg-gray-50 p-3 rounded-lg">
                                <div className="flex items-center mb-2">
                                  <CheckCircle size={16} className="text-green-500 mr-1" />
                                  <span className="text-sm font-medium text-gray-700">
                                    Дней выполнено
                                  </span>
                                </div>
                                <p className="text-xl font-semibold text-green-600">{completedDays}</p>
                              </div>
                              
                              <div className="bg-gray-50 p-3 rounded-lg">
                                <div className="flex items-center mb-2">
                                  <XCircle size={16} className="text-gray-500 mr-1" />
                                  <span className="text-sm font-medium text-gray-700">
                                    Дней пропущено
                                  </span>
                                </div>
                                <p className="text-xl font-semibold text-gray-600">{skippedDays}</p>
                              </div>
                            </div>
                            
                            <div>
                              <h4 className="font-medium text-gray-700 mb-2">Прогресс</h4>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div 
                                  className="bg-green-500 h-2 rounded-full" 
                                  style={{ width: `${completionRate}%` }}
                                ></div>
                              </div>
                            </div>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        )}
      </motion.div>
      
      <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
        <h3 className="flex items-center font-medium text-yellow-800 mb-2">
          <Info size={18} className="mr-2" />
          Внимание
        </h3>
        <p className="text-yellow-700">
          Удаление привычки приведет к потере всей истории и прогресса. Это действие нельзя отменить.
        </p>
      </div>
    </div>
  );
};

export default ManageHabits;