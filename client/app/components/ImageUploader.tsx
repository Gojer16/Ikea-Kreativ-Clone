import { useState, useRef, useEffect, ChangeEvent, DragEvent } from 'react';
import { useRoomStore } from '../store/roomStore';
import './ImageUploader.css'


const ImageUploader = () => {
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const previewUrlRef = useRef<string | null>(null);

  const setImageUrl = useRoomStore((state) => state.setImageUrl);

  const processFile = (file: File) => {
    try {
      const isValidImage = /image\/(jpeg|png|webp)/.test(file.type);
      const isTooLarge = file.size > 5 * 1024 * 1024;

      if (!isValidImage) {
        setFileError("Unsupported format. Please use JPG, PNG, or WebP.");
        return;
      }

      if (isTooLarge) {
        setFileError("Image exceeds 5MB limit. Please choose a smaller file.");
        return;
      }

      if (previewUrlRef.current) {
        URL.revokeObjectURL(previewUrlRef.current);
      }

      const previewUrl = URL.createObjectURL(file);
      previewUrlRef.current = previewUrl;
      setImagePreviewUrl(previewUrl);
      setImageUrl(previewUrl)
      setFileError(null);
      setUploadSuccess(true);
      
      // Clear success state after visual confirmation
      setTimeout(() => setUploadSuccess(false), 1500);
    } catch (error) {
      setFileError("Failed to process image. Please try again.");
      console.error("Image processing error:", error);
    }
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  const clearImage = () => {
    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
      previewUrlRef.current = null;
    }
    setImagePreviewUrl(null);
    setFileError(null);
    setImageUrl(null)
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  useEffect(() => {
    return () => {
      if (previewUrlRef.current) {
        URL.revokeObjectURL(previewUrlRef.current);
      }
    };
  }, []);

  return (
    <>
      <div className="flex justify-center">
        <div className="w-full max-w-md p-4">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleImageChange}
            className="hidden"
            id="image-upload"
          />

          {/* Main Upload Area */}
          {!imagePreviewUrl ? (
            <div 
              className={`border-2 border-dashed rounded-xl p-6 text-center transition-all duration-300
                ${isDragOver 
                  ? 'border-blue-500 bg-blue-50 scale-[1.02]' 
                  : uploadSuccess
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-300 hover:border-gray-400 bg-gray-50'}
                cursor-pointer`}
              onClick={() => fileInputRef.current?.click()}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              role="button"
              tabIndex={0}
              aria-labelledby="upload-label"
              onKeyDown={(e) => e.key === 'Enter' && fileInputRef.current?.click()}
            >
              <div className="flex flex-col items-center justify-center space-y-3">
                {uploadSuccess ? (
                  <div className="text-green-500 animate-bounce">
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className="h-12 w-12" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={1.5} 
                        d="M5 13l4 4L19 7" 
                      />
                    </svg>
                  </div>
                ) : (
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-12 w-12 text-gray-400" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={1.5} 
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" 
                    />
                  </svg>
                )}
                <div className="space-y-1">
                  <h3 
                    className="font-medium text-gray-900" 
                    id="upload-label"
                  >
                    {uploadSuccess ? "Upload Successful!" : "Upload Room Image"}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {uploadSuccess ? (
                      "Your room image is ready"
                    ) : (
                      <>
                        <span className="font-semibold text-blue-600">Click to upload</span> or drag and drop
                      </>
                    )}
                  </p>
                  <p className="text-xs text-gray-500">
                    {uploadSuccess ? "You can change it anytime" : "JPG, PNG, or WebP (Max 5MB)"}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="relative rounded-xl overflow-hidden shadow-md animate-fadeIn">
              {imagePreviewUrl && (
                <Image
                  src={imagePreviewUrl}
                  alt="Room preview"
                  width={400}
                  height={320}
                  className="w-full h-auto max-h-80 object-contain transition-opacity duration-300"
                  style={{ objectFit: 'contain' }}
                />
              )}
              <button
                onClick={clearImage}
                className="absolute top-3 right-3 bg-red-500 text-white p-1.5 rounded-full cursor-pointer hover:bg-red-600 transition-colors duration-200"
                aria-label="Clear image"
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-5 w-5" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M6 18L18 6M6 6l12 12" 
                  />
                </svg>
              </button>
            </div>
          )}

          {/* Error Message */}
          {fileError && (
            <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm text-center animate-shake">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-5 w-5 inline mr-2" 
                viewBox="0 0 20 20" 
                fill="currentColor"
              >
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {fileError}
            </div>
          )}

          {/* File Input Button */}
          {!imagePreviewUrl && (
            <div className="mt-4 flex justify-center">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
              >
                Browse Files
              </button>
            </div>
          )}
        </div>
      </div>
      
    
    </>
  );
};

export default ImageUploader;