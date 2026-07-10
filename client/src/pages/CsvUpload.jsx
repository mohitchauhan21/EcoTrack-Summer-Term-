import { motion } from 'framer-motion';
import { Upload } from 'lucide-react';

/**
 * CSV Upload page — placeholder.
 */
const CsvUpload = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center min-h-[60vh] text-center"
    >
      <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-primary-100 mb-4">
        <Upload className="h-7 w-7 text-primary-600" />
      </div>
      <h1 className="text-2xl font-bold text-secondary-900 mb-2">CSV Upload</h1>
      <p className="text-secondary-500">This page is under development.</p>
    </motion.div>
  );
};

export default CsvUpload;
