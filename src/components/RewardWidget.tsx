import React, { useState } from 'react';
import { Award, Gift, TrendingUp } from 'lucide-react';
import { useRewards } from '../context/RewardContext';
import { motion, AnimatePresence } from 'framer-motion';

const RewardWidget: React.FC = () => {
  const { points, streak, canClaimDaily, claimDailyReward } = useRewards();
  const [showReward, setShowReward] = useState(false);
  const [claimedAmount, setClaimedAmount] = useState(0);

  const handleClaimReward = () => {
    if (canClaimDaily) {
      const amount = claimDailyReward();
      setClaimedAmount(amount);
      setShowReward(true);
      
      // Скрываем анимацию через 3 секунды
      setTimeout(() => {
        setShowReward(false);
      }, 3000);
    }
  };

  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl shadow-sm p-4 mb-6 border border-blue-100">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-blue-700 flex items-center">
          <Award className="mr-2" size={22} />
          Ежедневные награды
        </h2>
        <div className="bg-white px-3 py-1 rounded-full shadow-sm flex items-center">
          <Gift className="text-purple-500 mr-1" size={16} />
          <span className="font-medium text-gray-700">{points} очков</span>
        </div>
      </div>
      
      <div className="flex items-center mb-4">
        <div className="bg-blue-100 rounded-lg p-2 mr-3">
          <TrendingUp className="text-blue-600" size={20} />
        </div>
        <div>
          <p className="text-sm text-gray-600 mb-1">Текущая серия входов</p>
          <p className="font-semibold text-gray-800">
            {streak} {streak === 1 ? 'день' : streak >= 2 && streak <= 4 ? 'дня' : 'дней'} подряд
          </p>
        </div>
      </div>
      
      <button
        onClick={handleClaimReward}
        disabled={!canClaimDaily}
        className={`w-full py-2 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2
          ${canClaimDaily
            ? 'bg-blue-500 hover:bg-blue-600 text-white'
            : 'bg-gray-200 text-gray-500 cursor-not-allowed'
          }`}
      >
        <Award size={20} />
        {canClaimDaily ? 'Получить ежедневную награду' : 'Награда уже получена'}
      </button>
      
      <AnimatePresence>
        {showReward && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: -20 }}
            transition={{ duration: 0.3, type: 'spring' }}
            className="mt-4 bg-green-100 border border-green-200 rounded-lg p-3 text-center"
          >
            <p className="text-green-800 font-medium">+{claimedAmount} очков получено!</p>
            {streak >= 7 && <p className="text-sm text-green-700 mt-1">Бонус за 7+ дней подряд!</p>}
            {streak >= 3 && streak < 7 && <p className="text-sm text-green-700 mt-1">Бонус за 3+ дня подряд!</p>}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default RewardWidget;