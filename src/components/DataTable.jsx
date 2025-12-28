import React, { useMemo } from "react";

export default React.memo(function DataTable({ data, selectedColumn, setSelectedColumn }) {
    const rows = data;
    const columns = useMemo(() => (rows.length > 0 ? Object.keys(rows[0]) : []), [rows]);

    if (!rows || rows.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-slate-400">
                <svg className="w-16 h-16 mb-4 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                <p className="text-lg font-medium">No Data</p>
                <p className="text-sm">Upload Excel file</p>
            </div>
        );
    }

    return (
        <div className="h-full overflow-auto bg-white shadow-sm border border-slate-200 rounded-lg flex flex-col">
            <div className="sticky top-0 z-10 bg-slate-50 border-b border-slate-200 px-4 py-2 flex justify-between items-center text-xs text-slate-500 shadow-sm">
                <span>{rows.length} rows</span>
                <span>Column: <span className="font-medium text-blue-600">{selectedColumn || "None"}</span></span>
            </div>

            <div className="overflow-auto flex-1">
                <table className="min-w-full divide-y divide-slate-200 border-separate border-spacing-0">
                    <thead className="bg-slate-50 sticky top-0 z-0 text-xs uppercase font-medium text-slate-500">
                        <tr>
                            {columns.map((key) => (
                                <th
                                    key={key}
                                    onClick={() => setSelectedColumn(key)}
                                    className={`px-4 py-3 text-left border-b border-r border-slate-200 cursor-pointer select-none whitespace-nowrap sticky top-0 bg-slate-50 hover:bg-slate-100 transition-colors
                    ${key === selectedColumn ? 'text-blue-600 bg-blue-50/50' : ''}`}
                                >
                                    {key}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-slate-100 text-sm text-slate-700">
                        {rows.map((row, i) => (
                            <tr key={i} className="hover:bg-slate-50 transition-colors">
                                {columns.map((key) => (
                                    <td
                                        key={`${i}-${key}`}
                                        className={`px-4 py-2 whitespace-nowrap border-b border-slate-50 border-r border-r-slate-50
                                  ${key === selectedColumn ? 'bg-blue-50/20 font-medium text-slate-900' : ''}`}
                                    >
                                        {row[key]}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
});
