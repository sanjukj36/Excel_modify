import React, { useState, useCallback } from "react";
import { Menu, X } from "lucide-react";
import FileUploader from "./components/FileUploader";
import NumericPanel from "./components/NumericPanel";
import FileOperations from "./components/FileOperations";
import DataTable from "./components/DataTable";
import TransformationPanel from "./components/TransformationPanel";
import JsonShow from "./components/JsonShow";
import { ToastProvider } from "./components/ToastContext";

const VIEW_MODES = {
    TABLE: "table",
    MODIFIED: "modified",
    PLC: "plc",
    PUBLISHER: "publisher",
};

export default function App() {
    const [data, setData] = useState([]);
    const [modifiedData, setModifiedData] = useState([]); // Store rows changed by operations
    const [originalData, setOriginalData] = useState([]);
    const [undoStack, setUndoStack] = useState([]);
    const [redoStack, setRedoStack] = useState([]);
    const [selectedColumn, setSelectedColumn] = useState("");
    const [fileName, setFileName] = useState("");
    const [viewMode, setViewMode] = useState(VIEW_MODES.TABLE);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const pushUndoSnapshot = useCallback((snapshot) => {
        setUndoStack((prev) => [...prev, snapshot]);
        setRedoStack([]);
    }, []);

    const handleFileLoad = useCallback((parsedJson, name) => {
        setFileName(name || "");
        setData(parsedJson);
        setModifiedData([]); // Reset modified data on new file load
        setOriginalData(parsedJson);
        setUndoStack([]);
        setRedoStack([]);
        if (parsedJson.length > 0 && Object.keys(parsedJson[0]).length > 0) {
            setSelectedColumn(Object.keys(parsedJson[0])[0]);
        }
    }, []);

    const performAction = useCallback((updater, sideEffectData = null) => {
        setData((prev) => {
            const prevSnapshot = prev;
            const next = updater(prev);
            pushUndoSnapshot(prevSnapshot);
            return next;
        });
        if (sideEffectData) {
            setModifiedData(sideEffectData);
            setViewMode(VIEW_MODES.MODIFIED); // Auto-switch to see changes, optional but helpful
        }
    }, [pushUndoSnapshot]);

    const resetChanges = useCallback(() => {
        setData([...originalData]);
        setModifiedData([]);
        setUndoStack([]);
        setRedoStack([]);
    }, [originalData]);

    const undoLastAction = useCallback(() => {
        setUndoStack((prevUndo) => {
            if (prevUndo.length === 0) return prevUndo;
            const newUndo = prevUndo.slice(0, -1);
            const lastSnapshot = prevUndo[prevUndo.length - 1];
            setRedoStack((prev) => [...prev, data]);
            setData(lastSnapshot);
            return newUndo;
        });
    }, [data]);

    const redoLastAction = useCallback(() => {
        setRedoStack((prevRedo) => {
            if (prevRedo.length === 0) return prevRedo;
            const newRedo = prevRedo.slice(0, -1);
            const last = prevRedo[prevRedo.length - 1];
            setUndoStack((prev) => [...prev, data]);
            setData(last);
            return newRedo;
        });
    }, [data]);

    return (
        <ToastProvider>
            <div className="flex h-screen w-full bg-slate-50 overflow-hidden text-slate-900 font-inter relative">

                {/* Mobile Overlay */}
                {isSidebarOpen && (
                    <div
                        className="fixed inset-0 bg-black/50 z-20 md:hidden backdrop-blur-sm transition-opacity"
                        onClick={() => setIsSidebarOpen(false)}
                    />
                )}

                {/* LEFT SIDEBAR - Responsive Drawer */}
                <div className={`
                    fixed inset-y-0 left-0 z-30 w-80 bg-white flex flex-col h-full border-r border-slate-200 shadow-2xl transition-transform duration-300 ease-in-out
                    md:relative md:translate-x-0 md:shadow-[4px_0_24px_-12px_rgba(0,0,0,0.1)]
                    ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
                `}>

                    {/* Mobile Close Button */}
                    <div className="md:hidden flex justify-end p-2 border-b border-slate-100">
                        <button
                            onClick={() => setIsSidebarOpen(false)}
                            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Sidebar Content - Scrollable */}
                    <div className="flex-1 overflow-y-auto p-2 space-y-2 custom-scrollbar">
                        <FileUploader onFileLoad={handleFileLoad} fileName={fileName} />

                        <div className="h-px bg-slate-100 mx-2 my-1"></div>

                        <TransformationPanel
                            data={data}
                            selectedColumn={selectedColumn}
                            setSelectedColumn={setSelectedColumn}
                            performAction={performAction}
                            isTableMode={viewMode === VIEW_MODES.TABLE}
                        />

                        <NumericPanel
                            data={data}
                            selectedColumn={selectedColumn}
                            performAction={performAction}
                            isTableMode={viewMode === VIEW_MODES.TABLE}
                        />

                        <div className="h-px bg-slate-100 mx-2 my-1"></div>

                        <FileOperations
                            resetChanges={resetChanges}
                            undoLastAction={undoLastAction}
                            redoLastAction={redoLastAction}
                            saveData={setData}
                            data={data}
                            isTableMode={viewMode === VIEW_MODES.TABLE}
                        />

                        {/* Bottom padding for safe scrolling */}
                        <div className="h-8"></div>
                    </div>
                </div>

                {/* RIGHT MAIN CONTENT - Flex grow, handles its own views */}
                <div className="flex-1 flex flex-col h-full overflow-hidden bg-slate-50/50 w-full">

                    {/* Top Navigation Bar */}
                    <div className="h-16 flex-shrink-0 border-b border-slate-200 bg-white px-4 md:px-6 flex items-center justify-between md:justify-end shadow-sm z-10 gap-4">

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setIsSidebarOpen(true)}
                            className="md:hidden p-2 -ml-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg"
                        >
                            <Menu className="w-6 h-6" />
                        </button>

                        <div className="bg-slate-100 p-1 rounded-lg flex overflow-x-auto no-scrollbar max-w-full">
                            {Object.values(VIEW_MODES).map((mode) => {
                                if (mode === "modified" && modifiedData.length === 0) return null;
                                return (
                                    <button
                                        key={mode}
                                        onClick={() => setViewMode(mode)}
                                        className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all whitespace-nowrap
                                        ${viewMode === mode
                                                ? "bg-white text-blue-600 shadow-sm"
                                                : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"
                                            }`}
                                    >
                                        {mode === "table" && "Table"}
                                        {mode === "modified" && modifiedData.length > 0 && "Modified Items"}
                                        {mode === "plc" && "PLC JSON"}
                                        {mode === "publisher" && "Publisher JSON"}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Viewport content */}
                    <div className="flex-1 overflow-hidden p-2 md:p-4 relative">
                        {viewMode === VIEW_MODES.TABLE && (
                            <DataTable
                                data={data}
                                selectedColumn={selectedColumn}
                                setSelectedColumn={setSelectedColumn}
                                setData={setData}
                                performAction={performAction}
                            />
                        )}

                        {viewMode === VIEW_MODES.PUBLISHER && (
                            <JsonShow
                                data={data}
                                selectedColumn={selectedColumn}
                                setSelectedColumn={setSelectedColumn}
                                type="publisher"
                            />
                        )}

                        {viewMode === VIEW_MODES.PLC && (
                            <JsonShow
                                data={data}
                                selectedColumn={selectedColumn}
                                setSelectedColumn={setSelectedColumn}
                                type="plc"
                            />
                        )}
                        {viewMode === VIEW_MODES.MODIFIED && (
                            <div className="flex flex-col h-full">
                                <div className="mb-2 px-1 text-xs text-slate-500 font-medium">
                                    {(() => {
                                        const originalCount = modifiedData.filter(r => r.__isOriginalDuplicate).length;
                                        const modifiedCount = modifiedData.length - originalCount;
                                        return `Showing ${modifiedData.length} items (${modifiedCount} modified, ${originalCount} original source)`;
                                    })()}
                                </div>
                                <DataTable
                                    data={modifiedData}
                                    selectedColumn={selectedColumn}
                                    setSelectedColumn={setSelectedColumn}
                                    enableSelection={false}
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </ToastProvider>
    );
}
