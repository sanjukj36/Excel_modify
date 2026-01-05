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
    setData
}) {
    const rows = data || [];

    const columns = useMemo(() => {
        return rows.length > 0
            ? Object.keys(rows[0]).filter(k => !k.startsWith("__"))
            : [];
    }, [rows]);

    // 🔁 Rename column safely
    const renameColumn = useCallback((oldKey, newKey) => {
        if (!oldKey || !newKey || oldKey === newKey) return;

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
    }, [setData]);

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
                                {/* 🔤 Header content */}
                                <div className="flex items-center gap-2">
                                    <span className="font-medium">{key}</span>

                                    {/* 🔽 Inline options ONLY for selected column */}
                                    {enableSelection && key === selectedColumn && (
                                        <select
                                            className="ml-2 border border-slate-300 rounded px-1 py-0.5 text-[10px] bg-white text-slate-700"
                                            defaultValue=""
                                            onClick={(e) => e.stopPropagation()}
                                            onChange={(e) => {
                                                if (!e.target.value) return;
                                                renameColumn(key, e.target.value);
                                                setSelectedColumn(e.target.value);
                                                e.target.value = "";
                                            }}
                                        >
                                            <option value="">"to chnage"</option>
                                            <option value="Address">Address</option>
                                            <option value="Tags">Tags</option>
                                            <option value="Scale Factors">
                                                Scale Factors
                                            </option>
                                        </select>
                                    )}
                                </div>
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
