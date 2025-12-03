import { useState } from 'react';

const EXPENSE_TYPES = [
  'Miscellaneous',
  'Meal',
  'Transport',
  'Accommodation',
  'Entertainment',
  'Shopping',
  'Utilities',
  'Groceries',
  'Healthcare',
  'Other',
];

const ExpenseForm = ({ people, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    type: 'Miscellaneous',
    amount: '',
    payer: people[0] || '',
    participants: [],
    date: new Date().toISOString().split('T')[0],
    description: '',
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Please enter a valid amount';
    }
    
    if (!formData.payer) {
      newErrors.payer = 'Please select who paid';
    }
    
    if (formData.participants.length === 0) {
      newErrors.participants = 'Please select at least one participant';
    }
    
    if (!formData.date) {
      newErrors.date = 'Please select a date';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit({
        ...formData,
        amount: parseFloat(formData.amount),
      });
      
      // Reset form
      setFormData({
        type: 'Miscellaneous',
        amount: '',
        payer: people[0] || '',
        participants: [],
        date: new Date().toISOString().split('T')[0],
        description: '',
      });
      setErrors({});
    }
  };

  const handleParticipantToggle = (person) => {
    setFormData((prev) => ({
      ...prev,
      participants: prev.participants.includes(person)
        ? prev.participants.filter((p) => p !== person)
        : [...prev.participants, person],
    }));
  };

  const selectAllParticipants = () => {
    setFormData((prev) => ({
      ...prev,
      participants: [...people],
    }));
  };

  const clearAllParticipants = () => {
    setFormData((prev) => ({
      ...prev,
      participants: [],
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-4 sm:p-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Add New Expense</h2>
      
      {/* Expense Type */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Expense Type
        </label>
        <select
          value={formData.type}
          onChange={(e) => setFormData({ ...formData, type: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {EXPENSE_TYPES.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>

      {/* Amount */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Total Amount
        </label>
        <input
          type="number"
          step="0.01"
          min="0"
          max="999999999"
          value={formData.amount}
          onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
          placeholder="Enter amount"
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.amount ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {errors.amount && (
          <p className="text-red-500 text-sm mt-1">{errors.amount}</p>
        )}
      </div>

      {/* Payer */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Who Paid?
        </label>
        <select
          value={formData.payer}
          onChange={(e) => setFormData({ ...formData, payer: e.target.value })}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.payer ? 'border-red-500' : 'border-gray-300'
          }`}
        >
          <option value="">Select payer</option>
          {people.map((person) => (
            <option key={person} value={person}>
              {person}
            </option>
          ))}
        </select>
        {errors.payer && (
          <p className="text-red-500 text-sm mt-1">{errors.payer}</p>
        )}
      </div>

      {/* Participants */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Participants (who should split this expense?)
        </label>
        <div className="flex gap-2 mb-2">
          <button
            type="button"
            onClick={selectAllParticipants}
            className="text-sm px-3 py-1 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200"
          >
            Select All
          </button>
          <button
            type="button"
            onClick={clearAllParticipants}
            className="text-sm px-3 py-1 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
          >
            Clear All
          </button>
        </div>
        <div className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 p-3 border rounded-md ${
          errors.participants ? 'border-red-500' : 'border-gray-300'
        }`}>
          {people.map((person) => (
            <label
              key={person}
              className={`flex items-center gap-2 p-2 rounded cursor-pointer transition-colors ${
                formData.participants.includes(person)
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-gray-50 hover:bg-gray-100'
              }`}
            >
              <input
                type="checkbox"
                checked={formData.participants.includes(person)}
                onChange={() => handleParticipantToggle(person)}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <span className="text-sm truncate">{person}</span>
            </label>
          ))}
        </div>
        {errors.participants && (
          <p className="text-red-500 text-sm mt-1">{errors.participants}</p>
        )}
      </div>

      {/* Date */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Date
        </label>
        <input
          type="date"
          value={formData.date}
          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.date ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {errors.date && (
          <p className="text-red-500 text-sm mt-1">{errors.date}</p>
        )}
      </div>

      {/* Description */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="e.g., Dinner at Italian restaurant"
          rows={2}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
        />
      </div>

      {/* Buttons */}
      <div className="flex gap-3">
        <button
          type="submit"
          className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors font-medium"
        >
          Add Expense
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default ExpenseForm;
