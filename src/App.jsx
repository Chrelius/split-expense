import { useState } from 'react';
import { useExpenses } from './hooks/useExpenses';
import ExpenseForm from './components/ExpenseForm';
import ExpenseList from './components/ExpenseList';
import DebtSummary from './components/DebtSummary';
import PeopleManager from './components/PeopleManager';
import DataManager from './components/DataManager';

function App() {
  const {
    expenses,
    people,
    settlements,
    isLoaded,
    addExpense,
    deleteExpense,
    updatePerson,
    toggleSettlement,
    clearAllData,
    getExportData,
    importData,
  } = useExpenses();

  const [activeTab, setActiveTab] = useState('expenses');
  const [showPeopleManager, setShowPeopleManager] = useState(false);
  const [showDataManager, setShowDataManager] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-pulse text-gray-400">Loading...</div>
      </div>
    );
  }

  const handleClearAll = () => {
    clearAllData();
    setShowClearConfirm(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-900">Split Expenses</h1>
              <p className="text-xs text-gray-400">Track expenses with friends</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowPeopleManager(!showPeopleManager)}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                title="Manage People"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </button>
              <button
                onClick={() => setShowDataManager(!showDataManager)}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                title="Export / Import Data"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
              </button>
              <button
                onClick={() => setShowClearConfirm(true)}
                className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                title="Clear All"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 py-4">
        {/* People Manager */}
        {showPeopleManager && (
          <div className="mb-4">
            <PeopleManager
              people={people}
              onUpdatePerson={updatePerson}
              onClose={() => setShowPeopleManager(false)}
            />
          </div>
        )}

        {/* Data Manager */}
        {showDataManager && (
          <div className="mb-4">
            <DataManager
              onExport={getExportData}
              onImport={importData}
              onClose={() => setShowDataManager(false)}
            />
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex gap-1 p-1 mb-4 bg-gray-100 rounded-xl">
          <button
            onClick={() => setActiveTab('expenses')}
            className={`flex-1 py-2.5 px-4 text-sm font-medium rounded-lg transition-all ${
              activeTab === 'expenses'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Add
          </button>
          <button
            onClick={() => setActiveTab('list')}
            className={`flex-1 py-2.5 px-4 text-sm font-medium rounded-lg transition-all ${
              activeTab === 'list'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Expenses{expenses.length > 0 && ` (${expenses.length})`}
          </button>
          <button
            onClick={() => setActiveTab('summary')}
            className={`flex-1 py-2.5 px-4 text-sm font-medium rounded-lg transition-all ${
              activeTab === 'summary'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Summary
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

        {activeTab === 'summary' && (
          <DebtSummary 
            expenses={expenses} 
            settlements={settlements}
            onToggleSettlement={toggleSettlement}
          />
        )}
      </main>

      {/* Clear Confirmation Modal */}
      {showClearConfirm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl p-6 max-w-sm w-full">
            <div className="w-12 h-12 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">
              Clear All Data?
            </h3>
            <p className="text-gray-500 text-sm text-center mb-6">
              This will delete all expenses and reset everything. This cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowClearConfirm(false)}
                className="flex-1 py-2.5 px-4 text-sm font-medium text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleClearAll}
                className="flex-1 py-2.5 px-4 text-sm font-medium text-white bg-red-500 rounded-xl hover:bg-red-600 transition-colors"
              >
                Clear All
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="py-6 text-center">
        <p className="text-xs text-gray-400">Stored locally in your browser</p>
      </footer>
    </div>
  );
}

export default App;
