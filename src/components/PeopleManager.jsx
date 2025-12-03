import { useState } from 'react';

const PeopleManager = ({ people, onUpdatePerson, onClose }) => {
  const [editingIndex, setEditingIndex] = useState(null);
  const [editValue, setEditValue] = useState('');

  const handleEdit = (index) => {
    setEditingIndex(index);
    setEditValue(people[index]);
  };

  const handleSave = (index) => {
    if (editValue.trim() && editValue.trim() !== people[index]) {
      onUpdatePerson(index, editValue.trim());
    }
    setEditingIndex(null);
    setEditValue('');
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Enter') {
      handleSave(index);
    } else if (e.key === 'Escape') {
      setEditingIndex(null);
      setEditValue('');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Manage People</h2>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700"
          title="Close"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      <p className="text-sm text-gray-600 mb-4">
        Click on a name to edit it. Changes will apply to all existing expenses.
      </p>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {people.map((person, index) => (
          <div key={index} className="flex items-center gap-2">
            <span className="w-6 text-sm text-gray-500">{index + 1}.</span>
            {editingIndex === index ? (
              <div className="flex-1 flex gap-2">
                <input
                  type="text"
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  onBlur={() => handleSave(index)}
                  className="flex-1 px-3 py-2 border border-blue-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  autoFocus
                  maxLength={30}
                />
              </div>
            ) : (
              <button
                onClick={() => handleEdit(index)}
                className="flex-1 text-left px-3 py-2 bg-gray-50 hover:bg-gray-100 rounded-md transition-colors"
              >
                {person}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PeopleManager;
