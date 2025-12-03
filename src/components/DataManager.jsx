import { useState, useRef } from 'react';

const IMPORT_SUCCESS_CLOSE_DELAY_MS = 1500;

const DataManager = ({ onExport, onImport, onClose }) => {
  const [importError, setImportError] = useState('');
  const [importSuccess, setImportSuccess] = useState(false);
  const fileInputRef = useRef(null);

  const handleExport = () => {
    const dataStr = onExport();
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `split-expense-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImportError('');
    setImportSuccess(false);

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result;
        if (typeof content !== 'string') {
          throw new Error('Failed to read file');
        }
        onImport(content);
        setImportSuccess(true);
        setTimeout(() => {
          onClose();
        }, IMPORT_SUCCESS_CLOSE_DELAY_MS);
      } catch (error) {
        setImportError(error.message || 'Failed to import data');
      }
    };
    reader.onerror = () => {
      setImportError('Failed to read file');
    };
    reader.readAsText(file);

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
            <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
            </svg>
          </div>
          <h2 className="text-lg font-semibold text-gray-800">Export / Import</h2>
        </div>
        <button
          onClick={onClose}
          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          title="Close"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <p className="text-sm text-gray-500 mb-4">
        Export your data to transfer to another device, or import a previously exported backup.
      </p>

      <div className="space-y-3">
        {/* Export Button */}
        <button
          onClick={handleExport}
          className="w-full flex items-center justify-center gap-2 bg-indigo-500 text-white py-3 px-4 rounded-xl hover:bg-indigo-600 transition-colors font-medium text-sm"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Export Data
        </button>

        {/* Import Button */}
        <label className="w-full flex items-center justify-center gap-2 bg-gray-100 text-gray-700 py-3 px-4 rounded-xl hover:bg-gray-200 transition-colors font-medium text-sm cursor-pointer">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
          </svg>
          Import Data
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleFileSelect}
            className="hidden"
          />
        </label>
      </div>

      {/* Error Message */}
      {importError && (
        <div className="mt-4 p-3 bg-red-50 border border-red-100 rounded-xl">
          <p className="text-sm text-red-600">{importError}</p>
        </div>
      )}

      {/* Success Message */}
      {importSuccess && (
        <div className="mt-4 p-3 bg-green-50 border border-green-100 rounded-xl">
          <p className="text-sm text-green-600">Data imported successfully!</p>
        </div>
      )}

      <p className="mt-4 text-xs text-gray-400">
        Note: Importing will replace all existing data.
      </p>
    </div>
  );
};

export default DataManager;
