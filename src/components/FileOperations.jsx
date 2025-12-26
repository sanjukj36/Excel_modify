// import React, { useCallback } from "react";
// import Papa from "papaparse";
// import { saveAs } from "file-saver";

// export default React.memo(function FileOperations({ resetChanges, undoLastAction, redoLastAction, data }) {
//   const saveCSV = useCallback(() => {
//     if (!data.length) return alert("Nothing to save!");
//     const csv = Papa.unparse(data);
//     const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
//     saveAs(blob, "output.csv");
//   }, [data]);

//   return (
//     <div className="bg-white rounded-xl shadow-md p-5 border border-gray-200">
//       <h3 className="font-semibold text-gray-800 mb-3">File Operations</h3>
//       <div className="space-y-2">
//         <div className="flex flex-col sm:flex-row gap-3">
//           <button onClick={undoLastAction} className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2.5 rounded-lg">Undo</button>
//           <button onClick={redoLastAction} className="flex-1 bg-green-500 hover:bg-green-600 text-white px-4 py-2.5 rounded-lg">Re-Undo</button>
//         </div>
//         <div className="flex flex-col sm:flex-row gap-3 mt-2">
//           <button onClick={resetChanges} className="w-full bg-gray-500 hover:bg-gray-600 text-white px-4 py-2.5 rounded-lg">Reset Changes</button>
//           <button onClick={saveCSV} className="w-full bg-red-500 hover:bg-red-600 text-white px-4 py-2.5 rounded-lg">Save as CSV</button>
//         </div>
//       </div>
//     </div>
//   );
// });

import React, { useCallback } from "react";
import Papa from "papaparse";
import { saveAs } from "file-saver";

export default React.memo(function FileOperations({ resetChanges, undoLastAction, redoLastAction, data }) {
  const saveCSV = useCallback(() => {
    if (!data.length) return alert("Nothing to save!");
    const csv = Papa.unparse(data);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "output.csv");
  }, [data]);

  return (
    <div className="bg-white rounded-xl shadow-md p-5 border border-gray-200">
      <h3 className="font-semibold text-gray-800 mb-3">File Operations</h3>
      
      <div className="space-y-4">
        {/* History controls with tooltips */}
        <div className="grid grid-cols-2 gap-3">
          {/* Undo Button with tooltip */}
          <div className="relative group">
            <button 
              onClick={undoLastAction}
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-4 py-3 rounded-lg transition-all duration-200 font-medium shadow-sm hover:shadow-md flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h10a8 8 0 018 8v2M3 10l6-6m-6 6l6 6" />
              </svg>
              <span>Undo</span>
            </button>
            <div className="absolute bottom-full left-0 mb-2 w-full px-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
              <div className="bg-gray-800 text-white text-xs p-3 rounded-lg shadow-lg">
                <p className="font-medium mb-2">Undo Last Action</p>
                <ul className="space-y-1">
                  <li className="flex items-center">
                    <span className="text-blue-300 mr-2">↶</span>
                    Reverts your last transformation
                  </li>
                  <li className="flex items-center">
                    <span className="text-blue-300 mr-2">↺</span>
                    Works on all applied changes
                  </li>
                </ul>
              </div>
              <div className="w-3 h-3 bg-gray-800 transform rotate-45 absolute -bottom-1 left-6"></div>
            </div>
          </div>

          {/* Redo/Re-Undo Button with tooltip */}
          <div className="relative group">
            <button 
              onClick={redoLastAction}
              className="w-full bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white px-4 py-3 rounded-lg transition-all duration-200 font-medium shadow-sm hover:shadow-md flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 10h-10a8 8 0 00-8 8v2M21 10l-6-6m6 6l-6 6" />
              </svg>
              <span>Redo</span>
            </button>
            <div className="absolute bottom-full left-0 mb-2 w-full px-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
              <div className="bg-gray-800 text-white text-xs p-3 rounded-lg shadow-lg">
                <p className="font-medium mb-2">Redo Last Undo</p>
                <ul className="space-y-1">
                  <li className="flex items-center">
                    <span className="text-green-300 mr-2">↷</span>
                    Restores an undone action
                  </li>
              
                  <li className="flex items-center">
                    <span className="text-green-300 mr-2">⚠️</span>
                    Only available after using Undo
                  </li>
                </ul>
              </div>
              <div className="w-3 h-3 bg-gray-800 transform rotate-45 absolute -bottom-1 left-6"></div>
            </div>
          </div>
        </div>

        {/* File operations with tooltips */}
        <div className="grid grid-cols-2 gap-3">
          {/* Reset Changes Button with tooltip */}
          <div className="relative group">
            <button 
              onClick={resetChanges}
              className="w-full bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white px-4 py-3 rounded-lg transition-all duration-200 font-medium shadow-sm hover:shadow-md flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>Reset All</span>
            </button>
            <div className="absolute bottom-full left-0 mb-2 w-full px-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
              <div className="bg-gray-800 text-white text-xs p-3 rounded-lg shadow-lg">
                <p className="font-medium mb-2">Reset All Changes</p>
                <div className="space-y-2">
                  <div className="bg-red-900/30 p-2 rounded border border-red-700/50">
                    <p className="font-medium text-red-300">Warning: This cannot be undone!</p>
                  </div>
                  <ul className="space-y-1">
                    <li className="flex items-center">
                      <span className="text-red-400 mr-2">↺</span>
                      Reverts to original uploaded data
                    </li>
                    <li className="flex items-center">
                      <span className="text-red-400 mr-2">⌫</span>
                      Removes all transformations
                    </li>
                    <li className="flex items-center">
                      <span className="text-red-400 mr-2">⚠️</span>
                      Use with caution
                    </li>
                  </ul>
                </div>
              </div>
              <div className="w-3 h-3 bg-gray-800 transform rotate-45 absolute -bottom-1 left-6"></div>
            </div>
          </div>

          {/* Save CSV Button with tooltip */}
          <div className="relative group">
            <button 
              onClick={saveCSV}
              disabled={!data.length}
              className="w-full bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white px-4 py-3 rounded-lg transition-all duration-200 font-medium shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
              </svg>
              <span>Save CSV</span>
            </button>
            <div className="absolute bottom-full left-0 mb-2 w-full px-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
              <div className="bg-gray-800 text-white text-xs p-3 rounded-lg shadow-lg">
                <p className="font-medium mb-2">Export to CSV File</p>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <span className="text-green-300 mr-2">📥</span>
                    Downloads as "output.csv"
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-300 mr-2">📊</span>
                    Contains all current transformations
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-300 mr-2">💾</span>
                    Compatible with Excel/Google Sheets
                  </li>
                </ul>
                {!data.length && (
                  <div className="mt-2 p-2 bg-yellow-900/30 rounded border border-yellow-700/50">
                    <p className="text-yellow-300">⚠️ Upload data first</p>
                  </div>
                )}
              </div>
              <div className="w-3 h-3 bg-gray-800 transform rotate-45 absolute -bottom-1 left-6"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Status information */}
      {/* <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="space-y-2">
          <div className="flex items-center text-xs text-gray-600">
            <div className="w-2 h-2 rounded-full mr-2 bg-blue-400"></div>
            <span>All operations maintain your original data until export</span>
          </div>
          <div className="flex items-center text-xs text-gray-600">
            <div className="w-2 h-2 rounded-full mr-2 bg-green-400"></div>
            <span>Downloaded CSV includes all applied transformations</span>
          </div>
          <div className="text-xs text-gray-500 mt-2">
            <span className="font-medium">Tip:</span> Use Undo/Redo to preview changes before saving
          </div>
        </div>
      </div> */}
    </div>
  );
});