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
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-violet-100 rounded-lg flex items-center justify-center">
            <svg className="w-4 h-4 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
          <h2 className="text-lg font-semibold text-gray-800">People</h2>
        </div>
        <button
          onClick={onClose}
          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          title="Close"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      <p className="text-xs text-gray-400 mb-4">
        Tap to rename
      </p>
      
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
        {people.map((person, index) => (
          <div key={index}>
            {editingIndex === index ? (
              <input
                type="text"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                onBlur={() => handleSave(index)}
                className="w-full px-3 py-2 text-sm border-2 border-indigo-500 rounded-xl focus:outline-none bg-indigo-50"
                autoFocus
                maxLength={30}
              />
            ) : (
              <button
                onClick={() => handleEdit(index)}
                className="w-full px-3 py-2 text-sm text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors text-center"
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
