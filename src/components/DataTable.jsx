import React, { useMemo } from "react";

export default React.memo(function DataTable({ data, selectedColumn, setSelectedColumn }) {
  const rows = data;

  const columns = useMemo(() => (rows.length > 0 ? Object.keys(rows[0]) : []), [rows]);

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200 h-[calc(100vh-40px)]">
      <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
        <div className="flex justify-between items-center">
          <div className="flex gap-1">
            <p className="text-sm mt-1 text-gray-600">Showing {rows.length} rows</p>
          </div>
          <div className="text-sm text-blue-600 font-medium">Selected: {selectedColumn}</div>
        </div>
      </div>
      <div className="overflow-auto max-h-[calc(100vh-100px)]">
        <table className="min-w-full divide-y divide-gray-200 ">
          <thead className="bg-gray-50 sticky top-0">
            <tr>
              {columns.map((key) => (
                <th
                  key={key}
                  className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider border-b cursor-pointer ${key === selectedColumn
                    ? 'bg-blue-100 text-blue-700 border-blue-200'
                    : 'text-gray-500'
                    }`}
                  onClick={() => setSelectedColumn(key)}
                >
                  <div className="flex items-center gap-1">
                    {key}
                    {key === selectedColumn && (
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {rows.map((row, i) => (
              <tr key={i} className="hover:bg-gray-50 transition-colors">
                {Object.entries(row).map(([key, val]) => (
                  <td key={key} className={`px-6 py-4 whitespace-nowrap text-sm border-b ${key === selectedColumn ? 'bg-blue-50 text-blue-900 font-medium' : 'text-gray-700'}`}>
                    {val}
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
