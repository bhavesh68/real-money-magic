// this is the page where you ask user to input their expected budget and then what their spending limit is 
//this is the place where color coding would get set or other method

import React, { useState } from 'react';
import { gql, useMutation } from '@apollo/client';

const ADD_BUDGET = gql`
  mutation AddBudget($input: BudgetInput!) {
    addBudget(input: $input) {
      success
      message
    }
  }
`;

interface Budget {
  food: number;
  gas: number;
  rent: number;
  clothes: number;
  recreation: number;
  utilities: number;
  otherAmount: number;
  otherNote: string;
}

const SetBudget: React.FC = () => {
  const [budget, setBudget] = useState<Budget>({
    food: 0,
    gas: 0,
    rent: 0,
    clothes: 0,
    recreation: 0,
    utilities: 0,
    otherAmount: 0,
    otherNote: '',
  });

  const [addBudget, { loading, error, data }] = useMutation(ADD_BUDGET);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBudget({ ...budget, [name]: name === 'otherNote' ? value : parseFloat(value) });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    localStorage.setItem('userBudget', JSON.stringify(budget));

    try {
      const response = await addBudget({ variables: { input: budget } });
      console.log(response.data);
      alert('Budget submitted successfully!');
    } catch (err) {
      console.error('Submission error:', err);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-white shadow-md rounded-xl mt-6">
      <h2 className="text-xl font-bold mb-4 text-center">Set Your Monthly Budget</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {['food', 'gas', 'rent', 'clothes', 'recreation', 'utilities'].map((category) => (
          <div key={category}>
            <label className="block font-medium capitalize">{category} ($):</label>
            <input
              type="number"
              name={category}
              value={budget[category as keyof Budget]}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2 mt-1"
              min="0"
              required
            />
          </div>
        ))}
        <div>
          <label className="block font-medium">Other ($):</label>
          <input
            type="number"
            name="otherAmount"
            value={budget.otherAmount}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2 mt-1"
            min="0"
          />
        </div>
        <div>
          <label className="block font-medium">Note for Other:</label>
          <input
            type="text"
            name="otherNote"
            value={budget.otherNote}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2 mt-1"
            placeholder="E.g., gifts, pet care..."
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
        {data?.addBudget?.success && <p className="text-green-600 text-sm mt-2">Budget saved successfully!</p>}
      </form>
    </div>
  );
};

export default SetBudget;
