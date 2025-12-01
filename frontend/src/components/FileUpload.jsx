import React, { useState } from 'react';
import { Upload, FileText, Zap, Loader, File } from 'lucide-react';
import Button from './ui/Button';
import Card from './ui/Card';

const FileUpload = ({ onSuccess }) => {
  const [file, setFile] = useState(null);
  const [mode, setMode] = useState('quick');
  const [generateType, setGenerateType] = useState('notes');
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

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

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      alert('Please select a file');
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);
      
      if (generateType === 'notes') {
        formData.append('mode', mode);
      }

      const endpoint = generateType === 'notes' 
        ? 'http://localhost:5001/api/upload/notes'
        : 'http://localhost:5001/api/upload/flashcards';

      const response = await fetch(endpoint, {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const textResponse = await response.text();
        console.error('Non-JSON response:', textResponse);
        throw new Error('Server returned an invalid response. Please check if the backend is running correctly.');
      }

      const data = await response.json();

      if (response.ok) {
        alert(`${generateType === 'notes' ? 'Notes' : 'Flashcards'} generated successfully!`);
        setFile(null);
        if (onSuccess) onSuccess(data);
      } else {
        const errorMsg = data.message || 'Failed to process file';
        
        let helpText = '';
        if (errorMsg.includes('OCR')) {
          helpText = '\n\nTip: For best results with scanned PDFs, ensure the document has clear, high-contrast text.';
        } else if (errorMsg.includes('encrypted')) {
          helpText = '\n\nTip: You can remove PDF encryption using online tools or Adobe Acrobat.';
        } else if (errorMsg.includes('corrupted')) {
          helpText = '\n\nTip: Try opening the PDF in a viewer and re-saving it, or convert it to a new PDF.';
        }
        
        alert(errorMsg + helpText);
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert(error.message || 'Failed to upload file. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Card className="p-8 bg-white shadow-sm">
      <div
        className={`border-2 border-dashed rounded-xl p-12 text-center transition-all mb-6 ${
          dragActive
            ? 'border-indigo-500 bg-indigo-50 scale-[1.02]'
            : file 
            ? 'border-green-300 bg-green-50'
            : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          id="file-upload"
          className="hidden"
          accept=".pdf,.txt"
          onChange={handleFileChange}
        />
        
        {file ? (
          <div className="flex flex-col items-center gap-3">
            <div className="bg-green-100 p-4 rounded-full">
              <File className="h-10 w-10 text-green-600" />
            </div>
            <div className="text-center">
              <p className="font-semibold text-gray-900 text-lg">{file.name}</p>
              <p className="text-sm text-gray-500 mt-1">
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
            <button
              onClick={() => setFile(null)}
              className="mt-2 text-red-600 hover:text-red-700 text-sm font-medium underline"
            >
              Remove file
            </button>
          </div>
        ) : (
          <label htmlFor="file-upload" className="cursor-pointer block">
            <div className="bg-indigo-100 p-4 rounded-full inline-block mb-4">
              <Upload className="h-10 w-10 text-indigo-600" />
            </div>
            <p className="text-xl font-semibold text-gray-900 mb-2">
              Drag & Drop anything
            </p>
            <p className="text-gray-600 mb-1">
              or <span className="text-indigo-600 font-medium">choose files</span> from your computer
            </p>
            <p className="text-sm text-gray-500 mt-3">
              Supports PDF and TXT files (max 50MB)
            </p>
            <p className="text-xs text-gray-400 mt-1">
              ✨ Scanned PDFs & Books supported with OCR
            </p>
          </label>
        )}
      </div>

      <div className="flex items-center justify-center gap-6 mb-6 text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4" />
          <span>PDF</span>
        </div>
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4" />
          <span>TXT</span>
        </div>
        <div className="flex items-center gap-2">
          <Zap className="h-4 w-4" />
          <span>AI-Powered</span>
        </div>
      </div>

      <div className="space-y-5">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            What would you like to generate?
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setGenerateType('notes')}
              className={`p-4 rounded-lg border-2 transition-all ${
                generateType === 'notes'
                  ? 'border-indigo-600 bg-indigo-50 shadow-sm'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <FileText className={`h-6 w-6 mx-auto mb-2 ${
                generateType === 'notes' ? 'text-indigo-600' : 'text-gray-400'
              }`} />
              <div className={`text-sm font-semibold ${
                generateType === 'notes' ? 'text-indigo-900' : 'text-gray-700'
              }`}>
                Notes
              </div>
            </button>
            <button
              onClick={() => setGenerateType('flashcards')}
              className={`p-4 rounded-lg border-2 transition-all ${
                generateType === 'flashcards'
                  ? 'border-indigo-600 bg-indigo-50 shadow-sm'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <Zap className={`h-6 w-6 mx-auto mb-2 ${
                generateType === 'flashcards' ? 'text-indigo-600' : 'text-gray-400'
              }`} />
              <div className={`text-sm font-semibold ${
                generateType === 'flashcards' ? 'text-indigo-900' : 'text-gray-700'
              }`}>
                Flashcards
              </div>
            </button>
          </div>
        </div>

        {generateType === 'notes' && (
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Note Type
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setMode('quick')}
                className={`p-4 rounded-lg border-2 transition-all text-left ${
                  mode === 'quick'
                    ? 'border-indigo-600 bg-indigo-50 shadow-sm'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div className={`font-semibold text-sm mb-1 ${
                  mode === 'quick' ? 'text-indigo-900' : 'text-gray-900'
                }`}>
                  Quick Notes
                </div>
                <div className="text-xs text-gray-600">
                  Concise, exam-focused
                </div>
              </button>
              <button
                onClick={() => setMode('detailed')}
                className={`p-4 rounded-lg border-2 transition-all text-left ${
                  mode === 'detailed'
                    ? 'border-indigo-600 bg-indigo-50 shadow-sm'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div className={`font-semibold text-sm mb-1 ${
                  mode === 'detailed' ? 'text-indigo-900' : 'text-gray-900'
                }`}>
                  Detailed Notes
                </div>
                <div className="text-xs text-gray-600">
                  Comprehensive research
                </div>
              </button>
            </div>
          </div>
        )}

        <Button
          onClick={handleUpload}
          disabled={!file || isUploading}
          className="w-full flex items-center justify-center gap-2 py-3 text-base font-semibold"
        >
          {isUploading ? (
            <>
              <Loader className="h-5 w-5 animate-spin" />
              Processing with AI... {file?.name.endsWith('.pdf') ? '(may take 10-30s for scanned PDFs)' : ''}
            </>
          ) : (
            <>
              <Zap className="h-5 w-5" />
              Generate {generateType === 'notes' ? 'Notes' : 'Flashcards'}
            </>
          )}
        </Button>
      </div>
    </Card>
  );
};

export default FileUpload;

