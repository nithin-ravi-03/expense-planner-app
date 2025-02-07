import React, { useMemo } from 'react';
import { ChartBarIcon, ArrowTrendingUpIcon, ArrowTrendingDownIcon, CalendarIcon } from '@heroicons/react/24/outline';

const ExpenseSummary = ({ expenses }) => {
  const stats = useMemo(() => {
    const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    const today = new Date().toISOString().split('T')[0];
    const todayExpenses = expenses
      .filter(expense => expense.date === today)
      .reduce((sum, expense) => sum + expense.amount, 0);
    
    // Get highest spending category
    const categoryTotals = expenses.reduce((acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
      return acc;
    }, {});
    const highestCategory = Object.entries(categoryTotals)
      .sort(([,a], [,b]) => b - a)[0];
    
    return {
      totalSpent: total,
      todaySpent: todayExpenses,
      highestCategory: highestCategory ? {
        name: highestCategory[0],
        amount: highestCategory[1]
      } : { name: 'N/A', amount: 0 },
      averagePerDay: total / (expenses.length || 1)
    };
  }, [expenses]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center">
          <ChartBarIcon className="w-12 h-12 text-blue-500" />
          <div className="ml-4">
            <h3 className="text-lg font-semibold text-gray-500">Total Spent</h3>
            <p className="text-2xl font-bold">₹{stats.totalSpent.toFixed(2)}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center">
          <CalendarIcon className="w-12 h-12 text-green-500" />
          <div className="ml-4">
            <h3 className="text-lg font-semibold text-gray-500">Today's Expenses</h3>
            <p className="text-2xl font-bold">₹{stats.todaySpent.toFixed(2)}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center">
          <ArrowTrendingUpIcon className="w-12 h-12 text-red-500" />
          <div className="ml-4">
            <h3 className="text-lg font-semibold text-gray-500">Highest Category</h3>
            <p className="text-2xl font-bold capitalize">{stats.highestCategory.name}</p>
            <p className="text-sm text-gray-500">₹{stats.highestCategory.amount.toFixed(2)}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center">
          <ArrowTrendingDownIcon className="w-12 h-12 text-purple-500" />
          <div className="ml-4">
            <h3 className="text-lg font-semibold text-gray-500">Average Per Day</h3>
            <p className="text-2xl font-bold">₹{stats.averagePerDay.toFixed(2)}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpenseSummary;