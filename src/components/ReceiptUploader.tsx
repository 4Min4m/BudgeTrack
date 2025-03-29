import React from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud } from 'lucide-react';
import { createWorker } from 'tesseract.js';
import toast from 'react-hot-toast';
import { useStore } from '../store/useStore';

const ReceiptUploader: React.FC = () => {
  const [isProcessing, setIsProcessing] = React.useState(false);
  const addReceipt = useStore((state) => state.addReceipt);

  const processReceipt = async (file: File) => {
    try {
      setIsProcessing(true);
      const worker = await createWorker('eng');
      
      // Process the image
      const { data: { text } } = await worker.recognize(file);
      
      // Basic parsing logic - this should be enhanced with more sophisticated regex patterns
      const lines = text.split('\n');
      const total = lines
        .find(line => line.toLowerCase().includes('total'))
        ?.match(/\d+\.\d{2}/)
        ?.[0];

      if (total) {
        addReceipt({
          id: crypto.randomUUID(),
          date: new Date(),
          total: parseFloat(total),
          items: [], // This would need more sophisticated parsing
          category: 'other',
          createdAt: new Date(),
          updatedAt: new Date(),
        });
        toast.success('Receipt processed successfully!');
      } else {
        toast.error('Could not process receipt. Please try again.');
      }

      await worker.terminate();
    } catch (error) {
      console.error('Error processing receipt:', error);
      toast.error('Error processing receipt. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png']
    },
    onDrop: async (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (file) {
        await processReceipt(file);
      }
    }
  });

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Upload Receipt</h2>
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors
            ${isDragActive ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300 hover:border-indigo-400'}`}
        >
          <input {...getInputProps()} />
          <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
          <p className="mt-2 text-sm text-gray-600">
            {isProcessing
              ? 'Processing receipt...'
              : 'Drag & drop a receipt image here, or click to select'}
          </p>
        </div>
      </div>

      {/* Receipt List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium">Recent Receipts</h3>
        </div>
        <div className="divide-y divide-gray-200">
          {useStore((state) => state.receipts).map((receipt) => (
            <div key={receipt.id} className="px-6 py-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {receipt.date.toLocaleDateString()}
                  </p>
                  <p className="text-sm text-gray-500">{receipt.category}</p>
                </div>
                <p className="text-sm font-medium text-gray-900">
                  ${receipt.total.toFixed(2)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReceiptUploader;