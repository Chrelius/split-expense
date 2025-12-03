import { calculateExpenseDebts } from '../utils/calculations';

const ExpenseList = ({ expenses, onDelete }) => {
  if (expenses.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 text-center">
        <p className="text-gray-500">No expenses yet. Add your first expense above!</p>
      </div>
    );
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <h2 className="text-xl font-semibold p-4 sm:p-6 pb-0 text-gray-800">
        Expense Summary
      </h2>
      <div className="divide-y divide-gray-200">
        {expenses.map((expense) => {
          const debts = calculateExpenseDebts(expense);
          const sharePerPerson = expense.amount / expense.participants.length;
          
          return (
            <div key={expense.id} className="p-4 sm:p-6 hover:bg-gray-50">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                <div className="flex-1">
                  {/* Type and Amount */}
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="inline-block px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded">
                      {expense.type}
                    </span>
                    <span className="text-lg font-semibold text-gray-900">
                      {formatCurrency(expense.amount)}
                    </span>
                  </div>
                  
                  {/* Description */}
                  {expense.description && (
                    <p className="text-gray-700 mb-2">{expense.description}</p>
                  )}
                  
                  {/* Payer and Date */}
                  <div className="text-sm text-gray-600 mb-2">
                    <span className="font-medium">Paid by:</span> {expense.payer}
                    <span className="mx-2">•</span>
                    <span>{formatDate(expense.date)}</span>
                  </div>
                  
                  {/* Participants */}
                  <div className="text-sm text-gray-600 mb-3">
                    <span className="font-medium">Split among:</span>{' '}
                    {expense.participants.join(', ')}
                    <span className="ml-2 text-gray-500">
                      ({formatCurrency(sharePerPerson)} each)
                    </span>
                  </div>
                  
                  {/* Debts for this expense */}
                  {debts.length > 0 && (
                    <div className="bg-gray-50 rounded-md p-3 mt-2">
                      <p className="text-sm font-medium text-gray-700 mb-2">Who owes whom:</p>
                      <div className="flex flex-wrap gap-2">
                        {debts.map((debt, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded"
                          >
                            {debt.from} → {debt.to}: {formatCurrency(debt.amount)}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Delete Button */}
                <button
                  onClick={() => onDelete(expense.id)}
                  className="self-start px-3 py-1 text-sm text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors"
                  title="Delete expense"
                >
                  Delete
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ExpenseList;
