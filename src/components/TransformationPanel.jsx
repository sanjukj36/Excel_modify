// import React, { useCallback } from "react";

// export default React.memo(function TransformationPanel({ data, selectedColumn, setSelectedColumn, performAction }) {
//   const removeRegex = useCallback(() => {
//     if (!data.length) return alert("Upload Excel first!");
//     if (!selectedColumn) return alert("Please select a column first!");
//     if (!data[0][selectedColumn]) return alert(`No '${selectedColumn}' column!`);

//     performAction((prev) => {
//       return prev.map((row) => ({
//         ...row,
//         [selectedColumn]: String(row[selectedColumn] || "")
//           .replace(/[()]/g, "")
//           // .replace(/[^A-Za-z0-9]+/g, "_")
//           .replace(/[^\p{L}\p{N}]+/gu, "_")
//           .replace(/_+/g, "_")
//           .replace(/^_+|_+$/g, ""),
//       }));
//     });
//   }, [data, selectedColumn, performAction]);

//   const setScaleFactor = useCallback(() => {
//     if (!data.length) return alert("Upload Excel first!");
//     if (!selectedColumn) return alert("Please select a column first!");
//     if (!data[0][selectedColumn]) return alert(`No '${selectedColumn}' column!`);

//     const mapping = { "1": 1, "10": 0.1, "100": 0.01, "1000": 0.001 };
//     performAction((prev) => {
//       return prev.map((row) => {
//         let v = String(row[selectedColumn] || "").trim();
//         if (mapping[v]) return { ...row, [selectedColumn]: mapping[v] };
//         const n = parseFloat(v);
//         return { ...row, [selectedColumn]: isNaN(n) ? v : n };
//       });
//     });
//   }, [data, selectedColumn, performAction]);

//   const setRemoveDuplication = useCallback(() => {
//     if (!data.length) return alert("Upload Excel first!");
//     if (!selectedColumn) return alert("Please select a column first!");
//     if (!data[0][selectedColumn]) return alert(`No '${selectedColumn}' column!`);

//     performAction((prev) => {
//       const counter = {};

//       return prev.map((row) => {
//         let value = String(row[selectedColumn] || "").trim();

//         if (!value) return row;

//         if (counter[value] === undefined) {
//           counter[value] = 0;
//           return { ...row, [selectedColumn]: value };
//         }

//         counter[value] += 1;
//         return {
//           ...row,
//           [selectedColumn]: `${value}_${counter[value]}`
//         };
//       });
//     });
//   }, [data, selectedColumn, performAction]);

