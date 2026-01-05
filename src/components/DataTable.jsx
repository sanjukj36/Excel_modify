// import React, { useMemo } from "react";

// export default React.memo(function DataTable({ data, selectedColumn, setSelectedColumn, enableSelection = true, setData }) {
//     const rows = data;
//     const columns = useMemo(() => (rows.length > 0 ? Object.keys(rows[0]).filter(k => !k.startsWith("__")) : []), [rows]);

//     if (!rows || rows.length === 0) {
//         return (
//             <div className="flex flex-col items-center justify-center h-full text-slate-400">
//                 <svg className="w-16 h-16 mb-4 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
//                 </svg>
//                 <p className="text-lg font-medium">No Data</p>
//                 <p className="text-sm">Upload Excel file</p>
//             </div>
//         );
//     }

//     return (
//         <div className="h-full overflow-auto bg-white shadow-sm border border-slate-200 rounded-lg flex flex-col">
//             <div className="sticky top-0 z-10 bg-slate-50 border-b border-slate-200 px-4 py-2 flex justify-between items-center text-xs text-slate-500 shadow-sm">
//                 <span>{rows.length} rows</span>
//                 {enableSelection && (
//                     <span>Column: <span className="font-medium text-blue-600">{selectedColumn || "None"}</span></span>
//                 )}
//             </div>

//             <div className="overflow-auto flex-1">
//                 <table className="min-w-full divide-y divide-slate-200 border-separate border-spacing-0">
//                     <thead className="bg-slate-50 sticky top-0 z-0 text-xs uppercase font-medium text-slate-500">
//                         <tr>
//                             {columns.map((key) => (
//                                 <th
//                                     key={key}
//                                     onClick={() => enableSelection && setSelectedColumn(key)}
//                                     className={`px-4 py-3 text-left border-b border-r border-slate-200 whitespace-nowrap sticky top-0 bg-slate-50 transition-colors
//                     ${enableSelection ? 'cursor-pointer hover:bg-slate-100 select-none' : ''}
//                     ${enableSelection && key === selectedColumn ? 'text-blue-600 bg-blue-50/50' : ''}`}
//                                 >
//                                     {key}
//                                 </th>
//                             ))}
//                         </tr>
//                     </thead>
//                     <tbody className="bg-white divide-y divide-slate-100 text-sm text-slate-700">
//                         {rows.map((row, i) => (
//                             <tr
//                                 key={i}
//                                 className={`transition-colors ${row.__isOriginalDuplicate
//                                     ? "bg-red-50 text-red-600 hover:bg-red-100"
//                                     : "hover:bg-slate-50 text-slate-700"
//                                     }`}
//                             >
//                                 {columns.map((key, colIndex) => (
//                                     <td
//                                         key={`${i}-${key}`}
//                                         className={`px-4 py-2 whitespace-nowrap border-b border-slate-50 border-r border-r-slate-50
//                                   ${enableSelection && key === selectedColumn ? 'bg-blue-50/20 font-medium text-slate-900' : ''}`}
//                                     >
//                                         <div className="flex items-center gap-2">
//                                             {row[key]}
//                                             {colIndex === 0 && row.__isOriginalDuplicate && (
//                                                 <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-red-100 text-red-700 border border-red-200 uppercase tracking-wide">
//                                                     Original
//                                                 </span>
//                                             )}
//                                         </div>
//                                     </td>
//                                 ))}
//                             </tr>
//                         ))}
//                     </tbody>
//                 </table>
//             </div>
//         </div>
//     );
// });
import React, { useMemo, useCallback } from "react";

