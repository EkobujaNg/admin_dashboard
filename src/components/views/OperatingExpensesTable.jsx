"use client";

import React, { useState, useEffect } from "react";
import { FaPlus, FaTrash } from "react-icons/fa";

const OperatingExpensesTable = ({ expenses = [], onChange }) => {
  const [expenseItems, setExpenseItems] = useState(expenses || []);

  // Sync with parent when expenses prop changes
  useEffect(() => {
    setExpenseItems(expenses || []);
  }, [expenses]);

  const handleAddExpense = () => {
    const newExpense = {
      id: Date.now(),
      name: "",
      amount: "",
    };
    const updatedExpenses = [...expenseItems, newExpense];
    setExpenseItems(updatedExpenses);
    onChange(updatedExpenses);
  };

  const handleUpdateExpense = (id, field, value) => {
    const updatedExpenses = expenseItems.map((expense) => {
      if (expense.id === id) {
        return { ...expense, [field]: value };
      }
      return expense;
    });
    setExpenseItems(updatedExpenses);
    onChange(updatedExpenses);
  };

  const handleDeleteExpense = (id) => {
    const updatedExpenses = expenseItems.filter((expense) => expense.id !== id);
    setExpenseItems(updatedExpenses);
    onChange(updatedExpenses);
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      <h3 className="text-primary-10 font-Raleway font-bold text-lg">Operating Expenses (Annual)</h3>
      
      {expenseItems.length > 0 && (
        <div className="flex flex-col gap-3 w-full">
          {expenseItems.map((expense) => (
            <div key={expense.id} className="flex items-center gap-4 p-4 rounded-lg border border-opacityClr-30 bg-opacityClr-10">
              <div className="flex-1">
                <input
                  type="text"
                  value={expense.name}
                  onChange={(e) => handleUpdateExpense(expense.id, "name", e.target.value)}
                  placeholder="e.g., Security Payments (₦)"
                  className="w-full px-4 py-3 rounded-lg border border-opacityClr-30 bg-white text-primary-10 font-Raleway text-sm outline-none focus:border-primary-10 transition-colors"
                />
              </div>
              <div className="flex-1">
                <input
                  type="number"
                  value={expense.amount}
                  onChange={(e) => handleUpdateExpense(expense.id, "amount", e.target.value)}
                  placeholder="0"
                  min="0"
                  className="w-full px-4 py-3 rounded-lg border border-opacityClr-30 bg-white text-primary-10 font-Raleway text-sm outline-none focus:border-primary-10 transition-colors"
                />
              </div>
              <button
                onClick={() => handleDeleteExpense(expense.id)}
                className="flex items-center justify-center w-10 h-10 rounded-lg border border-red-200 bg-transparent hover:bg-red-50 transition-colors"
              >
                <FaTrash className="text-red-500" size={14} />
              </button>
            </div>
          ))}
        </div>
      )}

      <button
        onClick={handleAddExpense}
        className="flex items-center justify-center gap-2 px-4 py-3 bg-primary-10 text-white font-Raleway font-semibold text-sm rounded-lg hover:bg-primary-10/90 transition-colors w-fit"
      >
        <FaPlus size={16} />
        <span>Add Expense</span>
      </button>
    </div>
  );
};

export default OperatingExpensesTable;

