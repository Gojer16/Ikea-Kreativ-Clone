'use client';
/**
 * useImageUploader (custom hook)
 *
 * What:
 * - Encapsulates image upload state and behavior (drag/drop, file validation,
 *   preview creation and cleanup, errors, file input ref).
 *
 * Returned values:
 * - imagePreviewUrl, fileError, isDragOver, uploadSuccess
 * - fileInputRef and previewUrlRef for lifecycle management
 * - handlers: handleImageChange, handleDragOver, handleDragLeave, handleDrop, clearImage, triggerFileBrowser
 */

import { useState, useRef, useEffect, ChangeEvent, DragEvent } from 'react';
import { useRoomStore } from '../store/roomStore';

export default function useImageUploader() {
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const previewUrlRef = useRef<string | null>(null);

  const setImageUrl = useRoomStore((state) => state.setImageUrl);

  const revokePreview = () => {
    if (previewUrlRef.current) {
      try {
        URL.revokeObjectURL(previewUrlRef.current);
      } catch {
        // ignore potential errors from revokeObjectURL
      }
      previewUrlRef.current = null;
    }
  };

  const processFile = (file: File) => {
    try {
      const isValidImage = /image\/(jpeg|png|webp)/.test(file.type);
      const isTooLarge = file.size > 5 * 1024 * 1024; // 5MB

      if (!isValidImage) {
        setFileError('Unsupported format. Please use JPG, PNG, or WebP.');
        return;
      }

      if (isTooLarge) {
        setFileError('Image exceeds 5MB limit. Please choose a smaller file.');
        return;
      }

      // cleanup previous object URL
      revokePreview();

      const previewUrl = URL.createObjectURL(file);
      previewUrlRef.current = previewUrl;
      setImagePreviewUrl(previewUrl);

      // Update global store with a string preview URL
      setImageUrl(previewUrl);

      setFileError(null);
      setUploadSuccess(true);

      // Visual confirmation then reset success flag
      setTimeout(() => setUploadSuccess(false), 1500);
    } catch (error) {
      console.error('Image processing error:', error);
      setFileError('Failed to process image. Please try again.');
    }
  };

  // Handler: file input change
  const handleImageChange = (ev: ChangeEvent<HTMLInputElement>) => {
    const file = ev.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  // Handler: drag over the drop area
  const handleDragOver = (ev: DragEvent<HTMLDivElement>) => {
    // prevent default so drop event will fire and browser won't open file
    ev.preventDefault();
    setIsDragOver(true);
  };

  // Handler: drag leaves the drop area
  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  // Handler: drop file into drop area
  const handleDrop = (ev: DragEvent<HTMLDivElement>) => {
    ev.preventDefault();
    setIsDragOver(false);
    const file = ev.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const clearImage = () => {
    // Revoke object URL, clear local state and clear store (use empty string for store)
    revokePreview();
    setImagePreviewUrl(null);
    setFileError(null);
    setImageUrl(''); // keep as string to avoid TS mismatch with your current store typing
    setUploadSuccess(false);

    if (fileInputRef.current) {
      try {
        fileInputRef.current.value = '';
      } catch {
        // ignore potential read-only errors in some browsers
      }
    }
  };

  const triggerFileBrowser = () => {
    fileInputRef.current?.click();
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      revokePreview();
    };

  }, []);

  return {
    // state
    imagePreviewUrl,
    fileError,
    isDragOver,
    uploadSuccess,
    // refs
    fileInputRef,
    previewUrlRef,
    // actions
    handleImageChange,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    clearImage,
    triggerFileBrowser,
  };
}
