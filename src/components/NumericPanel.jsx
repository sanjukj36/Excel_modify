// import React, { useState, useCallback } from "react";

// export default React.memo(function NumericPanel({ data, selectedColumn, performAction }) {
//   // local state for fast typing — commit when clicking Add/Subtract
//   const [deltaLocal, setDeltaLocal] = useState("");

//   const modifyRegister = useCallback((sign) => {
//     if (!data.length) return alert("Upload Excel first!");
//     if (!selectedColumn) return alert("Please select a column first!");
//     if (!data[0][selectedColumn]) return alert(`No '${selectedColumn}' column!`);

//     const val = parseInt(deltaLocal);
//     if (isNaN(val)) return alert("Enter a valid number.");

//     performAction((prev) => {
//       return prev.map((row) => {
//         const reg = parseInt(row[selectedColumn]);
//         if (isNaN(reg)) return row;
//         return { ...row, [selectedColumn]: (reg + sign * val).toString() };
//       });
//     });
//   }, [data, selectedColumn, deltaLocal, performAction]);

//   return (
//     <div className="bg-white rounded-xl shadow-md p-5 border border-gray-200">
//       <h3 className="font-semibold text-gray-800 mb-3">Numeric Operations</h3>
//       <div className="space-y-3">
//         <div className="text-xs text-gray-500">Selected: <span className="font-medium text-blue-600">{selectedColumn || "None"}</span></div>
//         <input
//           type="number"
//           placeholder="Enter Δ value"
//           value={deltaLocal}
//           onChange={(e) => setDeltaLocal(e.target.value)}
//           className="w-full border border-gray-300 rounded-lg px-3 py-2.5"
//         />
//         <div className="flex gap-2">
//           <button onClick={() => modifyRegister(+1)} className="flex-1 bg-green-500 hover:bg-green-600 text-white px-4 py-2.5 rounded-lg">Add</button>
//           <button onClick={() => modifyRegister(-1)} className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2.5 rounded-lg">Subtract</button>
//         </div>
//       </div>
//     </div>
//   );
// });


import React, { useState, useCallback } from "react";

export default React.memo(function NumericPanel({
  data,
  selectedColumn,
  performAction
}) {
  const [deltaLocal, setDeltaLocal] = useState("");

  // 🔒 Disable numeric ops for Tags column
  const isTagsColumn = selectedColumn === "Tags";

  const modifyRegister = useCallback(
    (sign) => {
      // 🛑 HARD GUARD — never allow Tags calculation
      if (selectedColumn === "Tags") {
        alert("Numeric operations are disabled for the 'Tags' column.");
        return;
      }

      if (!data.length) return alert("Upload Excel first!");
      if (!selectedColumn) return alert("Please select a column first!");
      if (!data[0]?.[selectedColumn])
        return alert(`No '${selectedColumn}' column found!`);

      const val = parseInt(deltaLocal, 10);
      if (isNaN(val)) return alert("Enter a valid number.");

      performAction((prev) =>
        prev.map((row) => {
          const reg = parseInt(row[selectedColumn], 10);
          if (isNaN(reg)) return row;

          return {
            ...row,
            [selectedColumn]: (reg + sign * val).toString()
          };
        })
      );
    },
    [data, selectedColumn, deltaLocal, performAction]
  );

  const handleKeyPress = useCallback(
    (e, sign) => {
      if (e.key === "Enter" && !isTagsColumn) {
        modifyRegister(sign);
      }
    },
    [modifyRegister, isTagsColumn]
  );

  return (
    <div className="bg-white rounded-xl shadow-md p-5 border border-gray-200">
      <h3 className="font-semibold text-gray-800 mb-3">
        Numeric Operations
      </h3>

      <div className="text-xs text-gray-500 mb-2">
        Selected column:{" "}
        <span className="font-medium text-blue-600">
          {selectedColumn || "None"}
        </span>
      </div>

      {/* 🚫 Tags warning */}
      {isTagsColumn && (
        <div className="mb-4 text-sm text-red-600 font-medium">
          ⚠ Numeric operations are disabled for the <b>Tags</b> column.
        </div>
      )}

      <div className="space-y-4">
        {/* Input */}
        <input
          type="number"
          value={deltaLocal}
          onChange={(e) => setDeltaLocal(e.target.value)}
          onKeyDown={(e) => handleKeyPress(e, +1)}
          disabled={isTagsColumn}
          placeholder={
            isTagsColumn
              ? "Disabled for Tags column"
              : "Enter Δ value (number to add/subtract)"
          }
          className="w-full border border-gray-300 rounded-lg px-4 py-3
                     focus:outline-none focus:ring-2 focus:ring-blue-500
                     disabled:bg-gray-100 disabled:cursor-not-allowed"
        />

        {/* Buttons */}
        <div className="grid grid-cols-2 gap-3">
          {/* Add */}
          <button
            onClick={() => modifyRegister(+1)}
            disabled={
              isTagsColumn ||
              !deltaLocal ||
              isNaN(parseInt(deltaLocal, 10))
            }
            className="w-full bg-gradient-to-r from-green-500 to-emerald-600
                       hover:from-green-600 hover:to-emerald-700
                       text-white px-4 py-3 rounded-lg font-medium
                       transition-all shadow-sm hover:shadow-md
                       disabled:opacity-50 disabled:cursor-not-allowed"
          >
            + Add Δ
          </button>

          {/* Subtract */}
          <button
            onClick={() => modifyRegister(-1)}
            disabled={
              isTagsColumn ||
              !deltaLocal ||
              isNaN(parseInt(deltaLocal, 10))
            }
            className="w-full bg-gradient-to-r from-amber-500 to-orange-600
                       hover:from-amber-600 hover:to-orange-700
                       text-white px-4 py-3 rounded-lg font-medium
                       transition-all shadow-sm hover:shadow-md
                       disabled:opacity-50 disabled:cursor-not-allowed"
          >
            − Subtract Δ
          </button>
        </div>
      </div>
    </div>
  );
});

