import React, { useCallback } from "react";
import * as XLSX from "xlsx";

export default function FileUploader({ onFileLoad, fileName }) {
  const uploadExcel = useCallback(async (e) => {
    const file = e.target.files ? e.target.files[0] : e;
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      const data = evt.target.result;
      const wb = XLSX.read(data, { type: "binary" });
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      const json = XLSX.utils.sheet_to_json(ws, { defval: "", raw: false });

      // For large files we update UI in batches
      let batchSize = 1000;
      let chunked = [];
      (async () => {
        for (let i = 0; i < json.length; i += batchSize) {
          const chunk = json.slice(i, i + batchSize);
          chunked = [...chunked, ...chunk];
          // send partial only at the end to keep parent state stable
          // but you can also call onFileLoad each chunk if you want progressive preview
          await new Promise((r) => setTimeout(r, 0));
        }
        onFileLoad(chunked, file.name);
      })();
    };
    reader.readAsBinaryString(file);
  }, [onFileLoad]);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && (file.name.endsWith(".xlsx") || file.name.endsWith(".xls"))) {
      uploadExcel({ target: { files: [file] } });
    } else {
      alert("Please upload a valid Excel file (.xlsx or .xls)");
    }
  }, [uploadExcel]);

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
      <label className="block text-sm font-medium text-gray-700 mb-2">Upload Excel File</label>
      <label
        className="flex items-center justify-center w-full px-3 py-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-400 transition-colors bg-gray-50"
        onDragOver={(e) => { e.preventDefault(); e.currentTarget.classList.add('border-blue-400', 'bg-blue-50'); }}
        onDragLeave={(e) => { e.preventDefault(); e.currentTarget.classList.remove('border-blue-400', 'bg-blue-50'); }}
        onDrop={handleDrop}
      >
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          <span className="text-sm text-gray-600">{fileName || "Drag & drop or click"}</span>
        </div>
        <input type="file" accept=".xlsx,.xls" onChange={uploadExcel} className="hidden" />
      </label>
      {fileName && (
        <div className="flex items-center gap-2 text-green-600 mt-3">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span className="text-sm font-medium truncate max-w-xs">{fileName}</span>
        </div>
      )}
    </div>
  );
}
