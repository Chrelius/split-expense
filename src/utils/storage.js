const STORAGE_KEY = 'expense-tracker-data';
const EXPORT_VERSION = 1;

export const getStoredData = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error reading from localStorage:', error);
  }
  return { expenses: [], people: [] };
};

export const saveData = (data) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
};

export const clearData = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing localStorage:', error);
  }
};

export const exportData = (data) => {
  const exportPayload = {
    version: EXPORT_VERSION,
    exportedAt: new Date().toISOString(),
    data: {
      expenses: data.expenses || [],
      people: data.people || [],
      settlements: data.settlements || {},
    },
  };
  return JSON.stringify(exportPayload, null, 2);
};

export const parseImportData = (jsonString) => {
  let parsed;
  try {
    parsed = JSON.parse(jsonString);
  } catch {
    throw new Error('Invalid JSON format: unable to parse file');
  }
  
  // Validate structure
  if (!parsed || typeof parsed !== 'object') {
    throw new Error('Invalid data format');
  }
  
  // Handle versioned export format
  if (parsed.version && parsed.data) {
    const { data } = parsed;
    if (!Array.isArray(data.expenses)) {
      throw new Error('Invalid expenses data');
    }
    if (!Array.isArray(data.people)) {
      throw new Error('Invalid people data');
    }
    return {
      expenses: data.expenses,
      people: data.people,
      settlements: data.settlements || {},
    };
  }
  
  // Handle legacy format (direct data without version wrapper)
  if (Array.isArray(parsed.expenses) && Array.isArray(parsed.people)) {
    return {
      expenses: parsed.expenses,
      people: parsed.people,
      settlements: parsed.settlements || {},
    };
  }
  
  throw new Error('Invalid data format: missing required fields');
};
