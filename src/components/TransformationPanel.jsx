import React, { useCallback } from "react";

export default React.memo(function TransformationPanel({ data, selectedColumn, setSelectedColumn, performAction }) {
  const removeRegex = useCallback(() => {
    if (!data.length) return alert("Upload Excel first!");
    if (!selectedColumn) return alert("Please select a column first!");
    if (!data[0][selectedColumn]) return alert(`No '${selectedColumn}' column!`);

    performAction((prev) => {
      return prev.map((row) => ({
        ...row,
        [selectedColumn]: String(row[selectedColumn] || "")
          .replace(/[()]/g, "")
          // .replace(/[^A-Za-z0-9]+/g, "_")
          .replace(/[^\p{L}\p{N}]+/gu, "_")
          .replace(/_+/g, "_")
          .replace(/^_+|_+$/g, ""),
      }));
    });
  }, [data, selectedColumn, performAction]);

  const setScaleFactor = useCallback(() => {
    if (!data.length) return alert("Upload Excel first!");
    if (!selectedColumn) return alert("Please select a column first!");
    if (!data[0][selectedColumn]) return alert(`No '${selectedColumn}' column!`);

    const mapping = { "1": 1, "10": 0.1, "100": 0.01, "1000": 0.001 };
    performAction((prev) => {
      return prev.map((row) => {
        let v = String(row[selectedColumn] || "").trim();
        if (mapping[v]) return { ...row, [selectedColumn]: mapping[v] };
        const n = parseFloat(v);
        return { ...row, [selectedColumn]: isNaN(n) ? v : n };
      });
    });
  }, [data, selectedColumn, performAction]);

  return (
    <div className="bg-white rounded-xl shadow-md p-5 border border-gray-200">
      <h3 className="font-semibold text-gray-800 mb-3">Data Transformation</h3>
      <div className="space-y-2">
        <div className="text-xs text-gray-500 mb-2">Selected: <span className="font-medium text-blue-600">{selectedColumn || "None"}</span></div>
        <button onClick={removeRegex} className="w-full bg-orange-500 hover:bg-orange-600 text-white px-4 py-2.5 rounded-lg">Give Remove Regex</button>
        <button onClick={setScaleFactor} className="w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-2.5 rounded-lg mt-2">Convert to Scale Factor</button>
      </div>
    </div>
  );
});