// import React, { useState, useCallback } from "react";

// export default React.memo(function NumericPanel({ data, selectedColumn, performAction }) {
//   const [deltaLocal, setDeltaLocal] = useState("");

//   const modifyRegister = useCallback((sign) => {
//     if (!data.length) return alert("Upload Excel first!");
//     if (!selectedColumn) return alert("Please select a column first!");
//     if (!data[0][selectedColumn]) return alert(`No '${selectedColumn}' column!`);

//     const val = parseInt(deltaLocal);
//     if (isNaN(val)) return alert("Enter a valid number.");

//     performAction((prev) => {
//       return prev.map((row) => {
//         const reg = parseInt(row[selectedColumn]);
//         if (isNaN(reg)) return row;
//         return { ...row, [selectedColumn]: (reg + sign * val).toString() };
//       });
//     });
//   }, [data, selectedColumn, deltaLocal, performAction]);

//   const handleKeyPress = useCallback((e, sign) => {
//     if (e.key === 'Enter') {
//       modifyRegister(sign);
//     }
//   }, [modifyRegister]);

//   return (
//     <div className="bg-white rounded-xl shadow-md p-5 border border-gray-200">
//       <h3 className="font-semibold text-gray-800 mb-3">Numeric Operations</h3>
      
//       <div className="text-xs text-gray-500 mb-4">
//         Selected column: <span className="font-medium text-blue-600">{selectedColumn || "None"}</span>
//         {!selectedColumn && <span className="text-red-500 ml-2">(Select a column first)</span>}
//       </div>
      
//       <div className="space-y-4">
//         {/* Input field with tooltip */}
//         <div className="relative group">
//           <input
//             type="number"
//             placeholder="Enter Δ value (number to add/subtract)"
//             value={deltaLocal}
//             onChange={(e) => setDeltaLocal(e.target.value)}
//             onKeyDown={(e) => handleKeyPress(e, +1)}
//             className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//           />
//           <div className="absolute left-0 -top-2 transform -translate-y-full mb-1 w-full px-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
//             <div className="bg-gray-800 text-white text-xs p-3 rounded-lg shadow-lg">
//               <p className="font-medium mb-1">Δ Value Input</p>
//               <ul className="space-y-1">
//                 <li className="flex items-center">
//                   <span className="text-green-400 mr-2">✓</span>
//                   Enter positive or negative number
//                 </li>
//                 <li className="flex items-center">
//                   <span className="text-green-400 mr-2">✓</span>
//                   Press Enter after typing to apply Add
//                 </li>
//                 <li className="flex items-center">
//                   <span className="text-green-400 mr-2">✓</span>
//                   Works only with integer values
//                 </li>
//               </ul>
//             </div>
//             <div className="w-3 h-3 bg-gray-800 transform rotate-45 absolute -bottom-1 left-6"></div>
//           </div>
//         </div>

