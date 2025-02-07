import { useState, useEffect } from 'react';
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import ExpenseAnalytics from './ExpenseAnalytics';
import ExpenseSummary from './ExpenseSummary';
import BudgetManager from './BudgetManager';
import SavingsGoals from './SavingsGoals';
import ExpenseNotifications from './ExpenseNotifications';
import AchievementSystem from './AchievementSystem';


const ExpenseTracker = () => {
  const [expenses, setExpenses] = useState(() => {
    const savedExpenses = localStorage.getItem('expenses');
    return savedExpenses ? JSON.parse(savedExpenses) : [];
  });
  
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    category: 'other',
    date: new Date().toISOString().slice(0, 10)
  });
  const [savingsGoals, setSavingsGoals] = useState(() => {
    const savedGoals = localStorage.getItem('savingsGoals');
    return savedGoals ? JSON.parse(savedGoals) : [];
  });

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

  useEffect(() => {
    localStorage.setItem('expenses', JSON.stringify(expenses));
  }, [expenses]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.description || !formData.amount) return;
    
    const newExpense = {
      id: Date.now(),
      ...formData,
      amount: parseFloat(formData.amount)
    };
    
    setExpenses(prev => [newExpense, ...prev]);
    setFormData({
      description: '',
      amount: '',
      category: 'other',
      date: new Date().toISOString().slice(0, 10)
    });
  };

  const deleteExpense = (id) => {
    setExpenses(prev => prev.filter(expense => expense.id !== id));
  };

  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);

  return (
    <div className="max-w-7xl mx-auto p-4">
        <ExpenseNotifications expenses={expenses} budgets={budgets} />
        <ExpenseSummary expenses={expenses} /> 
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Budget Manager */}
            <BudgetManager expenses={expenses} />
            
            {/* Savings Goals */}
            <SavingsGoals savingsGoals={savingsGoals} 
          setSavingsGoals={setSavingsGoals}/>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Achievement System */}
        <AchievementSystem 
          expenses={expenses} 
          savingsGoals={savingsGoals} 
        />
      </div>
      
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-2xl font-bold mb-4">Add New Expense</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1">Description</label>
              <input
                type="text"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                placeholder="What did you spend on?"
              />
            </div>
            <div>
              <label className="block mb-1">Amount</label>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                placeholder="0.00"
                step="0.01"
              />
            </div>
            <div>
              <label className="block mb-1">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              >
                <option value="food">Food</option>
                <option value="transport">Transport</option>
                <option value="utilities">Utilities</option>
                <option value="entertainment">Entertainment</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className="block mb-1">Date</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              />
            </div>
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex items-center"
          >
            <PlusIcon className="w-5 h-5 mr-2" />
            Add Expense
          </button>
        </form>
      </div>
      <ExpenseAnalytics expenses={expenses} />
      <div className="bg-white rounded-lg shadow p-6 mt-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Expense List</h2>
          <div className="text-lg font-semibold">
            Total: ₹{totalExpenses.toFixed(2)}
          </div>
        </div>
        
        <div className="space-y-4">
          {expenses.map(expense => (
            <div
              key={expense.id}
              className="flex items-center justify-between p-4 border rounded hover:bg-gray-50"
            >
              <div className="flex-1">
                <h3 className="font-semibold">{expense.description}</h3>
                <div className="text-sm text-gray-500">
                  {new Date(expense.date).toLocaleDateString()} • {expense.category}
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="font-semibold">₹{expense.amount.toFixed(2)}</span>
                <button
                  onClick={() => deleteExpense(expense.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <TrashIcon className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
          {expenses.length === 0 && (
            <div className="text-center text-gray-500 py-8">
              No expenses added yet. Start by adding one above!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExpenseTracker;