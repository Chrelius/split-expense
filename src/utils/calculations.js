// Threshold for considering a balance as non-zero (handles floating point precision)
const BALANCE_THRESHOLD = 0.001;
// Minimum amount for a transfer to be recorded
const MIN_TRANSFER_AMOUNT = 0.01;

/**
 * Calculate how much each participant owes for an expense
 * Supports both single payer (legacy) and multiple payers
 * @param {Object} expense - The expense object
 * @returns {Array} Array of debt objects showing who owes whom and how much
 */
export const calculateExpenseDebts = (expense) => {
  const { amount, payer, payers, participants } = expense;
  const debts = [];
  
  if (!participants || participants.length === 0 || !amount || amount <= 0) {
    return debts;
  }

  const sharePerPerson = amount / participants.length;

  // Handle multiple payers
  if (payers && payers.length > 0) {
    // Calculate net balance for each person
    const balances = {};
    
    // Each payer has positive balance for what they paid
    payers.forEach(p => {
      balances[p.name] = (balances[p.name] || 0) + p.amount;
    });
    
    // Each participant owes their share (negative balance)
    participants.forEach(participant => {
      balances[participant] = (balances[participant] || 0) - sharePerPerson;
    });
    
    // Find debtors (negative balance) and creditors (positive balance)
    const debtors = [];
    const creditors = [];
    
    Object.entries(balances).forEach(([person, balance]) => {
      if (balance < -BALANCE_THRESHOLD) {
        debtors.push({ name: person, amount: -balance });
      } else if (balance > BALANCE_THRESHOLD) {
        creditors.push({ name: person, amount: balance });
      }
    });
    
    // Sort for consistent matching
    debtors.sort((a, b) => b.amount - a.amount);
    creditors.sort((a, b) => b.amount - a.amount);
    
    // Match debtors to creditors
    let i = 0, j = 0;
    while (i < debtors.length && j < creditors.length) {
      const debtor = debtors[i];
      const creditor = creditors[j];
      const transferAmount = Math.min(debtor.amount, creditor.amount);
      
      if (transferAmount > MIN_TRANSFER_AMOUNT) {
        debts.push({
          from: debtor.name,
          to: creditor.name,
          amount: Math.round(transferAmount * 100) / 100,
        });
      }
      
      debtor.amount -= transferAmount;
      creditor.amount -= transferAmount;
      
      if (debtor.amount < MIN_TRANSFER_AMOUNT) i++;
      if (creditor.amount < MIN_TRANSFER_AMOUNT) j++;
    }
  } else if (payer) {
    // Legacy single payer support
    participants.forEach((participant) => {
      if (participant !== payer) {
        debts.push({
          from: participant,
          to: payer,
          amount: sharePerPerson,
        });
      }
    });
  }

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
    .filter(([, amount]) => amount > MIN_TRANSFER_AMOUNT)
    .map(([key, amount]) => {
      const [from, to] = key.split('->');
      return {
        from,
        to,
        amount: Math.round(amount * 100) / 100,
      };
    });
};
