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
      <div className="space-y-2">
        <div className="flex flex-col sm:flex-row gap-3">
          <button onClick={undoLastAction} className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2.5 rounded-lg">Undo</button>
          <button onClick={redoLastAction} className="flex-1 bg-green-500 hover:bg-green-600 text-white px-4 py-2.5 rounded-lg">Re-Undo</button>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 mt-2">
          <button onClick={resetChanges} className="w-full bg-gray-500 hover:bg-gray-600 text-white px-4 py-2.5 rounded-lg">Reset Changes</button>
          <button onClick={saveCSV} className="w-full bg-red-500 hover:bg-red-600 text-white px-4 py-2.5 rounded-lg">Save as CSV</button>
        </div>
      </div>
    </div>
  );
});

