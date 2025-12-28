import React, { useMemo, useState } from "react";

export default React.memo(function JsonShow({ data, type }) {
    const [copied, setCopied] = useState(false);

    const transformedData = useMemo(() => {
        if (!Array.isArray(data)) return type === "plc" ? {} : [];
        return data.reduce((acc, item) => {
            if (!item?.Tags) return acc;
            if (type === "plc") {
                acc[item.Tags] = { starting_reg: Number(item.Address), type: "int16", scale_factor: Number(item["Scale Factors"]) };
            } else {
                acc.push(`LAST('${item.Tags}') AS '${item.Tags}'`);
            }
            return acc;
        }, type === "plc" ? {} : []);
    }, [data, type]);

    const formattedJson = useMemo(() => {
        try {
            if (type === 'plc') {
                const entries = Object.entries(transformedData).map(([key, value]) => `  "${key}": ${JSON.stringify(value)}`);
                return `{\n${entries.join(",\n")}\n}`;
            }
            return JSON.stringify(transformedData, null, 2);
        } catch { return "Invalid Data"; }
    }, [transformedData, type]);

    const handleCopy = async () => {
        try { await navigator.clipboard.writeText(formattedJson); setCopied(true); setTimeout(() => setCopied(false), 2000); } catch { }
    };

    const handleExport = () => {
        let fileName = prompt("Filename:", "data.json");
        if (!fileName) return;
        if (!fileName.endsWith(".json")) fileName += ".json";
        const blob = new Blob([formattedJson], { type: "application/json;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url; link.download = fileName;
        document.body.appendChild(link); link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="h-full bg-slate-900 shadow-sm border border-slate-700 rounded-lg flex flex-col overflow-hidden">
            <div className="bg-slate-800 border-b border-slate-700 px-4 py-2 flex justify-between items-center text-xs text-slate-400">
                <span className="uppercase font-bold tracking-wider text-slate-500">{type} JSON</span>
                <div className="flex gap-2">
                    <button onClick={handleCopy} className="hover:text-white transition-colors">{copied ? "Copied" : "Copy"}</button>
                    <button onClick={handleExport} className="hover:text-white transition-colors">Export</button>
                </div>
            </div>
            <div className="flex-1 overflow-auto p-4 custom-scrollbar">
                <pre className="text-xs font-mono text-blue-200">{formattedJson}</pre>
            </div>
        </div>
    );
});
