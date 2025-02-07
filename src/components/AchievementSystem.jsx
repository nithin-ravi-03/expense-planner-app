import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  TrophyIcon, 
  FireIcon, 
  StarIcon, 
  LightBulbIcon, 
  GiftIcon 
} from '@heroicons/react/24/outline';

const CHALLENGES = [
  {
    id: 'daily_tracking',
    title: 'Daily Expense Tracker',
    description: 'Log expenses for 7 consecutive days',
    reward: 50,
    icon: FireIcon,
    type: 'streak'
  },
  {
    id: 'budget_master',
    title: 'Budget Master',
    description: 'Stay under budget in 3 categories for a month',
    reward: 100,
    icon: TrophyIcon,
    type: 'monthly'
  },
  {
    id: 'savings_champion',
    title: 'Savings Champion',
    description: 'Save 20% of your income this month',
    reward: 150,
    icon: StarIcon,
    type: 'monthly'
  },
  {
    id: 'expense_reducer',
    title: 'Expense Reducer',
    description: 'Reduce spending by 10% compared to last month',
    reward: 75,
    icon: LightBulbIcon,
    type: 'comparative'
  }
];

const ACHIEVEMENTS = [
  {
    id: 'first_expense',
    title: 'First Step',
    description: 'Log your first expense',
    reward: 25,
    icon: GiftIcon
  },
  {
    id: 'monthly_budget_pro',
    title: 'Budget Pro',
    description: 'Complete 3 monthly challenges',
    reward: 100,
    icon: TrophyIcon
  }
];

const AchievementSystem = ({ expenses = [], savingsGoals = [] }) => {
  const [userPoints, setUserPoints] = useState(() => {
    return parseInt(localStorage.getItem('userPoints') || '0');
  });

  const [completedChallenges, setCompletedChallenges] = useState(() => {
    const saved = localStorage.getItem('completedChallenges');
    return saved ? JSON.parse(saved) : [];
  });

  const [unlockedAchievements, setUnlockedAchievements] = useState(() => {
    const saved = localStorage.getItem('unlockedAchievements');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('userPoints', userPoints.toString());
  }, [userPoints]);

  useEffect(() => {
    localStorage.setItem('completedChallenges', JSON.stringify(completedChallenges));
  }, [completedChallenges]);

  useEffect(() => {
    localStorage.setItem('unlockedAchievements', JSON.stringify(unlockedAchievements));
  }, [unlockedAchievements]);

  // Challenge Completion Logic
  useEffect(() => {
    const checkChallenges = () => {
      CHALLENGES.forEach(challenge => {
        if (!completedChallenges.includes(challenge.id)) {
          let isCompleted = false;

          switch (challenge.id) {
            case 'daily_tracking':
              // Check for 7 consecutive days of expense tracking
              const uniqueDates = new Set(expenses.map(e => e.date));
              isCompleted = uniqueDates.size >= 7;
              break;

            case 'budget_master':
              // Placeholder for budget mastery
              isCompleted = false;
              break;

            case 'savings_champion':
              // Check if savings goal progress meets criteria
              const totalSavings = savingsGoals.reduce((sum, goal) => 
                sum + (goal.currentAmount || 0), 0);
              isCompleted = totalSavings > 0;
              break;

            case 'expense_reducer':
              // Placeholder for expense reduction
              isCompleted = false;
              break;
          }

          if (isCompleted) {
            setCompletedChallenges(prev => [...prev, challenge.id]);
            setUserPoints(prev => prev + challenge.reward);
          }
        }
      });
    };

    checkChallenges();
  }, [expenses, savingsGoals, completedChallenges]);

  // Achievements Logic
  useEffect(() => {
    const checkAchievements = () => {
      ACHIEVEMENTS.forEach(achievement => {
        if (!unlockedAchievements.includes(achievement.id)) {
          let isUnlocked = false;

          switch (achievement.id) {
            case 'first_expense':
              isUnlocked = expenses.length > 0;
              break;

            case 'monthly_budget_pro':
              isUnlocked = completedChallenges.length >= 3;
              break;
          }

          if (isUnlocked) {
            setUnlockedAchievements(prev => [...prev, achievement.id]);
            setUserPoints(prev => prev + achievement.reward);
          }
        }
      });
    };

    checkAchievements();
  }, [expenses, completedChallenges]);

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Gamification Dashboard</h2>
        <div className="flex items-center space-x-2">
          <StarIcon className="w-6 h-6 text-yellow-500" />
          <span className="text-lg font-bold">{userPoints} Points</span>
        </div>
      </div>

      {/* Challenges Section */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-4">Active Challenges</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {CHALLENGES.map(challenge => {
            const isCompleted = completedChallenges.includes(challenge.id);
            const Icon = challenge.icon;

            return (
              <motion.div
                key={challenge.id}
                whileHover={{ scale: 1.05 }}
                className={`p-4 rounded-lg border ${
                  isCompleted 
                    ? 'bg-green-50 border-green-200' 
                    : 'bg-gray-50 border-gray-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Icon 
                      className={`w-8 h-8 ${
                        isCompleted ? 'text-green-500' : 'text-gray-500'
                      }`} 
                    />
                    <div>
                      <h4 className="font-semibold">{challenge.title}</h4>
                      <p className="text-sm text-gray-600">{challenge.description}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-bold text-yellow-600">
                      +{challenge.reward} Points
                    </span>
                    {isCompleted && (
                      <span className="block text-xs text-green-600 mt-1">
                        Completed
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Achievements Section */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Achievements</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {ACHIEVEMENTS.map(achievement => {
            const isUnlocked = unlockedAchievements.includes(achievement.id);
            const Icon = achievement.icon;

            return (
              <motion.div
                key={achievement.id}
                whileHover={{ scale: 1.05 }}
                className={`p-4 rounded-lg border ${
                  isUnlocked 
                    ? 'bg-yellow-50 border-yellow-200' 
                    : 'bg-gray-50 border-gray-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Icon 
                      className={`w-8 h-8 ${
                        isUnlocked ? 'text-yellow-500' : 'text-gray-500'
                      }`} 
                    />
                    <div>
                      <h4 className="font-semibold">{achievement.title}</h4>
                      <p className="text-sm text-gray-600">{achievement.description}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-bold text-yellow-600">
                      +{achievement.reward} Points
                    </span>
                    {isUnlocked && (
                      <span className="block text-xs text-yellow-600 mt-1">
                        Unlocked
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AchievementSystem;