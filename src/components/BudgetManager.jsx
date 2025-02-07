import React, { useState, useEffect } from 'react';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

const BudgetManager = ({ expenses }) => {
  const [budgets, setBudgets] = useState(() => {
    const saved = localStorage.getItem('budgets');
    return saved ? JSON.parse(saved) : {
      food: 500,
      transport: 200,
      utilities: 300,
      entertainment: 150,
      other: 200
    };
  });

  const [editing, setEditing] = useState(null);
  const [editValue, setEditValue] = useState('');

  useEffect(() => {
    localStorage.setItem('budgets', JSON.stringify(budgets));
  }, [budgets]);

  // Calculate spending by category
  const categorySpending = expenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {});

  const handleEditBudget = (category) => {
    setEditing(category);
    setEditValue(budgets[category].toString());
  };

  const handleSaveBudget = () => {
    if (editing && !isNaN(editValue)) {
      setBudgets(prev => ({
        ...prev,
        [editing]: parseFloat(editValue)
      }));
      setEditing(null);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4">Budget Tracking</h2>
      <div className="space-y-4">
        {Object.entries(budgets).map(([category, budget]) => {
          const spent = categorySpending[category] || 0;
          const percentage = (spent / budget) * 100;
          const isOverBudget = spent > budget;

          return (
            <div key={category} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="capitalize font-medium">{category}</span>
                  {editing === category ? (
                    <div className="flex items-center space-x-2">
                      <input
                        type="number"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        className="w-24 p-1 border rounded"
                      />
                      <button
                        onClick={handleSaveBudget}
                        className="text-green-500 hover:text-green-700"
                      >
                        Save
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleEditBudget(category)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <PencilIcon className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <div className="text-sm">
                  ${spent.toFixed(2)} / ${budget.toFixed(2)}
                </div>
              </div>
              <div className="relative pt-1">
                <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200">
                  <div
                    style={{ width: `${Math.min(percentage, 100)}%` }}
                    className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center ${
                      isOverBudget ? 'bg-red-500' : 'bg-blue-500'
                    }`}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BudgetManager;