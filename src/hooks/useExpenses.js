import { useState, useEffect, useCallback } from 'react';
import { getStoredData, saveData, exportData, parseImportData } from '../utils/storage';

const DEFAULT_PEOPLE = [
  'Person 1', 'Person 2', 'Person 3', 'Person 4', 'Person 5',
  'Person 6', 'Person 7', 'Person 8', 'Person 9', 'Person 10'
];

const getInitialData = () => {
  const stored = getStoredData();
  return {
    expenses: stored.expenses || [],
    people: stored.people?.length > 0 ? stored.people : DEFAULT_PEOPLE,
    settlements: stored.settlements || {},
  };
};

export const useExpenses = () => {
  const [data, setData] = useState(getInitialData);
  const { expenses, people, settlements } = data;

  // Save to localStorage whenever data changes
  useEffect(() => {
    saveData({ expenses, people, settlements });
  }, [expenses, people, settlements]);

  const addExpense = useCallback((expense) => {
    const newExpense = {
      ...expense,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    setData((prev) => ({
      ...prev,
      expenses: [...prev.expenses, newExpense],
    }));
    return newExpense;
  }, []);

  const updateExpense = useCallback((id, updates) => {
    setData((prev) => ({
      ...prev,
      expenses: prev.expenses.map((expense) =>
        expense.id === id ? { ...expense, ...updates } : expense
      ),
    }));
  }, []);

  const deleteExpense = useCallback((id) => {
    setData((prev) => ({
      ...prev,
      expenses: prev.expenses.filter((expense) => expense.id !== id),
    }));
  }, []);

  const updatePerson = useCallback((index, newName) => {
    setData((prev) => {
      const oldName = prev.people[index];
      const updatedPeople = [...prev.people];
      updatedPeople[index] = newName;
      
      // Update all expenses that reference this person
      const updatedExpenses = prev.expenses.map((expense) => ({
        ...expense,
        payer: expense.payer === oldName ? newName : expense.payer,
        payers: expense.payers 
          ? expense.payers.map(p => p.name === oldName ? { ...p, name: newName } : p)
          : undefined,
        participants: expense.participants.map((p) =>
          p === oldName ? newName : p
        ),
      }));
      
      // Update settlements keys
      const updatedSettlements = {};
      Object.entries(prev.settlements).forEach(([key, value]) => {
        const newKey = key
          .replace(oldName + '->', newName + '->')
          .replace('->' + oldName, '->' + newName);
        updatedSettlements[newKey] = value;
      });
      
      return {
        expenses: updatedExpenses,
        people: updatedPeople,
        settlements: updatedSettlements,
      };
    });
  }, []);

  const toggleSettlement = useCallback((key) => {
    setData((prev) => ({
      ...prev,
      settlements: {
        ...prev.settlements,
        [key]: !prev.settlements[key],
      },
    }));
  }, []);

  const clearAllData = useCallback(() => {
    setData({
      expenses: [],
      people: DEFAULT_PEOPLE,
      settlements: {},
    });
  }, []);

  const getExportData = useCallback(() => {
    return exportData(data);
  }, [data]);

  const importData = useCallback((jsonString) => {
    const importedData = parseImportData(jsonString);
    setData({
      expenses: importedData.expenses,
      people: importedData.people.length > 0 ? importedData.people : DEFAULT_PEOPLE,
      settlements: importedData.settlements,
    });
  }, []);

  return {
    expenses,
    people,
    settlements,
    isLoaded: true,
    addExpense,
    updateExpense,
    deleteExpense,
    updatePerson,
    toggleSettlement,
    clearAllData,
    getExportData,
    importData,
  };
};
