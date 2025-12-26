import React, { useState, useCallback, useMemo } from "react";
import FileUploader from "./components/FileUploader";
import NumericPanel from "./components/NumericPanel";
import FileOperations from "./components/FileOperations";
import DataTable from "./components/DataTable";
import TransformationPanel from "./components/TransformationPanel";
import JsonShow from "./components/JsonShow";

export default function App() {
  const [data, setData] = useState([]);
  const [originalData, setOriginalData] = useState([]);
  const [undoStack, setUndoStack] = useState([]); // array of data snapshots
  const [redoStack, setRedoStack] = useState([]);
  const [selectedColumn, setSelectedColumn] = useState("");
  const [fileName, setFileName] = useState("");
  const [mode, setMode] = useState(false)

  // Helpers to push snapshot to undo stack
  const pushUndoSnapshot = useCallback((snapshot) => {
    setUndoStack((prev) => [...prev, snapshot]);
    // clear redo on new action
    setRedoStack([]);
  }, []);

  // Called by FileUploader after file is parsed
  const handleFileLoad = useCallback((parsedJson, name) => {
    setFileName(name || "");
    setData(parsedJson);
    setOriginalData(parsedJson);
    setUndoStack([]);
    setRedoStack([]);
    if (parsedJson.length > 0 && Object.keys(parsedJson[0]).length > 0) {
      setSelectedColumn(Object.keys(parsedJson[0])[0]);
    }
  }, []);

  // Generic action performer that records undo snapshot
  const performAction = useCallback((updater) => {
    setData((prev) => {
      const prevSnapshot = prev;
      const next = updater(prev);
      // push previous snapshot
      pushUndoSnapshot(prevSnapshot);
      return next;
    });
  }, [pushUndoSnapshot]);

  const resetChanges = useCallback(() => {
    setData([...originalData]);
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

  // derived: available columns
  const availableColumns = useMemo(() => (data.length > 0 ? Object.keys(data[0]) : []), [data]);


  return (
    <div className="min-h-screen bg-gradient-to-br from-black to-slate-400 p-4">
      {/* <div className="max-w-7xl mx-auto"> */}
      <div className="max-w-screen mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1 space-y-5">
            {/* Toggle Button*/}
            <div className="flex flex-col items-end">
              <div className="flex items-center space-x-4">
                <span className={`font-medium ${!mode ? 'text-cyan-400' : 'text-gray-400'}`}>Table View</span>

                <button
                  onClick={() => setMode(!mode)}
                  className={`relative inline-flex h-6 w-10 items-center rounded-full bg-gray-800 border border-gray-700 
                  transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 ${mode?  'focus:ring-purple-500 shadow-lg' :'focus:ring-cyan-500 shadow-lg'}`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-gradient-to-r  transition-transform duration-300 ${mode ? 'translate-x-5 from-purple-500 to-gray-400' : 'translate-x-1 from-cyan-500 to-teal-400'
                      }`}
                  />
                </button>

                <span className={`font-medium ${mode ? 'text-purple-400' : 'text-gray-400'}`}>JSON View</span>
              </div>


            </div>

            <FileUploader onFileLoad={handleFileLoad} fileName={fileName} />

            <TransformationPanel
              data={data}
              selectedColumn={selectedColumn}
              setSelectedColumn={setSelectedColumn}
              performAction={performAction}
            />

            <NumericPanel
              data={data}
              selectedColumn={selectedColumn}
              performAction={performAction}
            />

            <FileOperations
              resetChanges={resetChanges}
              undoLastAction={undoLastAction}
              redoLastAction={redoLastAction}
              saveData={setData}
              data={data}
            />
          </div>

          <div className="lg:col-span-3">



            {mode ?
              <JsonShow
                data={data}
                selectedColumn={selectedColumn}
                setSelectedColumn={setSelectedColumn}
              />
              :
              <DataTable
                data={data}
                selectedColumn={selectedColumn}
                setSelectedColumn={setSelectedColumn}
              />
            }
          </div>
        </div>
      </div>
    </div>
  );
}

