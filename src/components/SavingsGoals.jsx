import React, { useState, useEffect } from 'react';
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline';

const SavingsGoals = () => {
  const [goals, setGoals] = useState(() => {
    const saved = localStorage.getItem('savingsGoals');
    return saved ? JSON.parse(saved) : [];
  });

  const [newGoal, setNewGoal] = useState({
    name: '',
    targetAmount: '',
    currentAmount: '',
    deadline: ''
  });

  useEffect(() => {
    localStorage.setItem('savingsGoals', JSON.stringify(goals));
  }, [goals]);

  const handleAddGoal = (e) => {
    e.preventDefault();
    if (!newGoal.name || !newGoal.targetAmount) return;

    setGoals(prev => [...prev, {
      ...newGoal,
      id: Date.now(),
      targetAmount: parseFloat(newGoal.targetAmount),
      currentAmount: parseFloat(newGoal.currentAmount) || 0
    }]);

    setNewGoal({
      name: '',
      targetAmount: '',
      currentAmount: '',
      deadline: ''
    });
  };

  const handleUpdateProgress = (goalId, amount) => {
    setGoals(prev => prev.map(goal => {
      if (goal.id === goalId) {
        return {
          ...goal,
          currentAmount: parseFloat(amount) || 0
        };
      }
      return goal;
    }));
  };

  const handleDeleteGoal = (goalId) => {
    setGoals(prev => prev.filter(goal => goal.id !== goalId));
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4">Savings Goals</h2>
      
      {/* Add New Goal Form */}
      <form onSubmit={handleAddGoal} className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="text"
          placeholder="Goal Name"
          value={newGoal.name}
          onChange={(e) => setNewGoal(prev => ({ ...prev, name: e.target.value }))}
          className="p-2 border rounded"
        />
        <input
          type="number"
          placeholder="Target Amount (₹)"
          value={newGoal.targetAmount}
          onChange={(e) => setNewGoal(prev => ({ ...prev, targetAmount: e.target.value }))}
          className="p-2 border rounded"
        />
        <input
          type="number"
          placeholder="Current Amount ₹(optional)"
          value={newGoal.currentAmount}
          onChange={(e) => setNewGoal(prev => ({ ...prev, currentAmount: e.target.value }))}
          className="p-2 border rounded"
        />
        <input
          type="date"
          placeholder="Deadline (optional)"
          value={newGoal.deadline}
          onChange={(e) => setNewGoal(prev => ({ ...prev, deadline: e.target.value }))}
          className="p-2 border rounded"
        />
        <button
          type="submit"
          className="md:col-span-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex items-center justify-center"
        >
          <PlusIcon className="w-5 h-5 mr-2" />
          Add Goal
        </button>
      </form>

      {/* Goals List */}
      <div className="space-y-4">
        {goals.map(goal => {
          const progress = (goal.currentAmount / goal.targetAmount) * 100;
          
          return (
            <div key={goal.id} className="border rounded p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-semibold">{goal.name}</h3>
                  {goal.deadline && (
                    <p className="text-sm text-gray-500">
                      Deadline: {new Date(goal.deadline).toLocaleDateString()}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => handleDeleteGoal(goal.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <TrashIcon className="w-5 h-5" />
                </button>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progress: {progress.toFixed(1)}%</span>
                  <span>₹{goal.currentAmount} / ₹{goal.targetAmount}</span>
                </div>
                <div className="relative pt-1">
                  <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200">
                    <div
                      style={{ width: `${progress}%` }}
                      className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-500"
                    />
                  </div>
                </div>
                <input
                  type="number"
                  value={goal.currentAmount}
                  onChange={(e) => handleUpdateProgress(goal.id, e.target.value)}
                  className="w-full p-2 border rounded mt-2"
                  placeholder="Update progress"
                />
              </div>
            </div>
          );
        })}
        {goals.length === 0 && (
          <p className="text-center text-gray-500">No savings goals yet. Add one above!</p>
        )}
      </div>
    </div>
  );
};

export default SavingsGoals;