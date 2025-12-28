import React, { useState, useCallback } from "react";
import Tooltip from "./Tooltip";
import { useToast } from "./ToastContext";

export default React.memo(function NumericPanel({ data, selectedColumn, performAction }) {
    const [deltaLocal, setDeltaLocal] = useState("");
    const isTagsColumn = selectedColumn === "Tags";
    const { addToast } = useToast();

    const modifyRegister = useCallback((sign) => {
        if (selectedColumn === "Tags") return addToast("Modification disabled for 'Tags' column", "warning");
        if (!data.length) return addToast("Upload Excel first!", "error");
        if (!selectedColumn) return addToast("Select a column to modify", "error");

        const val = parseInt(deltaLocal, 10);
        if (isNaN(val)) return addToast("Please enter a valid number", "error");

        performAction((prev) =>
            prev.map((row) => {
                const reg = parseInt(row[selectedColumn], 10);
                if (isNaN(reg)) return row;
                return { ...row, [selectedColumn]: (reg + sign * val).toString() };
            })
        );
        addToast(`Success: ${sign > 0 ? 'Added' : 'Subtracted'} ${val} from ${selectedColumn}`, "success");
    }, [data, selectedColumn, deltaLocal, performAction, addToast]);

    return (
        <div className="bg-slate-50 rounded-lg border border-slate-200 p-3">
            <h3 className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">Math Ops</h3>

            {isTagsColumn ? (
                <Tooltip content="This column is protected to prevent accidental changes to Tag definitions.">
                    <div className="text-[10px] bg-red-50 text-red-600 px-2 py-1 rounded border border-red-100 mb-2 cursor-not-allowed text-center">
                        Disabled for 'Tags'
                    </div>
                </Tooltip>
            ) : (
                <Tooltip content="Enter the value to add or subtract from all numbers in the selected column.">
                    <input
                        type="number"
                        value={deltaLocal}
                        onChange={(e) => setDeltaLocal(e.target.value)}
                        placeholder="Δ Value"
                        className="w-full text-xs border border-slate-300 rounded px-2 py-1.5 mb-2 focus:ring-1 focus:ring-blue-500 outline-none"
                    />
                </Tooltip>
            )}

            <div className="grid grid-cols-2 gap-2">
                <Tooltip content="Add the entered value to every number in this column.">
                    <button
                        onClick={() => modifyRegister(+1)}
                        disabled={isTagsColumn || !deltaLocal}
                        className="bg-emerald-500 hover:bg-emerald-600 text-white px-2 py-1.5 rounded text-xs font-medium transition-colors disabled:opacity-50 w-full"
                    >
                        + Add
                    </button>
                </Tooltip>

                <Tooltip content="Subtract the entered value from every number in this column.">
                    <button
                        onClick={() => modifyRegister(-1)}
                        disabled={isTagsColumn || !deltaLocal}
                        className="bg-amber-500 hover:bg-amber-600 text-white px-2 py-1.5 rounded text-xs font-medium transition-colors disabled:opacity-50 w-full"
                    >
                        - Sub
                    </button>
                </Tooltip>
            </div>
        </div>
    );
});
