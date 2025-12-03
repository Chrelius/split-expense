import { useState } from 'react';
import { useExpenses } from './hooks/useExpenses';
import ExpenseForm from './components/ExpenseForm';
import ExpenseList from './components/ExpenseList';
import DebtSummary from './components/DebtSummary';
import PeopleManager from './components/PeopleManager';

function App() {
  const {
    expenses,
    people,
    isLoaded,
    addExpense,
    deleteExpense,
    updatePerson,
    clearAllData,
  } = useExpenses();

  const [activeTab, setActiveTab] = useState('expenses');
  const [showPeopleManager, setShowPeopleManager] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  const handleClearAll = () => {
    clearAllData();
    setShowClearConfirm(false);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-blue-600 text-white shadow-lg">
        <div className="max-w-4xl mx-auto px-4 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold">Split Expense</h1>
              <p className="text-blue-100 text-sm sm:text-base">
                Track and split expenses with friends
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowPeopleManager(!showPeopleManager)}
                className="px-3 py-2 text-sm bg-blue-500 hover:bg-blue-400 rounded-md transition-colors"
              >
                {showPeopleManager ? 'Hide' : 'Manage'} People
              </button>
              <button
                onClick={() => setShowClearConfirm(true)}
                className="px-3 py-2 text-sm bg-red-500 hover:bg-red-400 rounded-md transition-colors"
              >
                Clear All
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-6">
        {/* People Manager */}
        {showPeopleManager && (
          <div className="mb-6">
            <PeopleManager
              people={people}
              onUpdatePerson={updatePerson}
              onClose={() => setShowPeopleManager(false)}
            />
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex mb-6 bg-white rounded-lg shadow-md overflow-hidden">
          <button
            onClick={() => setActiveTab('expenses')}
            className={`flex-1 py-3 px-4 text-sm sm:text-base font-medium transition-colors ${
              activeTab === 'expenses'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Add Expense
          </button>
          <button
            onClick={() => setActiveTab('list')}
            className={`flex-1 py-3 px-4 text-sm sm:text-base font-medium transition-colors ${
              activeTab === 'list'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Expenses ({expenses.length})
          </button>
          <button
            onClick={() => setActiveTab('summary')}
            className={`flex-1 py-3 px-4 text-sm sm:text-base font-medium transition-colors ${
              activeTab === 'summary'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Debt Summary
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'expenses' && (
          <ExpenseForm
            people={people}
            onSubmit={(expense) => {
              addExpense(expense);
              setActiveTab('list');
            }}
          />
        )}

        {activeTab === 'list' && (
          <ExpenseList expenses={expenses} onDelete={deleteExpense} />
        )}

        {activeTab === 'summary' && <DebtSummary expenses={expenses} />}
      </main>

      {/* Clear Confirmation Modal */}
      {showClearConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-sm w-full">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Clear All Data?
            </h3>
            <p className="text-gray-600 mb-6">
              This will permanently delete all expenses and reset people names.
              This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowClearConfirm(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleClearAll}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                Clear All
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="mt-auto py-4 text-center text-gray-500 text-sm">
        <p>Data stored locally in your browser</p>
      </footer>
    </div>
  );
}

export default App;
