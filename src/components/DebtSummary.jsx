import { useState } from 'react';
import { calculateDebtSummary, calculateSimplifiedDebts, getExpenseBreakdownForSettlement } from '../utils/calculations';

const DebtSummary = ({ expenses, settlements = {}, onToggleSettlement }) => {
  const [expandedSettlement, setExpandedSettlement] = useState(null);
  const summary = calculateDebtSummary(expenses);
  const simplifiedDebts = calculateSimplifiedDebts(expenses);

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

  const getSettlementKey = (from, to) => `${from}->${to}`;

  const toggleBreakdown = (key, e) => {
    e.stopPropagation();
    setExpandedSettlement(expandedSettlement === key ? null : key);
  };

  if (expenses.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
        <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
        </div>
        <h2 className="text-lg font-semibold text-gray-800 mb-2">No Debts Yet</h2>
        <p className="text-gray-500 text-sm">Add expenses to see the debt summary</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Settlement Summary */}
      {simplifiedDebts.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-gray-800">Settlements</h2>
          </div>
          <p className="text-sm text-gray-500 mb-4">Click checkbox to mark as paid, or expand to see breakdown</p>
          <div className="space-y-2">
            {simplifiedDebts.map((debt, index) => {
              const key = getSettlementKey(debt.from, debt.to);
              const isSettled = settlements[key];
              const isExpanded = expandedSettlement === key;
              const breakdown = isExpanded ? getExpenseBreakdownForSettlement(expenses, debt.from, debt.to) : [];
              
              return (
                <div key={index} className="rounded-xl border overflow-hidden transition-all">
                  <div
                    className={`w-full flex items-center justify-between p-4 transition-all ${
                      isSettled 
                        ? 'bg-green-50 border-green-200' 
                        : 'bg-gray-50 border-gray-100'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => onToggleSettlement && onToggleSettlement(key)}
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                          isSettled ? 'bg-green-500 border-green-500' : 'border-gray-300 hover:border-gray-400'
                        }`}
                        title={isSettled ? 'Mark as unpaid' : 'Mark as paid'}
                      >
                        {isSettled && (
                          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </button>
                      <div className="text-left">
                        <div className="flex items-center gap-2">
                          <span className={`font-medium ${isSettled ? 'text-gray-500 line-through' : 'text-gray-800'}`}>
                            {debt.from}
                          </span>
                          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                          </svg>
                          <span className={`font-medium ${isSettled ? 'text-gray-500 line-through' : 'text-gray-800'}`}>
                            {debt.to}
                          </span>
                        </div>
                        {isSettled && (
                          <span className="text-xs text-green-600 font-medium">Paid</span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-lg font-semibold ${isSettled ? 'text-gray-400 line-through' : 'text-gray-900'}`}>
                        {formatNumber(debt.amount)}
                      </span>
                      <button
                        onClick={(e) => toggleBreakdown(key, e)}
                        className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded-lg transition-colors"
                        title={isExpanded ? 'Hide breakdown' : 'Show breakdown'}
                      >
                        <svg 
                          className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  
                  {/* Expense Breakdown */}
                  {isExpanded && breakdown.length > 0 && (
                    <div className="bg-white border-t border-gray-100 p-4">
                      <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3">Expense Breakdown</p>
                      <div className="space-y-2">
                        {breakdown.map((item) => (
                          <div 
                            key={`${item.expenseId}-${item.direction}`}
                            className={`flex items-center justify-between p-3 rounded-lg ${
                              item.direction === 'owes' ? 'bg-red-50' : 'bg-green-50'
                            }`}
                          >
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="inline-block px-2 py-0.5 text-xs font-medium bg-white rounded-full text-gray-600">
                                  {item.type}
                                </span>
                                <span className="text-xs text-gray-400">
                                  {formatDate(item.date)}
                                </span>
                              </div>
                              <p className="text-sm text-gray-700 truncate">{item.description}</p>
                            </div>
                            <div className="text-right ml-3">
                              <span className={`text-sm font-semibold ${
                                item.direction === 'owes' ? 'text-red-600' : 'text-green-600'
                              }`}>
                                {item.direction === 'owes' ? '+' : '-'}{formatNumber(item.amount)}
                              </span>
                              <p className="text-xs text-gray-400">
                                {item.direction === 'owes' ? `${debt.from} owes` : `${debt.to} owes`}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="mt-3 pt-3 border-t border-gray-100 flex justify-between items-center">
                        <span className="text-sm text-gray-500">Net amount</span>
                        <span className="text-sm font-semibold text-gray-900">{formatNumber(debt.amount)}</span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Individual Balances */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
            <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h2 className="text-lg font-semibold text-gray-800">Balances</h2>
        </div>
        
        {/* Mobile view - cards */}
        <div className="block sm:hidden space-y-2">
          {summary.map((item) => (
            <div
              key={item.person}
              className="p-4 bg-gray-50 rounded-xl"
            >
              <p className="font-medium text-gray-900 mb-3">{item.person}</p>
              <div className="grid grid-cols-3 gap-2 text-sm">
                <div>
                  <p className="text-gray-400 text-xs mb-1">Owes</p>
                  <p className="font-semibold text-red-500">{formatNumber(item.owes)}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs mb-1">Owed</p>
                  <p className="font-semibold text-green-500">{formatNumber(item.owed)}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs mb-1">Net</p>
                  <p className={`font-semibold ${
                    item.net > 0 ? 'text-green-500' : item.net < 0 ? 'text-red-500' : 'text-gray-500'
                  }`}>
                    {item.net > 0 ? '+' : ''}{formatNumber(item.net)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop view - table */}
        <div className="hidden sm:block">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">Person</th>
                <th className="text-right py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">Owes</th>
                <th className="text-right py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">Owed</th>
                <th className="text-right py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">Net</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {summary.map((item) => (
                <tr key={item.person}>
                  <td className="py-3 font-medium text-gray-900">{item.person}</td>
                  <td className="py-3 text-right font-semibold text-red-500">{formatNumber(item.owes)}</td>
                  <td className="py-3 text-right font-semibold text-green-500">{formatNumber(item.owed)}</td>
                  <td className={`py-3 text-right font-semibold ${
                    item.net > 0 ? 'text-green-500' : item.net < 0 ? 'text-red-500' : 'text-gray-500'
                  }`}>
                    {item.net > 0 ? '+' : ''}{formatNumber(item.net)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DebtSummary;
