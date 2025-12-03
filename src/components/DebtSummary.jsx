import { calculateDebtSummary, calculateSimplifiedDebts } from '../utils/calculations';

const DebtSummary = ({ expenses }) => {
  const summary = calculateDebtSummary(expenses);
  const simplifiedDebts = calculateSimplifiedDebts(expenses);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  if (expenses.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 text-center">
        <h2 className="text-xl font-semibold mb-3 text-gray-800">Debt Summary</h2>
        <p className="text-gray-500">Add some expenses to see the debt summary.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Simplified Debts - Who Owes Whom */}
      {simplifiedDebts.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            Settlement Summary
          </h2>
          <p className="text-sm text-gray-600 mb-4">
            Simplified view of who owes whom to settle all debts:
          </p>
          <div className="space-y-3">
            {simplifiedDebts.map((debt, index) => (
              <div
                key={index}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 bg-gradient-to-r from-orange-50 to-green-50 rounded-lg border border-gray-200"
              >
                <div className="flex items-center gap-2 mb-2 sm:mb-0">
                  <span className="font-medium text-orange-700">{debt.from}</span>
                  <svg
                    className="w-5 h-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                  <span className="font-medium text-green-700">{debt.to}</span>
                </div>
                <span className="text-lg font-semibold text-gray-900">
                  {formatCurrency(debt.amount)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Individual Balances Table */}
      <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">
          Individual Balances
        </h2>
        
        {/* Mobile view - cards */}
        <div className="block sm:hidden space-y-3">
          {summary.map((item) => (
            <div
              key={item.person}
              className="p-4 bg-gray-50 rounded-lg border border-gray-200"
            >
              <p className="font-medium text-gray-900 mb-2">{item.person}</p>
              <div className="grid grid-cols-3 gap-2 text-sm">
                <div>
                  <p className="text-gray-500">Owes</p>
                  <p className="font-medium text-red-600">{formatCurrency(item.owes)}</p>
                </div>
                <div>
                  <p className="text-gray-500">Owed</p>
                  <p className="font-medium text-green-600">{formatCurrency(item.owed)}</p>
                </div>
                <div>
                  <p className="text-gray-500">Net</p>
                  <p
                    className={`font-semibold ${
                      item.net > 0
                        ? 'text-green-600'
                        : item.net < 0
                        ? 'text-red-600'
                        : 'text-gray-600'
                    }`}
                  >
                    {item.net > 0 ? '+' : ''}{formatCurrency(item.net)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop view - table */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                  Person
                </th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-600">
                  Total Owes
                </th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-600">
                  Total Owed
                </th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-600">
                  Net Balance
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {summary.map((item) => (
                <tr key={item.person} className="hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium text-gray-900">
                    {item.person}
                  </td>
                  <td className="py-3 px-4 text-right text-red-600">
                    {formatCurrency(item.owes)}
                  </td>
                  <td className="py-3 px-4 text-right text-green-600">
                    {formatCurrency(item.owed)}
                  </td>
                  <td
                    className={`py-3 px-4 text-right font-semibold ${
                      item.net > 0
                        ? 'text-green-600'
                        : item.net < 0
                        ? 'text-red-600'
                        : 'text-gray-600'
                    }`}
                  >
                    {item.net > 0 ? '+' : ''}{formatCurrency(item.net)}
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
