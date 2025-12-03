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
    payers: [], // Changed from single payer to array of payers with amounts
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
    
    if (formData.payers.length === 0) {
      newErrors.payers = 'Please select at least one person who paid';
    } else {
      const totalPaid = formData.payers.reduce((sum, p) => sum + (parseFloat(p.amount) || 0), 0);
      const totalAmount = parseFloat(formData.amount) || 0;
      
      // Check if any payer has invalid amount
      const hasInvalidAmount = formData.payers.some(p => !p.amount || parseFloat(p.amount) <= 0);
      if (hasInvalidAmount) {
        newErrors.payers = 'Each payer must have a valid amount';
      } else if (Math.abs(totalPaid - totalAmount) > 0.01) {
        newErrors.payers = `Total paid (${totalPaid.toFixed(2)}) must equal the expense amount (${totalAmount.toFixed(2)})`;
      }
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
        payers: formData.payers.map(p => ({
          name: p.name,
          amount: parseFloat(p.amount)
        })),
      });
      
      // Reset form
      setFormData({
        type: 'Miscellaneous',
        amount: '',
        payers: [],
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

  const handlePayerToggle = (person) => {
    setFormData((prev) => {
      const existingPayer = prev.payers.find(p => p.name === person);
      if (existingPayer) {
        // Remove payer
        return {
          ...prev,
          payers: prev.payers.filter(p => p.name !== person),
        };
      } else {
        // Add payer with default amount
        const totalAmount = parseFloat(prev.amount) || 0;
        const newPayers = [...prev.payers, { name: person, amount: '' }];
        
        // If this is the only payer, auto-fill with total amount
        if (newPayers.length === 1 && totalAmount > 0) {
          newPayers[0].amount = totalAmount.toString();
        }
        
        return {
          ...prev,
          payers: newPayers,
        };
      }
    });
  };

  const handlePayerAmountChange = (payerName, amount) => {
    setFormData((prev) => ({
      ...prev,
      payers: prev.payers.map(p => 
        p.name === payerName ? { ...p, amount } : p
      ),
    }));
  };

  const splitPayersEvenly = () => {
    const totalAmount = parseFloat(formData.amount) || 0;
    const numPayers = formData.payers.length;
    if (numPayers > 0 && totalAmount > 0) {
      const amountEach = (totalAmount / numPayers).toFixed(2);
      setFormData((prev) => ({
        ...prev,
        payers: prev.payers.map(p => ({ ...p, amount: amountEach })),
      }));
    }
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

      {/* Payers */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">
            Paid by
          </label>
          {formData.payers.length > 1 && (
            <button
              type="button"
              onClick={splitPayersEvenly}
              className="text-xs text-indigo-600 hover:text-indigo-700 font-medium"
            >
              Split evenly
            </button>
          )}
        </div>
        <div className={`grid grid-cols-2 sm:grid-cols-5 gap-2 ${
          errors.payers && formData.payers.length === 0 ? 'ring-2 ring-red-200 rounded-xl p-1' : ''
        }`}>
          {people.map((person) => (
            <button
              key={person}
              type="button"
              onClick={() => handlePayerToggle(person)}
              className={`px-3 py-2 text-sm rounded-xl transition-all ${
                formData.payers.some(p => p.name === person)
                  ? 'bg-emerald-500 text-white font-medium'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {person}
            </button>
          ))}
        </div>
        
        {/* Payer Amount Inputs */}
        {formData.payers.length > 0 && (
          <div className="mt-3 space-y-2">
            {formData.payers.map((payer) => (
              <div key={payer.name} className="flex items-center gap-2">
                <span className="text-sm text-gray-700 min-w-[80px] font-medium">{payer.name}</span>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="999999999"
                  value={payer.amount}
                  onChange={(e) => handlePayerAmountChange(payer.name, e.target.value)}
                  placeholder="Amount paid"
                  className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-gray-50"
                />
              </div>
            ))}
            {formData.payers.length > 0 && (
              <div className="text-xs text-gray-500 mt-1">
                Total paid: {formData.payers.reduce((sum, p) => sum + (parseFloat(p.amount) || 0), 0).toFixed(2)} / {parseFloat(formData.amount || 0).toFixed(2)}
              </div>
            )}
          </div>
        )}
        
        {errors.payers && (
          <p className="text-red-500 text-xs mt-2">{errors.payers}</p>
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
