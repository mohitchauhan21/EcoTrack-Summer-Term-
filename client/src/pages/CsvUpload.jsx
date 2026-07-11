import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Upload, FileSpreadsheet, CheckCircle2, AlertCircle,
  X, Loader2, CloudUpload,
} from 'lucide-react';
import api from '../services/api';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import toast from 'react-hot-toast';

/**
 * CSV Upload page — drag-and-drop file zone, validation, preview, confirm insert.
 */
const CsvUpload = () => {
  const [file, setFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(null);
  const [inserting, setInserting] = useState(false);
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) {
      validateAndSetFile(droppedFile);
    }
  };

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      validateAndSetFile(selectedFile);
    }
  };

  const validateAndSetFile = (f) => {
    const ext = f.name.split('.').pop().toLowerCase();
    if (!['csv', 'xls', 'xlsx'].includes(ext)) {
      toast.error('Only CSV and Excel files are allowed');
      return;
    }
    if (f.size > 5 * 1024 * 1024) {
      toast.error('File size must be under 5MB');
      return;
    }
    setFile(f);
    setPreview(null);
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const { data } = await api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setPreview(data.data);
      toast.success('File parsed successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleConfirmInsert = async () => {
    if (!file) return;
    setInserting(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const { data } = await api.post('/upload?confirm=true', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.success(`${data.data.inserted} logs inserted successfully!`);
      setFile(null);
      setPreview(null);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Insert failed');
    } finally {
      setInserting(false);
    }
  };

  const resetUpload = () => {
    setFile(null);
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-3xl mx-auto space-y-6"
    >
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-secondary-900 flex items-center gap-2">
          <Upload className="h-7 w-7 text-primary-600" />
          CSV Upload
        </h1>
        <p className="text-secondary-500 mt-1">
          Upload a CSV or Excel file to bulk-import carbon logs
        </p>
      </div>

      {/* Expected format info */}
      <Card title="Expected File Format">
        <p className="text-sm text-secondary-600 mb-3">
          Your file should include the following columns:
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-secondary-50 border-b border-secondary-200">
              <tr>
                <th className="text-left px-3 py-2 font-semibold text-secondary-600">Column</th>
                <th className="text-left px-3 py-2 font-semibold text-secondary-600">Example</th>
              </tr>
            </thead>
            <tbody className="text-secondary-700">
              <tr className="border-b border-secondary-50"><td className="px-3 py-2">date</td><td className="px-3 py-2">2025-07-01</td></tr>
              <tr className="border-b border-secondary-50"><td className="px-3 py-2">department</td><td className="px-3 py-2">Engineering</td></tr>
              <tr className="border-b border-secondary-50"><td className="px-3 py-2">activityType</td><td className="px-3 py-2">electricity</td></tr>
              <tr className="border-b border-secondary-50"><td className="px-3 py-2">amount</td><td className="px-3 py-2">500</td></tr>
              <tr className="border-b border-secondary-50"><td className="px-3 py-2">unit</td><td className="px-3 py-2">kWh</td></tr>
              <tr><td className="px-3 py-2">carbonEquivalent</td><td className="px-3 py-2">250</td></tr>
            </tbody>
          </table>
        </div>
      </Card>

      {/* Drop Zone */}
      <Card>
        <div
          className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-colors duration-200 cursor-pointer ${
            dragActive
              ? 'border-primary-500 bg-primary-50/50'
              : file
              ? 'border-primary-300 bg-primary-50/30'
              : 'border-secondary-300 hover:border-secondary-400 hover:bg-secondary-50'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => !file && fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,.xls,.xlsx"
            onChange={handleFileSelect}
            className="hidden"
          />

          {file ? (
            <div className="space-y-3">
              <FileSpreadsheet className="h-12 w-12 text-primary-500 mx-auto" />
              <div>
                <p className="text-sm font-medium text-secondary-900">{file.name}</p>
                <p className="text-xs text-secondary-500">{(file.size / 1024).toFixed(1)} KB</p>
              </div>
              <div className="flex items-center justify-center gap-2">
                <Button variant="primary" onClick={handleUpload} isLoading={uploading} icon={<CloudUpload className="h-4 w-4" />}>
                  Parse File
                </Button>
                <Button variant="ghost" onClick={resetUpload} icon={<X className="h-4 w-4" />}>
                  Remove
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <CloudUpload className="h-12 w-12 text-secondary-400 mx-auto" />
              <div>
                <p className="text-sm font-medium text-secondary-700">
                  Drag and drop your file here, or click to browse
                </p>
                <p className="text-xs text-secondary-400 mt-1">
                  Supports CSV, XLS, XLSX (max 5MB)
                </p>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Preview Results */}
      <AnimatePresence>
        {preview && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-4"
          >
            {/* Summary */}
            <Card>
              <div className="flex items-center gap-6 flex-wrap">
                <div className="flex items-center gap-2 text-sm">
                  <FileSpreadsheet className="h-4 w-4 text-secondary-500" />
                  <span className="text-secondary-600">Total Rows:</span>
                  <span className="font-semibold text-secondary-900">{preview.totalRows}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-primary-500" />
                  <span className="text-secondary-600">Valid:</span>
                  <span className="font-semibold text-primary-600">{preview.validRows}</span>
                </div>
                {preview.invalidRows > 0 && (
                  <div className="flex items-center gap-2 text-sm">
                    <AlertCircle className="h-4 w-4 text-danger-500" />
                    <span className="text-secondary-600">Invalid:</span>
                    <span className="font-semibold text-danger-500">{preview.invalidRows}</span>
                  </div>
                )}
              </div>
            </Card>

            {/* Errors */}
            {preview.errors?.length > 0 && (
              <Card title="Validation Errors">
                <div className="max-h-40 overflow-y-auto space-y-1">
                  {preview.errors.map((err, idx) => (
                    <p key={idx} className="text-sm text-danger-600 flex items-start gap-2">
                      <AlertCircle className="h-3.5 w-3.5 mt-0.5 shrink-0" />
                      {err}
                    </p>
                  ))}
                </div>
              </Card>
            )}

            {/* Data Preview Table */}
            {preview.preview?.length > 0 && (
              <Card title="Data Preview (first 10 rows)">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-secondary-50 border-b border-secondary-200">
                      <tr>
                        <th className="text-left px-3 py-2 font-semibold text-secondary-600">Date</th>
                        <th className="text-left px-3 py-2 font-semibold text-secondary-600">Dept</th>
                        <th className="text-left px-3 py-2 font-semibold text-secondary-600">Activity</th>
                        <th className="text-right px-3 py-2 font-semibold text-secondary-600">Amount</th>
                        <th className="text-left px-3 py-2 font-semibold text-secondary-600">Unit</th>
                        <th className="text-right px-3 py-2 font-semibold text-secondary-600">CO₂e</th>
                      </tr>
                    </thead>
                    <tbody>
                      {preview.preview.map((row, idx) => (
                        <tr key={idx} className="border-b border-secondary-50">
                          <td className="px-3 py-2 text-secondary-700">{new Date(row.date).toLocaleDateString()}</td>
                          <td className="px-3 py-2 text-secondary-700">{row.department}</td>
                          <td className="px-3 py-2 text-secondary-700 capitalize">{row.activityType}</td>
                          <td className="px-3 py-2 text-right text-secondary-700">{row.amount}</td>
                          <td className="px-3 py-2 text-secondary-700">{row.unit}</td>
                          <td className="px-3 py-2 text-right font-semibold text-secondary-900">{row.carbonEquivalent}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            )}

            {/* Confirm Insert */}
            {preview.validRows > 0 && (
              <div className="flex justify-end gap-2">
                <Button variant="ghost" onClick={resetUpload}>
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  onClick={handleConfirmInsert}
                  isLoading={inserting}
                  icon={<CheckCircle2 className="h-4 w-4" />}
                >
                  Insert {preview.validRows} Logs
                </Button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default CsvUpload;
