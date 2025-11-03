import React, { useState, useCallback } from "react";

export default React.memo(function NumericPanel({ data, selectedColumn, performAction }) {
  // local state for fast typing — commit when clicking Add/Subtract
  const [deltaLocal, setDeltaLocal] = useState("");

  const modifyRegister = useCallback((sign) => {
    if (!data.length) return alert("Upload Excel first!");
    if (!selectedColumn) return alert("Please select a column first!");
    if (!data[0][selectedColumn]) return alert(`No '${selectedColumn}' column!`);

    const val = parseInt(deltaLocal);
    if (isNaN(val)) return alert("Enter a valid number.");

    performAction((prev) => {
      return prev.map((row) => {
        const reg = parseInt(row[selectedColumn]);
        if (isNaN(reg)) return row;
        return { ...row, [selectedColumn]: (reg + sign * val).toString() };
      });
    });
  }, [data, selectedColumn, deltaLocal, performAction]);

  return (
    <div className="bg-white rounded-xl shadow-md p-5 border border-gray-200">
      <h3 className="font-semibold text-gray-800 mb-3">Numeric Operations</h3>
      <div className="space-y-3">
        <div className="text-xs text-gray-500">Selected: <span className="font-medium text-blue-600">{selectedColumn || "None"}</span></div>
        <input
          type="number"
          placeholder="Enter Δ value"
          value={deltaLocal}
          onChange={(e) => setDeltaLocal(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2.5"
        />
        <div className="flex gap-2">
          <button onClick={() => modifyRegister(+1)} className="flex-1 bg-green-500 hover:bg-green-600 text-white px-4 py-2.5 rounded-lg">Add</button>
          <button onClick={() => modifyRegister(-1)} className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2.5 rounded-lg">Subtract</button>
        </div>
      </div>
    </div>
  );
});

