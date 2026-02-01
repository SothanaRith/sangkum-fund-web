import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import {
  Camera,
  Upload,
  CheckCircle2,
  AlertCircle,
  Loader2,
  FileText,
  ArrowRight,
  Home,
  ShieldCheck,
  X,
  Eye,
} from 'lucide-react';
import { ocrAPI, usersAPI } from '@/lib/api';
import Layout from '@/components/Layout';

export default function OcrVerificationPage() {
  const router = useRouter();
  const [step, setStep] = useState('upload'); // upload, preview, result
  const [documentType, setDocumentType] = useState('NATIONAL_ID');
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [extractedData, setExtractedData] = useState(null);
  const [userData, setUserData] = useState(null);
  const [showPreview, setShowPreview] = useState(false);

  const documentOptions = [
    { value: 'NATIONAL_ID', label: 'National ID Card' },
    { value: 'PASSPORT', label: 'Passport' },
    { value: 'DRIVER_LICENSE', label: "Driver's License" },
  ];

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      // Validate file type
      if (!['image/jpeg', 'image/png', 'image/jpg'].includes(selectedFile.type)) {
        setError('Please select a valid image file (JPG, PNG)');
        return;
      }

      // Validate file size (max 5MB)
      if (selectedFile.size > 5 * 1024 * 1024) {
        setError('File size must be less than 5MB');
        return;
      }

      setFile(selectedFile);
      setError(null);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleDragDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    handleFileSelect({ target: { files: e.dataTransfer.files } });
  };

  const handleSubmitDocument = async () => {
    if (!file || !preview) {
      setError('Please select a document image');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Fetch user data for name verification
      const currentUser = await usersAPI.getCurrentUser();
      setUserData(currentUser);

      // Extract base64 from preview
      const base64Image = preview.split(',')[1];

      // Call OCR verification API
      const result = await ocrAPI.verifyDocument(
        base64Image,
        documentType,
        currentUser.name
      );

      setExtractedData(result);

      if (result.verified) {
        setSuccess(true);
        setStep('result');
      } else {
        setError(result.message || 'Verification failed. Please try again.');
        setStep('preview');
      }
    } catch (err) {
      console.error('OCR verification error:', err);
      setError(err.response?.data?.message || 'Failed to verify document. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    setFile(null);
    setPreview(null);
    setExtractedData(null);
    setError(null);
    setSuccess(false);
    setStep('upload');
  };

  if (step === 'preview' && preview) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-b from-orange-50 via-white to-amber-50 py-12">
          <div className="container mx-auto px-4 max-w-4xl">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-100 to-cyan-100 rounded-full mb-4">
                <ShieldCheck className="w-4 h-4 text-blue-700" />
                <span className="text-sm font-medium text-blue-800">Identity Verification</span>
              </div>
              <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
                Verify Your Identity
              </h1>
              <p className="text-gray-600">Review the extracted information before confirming</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Document Preview */}
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
                <h2 className="text-lg font-semibold mb-4 text-gray-900">Document Preview</h2>
                <div className="relative aspect-video bg-gray-100 rounded-xl overflow-hidden border-2 border-gray-200">
                  <img
                    src={preview}
                    alt="Document preview"
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={() => setShowPreview(!showPreview)}
                    className="absolute top-2 right-2 bg-white rounded-lg p-2 shadow-lg hover:bg-gray-50"
                  >
                    <Eye className="w-5 h-5 text-gray-700" />
                  </button>
                </div>
                <p className="text-sm text-gray-600 mt-4">
                  <strong>Document Type:</strong> {documentOptions.find(d => d.value === documentType)?.label}
                </p>
              </div>

              {/* Extracted Information */}
              <div className="space-y-4">
                <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
                  <h2 className="text-lg font-semibold mb-4 text-gray-900">Extracted Information</h2>

                  {!extractedData ? (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Document Type
                        </label>
                        <select
                          value={documentType}
                          onChange={(e) => setDocumentType(e.target.value)}
                          className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:outline-none"
                        >
                          {documentOptions.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <button
                        onClick={handleSubmitDocument}
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-orange-600 to-amber-600 text-white py-3 rounded-xl font-semibold hover:from-orange-700 hover:to-amber-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                      >
                        {loading ? (
                          <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Processing...
                          </>
                        ) : (
                          <>
                            <ShieldCheck className="w-5 h-5" />
                            Verify Document
                          </>
                        )}
                      </button>

                      {error && (
                        <div className="flex gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
                          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="font-semibold text-red-900">{error}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {extractedData.verified && (
                        <div className="flex gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
                          <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="font-semibold text-green-900">Verification Successful!</p>
                            <p className="text-sm text-green-800">{extractedData.message}</p>
                          </div>
                        </div>
                      )}

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Extracted Name
                        </label>
                        <div className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 font-medium">
                          {extractedData.extractedName || 'Not extracted'}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Extracted ID
                        </label>
                        <div className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 font-medium">
                          {extractedData.extractedId || 'Not extracted'}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Confidence Level
                        </label>
                        <div className="inline-block px-3 py-1 bg-blue-100 text-blue-900 rounded-full text-sm font-semibold">
                          {extractedData.confidence}
                        </div>
                      </div>

                      {extractedData.verified && (
                        <button
                          onClick={() => router.push('/settings')}
                          className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 transition-all flex items-center justify-center gap-2"
                        >
                          <CheckCircle2 className="w-5 h-5" />
                          Verification Complete
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4 mt-8">
              <button
                onClick={handleRetry}
                className="flex-1 px-6 py-3 bg-white text-gray-700 rounded-xl font-semibold border-2 border-gray-200 hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
              >
                <X className="w-5 h-5" />
                Cancel
              </button>
              {!extractedData && (
                <button
                  onClick={() => setStep('upload')}
                  className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all flex items-center justify-center gap-2"
                >
                  <Upload className="w-5 h-5" />
                  Select Different Document
                </button>
              )}
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-orange-50 via-white to-amber-50 py-12">
        <div className="container mx-auto px-4 max-w-2xl">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-100 to-cyan-100 rounded-full mb-4">
              <ShieldCheck className="w-4 h-4 text-blue-700" />
              <span className="text-sm font-medium text-blue-800">Identity Verification</span>
            </div>
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
              Verify Your Identity
            </h1>
            <p className="text-xl text-gray-600 mb-2">
              Upload a document to verify your account
            </p>
            <p className="text-gray-500">
              This helps us maintain a safe and trustworthy community
            </p>
          </div>

          {/* Benefits Section */}
          <div className="grid md:grid-cols-3 gap-4 mb-12">
            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center mb-4">
                <ShieldCheck className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Build Trust</h3>
              <p className="text-sm text-gray-600">Show other users you're verified</p>
            </div>
            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
              <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center mb-4">
                <CheckCircle2 className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Enhanced Access</h3>
              <p className="text-sm text-gray-600">Unlock premium features</p>
            </div>
            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
              <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center mb-4">
                <FileText className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Secure Process</h3>
              <p className="text-sm text-gray-600">Your data is encrypted</p>
            </div>
          </div>

          {/* Document Type Selection */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Select Document Type</h2>
            <div className="grid md:grid-cols-3 gap-4 mb-8">
              {documentOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setDocumentType(option.value)}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    documentType === option.value
                      ? 'border-orange-600 bg-orange-50'
                      : 'border-gray-200 bg-white hover:border-orange-300'
                  }`}
                >
                  <FileText className="w-6 h-6 mx-auto mb-2 text-orange-600" />
                  <p className="font-semibold text-gray-900">{option.label}</p>
                </button>
              ))}
            </div>

            {/* Upload Area */}
            <div
              onDrop={handleDragDrop}
              onDragOver={(e) => e.preventDefault()}
              className="border-2 border-dashed border-gray-300 rounded-2xl p-12 text-center hover:border-orange-400 hover:bg-orange-50 transition-all cursor-pointer"
            >
              <input
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
                id="file-input"
              />
              <label htmlFor="file-input" className="cursor-pointer block">
                <div className="flex flex-col items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-orange-100 flex items-center justify-center">
                    <Upload className="w-8 h-8 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-gray-900 mb-1">
                      Drag and drop your document
                    </p>
                    <p className="text-sm text-gray-500">
                      or click to browse (JPG, PNG - Max 5MB)
                    </p>
                  </div>
                </div>
              </label>
            </div>

            {file && (
              <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-green-900">{file.name}</p>
                  <p className="text-sm text-green-800">
                    {(file.size / 1024).toFixed(2)} KB - Ready to verify
                  </p>
                </div>
              </div>
            )}

            {error && (
              <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-red-900">Error</p>
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              </div>
            )}

            <button
              onClick={() => {
                if (file) {
                  setStep('preview');
                }
              }}
              disabled={!file || loading}
              className="w-full mt-8 bg-gradient-to-r from-orange-600 to-amber-600 text-white py-3 rounded-xl font-semibold hover:from-orange-700 hover:to-amber-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <ArrowRight className="w-5 h-5" />
                  Continue to Review
                </>
              )}
            </button>
          </div>

          {/* Info Section */}
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-8">
            <h3 className="font-bold text-blue-900 mb-4">Document Requirements</h3>
            <ul className="space-y-2 text-sm text-blue-900">
              <li className="flex gap-2">
                <span className="font-bold">•</span>
                <span>Document must be clear and readable</span>
              </li>
              <li className="flex gap-2">
                <span className="font-bold">•</span>
                <span>Full face visible in photo</span>
              </li>
              <li className="flex gap-2">
                <span className="font-bold">•</span>
                <span>Name on document must match your account name</span>
              </li>
              <li className="flex gap-2">
                <span className="font-bold">•</span>
                <span>Document must not be expired</span>
              </li>
            </ul>
          </div>

          {/* Footer Links */}
          <div className="flex gap-4 mt-12 justify-center">
            <Link href="/settings" className="text-orange-600 hover:text-orange-700 font-semibold flex items-center gap-2">
              <Home className="w-5 h-5" />
              Back to Settings
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}
