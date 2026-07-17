import React, { useState, useRef } from "react";
import { Upload, FileText, AlertCircle, CheckCircle2, UploadCloud } from "lucide-react";
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
  const [successAlert, setSuccessAlert] = useState<string | null>(null);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
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
    reader.readAsText(selectedFile.slice(0, 1024));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
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
    setResult(null); // Clear previous results
    
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await apiClient.post("/logs/bulk-upload", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      
      if (res.data.insertedCount > 0 && res.data.errorCount === 0) {
        // 100% Success
        setSuccessAlert(`Successfully inserted ${res.data.insertedCount} rows.`);
        setIsFadingOut(false);
        setFile(null);
        setHeaders([]);
        onSuccess();
        
        setTimeout(() => {
          setIsFadingOut(true);
        }, 3500);

        setTimeout(() => {
          setSuccessAlert(null);
          setIsFadingOut(false);
        }, 4000);
      } else {
        // Partial success or failure
        setResult(res.data);
        if (res.data.insertedCount > 0) {
          onSuccess();
        }
      }
    } catch (error: any) {
      console.error("Upload failed", error);
      const msg = error.response?.data?.message || "Failed to upload file. Please try again.";
      toast(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dark:bg-zinc-900 bg-white border dark:border-white/[0.06] border-gray-200 rounded-2xl p-6 h-full flex flex-col shadow-sm relative">
      <h3 className="text-sm font-bold uppercase tracking-widest dark:text-zinc-100 text-gray-900 mb-6">Bulk Upload (CSV)</h3>
      
      {successAlert && (
        <div className={`mb-6 transition-opacity duration-500 animate-in fade-in slide-in-from-top-2 ${isFadingOut ? 'opacity-0' : 'opacity-100'}`}>
           <div className="flex items-center space-x-3 text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-5 py-4 rounded-lg">
             <CheckCircle2 className="w-6 h-6" />
             <span className="font-medium text-sm">{successAlert}</span>
           </div>
        </div>
      )}
      
      {!file ? (
        <div 
          className={`flex-grow flex flex-col justify-center items-center border-2 border-dashed rounded-2xl p-10 text-center transition-all duration-300 cursor-pointer ${
            isDragging 
              ? "border-emerald-500 bg-emerald-500/5" 
              : "dark:border-white/[0.06] border-gray-300 hover:border-emerald-500/50 hover:bg-gray-50 dark:hover:bg-white/[0.02]"
          }`}
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={(e) => { e.preventDefault(); setIsDragging(false); }}
          onDrop={handleDrop}
        >
          <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 transition-colors duration-300 ${
             isDragging ? "bg-emerald-500/20 text-emerald-500" : "dark:bg-white/5 bg-gray-100 dark:text-zinc-400 text-gray-500"
          }`}>
             <UploadCloud className="w-10 h-10" />
          </div>
          <p className="dark:text-zinc-200 text-gray-800 font-medium text-lg mb-2">
             {isDragging ? "Drop your file here..." : "Click or drag CSV file here"}
          </p>
          <p className="dark:text-zinc-500 text-gray-500 text-sm max-w-[250px] leading-relaxed mx-auto">
             Expected columns: date, department, activityType, rawAmount, rawUnit, source
          </p>
          <input 
            type="file" 
            accept=".csv" 
            className="hidden" 
            ref={fileInputRef} 
            onChange={handleFileChange}
          />
        </div>
      ) : (
        <div className="space-y-6 flex-grow flex flex-col justify-center">
          <div className="flex items-center justify-between dark:bg-zinc-800 bg-gray-50 border dark:border-white/[0.06] border-gray-200 rounded-lg p-5">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                <FileText className="w-5 h-5 text-emerald-500" />
              </div>
              <div>
                <p className="dark:text-zinc-200 text-gray-800 font-medium text-sm">{file.name}</p>
                <p className="dark:text-zinc-500 text-gray-500 text-xs mt-1">{(file.size / 1024).toFixed(1)} KB</p>
              </div>
            </div>
            <button 
              onClick={() => { setFile(null); setResult(null); setHeaders([]); }}
              className="dark:text-zinc-500 text-gray-500 hover:text-red-400 text-xs font-bold uppercase tracking-wider transition-colors px-3 py-2 rounded-lg hover:bg-red-500/10"
              disabled={loading}
            >
              Remove
            </button>
          </div>

          {!result && headers.length > 0 && (
            <div className="dark:bg-zinc-800 bg-gray-50 border dark:border-white/[0.06] border-gray-200 rounded-lg p-5">
              <h4 className="text-[10px] uppercase tracking-widest font-bold dark:text-zinc-500 text-gray-500 mb-4">Detected Columns</h4>
              <div className="flex flex-wrap gap-2">
                {headers.map((h, i) => (
                  <span key={i} className="bg-white/5 border dark:border-white/[0.06] border-gray-200 dark:text-zinc-300 text-gray-700 text-xs px-2.5 py-1.5 rounded font-medium">
                    {h}
                  </span>
                ))}
              </div>
            </div>
          )}

          {!result ? (
            <div className="mt-auto pt-4">
              <button
                onClick={handleUpload}
                disabled={loading}
                className="w-full bg-emerald-500 hover:bg-emerald-400 disabled:dark:bg-zinc-800 bg-gray-200 disabled:dark:text-zinc-500 text-gray-500 text-black font-bold uppercase tracking-wide py-3.5 rounded-lg transition-all duration-300 text-sm shadow-[0_0_20px_rgba(16,185,129,0.15)] hover:shadow-[0_0_30px_rgba(16,185,129,0.25)] disabled:shadow-none"
              >
                {loading ? "Processing Upload..." : "Confirm & Process"}
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center space-x-3 text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-5 py-4 rounded-lg">
                <CheckCircle2 className="w-6 h-6" />
                <span className="font-medium text-sm">Successfully inserted {result.insertedCount} rows.</span>
              </div>
              
              {result.errorCount > 0 && (
                <div className="text-red-400 bg-red-500/10 border border-red-500/20 px-5 py-4 rounded-lg">
                  <div className="flex items-center space-x-3 mb-3">
                    <AlertCircle className="w-6 h-6" />
                    <span className="font-medium text-sm">Skipped {result.errorCount} rows due to errors.</span>
                  </div>
                  <div className="max-h-32 overflow-y-auto text-xs space-y-2 pl-9">
                    {result.errors.map((err, i) => (
                      <div key={i} className="opacity-80">Row {err.row}: {err.reason}</div>
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
