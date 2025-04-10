// SetBudget.tsx – Monthly budget input + project save mutation

import React, { useEffect, useState } from 'react';
import { gql, useMutation } from '@apollo/client';
import { Budget } from '../types/budget1';
import { stripTypenameDeep } from '../utils/stripTypename';

const UPDATE_BUDGET = gql`
  mutation UpdateBudget($projectId: ID!, $budgetData: [BudgetEntryInput!]!) {
    updateBudgetData(projectId: $projectId, budgetData: $budgetData) {
      id
      budgetData {
        category
        amount
        type
        recurring
        note
      }
    }
  }
`;

interface SetBudgetProps {
  initialData?: Budget;
  onSave?: (data: Budget) => Promise<void>;
  projectId: string;
}

const SetBudget: React.FC<SetBudgetProps> = ({ initialData, onSave, projectId }) => {
  const fallback: Budget = {
    food: 0,
    gas: 0,
    rent: 0,
    clothes: 0,
    recreation: 0,
    utilities: 0,
    otherAmount: 0,
    otherNote: '',
  };
  
  const [budget, setBudget] = useState<Budget>(() =>
    { return { ...fallback, ...(initialData || {}) }; }
  );

  useEffect(() => {
    if (initialData) {
      setBudget({ ...fallback, ...initialData });
    }
  }, [initialData]);  

  const [updateBudget, { loading, error }] = useMutation(UPDATE_BUDGET);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBudget(prev => ({
      ...prev,
      [name]: name === 'otherNote' ? value : parseFloat(value || '0')
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    const budgetEntries = Object.entries(budget)
      .filter(([key]) => key !== 'otherNote')
      .map(([category, amount]) => ({
        category,
        amount,
        type: 'expense',
        recurring: false,
        note: category === 'otherAmount' ? budget.otherNote : ''
      }));
  
    const cleaned = stripTypenameDeep(budgetEntries); 
  
    try {
      const response = await updateBudget({
        variables: {
          projectId,
          budgetData: cleaned,
        },
      });
  
      console.log('[✅ Budget updated]', response.data);
      alert('Budget saved successfully!');
  
      if (onSave) await onSave(budget);
    } catch (err) {
      console.error('❌ Submission error:', err);
    }
  
    localStorage.setItem('userBudget', JSON.stringify(budget));
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-white shadow-md rounded-xl mt-6">
      <h2 className="text-xl font-bold mb-4 text-center">Set Your Monthly Budget</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {['food', 'gas', 'rent', 'clothes', 'recreation', 'utilities'].map(category => (
          <div key={category}>
            <label htmlFor={category} className="block font-medium capitalize">
              {category} ($):
            </label>
            <input
              id={category}
              type="number"
              name={category}
              placeholder={`Enter amount for ${category}`}
              value={budget[category as keyof Budget]}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2 mt-1"
              min="0"
              required
            />
          </div>
        ))}

        <div>
          <label htmlFor="otherAmount" className="block font-medium">Other ($):</label>
          <input
            id="otherAmount"
            type="number"
            name="otherAmount"
            placeholder="E.g., $50"
            value={budget.otherAmount}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2 mt-1"
            min="0"
          />
        </div>

        <div>
          <label htmlFor="otherNote" className="block font-medium">Note for Other:</label>
          <input
            id="otherNote"
            type="text"
            name="otherNote"
            placeholder="E.g., gifts, pet care..."
            value={budget.otherNote}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2 mt-1"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700"
        >
          {loading ? 'Saving...' : 'Save Budget'}
        </button>

        {error && <p className="text-red-600 text-sm mt-2">Error: {error.message}</p>}
      </form>
    </div>
  );
};

export default SetBudget;
