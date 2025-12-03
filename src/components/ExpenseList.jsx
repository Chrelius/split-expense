import { calculateExpenseDebts } from '../utils/calculations';

const ExpenseList = ({ expenses, onDelete }) => {
  if (expenses.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
        <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        </div>
        <h2 className="text-lg font-semibold text-gray-800 mb-2">No Expenses Yet</h2>
        <p className="text-gray-500 text-sm">Add your first expense to get started</p>
      </div>
    );
  }

  const formatNumber = (amount) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="space-y-3">
      {expenses.map((expense) => {
        const debts = calculateExpenseDebts(expense);
        const sharePerPerson = expense.amount / expense.participants.length;
        
        return (
          <div key={expense.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-5 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                {/* Header */}
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="inline-block px-2.5 py-1 text-xs font-medium bg-indigo-50 text-indigo-600 rounded-full">
                    {expense.type}
                  </span>
                  <span className="text-xs text-gray-400">
                    {formatDate(expense.date)}
                  </span>
                </div>
                
                {/* Amount */}
                <p className="text-2xl font-bold text-gray-900 mb-1">
                  {formatNumber(expense.amount)}
                </p>
                
                {/* Description */}
                {expense.description && (
                  <p className="text-gray-600 text-sm mb-3">{expense.description}</p>
                )}
                
                {/* Payer */}
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <span className="text-sm text-gray-600">
                    Paid by <span className="font-medium text-gray-900">{expense.payer}</span>
                  </span>
                </div>
                
                {/* Participants */}
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {expense.participants.map((p, i) => (
                    <span key={i} className="px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded-full">
                      {p}
                    </span>
                  ))}
                  <span className="px-2 py-0.5 text-xs bg-blue-50 text-blue-600 rounded-full">
                    {formatNumber(sharePerPerson)} each
                  </span>
                </div>
                
                {/* Debts */}
                {debts.length > 0 && (
                  <div className="pt-3 border-t border-gray-100">
                    <p className="text-xs text-gray-400 mb-2">Owes</p>
                    <div className="flex flex-wrap gap-2">
                      {debts.map((debt, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center gap-1 text-xs text-gray-600"
                        >
                          <span className="font-medium">{debt.from}</span>
                          <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                          </svg>
                          <span className="font-medium">{debt.to}</span>
                          <span className="text-amber-600 font-semibold">{formatNumber(debt.amount)}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              {/* Delete Button */}
              <button
                onClick={() => onDelete(expense.id)}
                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                title="Delete expense"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ExpenseList;
