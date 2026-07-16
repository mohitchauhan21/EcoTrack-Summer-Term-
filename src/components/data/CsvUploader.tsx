import React, { useState, useRef } from "react";
import { Upload, FileText, AlertCircle, CheckCircle2 } from "lucide-react";
import apiClient from "../../api/axiosClient";
import { useToast } from "../../context/ToastContext";

interface Props {
  onSuccess: () => void;
}

export default function CsvUploader({ onSuccess }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [headers, setHeaders] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ insertedCount: number, errorCount: number, errors: any[] } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const processFile = (selectedFile: File) => {
    setFile(selectedFile);
    setResult(null);
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const firstLine = text.split('\n')[0];
      if (firstLine) {
        setHeaders(firstLine.split(',').map(h => h.trim().replace(/['"]/g, '')));
      }
    };
    reader.readAsText(selectedFile.slice(0, 1024)); // Read first 1KB
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.name.endsWith('.csv') || droppedFile.type === 'text/csv') {
        processFile(droppedFile);
      } else {
        toast("Please drop a valid CSV file.", "error");
      }
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await apiClient.post("/logs/bulk-upload", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      setResult(res.data);
      if (res.data.insertedCount > 0) {
        toast(`Successfully imported ${res.data.insertedCount} logs`, 'success');
        onSuccess();
      } else {
        toast(`Import completed with ${res.data.errorCount} errors`, 'error');
      }
    } catch (error: any) {
      console.error("Upload failed", error);
      const msg = error.response?.data?.message || "Failed to upload file.";
      toast(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#0f0f0f] border border-white/5 rounded-2xl p-6 h-full flex flex-col">
      <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-100 mb-6">Bulk Upload (CSV)</h3>
      
      {!file ? (
        <div 
          className="flex-grow flex flex-col justify-center border-2 border-dashed border-white/10 rounded-xl p-8 text-center hover:border-emerald-500/30 hover:bg-white/[0.02] transition-colors cursor-pointer"
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
        >
          <Upload className="w-8 h-8 text-zinc-600 mx-auto mb-3" />
          <p className="text-zinc-300 font-medium text-sm">Click or drag CSV file here</p>
          <p className="text-zinc-500 text-xs mt-2">Expected columns: date, department, activityType, rawAmount, rawUnit, source</p>
          <input 
            type="file" 
            accept=".csv" 
            className="hidden" 
            ref={fileInputRef} 
            onChange={handleFileChange}
          />
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-zinc-900 border border-white/10 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <FileText className="w-6 h-6 text-emerald-500" />
              <div>
                <p className="text-zinc-200 font-medium text-sm">{file.name}</p>
                <p className="text-zinc-500 text-xs mt-1">{(file.size / 1024).toFixed(1)} KB</p>
              </div>
            </div>
            <button 
              onClick={() => { setFile(null); setResult(null); setHeaders([]); }}
              className="text-zinc-500 hover:text-white text-xs font-bold uppercase tracking-wider transition-colors"
              disabled={loading}
            >
              Remove
            </button>
          </div>

          {!result && headers.length > 0 && (
            <div className="bg-zinc-900 border border-white/5 rounded-lg p-4">
              <h4 className="text-[10px] uppercase tracking-widest font-bold text-zinc-500 mb-3">Detected Columns</h4>
              <div className="flex flex-wrap gap-2">
                {headers.map((h, i) => (
                  <span key={i} className="bg-white/5 border border-white/10 text-zinc-300 text-xs px-2 py-1 rounded">
                    {h}
                  </span>
                ))}
              </div>
            </div>
          )}

          {!result ? (
            <button
              onClick={handleUpload}
              disabled={loading}
              className="w-full bg-emerald-500 hover:bg-emerald-400 disabled:bg-zinc-800 disabled:text-zinc-500 text-black font-bold uppercase tracking-wide py-3 rounded-lg transition-colors text-sm"
            >
              {loading ? "Uploading..." : "Confirm & Process"}
            </button>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-4 py-3 rounded-md">
                <CheckCircle2 className="w-5 h-5" />
                <span className="font-medium text-sm">Successfully inserted {result.insertedCount} rows.</span>
              </div>
              
              {result.errorCount > 0 && (
                <div className="text-red-400 bg-red-500/10 border border-red-500/20 px-4 py-3 rounded-md">
                  <div className="flex items-center space-x-2 mb-2">
                    <AlertCircle className="w-5 h-5" />
                    <span className="font-medium text-sm">Skipped {result.errorCount} rows due to errors.</span>
                  </div>
                  <div className="max-h-32 overflow-y-auto text-xs space-y-1">
                    {result.errors.map((err, i) => (
                      <div key={i}>Row {err.row}: {err.reason}</div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