export default React.memo(function DataTable({
    data,
    selectedColumn,
    setSelectedColumn,
    enableSelection = true,
    setData,
    performAction
}) {
    const rows = data || [];
    const [editingColumn, setEditingColumn] = React.useState(null);
    const [tempName, setTempName] = React.useState("");

    const columns = useMemo(() => {
        return rows.length > 0
            ? Object.keys(rows[0]).filter(k => !k.startsWith("__"))
            : [];
    }, [rows]);

    // 🔁 Rename column safely
    const renameColumn = useCallback((oldKey, newKey) => {
        if (!oldKey || !newKey || oldKey === newKey) return;

        if (performAction) {
            performAction((prev) =>
                prev.map((row) => {
                    if (!(oldKey in row)) return row;
                    const { [oldKey]: value, ...rest } = row;
                    return { ...rest, [newKey]: value };
                })
            );
        } else {
            // Fallback if performAction is missing (though it shouldn't be)
            setData(prev =>
                prev.map(row => {
                    if (!(oldKey in row)) return row;
                    const { [oldKey]: value, ...rest } = row;
                    return {
                        ...rest,
                        [newKey]: value
                    };
                })
            );
        }
        setSelectedColumn(newKey);
    }, [performAction, setData, setSelectedColumn]);

    const startEditing = (key) => {
        setEditingColumn(key);
        setTempName(key);
    };

    const saveColumnName = () => {
        if (editingColumn && tempName && tempName !== editingColumn) {
            renameColumn(editingColumn, tempName);
        }
        setEditingColumn(null);
    };

    if (!rows.length) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-slate-400">
                <p className="text-lg font-medium">No Data</p>
                <p className="text-sm">Upload Excel file</p>
            </div>
        );
    }

    return (
        <div className="h-full overflow-auto bg-white shadow-sm border border-slate-200 rounded-lg">
            <table className="min-w-full divide-y divide-slate-200 border-separate border-spacing-0">
                <thead className="bg-slate-50 sticky top-0 z-10 text-xs font-medium text-slate-500">
                    <tr>
                        {columns.map((key) => (
                            <th
                                key={key}
                                onClick={() =>
                                    enableSelection && setSelectedColumn(key)
                                }
                                className={`px-4 py-3 text-left border-b border-r border-slate-200 whitespace-nowrap bg-slate-50
                                ${enableSelection ? "cursor-pointer hover:bg-slate-100" : ""}
                                ${key === selectedColumn ? "bg-blue-50 text-blue-600" : ""}`}
                            >
                                {editingColumn === key ? (
                                    <>
                                        <input
                                            autoFocus
                                            type="text"
                                            list="column-suggestions"
                                            value={tempName}
                                            onChange={(e) => setTempName(e.target.value)}
                                            onBlur={saveColumnName}
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter") saveColumnName();
                                                if (e.key === "Escape") setEditingColumn(null);
                                            }}
                                            onClick={(e) => e.stopPropagation()}
                                            className="ml-2 border border-blue-400 rounded px-1 py-0.5 text-xs text-slate-700 outline-none w-32"
                                        />
                                        <datalist id="column-suggestions">
                                            <option value="Address" />
                                            <option value="Tags" />
                                            <option value="Scale Factors" />
                                        </datalist>
                                    </>
                                ) : (
                                    <div className="flex items-center gap-2">
                                        <span className="font-medium">{key}</span>
                                        {enableSelection && key === selectedColumn && (
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    startEditing(key);
                                                }}
                                                className="ml-1 text-slate-400 hover:text-blue-600 p-1 rounded hover:bg-slate-100 transition-colors"
                                                title="Rename Column"
                                            >
                                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                                </svg>
                                            </button>
                                        )}
                                    </div>
                                )}
                            </th>
                        ))}
                    </tr>
                </thead>

                <tbody className="bg-white divide-y divide-slate-100 text-sm text-slate-700">
                    {rows.map((row, i) => (
                        <tr
                            key={i}
                            className={`hover:bg-slate-50 ${row.__isOriginalDuplicate
                                ? "bg-red-50 text-red-600"
                                : ""
                                }`}
                        >
                            {columns.map((key, colIndex) => (
                                <td
                                    key={`${i}-${key}`}
                                    className={`px-4 py-2 whitespace-nowrap border-b border-r border-slate-50
                                    ${key === selectedColumn ? "bg-blue-50/20 font-medium" : ""}`}
                                >
                                    <div className="flex items-center gap-2">
                                        {row[key]}
                                        {colIndex === 0 &&
                                            row.__isOriginalDuplicate && (
                                                <span className="text-[10px] px-1.5 py-0.5 bg-red-100 text-red-700 rounded border border-red-200 uppercase">
                                                    Original
                                                </span>
                                            )}
                                    </div>
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
});
