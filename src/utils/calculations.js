/**
 * Calculate how much each participant owes for an expense
 * @param {Object} expense - The expense object
 * @returns {Array} Array of debt objects showing who owes whom and how much
 */
export const calculateExpenseDebts = (expense) => {
  const { amount, payer, participants } = expense;
  const debts = [];
  
  if (!participants || participants.length === 0) {
    return debts;
  }

  const sharePerPerson = amount / participants.length;

  participants.forEach((participant) => {
    if (participant !== payer) {
      debts.push({
        from: participant,
        to: payer,
        amount: sharePerPerson,
      });
    }
  });

  return debts;
};

/**
 * Calculate the overall debt summary for all expenses
 * @param {Array} expenses - Array of expense objects
 * @returns {Object} Object with each person's net balance (positive = owed to them, negative = they owe)
 */
export const calculateDebtSummary = (expenses) => {
  const balances = {};

  expenses.forEach((expense) => {
    const debts = calculateExpenseDebts(expense);
    
    debts.forEach((debt) => {
      // Person who owes (negative balance)
      if (!balances[debt.from]) {
        balances[debt.from] = { owes: 0, owed: 0 };
      }
      balances[debt.from].owes += debt.amount;

      // Person who is owed (positive balance)
      if (!balances[debt.to]) {
        balances[debt.to] = { owes: 0, owed: 0 };
      }
      balances[debt.to].owed += debt.amount;
    });
  });

  // Calculate net balance for each person
  const summary = Object.entries(balances).map(([person, { owes, owed }]) => ({
    person,
    owes: Math.round(owes * 100) / 100,
    owed: Math.round(owed * 100) / 100,
    net: Math.round((owed - owes) * 100) / 100,
  }));

  return summary;
};

/**
 * Calculate detailed debts showing who owes whom
 * @param {Array} expenses - Array of expense objects
 * @returns {Array} Simplified array of debts (from -> to with combined amounts)
 */
export const calculateSimplifiedDebts = (expenses) => {
  const debtMap = {};

  expenses.forEach((expense) => {
    const debts = calculateExpenseDebts(expense);
    
    debts.forEach((debt) => {
      const key = `${debt.from}->${debt.to}`;
      const reverseKey = `${debt.to}->${debt.from}`;
      
      if (debtMap[reverseKey]) {
        // Net out the debts
        debtMap[reverseKey] -= debt.amount;
        if (debtMap[reverseKey] < 0) {
          debtMap[key] = -debtMap[reverseKey];
          delete debtMap[reverseKey];
        } else if (debtMap[reverseKey] === 0) {
          delete debtMap[reverseKey];
        }
      } else {
        debtMap[key] = (debtMap[key] || 0) + debt.amount;
      }
    });
  });

  return Object.entries(debtMap)
    .filter(([, amount]) => amount > 0.01)
    .map(([key, amount]) => {
      const [from, to] = key.split('->');
      return {
        from,
        to,
        amount: Math.round(amount * 100) / 100,
      };
    });
};
