import React, { useCallback } from "react";
import Papa from "papaparse";
import { saveAs } from "file-saver";
import Tooltip from "./Tooltip";
import { useToast } from "./ToastContext";

export default React.memo(function FileOperations({ resetChanges, undoLastAction, redoLastAction, data }) {
    const { addToast } = useToast();

    const handleSave = useCallback(() => {
        if (!data.length) return addToast("Nothing to save!", "error");
        try {
            const csv = Papa.unparse(data);
            const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
            saveAs(blob, "output.csv");
            addToast("File downloaded successfully", "success");
        } catch (e) {
            addToast("Error saving file", "error");
        }
    }, [data, addToast]);

    const handleUndo = useCallback(() => {
        undoLastAction();
        addToast("Undid last action", "info");
    }, [undoLastAction, addToast]);

    const handleRedo = useCallback(() => {
        redoLastAction();
        addToast("Redid last action", "info");
    }, [redoLastAction, addToast]);

    const handleReset = useCallback(() => {
        if (window.confirm("Are you sure you want to reset all changes?")) {
            resetChanges();
            addToast("Variables reset to original state", "warning");
        }
    }, [resetChanges, addToast]);

    return (
        <div className="space-y-2">
            <div className="grid grid-cols-2 gap-2">
                <Tooltip content="Revert the last change you made to the data.">
                    <button onClick={handleUndo} className="w-full bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 px-2 py-1.5 rounded text-xs font-medium shadow-sm transition-colors flex justify-center items-center gap-1">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h10a8 8 0 018 8v2M3 10l6-6m-6 6l6 6" /></svg>
                        Undo
                    </button>
                </Tooltip>

                <Tooltip content="Reapply a change that was previously undone.">
                    <button onClick={handleRedo} className="w-full bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 px-2 py-1.5 rounded text-xs font-medium shadow-sm transition-colors flex justify-center items-center gap-1">
                        Redo
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 10h-10a8 8 0 00-8 8v2M21 10l-6-6m6 6l-6 6" /></svg>
                    </button>
                </Tooltip>
            </div>

            <Tooltip content="Export the current table data as a CSV file.">
                <button onClick={handleSave} disabled={!data.length} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-2 rounded-lg text-sm font-semibold shadow-sm transition-colors flex justify-center items-center gap-2 disabled:opacity-50 disabled:grayscale">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                    Download CSV
                </button>
            </Tooltip>

            <Tooltip content={
                <div className="text-red-300">
                    <p className="font-bold text-red-200">Warning</p>
                    Reverts all data back to the original uploaded file state.
                </div>
            }>
                <button onClick={handleReset} disabled={!data.length} className="w-full text-red-500 hover:bg-red-50 px-2 py-1.5 rounded text-xs font-medium transition-colors">
                    Reset All
                </button>
            </Tooltip>
        </div>
    );
});