//   return (
//     <div className="bg-white rounded-xl shadow-md p-5 border border-gray-200">
//       <h3 className="font-semibold text-gray-800 mb-3">Data Transformation</h3>
//       <div className="space-y-2">
//         <div className="text-xs text-gray-500 mb-2">Selected: <span className="font-medium text-blue-600">{selectedColumn || "None"}</span></div>
//         <button onClick={removeRegex} className="w-full bg-orange-500 hover:bg-orange-600 text-white px-4 py-2.5 rounded-lg">Give Remove Regex</button>
//         <button onClick={setScaleFactor} className="w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-2.5 rounded-lg mt-2">
//           Convert to Scale Factor
//           <span> chnage this  "1": 1, "10": 0.1, "100": 0.01, "1000": 0.001 </span></button>
//         <button onClick={setRemoveDuplication} className="w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-2.5 rounded-lg mt-2">Remove Duplication</button>
//       </div>
//     </div>
//   );
// });
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

  const setRemoveDuplication = useCallback(() => {
    if (!data.length) return alert("Upload Excel first!");
    if (!selectedColumn) return alert("Please select a column first!");
    if (!data[0][selectedColumn]) return alert(`No '${selectedColumn}' column!`);

    performAction((prev) => {
      const counter = {};

      return prev.map((row) => {
        let value = String(row[selectedColumn] || "").trim();

        if (!value) return row;

        if (counter[value] === undefined) {
          counter[value] = 0;
          return { ...row, [selectedColumn]: value };
        }

        counter[value] += 1;
        return {
          ...row,
          [selectedColumn]: `${value}_${counter[value]}`
        };
      });
    });
  }, [data, selectedColumn, performAction]);

  return (
    <div className="bg-white rounded-xl shadow-md p-5 border border-gray-200">
      <h3 className="font-semibold text-gray-800 mb-3">Data Transformation</h3>
      <div className="text-xs text-gray-500 mb-4">
        Selected column: <span className="font-medium text-blue-600">{selectedColumn || "None"}</span>
        {!selectedColumn && <span className="text-red-500 ml-2">(Select a column first)</span>}
      </div>

      <div className="space-y-3">
        {/* Button 1: Remove Regex with tooltip */}
        <div className="relative group">
          <button
            onClick={removeRegex}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white px-4 py-3 rounded-lg transition-colors duration-200 font-medium"
          >
            Clean Text Formatting
          </button>
          <div className="absolute bottom-full left-0 mb-2 w-full px-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
            <div className="bg-gray-800 text-white text-xs p-3 rounded-lg shadow-lg">
              <p className="font-medium mb-1">What it does:</p>
              <ul className="list-disc pl-4 space-y-1">
                <li>Removes parentheses ( ) from text</li>
                <li>Replaces special characters with underscores</li>
                <li>Removes extra underscores (_)</li>
                <li>Trims underscores from start/end</li>
              </ul>
              <p className="mt-2 text-gray-300">Example: "Test (123)!" becomes "Test_123"</p>
            </div>
            <div className="w-3 h-3 bg-gray-800 transform rotate-45 absolute -bottom-1 left-6"></div>
          </div>
        </div>

        {/* Button 2: Scale Factor with tooltip */}
        <div className="relative group">
          <button
            onClick={setScaleFactor}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-3 rounded-lg transition-colors duration-200 font-medium"
          >
            Convert Scale Values
          </button>
          <div className="absolute bottom-full left-0 mb-2 w-full px-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
            <div className="bg-gray-800 text-white text-xs p-3 rounded-lg shadow-lg">
              <p className="font-medium mb-2">Converts string scale factors to decimal numbers:</p>
              <div className="grid grid-cols-2 gap-2 mb-2">
                <div className="bg-gray-700 p-2 rounded text-center">
                  <div className="font-bold">1
                    <span className="text-green-300 ps-1">→ 1</span>
                  </div>
                </div>
                <div className="bg-gray-700 p-2 rounded text-center">
                  <div className="font-bold">10
                    <span className="text-green-300 ps-1">→ 0.1</span>
                  </div>
                </div>
                <div className="bg-gray-700 p-2 rounded text-center">
                  <div className="font-bold">100
                    <span className="text-green-300 ps-1">→ 0.01</span>
                  </div>
                </div>
                <div className="bg-gray-700 p-2 rounded text-center">
                  <div className="font-bold">1000
                    <span className="text-green-300 ps-1">→ 0.001</span>
                  </div>
                </div>
              </div>
              <p className="text-gray-300">Other numeric values remain unchanged</p>
            </div>
            <div className="w-3 h-3 bg-gray-800 transform rotate-45 absolute -bottom-1 left-6"></div>
          </div>
        </div>

        {/* Button 3: Remove Duplication with tooltip */}
        <div className="relative group">
          <button
            onClick={setRemoveDuplication}
            className="w-full bg-purple-500 hover:bg-purple-600 text-white px-4 py-3 rounded-lg transition-colors duration-200 font-medium"
          >
            Remove Duplication
          </button>
          <div className="absolute bottom-full left-0 mb-2 w-full px-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
            <div className="bg-gray-800 text-white text-xs p-3 rounded-lg shadow-lg">
              <p className="font-medium mb-2">Appends numbers to duplicate values:</p>
              <div className="space-y-2 mb-2">
                <div className="flex items-center justify-between bg-gray-700 p-2 rounded">
                  <span className="font-mono">"Apple"</span>
                  <span className="text-green-300">→ "Apple" (first occurrence)</span>
                </div>
                <div className="flex items-center justify-between bg-gray-700 p-2 rounded">
                  <span className="font-mono">"Apple" (duplicate)</span>
                  <span className="text-green-300">→ "Apple_1"</span>
                </div>
                <div className="flex items-center justify-between bg-gray-700 p-2 rounded">
                  <span className="font-mono">"Apple" (another)</span>
                  <span className="text-green-300">→ "Apple_2"</span>
                </div>
              </div>
              <p className="text-gray-300">Empty cells are not modified</p>
            </div>
            <div className="w-3 h-3 bg-gray-800 transform rotate-45 absolute -bottom-1 left-6"></div>
          </div>
        </div>
      </div>

      {/* Status indicator */}
      {/* <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex items-center text-xs text-gray-600">
          <div className={`w-2 h-2 rounded-full mr-2 ${data.length > 0 ? 'bg-green-500' : 'bg-gray-300'}`}></div>
          <span>{data.length > 0 ? `Data loaded (${data.length} rows)` : 'No data loaded'}</span>
        </div>
        <div className="flex items-center text-xs text-gray-600 mt-1">
          <div className={`w-2 h-2 rounded-full mr-2 ${selectedColumn ? 'bg-green-500' : 'bg-gray-300'}`}></div>
          <span>{selectedColumn ? `Column selected: ${selectedColumn}` : 'No column selected'}</span>
        </div>
      </div> */}
    </div>
  );
});
