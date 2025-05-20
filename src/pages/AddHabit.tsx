import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, Bookmark, AlarmClock, ArrowLeft } from 'lucide-react';
import { useHabits } from '../context/HabitContext';
import { motion } from 'framer-motion';

const AddHabit: React.FC = () => {
  const navigate = useNavigate();
  const { addHabit } = useHabits();
  
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [frequency, setFrequency] = useState('daily');
  const [color, setColor] = useState('#3B82F6');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Проверка валидации
    const newErrors: { [key: string]: string } = {};
    
    if (!name.trim()) {
      newErrors.name = 'Название привычки обязательно';
    } else if (name.length > 50) {
      newErrors.name = 'Название привычки не должно превышать 50 символов';
    }
    
    if (description.length > 200) {
      newErrors.description = 'Описание не должно превышать 200 символов';
    }
    
    setErrors(newErrors);
    
    // Если нет ошибок, добавляем привычку
    if (Object.keys(newErrors).length === 0) {
      addHabit({
        name,
        description,
        frequency,
        color
      });
      
      // Отображаем уведомление об успехе (можно добавить toast)
      alert('Привычка успешно добавлена!');
      
      // Перенаправляем на главную страницу
      navigate('/');
    }
  };

  return (
    <div className="page-transition max-w-2xl mx-auto">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-gray-600 hover:text-blue-600 mb-6 transition-colors duration-200"
      >
        <ArrowLeft size={20} className="mr-1" />
        Назад
      </button>
      
      <motion.div 
        className="bg-white rounded-lg shadow-md p-6 mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center mb-6">
          <div className="bg-blue-100 rounded-full p-3 mr-4">
            <PlusCircle className="text-blue-600" size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Добавить привычку</h1>
            <p className="text-gray-600">Создайте новую привычку для отслеживания</p>
          </div>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-gray-700 font-medium mb-2">
              Название привычки*
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 ${
                errors.name ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Например: Ежедневная зарядка"
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>
          
          <div className="mb-4">
            <label htmlFor="description" className="block text-gray-700 font-medium mb-2">
              Описание
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 ${
                errors.description ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Опишите вашу привычку подробнее"
              rows={3}
            ></textarea>
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">{errors.description}</p>
            )}
            <p className="text-gray-500 text-sm mt-1">
              {description.length}/200 символов
            </p>
          </div>
          
          <div className="mb-4">
            <label htmlFor="frequency" className="block text-gray-700 font-medium mb-2">
              Частота
            </label>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                className={`px-4 py-2 rounded-lg border transition-colors duration-200 ${
                  frequency === 'daily'
                    ? 'bg-blue-100 border-blue-300 text-blue-700'
                    : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
                onClick={() => setFrequency('daily')}
              >
                <AlarmClock size={16} className="inline-block mr-1" />
                Ежедневно
              </button>
              <button
                type="button"
                className={`px-4 py-2 rounded-lg border transition-colors duration-200 ${
                  frequency === 'weekly'
                    ? 'bg-blue-100 border-blue-300 text-blue-700'
                    : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
                onClick={() => setFrequency('weekly')}
              >
                <AlarmClock size={16} className="inline-block mr-1" />
                Еженедельно
              </button>
              <button
                type="button"
                className={`px-4 py-2 rounded-lg border transition-colors duration-200 ${
                  frequency === 'custom'
                    ? 'bg-blue-100 border-blue-300 text-blue-700'
                    : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
                onClick={() => setFrequency('custom')}
              >
                <AlarmClock size={16} className="inline-block mr-1" />
                Своя частота
              </button>
            </div>
          </div>
          
          <div className="mb-6">
            <label htmlFor="color" className="block text-gray-700 font-medium mb-2">
              Цвет
            </label>
            <div className="flex items-center">
              <div
                className="w-10 h-10 rounded-full mr-4 border border-gray-300"
                style={{ backgroundColor: color }}
              ></div>
              <input
                type="color"
                id="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-full h-10 cursor-pointer"
              />
            </div>
          </div>
          
          <div className="flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200"
            >
              Отмена
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200 flex items-center"
            >
              <Bookmark size={18} className="mr-1" />
              Создать привычку
            </button>
          </div>
        </form>
      </motion.div>
      
      <div className="bg-gray-50 rounded-lg border border-gray-200 p-4">
        <h3 className="font-medium text-gray-800 mb-2">Рекомендации по созданию привычек:</h3>
        <ul className="list-disc pl-5 text-gray-600 space-y-1">
          <li>Начните с малого: выбирайте простые, конкретные привычки</li>
          <li>Будьте реалистичны в своих ожиданиях</li>
          <li>Привязывайте новые привычки к существующим</li>
          <li>Отслеживайте свой прогресс ежедневно</li>
        </ul>
      </div>
    </div>
  );
};

export default AddHabit;