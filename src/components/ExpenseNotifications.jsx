import React, { useEffect, useState } from 'react';
import { BellIcon, XMarkIcon } from '@heroicons/react/24/outline';

const ExpenseNotifications = ({ expenses, budgets }) => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const newNotifications = [];
    
    // Check for budget warnings
    const categorySpending = expenses.reduce((acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
      return acc;
    }, {});

    Object.entries(budgets).forEach(([category, budget]) => {
      const spent = categorySpending[category] || 0;
      const percentage = (spent / budget) * 100;
      
      if (percentage >= 90 && percentage < 100) {
        newNotifications.push({
          id: `budget-warning-${category}`,
          type: 'warning',
          message: `You've used ${percentage.toFixed(1)}% of your ${category} budget`
        });
      } else if (percentage >= 100) {
        newNotifications.push({
          id: `budget-exceeded-${category}`,
          type: 'alert',
          message: `You've exceeded your ${category} budget!`
        });
      }
    });

    // Check for unusual spending patterns
    const today = new Date();
    const recentExpenses = expenses.filter(expense => {
      const expenseDate = new Date(expense.date);
      const daysDiff = (today - expenseDate) / (1000 * 60 * 60 * 24);
      return daysDiff <= 7;
    });

    const weeklyTotal = recentExpenses.reduce((sum, expense) => sum + expense.amount, 0);
    if (weeklyTotal > 1000) {
      newNotifications.push({
        id: 'high-weekly-spending',
        type: 'info',
        message: `High spending detected: $${weeklyTotal.toFixed(2)} in the past week`
      });
    }

    setNotifications(newNotifications);
  }, [expenses, budgets]);

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  if (notifications.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 space-y-2">
      {notifications.map(notification => (
        <div
          key={notification.id}
          className={`p-4 rounded-lg shadow-lg flex items-center space-x-2 ${
            notification.type === 'alert' ? 'bg-red-100 text-red-800' :
            notification.type === 'warning' ? 'bg-yellow-100 text-yellow-800' :
            'bg-blue-100 text-blue-800'
          }`}
        >
          <BellIcon className="w-5 h-5" />
          <span>{notification.message}</span>
          <button
            onClick={() => removeNotification(notification.id)}
            className="ml-2 text-gray-500 hover:text-gray-700"
          >
            <XMarkIcon className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};

export default ExpenseNotifications;