
import React, { useMemo, useState } from "react";

export default React.memo(function JsonShow({ data }) {
  const [copied, setCopied] = useState(false);

  // ✅ Transform input data
  const transformedData = useMemo(() => {
    if (!Array.isArray(data)) return {};

    return data.reduce((acc, item) => {
      if (!item?.Tags) return acc;

      acc[item.Tags] = {
        starting_reg: Number(item.Address),
        type: "int16",
        scale_factor: Number(item["Scale Factors"])
      };

      return acc;
    }, {});
  }, [data]);

  const formattedJson = useMemo(() => {
    try {
      return JSON.stringify(transformedData, null, 2);
    } catch {
      return "Invalid JSON data";
    }
  }, [transformedData]);

  // ✅ Copy JSON
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(formattedJson);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const textArea = document.createElement("textarea");
      textArea.value = formattedJson;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // ✅ Export JSON with user-defined filename
  const handleExport = () => {
    let fileName = prompt("Enter file name", "tags_config.json");
    if (!fileName) return;

    if (!fileName.endsWith(".json")) {
      fileName += ".json";
    }

    const blob = new Blob([formattedJson], {
      type: "application/json;charset=utf-8;"
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const rowCount = Object.keys(transformedData).length;

  return (
    <div className="flex flex-col h-[calc(100vh-40px)] bg-white rounded-2xl shadow-lg border border-gray-200">
      {/* Header */}
      <div className="px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700">JSON Viewer</span>
          <span className="text-xs px-2 py-1 bg-gray-200 text-gray-600 rounded-full">
            {rowCount} tags
          </span>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleCopy}
            className={`px-4 py-2 text-sm rounded-lg border transition ${
              copied
                ? "bg-green-100 text-green-700 border-green-200"
                : "bg-blue-50 text-blue-600 hover:bg-blue-100 border-blue-200"
            }`}
          >
            {copied ? "Copied!" : "Copy JSON"}
          </button>

          {/* ✅ Export Button */}
          <button
            onClick={handleExport}
            className="px-4 py-2 text-sm rounded-lg border bg-purple-50 text-purple-700 hover:bg-purple-100 border-purple-200"
          >
            Export JSON
          </button>
        </div>
      </div>

      {/* JSON Content */}
      <div className="flex-1 overflow-auto bg-gray-50 p-6 px-6">
        <pre className="text-sm font-mono px-4 rounded-lg  h-full">
          <code>{formattedJson}</code>
        </pre>
      </div>

      {/* Footer */}
      <div className="px-6 py-3  text-xs text-gray-500 flex justify-between">
        <span>JSON Size: {new Blob([formattedJson]).size} bytes</span>
        <span>.json export supported</span>
      </div>
    </div>
  );
});
