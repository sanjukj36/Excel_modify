import React, { useCallback } from "react";
import Tooltip from "./Tooltip";
import { useToast } from "./ToastContext";

export default React.memo(function TransformationPanel({ data, selectedColumn, setSelectedColumn, performAction, isTableMode }) {
    const { addToast } = useToast();

    const removeRegex = useCallback(() => {
        if (!isTableMode) return addToast("Switch to 'Table' view to edit data", "warning");
        if (!data.length) return addToast("Upload Excel first!", "error");
        if (!selectedColumn) return addToast("Please select a column!", "error");

        performAction((prev) => {
            return prev.map((row) => ({
                ...row,
                [selectedColumn]: String(row[selectedColumn] || "")
                    .replace(/[()]/g, "")
                    .replace(/[^\p{L}\p{N}]+/gu, "_")
                    .replace(/_+/g, "_")
                    .replace(/^_+|_+$/g, ""),
            }));
        });
        addToast("Cleaned text formatting in " + selectedColumn, "success");
    }, [data, selectedColumn, performAction, addToast, isTableMode]);

    const setScaleFactor = useCallback(() => {
        if (!isTableMode) return addToast("Switch to 'Table' view to edit data", "warning");
        if (!data.length) return addToast("Upload Excel first!", "error");
        if (!selectedColumn) return addToast("Please select a column!", "error");
        if (selectedColumn === "Tags") return addToast("Modification disabled for 'Tags' column", "warning");

        const mapping = { "1": 1, "10": 0.1, "100": 0.01, "1000": 0.001 };
        let changed = 0;

        performAction((prev) => {
            const newData = prev.map((row) => {
                let v = String(row[selectedColumn] || "").trim();
                if (mapping[v]) { changed++; return { ...row, [selectedColumn]: mapping[v] }; }
                const n = parseFloat(v);
                return { ...row, [selectedColumn]: isNaN(n) ? v : n };
            });
            return newData;
        });
        addToast(`Scaled values in ${selectedColumn}`, "success");
    }, [data, selectedColumn, performAction, addToast, isTableMode]);

    const setRemoveDuplication = useCallback(() => {
        if (!isTableMode) return addToast("Switch to 'Table' view to edit data", "warning");
        if (!data.length) return addToast("Upload Excel first!", "error");
        if (!selectedColumn) return addToast("Please select a column!", "error");
        if (selectedColumn === "Scale Factors") return addToast("Modification disabled for 'Scale Factors' column", "warning");

        // Calculate potential changes first
        const counter = {};
        const firstOccurrences = {}; // Map value -> original row
        const processedOriginals = new Set(); // Track which originals have been added to modified list
        const modifiedRowsLocal = [];

        const newData = data.map((row) => {
            let value = String(row[selectedColumn] || "").trim();
            if (!value) return row;

            if (counter[value] === undefined) {
                counter[value] = 0;
                firstOccurrences[value] = row; // Store reference to original row
                return { ...row, [selectedColumn]: value };
            }

            // Found a duplicate
            counter[value] += 1;

            // If this is the first time we're seeing a duplicate for this value,
            // add the original row to the modified list first
            if (!processedOriginals.has(value)) {
                modifiedRowsLocal.push({
                    ...firstOccurrences[value],
                    __isOriginalDuplicate: true // Flag for red styling
                });
                processedOriginals.add(value);
            }

            // Create the new duplicate row
            const newRow = { ...row, [selectedColumn]: `${value}_${counter[value]}` };
            modifiedRowsLocal.push(newRow);
            return newRow;
        });

        if (modifiedRowsLocal.length === 0) {
            return addToast("No duplicates found", "info");
        }

        // Apply changes if duplicates exist
        performAction(() => newData, modifiedRowsLocal);
        addToast("Removed duplicates in " + selectedColumn, "success");
    }, [data, selectedColumn, performAction, addToast, isTableMode]);

    const isScaleFactors = selectedColumn === "Scale Factors";
    const isAddress = selectedColumn === "Address";
    const isTags = selectedColumn === "Tags";

    return (
        <div className={`bg-slate-50 rounded-lg border border-slate-200 p-3 ${!isTableMode ? 'opacity-60 pointer-events-none' : ''}`}>
            <div className="mb-2">
                <h3 className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Transform</h3>
                <p className="text-[10px] text-slate-400 truncate mt-0.5">
                    Col: <span className="font-medium text-blue-600">{selectedColumn || "-"}</span>
                </p>
            </div>

            <div className="space-y-2">
                {/* Clean Format - Disabled for Scale Factors & Address */}
                {isScaleFactors || isAddress ? (
                    <Tooltip content={`Disabled for '${selectedColumn}' column.`}>
                        <button disabled className="w-full bg-slate-100 border border-slate-200 text-slate-400 px-3 py-1.5 rounded text-xs font-medium shadow-none cursor-not-allowed text-left flex items-center justify-between">
                            <span>Clean Format</span>
                            <span className="text-[10px] opacity-50">Disabled</span>
                        </button>
                    </Tooltip>
                ) : (
                    <Tooltip content={!isTableMode ? "Switch to Table view to use this tool." :
                        <div>
                            <p className="font-semibold text-emerald-400 mb-1">Clean Text Formatting</p>
                            <ul className="list-disc pl-3 text-slate-300 space-y-0.5">
                                <li>Removes parentheses ( )</li>
                                <li>Special chars → underscores</li>
                                <li>Trims extra underscores</li>
                            </ul>
                            <p className="mt-1 text-xs opacity-70 italic">Example: "Test (123)!" → "Test_123"</p>
                        </div>
                    }>
                        <button onClick={removeRegex} disabled={!isTableMode} className="w-full bg-white border border-slate-200 hover:border-orange-300 hover:text-orange-600 text-slate-600 px-3 py-1.5 rounded text-xs font-medium shadow-sm transition-all text-left flex items-center justify-between">
                            <span>Clean Format</span>
                            <span className="text-[10px] opacity-50">Regex</span>
                        </button>
                    </Tooltip>
                )}

                {/* Scale Values - Disabled for Tags & Address */}
                {isTags || isAddress ? (
                    <Tooltip content={`Disabled for '${selectedColumn}' column.`}>
                        <button disabled className="w-full bg-slate-100 border border-slate-200 text-slate-400 px-3 py-1.5 rounded text-xs font-medium shadow-none cursor-not-allowed text-left flex items-center justify-between">
                            <span>Scale Values</span>
                            <span className="text-[10px] opacity-50">Disabled</span>
                        </button>
                    </Tooltip>
                ) : (
                    <Tooltip content={!isTableMode ? "Switch to Table view to use this tool." :
                        <div>
                            <p className="font-semibold text-blue-400 mb-1">Scale Factor Conversion</p>
                            <p className="mb-1">Converts specific string keys to numbers:</p>
                            <div className="grid grid-cols-2 gap-x-2 gap-y-0.5 text-xs font-mono text-slate-300">
                                <span>"1" → 1</span>
                                <span>"10" → 0.1</span>
                                <span>"100" → 0.01</span>
                                <span>"1000" → 0.001</span>
                            </div>
                        </div>
                    }>
                        <button onClick={setScaleFactor} disabled={!isTableMode} className="w-full bg-white border border-slate-200 hover:border-blue-300 hover:text-blue-600 text-slate-600 px-3 py-1.5 rounded text-xs font-medium shadow-sm transition-all text-left flex items-center justify-between">
                            <span>Scale Values</span>
                            <span className="text-[10px] opacity-50">1→1</span>
                        </button>
                    </Tooltip>
                )}

                {/* Dedup - Disabled for Scale Factors */}
                {isScaleFactors ? (
                    <Tooltip content={`Disabled for '${selectedColumn}' column.`}>
                        <button disabled className="w-full bg-slate-100 border border-slate-200 text-slate-400 px-3 py-1.5 rounded text-xs font-medium shadow-none cursor-not-allowed text-left flex items-center justify-between">
                            <span>Dedup</span>
                            <span className="text-[10px] opacity-50">Disabled</span>
                        </button>
                    </Tooltip>
                ) : (
                    <Tooltip content={!isTableMode ? "Switch to Table view to use this tool." :
                        <div>
                            <p className="font-semibold text-purple-400 mb-1">Remove Duplicates</p>
                            <p>Appends a suffix to duplicate values to make them unique.</p>
                            <div className="mt-1 text-slate-300 bg-slate-700/50 p-1 rounded">
                                Apple → Apple<br />
                                Apple → Apple_1<br />
                                Apple → Apple_2
                            </div>
                        </div>
                    }>
                        <button onClick={setRemoveDuplication} disabled={!isTableMode} className="w-full bg-white border border-slate-200 hover:border-purple-300 hover:text-purple-600 text-slate-600 px-3 py-1.5 rounded text-xs font-medium shadow-sm transition-all text-left flex items-center justify-between">
                            <span>Dedup</span>
                            <span className="text-[10px] opacity-50">_1,_2</span>
                        </button>
                    </Tooltip>
                )}
            </div>
        </div>
    );
});
