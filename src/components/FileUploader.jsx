import React, { useCallback, useState } from "react";
import * as XLSX from "xlsx";

export default function FileUploader({ onFileLoad, fileName }) {
    const [isDragging, setIsDragging] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const uploadExcel = useCallback(async (e) => {
        const file = e.target.files ? e.target.files[0] : e;
        if (!file) return;

        setIsLoading(true);
        setTimeout(() => {
            const reader = new FileReader();
            reader.onload = (evt) => {
                const data = evt.target.result;
                const wb = XLSX.read(data, { type: "binary" });
                const wsname = wb.SheetNames[0];
                const ws = wb.Sheets[wsname];
                const json = XLSX.utils.sheet_to_json(ws, { defval: "", raw: false });

                let batchSize = 1000;
                let chunked = [];
                (async () => {
                    for (let i = 0; i < json.length; i += batchSize) {
                        const chunk = json.slice(i, i + batchSize);
                        chunked = [...chunked, ...chunk];
                        await new Promise((r) => setTimeout(r, 0));
                    }
                    onFileLoad(chunked, file.name);
                    setIsLoading(false);
                })();
            };
            reader.readAsBinaryString(file);
        }, 50);
    }, [onFileLoad]);

    const handleDrop = useCallback((e) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        if (file && (file.name.endsWith(".xlsx") || file.name.endsWith(".xls"))) {
            uploadExcel({ target: { files: [file] } });
        } else {
            alert("Please upload a valid Excel file");
        }
    }, [uploadExcel]);

    return (
        <div className="bg-white rounded-lg border border-slate-200 p-3">
            <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Source</h3>
                {fileName && <span className="text-[10px] bg-emerald-50 text-emerald-600 px-1.5 py-0.5 rounded border border-emerald-100">Loaded</span>}
            </div>

            <label
                className={`relative flex flex-col items-center justify-center w-full py-4 px-2
                   border border-dashed rounded-lg cursor-pointer transition-all duration-200
                   ${isDragging ? 'border-blue-500 bg-blue-50/50' : 'border-slate-300 hover:border-blue-400 hover:bg-slate-50'}`}
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={(e) => { e.preventDefault(); setIsDragging(false); }}
                onDrop={handleDrop}
            >
                <div className="flex flex-col items-center gap-1 text-center">
                    {isLoading ? (
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                    ) : fileName ? (
                        <>
                            <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <p className="text-xs font-medium text-slate-700 truncate max-w-[180px]">{fileName}</p>
                        </>
                    ) : (
                        <>
                            <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                            </svg>
                            <p className="text-[10px] text-slate-500">Drag excel here</p>
                        </>
                    )}
                </div>
                <input type="file" accept=".xlsx,.xls" onChange={uploadExcel} disabled={isLoading} className="hidden" />
            </label>
        </div>
    );
}