//         {/* Action buttons with tooltips */}
//         <div className="grid grid-cols-2 gap-3">
//           {/* Add Button with tooltip */}
//           <div className="relative group">
//             <button 
//               onClick={() => modifyRegister(+1)}
//               className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-4 py-3 rounded-lg transition-all duration-200 font-medium shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
//               disabled={!deltaLocal || isNaN(parseInt(deltaLocal))}
//             >
//               <div className="flex items-center justify-center gap-2">
//                 <span className="text-lg">+</span>
//                 <span>Add Δ</span>
//               </div>
//             </button>
//             <div className="absolute bottom-full left-0 mb-2 w-full px-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
//               <div className="bg-gray-800 text-white text-xs p-3 rounded-lg shadow-lg">
//                 <p className="font-medium mb-2">Add Operation</p>
//                 <div className="space-y-2">
//                   <div className="bg-gray-700 p-2 rounded text-center">
//                     <div className="font-mono">Current Value + Δ</div>
//                   </div>
//                   <div className="flex items-center justify-between">
//                     <span className="text-gray-300">Example:</span>
//                     <span className="font-mono text-green-300">100 + 5 = 105</span>
//                   </div>
//                 </div>
//                 <p className="mt-2 text-gray-300 text-xs">Applies to all rows in selected column</p>
//               </div>
//               <div className="w-3 h-3 bg-gray-800 transform rotate-45 absolute -bottom-1 left-6"></div>
//             </div>
//           </div>

//           {/* Subtract Button with tooltip */}
//           <div className="relative group">
//             <button 
//               onClick={() => modifyRegister(-1)}
//               className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white px-4 py-3 rounded-lg transition-all duration-200 font-medium shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
//               disabled={!deltaLocal || isNaN(parseInt(deltaLocal))}
//             >
//               <div className="flex items-center justify-center gap-2">
//                 <span className="text-lg">−</span>
//                 <span>Subtract Δ</span>
//               </div>
//             </button>
//             <div className="absolute bottom-full left-0 mb-2 w-full px-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
//               <div className="bg-gray-800 text-white text-xs p-3 rounded-lg shadow-lg">
//                 <p className="font-medium mb-2">Subtract Operation</p>
//                 <div className="space-y-2">
//                   <div className="bg-gray-700 p-2 rounded text-center">
//                     <div className="font-mono">Current Value − Δ</div>
//                   </div>
//                   <div className="flex items-center justify-between">
//                     <span className="text-gray-300">Example:</span>
//                     <span className="font-mono text-green-300">100 − 5 = 95</span>
//                   </div>
//                 </div>
//                 <p className="mt-2 text-gray-300 text-xs">Applies to all rows in selected column</p>
//               </div>
//               <div className="w-3 h-3 bg-gray-800 transform rotate-45 absolute -bottom-1 left-6"></div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Status and instructions */}
//       {/* <div className="mt-6 pt-4 border-t border-gray-200">
//         <div className="space-y-2">
//           <div className="flex items-center text-xs text-gray-600">
//             <div className={`w-2 h-2 rounded-full mr-2 ${deltaLocal && !isNaN(parseInt(deltaLocal)) ? 'bg-green-500 animate-pulse' : 'bg-gray-300'}`}></div>
//             <span>{deltaLocal && !isNaN(parseInt(deltaLocal)) ? `Δ = ${parseInt(deltaLocal)} ready` : 'Enter Δ value'}</span>
//           </div>
//           <div className="flex items-center text-xs text-gray-600">
//             <div className="w-2 h-2 rounded-full mr-2 bg-blue-400"></div>
//             <span>Non-numeric cells in column are skipped</span>
//           </div>
//           <div className="text-xs text-gray-500 mt-2">
//             <span className="font-medium">Tip:</span> Press Enter in input field to quickly Add
//           </div>
//         </div>
//       </div> */}
//     </div>
//   );
// });

