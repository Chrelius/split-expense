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
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
      {/* Amount - Prominent at top */}
      <div className="mb-5">
        <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">
          Amount
        </label>
        <input
          type="number"
          step="0.01"
          min="0"
          max="999999999"
          value={formData.amount}
          onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
          placeholder="0.00"
          className={`w-full text-3xl font-bold text-gray-900 border-0 border-b-2 pb-2 focus:outline-none focus:border-indigo-500 bg-transparent ${
            errors.amount ? 'border-red-500' : 'border-gray-200'
          }`}
        />
        {errors.amount && (
          <p className="text-red-500 text-xs mt-1">{errors.amount}</p>
        )}
      </div>

      {/* Type and Date Row */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div>
          <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">
            Type
          </label>
          <select
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-gray-50"
          >
            {EXPENSE_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">
            Date
          </label>
          <input
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            className={`w-full px-3 py-2.5 text-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-gray-50 ${
              errors.date ? 'border-red-500' : 'border-gray-200'
            }`}
          />
        </div>
      </div>

      {/* Description */}
      <div className="mb-4">
        <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">
          Description
        </label>
        <input
          type="text"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="What was this for?"
          className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-gray-50"
        />
      </div>

      {/* Payer */}
      <div className="mb-4">
        <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">
          Paid by
        </label>
        <select
          value={formData.payer}
          onChange={(e) => setFormData({ ...formData, payer: e.target.value })}
          className={`w-full px-3 py-2.5 text-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-gray-50 ${
            errors.payer ? 'border-red-500' : 'border-gray-200'
          }`}
        >
          <option value="">Select person</option>
          {people.map((person) => (
            <option key={person} value={person}>
              {person}
            </option>
          ))}
        </select>
        {errors.payer && (
          <p className="text-red-500 text-xs mt-1">{errors.payer}</p>
        )}
      </div>

      {/* Participants */}
      <div className="mb-5">
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">
            Split with
          </label>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={selectAllParticipants}
              className="text-xs text-indigo-600 hover:text-indigo-700 font-medium"
            >
              All
            </button>
            <span className="text-gray-300">|</span>
            <button
              type="button"
              onClick={clearAllParticipants}
              className="text-xs text-gray-500 hover:text-gray-700 font-medium"
            >
              None
            </button>
          </div>
        </div>
        <div className={`grid grid-cols-2 sm:grid-cols-5 gap-2 ${
          errors.participants ? 'ring-2 ring-red-200 rounded-xl p-1' : ''
        }`}>
          {people.map((person) => (
            <button
              key={person}
              type="button"
              onClick={() => handleParticipantToggle(person)}
              className={`px-3 py-2 text-sm rounded-xl transition-all ${
                formData.participants.includes(person)
                  ? 'bg-indigo-500 text-white font-medium'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {person}
            </button>
          ))}
        </div>
        {errors.participants && (
          <p className="text-red-500 text-xs mt-2">{errors.participants}</p>
        )}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="w-full bg-indigo-500 text-white py-3 px-4 rounded-xl hover:bg-indigo-600 transition-colors font-medium text-sm"
      >
        Add Expense
      </button>
      {onCancel && (
        <button
          type="button"
          onClick={onCancel}
          className="w-full mt-2 py-3 px-4 text-sm text-gray-500 hover:text-gray-700 transition-colors"
        >
          Cancel
        </button>
      )}
    </form>
  );
};

export default ExpenseForm;
