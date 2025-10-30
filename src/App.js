import React, { useState } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import Papa from "papaparse";

export default function App() {

  const [data, setData] = useState([]);
  const [originalData, setOriginalData] = useState([]);
  const [delta, setDelta] = useState("");
  const [fileName, setFileName] = useState("");
  const [selectedColumn, setSelectedColumn] = useState("");

  const uploadExcel = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (evt) => {
      const wb = XLSX.read(evt.target.result, { type: "binary" });
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      const json = XLSX.utils.sheet_to_json(ws, { defval: "" });
      setData(json);
      setOriginalData(json);
      // Set the first column as default selected column
      if (json.length > 0 && Object.keys(json[0]).length > 0) {
        setSelectedColumn(Object.keys(json[0])[0]);
      }
    };
    reader.readAsBinaryString(file);
  };

  const removeRegex = () => {
    if (!data.length) return alert("Upload Excel first!");
    if (!selectedColumn) return alert("Please select a column first!");
    if (!data[0][selectedColumn]) return alert(`No '${selectedColumn}' column!`);

    const cleaned = data.map((row) => ({
      ...row,
      [selectedColumn]: String(row[selectedColumn] || "")
        .replace(/[()]/g, "")
        .replace(/[^A-Za-z0-9]+/g, "_")
        .replace(/_+/g, "_")
        .replace(/^_+|_+$/g, ""),
    }));
    setData(cleaned);
  };

  const setScaleFactor = () => {
    if (!data.length) return alert("Upload Excel first!");
    if (!selectedColumn) return alert("Please select a column first!");
    if (!data[0][selectedColumn]) return alert(`No '${selectedColumn}' column!`);

    const mapping = { "1": 1, "10": 0.1, "100": 0.001, "1000": 0.0001 };

    const updated = data.map((row) => {
      let v = String(row[selectedColumn] || "").trim();
      if (mapping[v]) return { ...row, [selectedColumn]: mapping[v] };
      const n = parseFloat(v);
      return { ...row, [selectedColumn]: isNaN(n) ? v : n };
    });
    setData(updated);
  };

  const resetChanges = () => {
    setData([...originalData]);
  };

  const saveCSV = () => {
    if (!data.length) return alert("Nothing to save!");
    const csv = Papa.unparse(data);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "output.csv");
  };

  const modifyRegister = (sign) => {
    if (!data.length) return alert("Upload Excel first!");
    if (!selectedColumn) return alert("Please select a column first!");
    if (!data[0][selectedColumn]) return alert(`No '${selectedColumn}' column!`);

    const val = parseInt(delta);
    if (isNaN(val)) return alert("Enter a valid number.");

    const modified = data.map((row) => {
      const reg = parseInt(row[selectedColumn]);
      if (isNaN(reg)) return row;
      return { ...row, [selectedColumn]: (reg + sign * val).toString() };
    });
    setData(modified);
  };

  const exitForUpload = () => {
    setOriginalData([]);
    setDelta("")
    setFileName("");
    setSelectedColumn(""); 
    setData([]);
  };

  // Get available columns for dropdown
  const availableColumns = data.length > 0 ? Object.keys(data[0]) : [];




  return (
    // <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-600 p-4">
    <div className="min-h-screen bg-gradient-to-br from-black to-slate-400 p-4">
      {/* <div className="max-w-7xl mx-auto"> */}
      <div className="max-w- mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Side - Controls */}
          <div className="lg:col-span-1 space-y-6">
            {/* Upload Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload Excel File
                  </label>
                  <div className="flex-1 items-center gap-3">
                    <label
                      className="flex items-center justify-center w-full px-3 py-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-400 transition-colors bg-gray-50"
                      onDragOver={(e) => {
                        e.preventDefault();
                        e.currentTarget.classList.add('border-blue-400', 'bg-blue-50');
                      }}
                      onDragLeave={(e) => {
                        e.preventDefault();
                        e.currentTarget.classList.remove('border-blue-400', 'bg-blue-50');
                      }}
                      onDrop={(e) => {
                        e.preventDefault();
                        e.currentTarget.classList.remove('border-blue-400', 'bg-blue-50');
                        const file = e.dataTransfer.files[0];
                        if (file && (file.name.endsWith('.xlsx') || file.name.endsWith('.xls'))) {
                          const event = { target: { files: [file] } };
                          uploadExcel(event);
                        } else {
                          alert('Please upload a valid Excel file (.xlsx or .xls)');
                        }
                      }}
                    >
                      <div className="flex items-center gap-2">
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        <span className="text-sm text-gray-600">
                          {fileName || "Drag & drop or click"}
                        </span>
                      </div>
                      <input
                        type="file"
                        accept=".xlsx,.xls"
                        onChange={uploadExcel}
                        className="hidden"
                      />
                    </label>
                    {fileName && (
                      <div className="flex items-center gap-2 text-green-600">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span className="text-sm font-medium truncate max-w-xs">{fileName}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Column Selector */}
                {availableColumns.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Column
                    </label>
                    <select
                      value={selectedColumn}
                      onChange={(e) => setSelectedColumn(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                    >
                      {availableColumns.map((column) => (
                        <option key={column} value={column}>
                          {column}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

              </div>
            </div>

            {/* Data Transformation Card */}
            <div className="bg-white rounded-xl shadow-md p-5 border border-gray-200">
              <h3 className="font-semibold text-gray-800 mb-3">Data Transformation</h3>
              <div className="space-y-2">
                <div className="text-xs text-gray-500 mb-2">
                  Selected: <span className="font-medium text-blue-600">{selectedColumn || "None"}</span>
                </div>
                <button
                  onClick={removeRegex}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white px-4 py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                  Give Remove Regex
                </button>
                <button
                  onClick={setScaleFactor}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                  </svg>
                  Convert to Scale Factor
                </button>
              </div>
            </div>

            {/* Numeric Operations Card */}
            <div className="bg-white rounded-xl shadow-md p-5 border border-gray-200">
              <h3 className="font-semibold text-gray-800 mb-3">Numeric Operations</h3>
              <div className="space-y-3">
                <div className="text-xs text-gray-500">
                  Selected: <span className="font-medium text-blue-600">{selectedColumn || "None"}</span>
                </div>
                <input
                  type="number"
                  placeholder="Enter Δ value"
                  value={delta}
                  onChange={(e) => setDelta(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => modifyRegister(+1)}
                    className="flex-1 bg-green-500 hover:bg-green-600 text-white px-4 py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Add
                  </button>
                  <button
                    onClick={() => modifyRegister(-1)}
                    className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                    </svg>
                    Subtract
                  </button>
                </div>
              </div>
            </div>

            {/* File Operations Card */}
            <div className="bg-white rounded-xl shadow-md p-5 border border-gray-200">
              <h3 className="font-semibold text-gray-800 mb-3">File Operations</h3>
              <div className="space-y-2">
                <button
                  onClick={resetChanges}
                  className="w-full bg-gray-500 hover:bg-gray-600 text-white px-4 py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Reset Changes
                </button>
                <button
                  onClick={saveCSV}
                  className="w-full bg-red-500 hover:bg-red-600 text-white px-4 py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Save as CSV
                </button>
                <button
                  onClick={exitForUpload}
                  className="w-full bg-slate-900 hover:bg-slate-900 text-white px-4 py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  {/* <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg> */}
                  Exit (For New File Upload)
                </button>
              </div>
            </div>
          </div>

          {/* Right Side - Data Table */}
          <div className="lg:col-span-3">
            {data.length > 0 && (
              // <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200 h-[calc(100vh-40px)]">
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200 h-[calc(100vh-40px)]">
                <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                  <div className="flex justify-between items-center">
                    <div className="flex gap-1">
                      {/* <h2 className="text-lg font-semibold text-gray-800">Data Preview</h2> */}
                      <p className="text-sm mt-1 text-gray-600">Showing {data.length} rows</p>
                    </div>
                    <div className="text-sm text-blue-600 font-medium">
                      Selected: {selectedColumn}
                    </div>
                  </div>
                </div>
                {/* <div className="overflow-auto max-h-[calc(100vh-200px)]"> */}
                <div className="overflow-auto max-h-[calc(100vh-100px)]">
                  <table className="min-w-full divide-y divide-gray-200 ">
                    <thead className="bg-gray-50 sticky top-0">
                      <tr>
                        {Object.keys(data[0]).map((key) => (
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
                      {data.map((row, i) => (
                        <tr
                          key={i}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          {Object.entries(row).map(([key, val]) => (
                            <td
                              key={key}
                              className={`px-6 py-4 whitespace-nowrap text-sm border-b ${key === selectedColumn
                                  ? 'bg-blue-50 text-blue-900 font-medium'
                                  : 'text-gray-700'
                                }`}
                            >
                              {val}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Empty State */}
            {data.length === 0 && (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 h-96 flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <svg className="w-16 h-16 mx-auto text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p className="mt-4 text-lg font-medium">No data loaded</p>
                  <p className="text-sm">Upload an Excel file to see the data preview</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Upload Card */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-200">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">

            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload Excel File
              </label>
              <div className="flex items-center gap-3">
                <label
                  className="flex items-center justify-center w-full max-w-xs px-3 py-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-400 transition-colors bg-gray-50"
                  onDragOver={(e) => {
                    e.preventDefault();
                    e.currentTarget.classList.add('border-blue-400', 'bg-blue-50');
                  }}
                  onDragLeave={(e) => {
                    e.preventDefault();
                    e.currentTarget.classList.remove('border-blue-400', 'bg-blue-50');
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    e.currentTarget.classList.remove('border-blue-400', 'bg-blue-50');
                    const file = e.dataTransfer.files[0];
                    if (file && (file.name.endsWith('.xlsx') || file.name.endsWith('.xls'))) {
                      const event = { target: { files: [file] } };
                      uploadExcel(event);
                    } else {
                      alert('Please upload a valid Excel file (.xlsx or .xls)');
                    }
                  }}
                >
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <span className="text-sm text-gray-600">
                      {fileName || "Drag & drop or click"}
                    </span>
                  </div>
                  <input
                    type="file"
                    accept=".xlsx,.xls"
                    onChange={uploadExcel}
                    className="hidden"
                  />
                </label>
                {fileName && (
                  <div className="flex items-center gap-2 text-green-600">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm font-medium truncate max-w-xs">{fileName}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Column Selector */}
            {availableColumns.length > 0 && (
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Column
                </label>
                <select
                  value={selectedColumn}
                  onChange={(e) => setSelectedColumn(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {availableColumns.map((column) => (
                    <option key={column} value={column}>
                      {column}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="text-right">
              <div className="text-2xl font-bold text-blue-600">
                {data.length}
              </div>
              <div className="text-sm text-gray-600">
                Rows Loaded
              </div>
            </div>
          </div>
        </div>

        {/* Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Data Transformation Card */}
          <div className="bg-white rounded-xl shadow-md p-5 border border-gray-200">
            <h3 className="font-semibold text-gray-800 mb-3">Data Transformation</h3>
            <div className="space-y-2">
              <div className="text-xs text-gray-500 mb-2">
                Selected: <span className="font-medium text-blue-600">{selectedColumn || "None"}</span>
              </div>
              <button
                onClick={removeRegex}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white px-4 py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
                Give Remove Regex
              </button>
              <button
                onClick={setScaleFactor}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                </svg>
                Convert to Scale Factor
              </button>
            </div>
          </div>

          {/* Register Operations Card */}
          <div className="bg-white rounded-xl shadow-md p-5 border border-gray-200">
            <h3 className="font-semibold text-gray-800 mb-3">Numeric Operations</h3>
            <div className="space-y-3">
              <div className="text-xs text-gray-500">
                Selected: <span className="font-medium text-blue-600">{selectedColumn || "None"}</span>
              </div>
              <input
                type="number"
                placeholder="Enter Δ value"
                value={delta}
                onChange={(e) => setDelta(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <div className="flex gap-2">
                <button
                  onClick={() => modifyRegister(+1)}
                  className="flex-1 bg-green-500 hover:bg-green-600 text-white px-4 py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Add
                </button>
                <button
                  onClick={() => modifyRegister(-1)}
                  className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                  </svg>
                  Subtract
                </button>
              </div>
            </div>
          </div>

          {/* File Operations Card */}
          <div className="bg-white rounded-xl shadow-md p-5 border border-gray-200">
            <h3 className="font-semibold text-gray-800 mb-3">File Operations</h3>
            <div className="space-y-2">
              <button
                onClick={resetChanges}
                className="w-full bg-gray-500 hover:bg-gray-600 text-white px-4 py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Reset Changes
              </button>
              <button
                onClick={saveCSV}
                className="w-full bg-red-500 hover:bg-red-600 text-white px-4 py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Save as CSV
              </button>
            </div>
          </div>
        </div>

        {/* Data Table */}
        {data.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-lg font-semibold text-gray-800">Data Preview</h2>
                  <p className="text-sm text-gray-600">Showing {data.length} rows</p>
                </div>
                <div className="text-sm text-blue-600 font-medium">
                  Selected: {selectedColumn}
                </div>
              </div>
            </div>
            <div className="overflow-auto max-h-96">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    {Object.keys(data[0]).map((key) => (
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
                  {data.map((row, i) => (
                    <tr
                      key={i}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      {Object.entries(row).map(([key, val]) => (
                        <td
                          key={key}
                          className={`px-6 py-4 whitespace-nowrap text-sm border-b ${key === selectedColumn
                              ? 'bg-blue-50 text-blue-900 font-medium'
                              : 'text-gray-700'
                            }`}
                        >
                          {val}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}