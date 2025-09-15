import { useState } from 'react';

export interface FileUploadState {
  uploading: boolean;
  progress: number;
  error: string | null;
  result: any | null;
}

export function useFileUpload() {
  const [state, setState] = useState<FileUploadState>({
    uploading: false,
    progress: 0,
    error: null,
    result: null,
  });

  const uploadFile = async (file: File) => {
    setState({ uploading: true, progress: 0, error: null, result: null });

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const result = await response.json();
      setState({ uploading: false, progress: 100, error: null, result: result.data });
      return result.data;
    } catch (error) {
      setState({ 
        uploading: false, 
        progress: 0, 
        error: error instanceof Error ? error.message : 'Upload failed',
        result: null 
      });
      throw error;
    }
  };

  const uploadMultipleFiles = async (files: File[]) => {
    setState({ uploading: true, progress: 0, error: null, result: null });
    const results = [];

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const progress = Math.round(((i + 1) / files.length) * 100);
        setState(prev => ({ ...prev, progress }));

        const result = await uploadFile(file);
        results.push(result);
      }

      setState({ uploading: false, progress: 100, error: null, result: results });
      return results;
    } catch (error) {
      setState({ 
        uploading: false, 
        progress: 0, 
        error: error instanceof Error ? error.message : 'Upload failed',
        result: null 
      });
      throw error;
    }
  };

  const reset = () => {
    setState({ uploading: false, progress: 0, error: null, result: null });
  };

  return {
    ...state,
    uploadFile,
    uploadMultipleFiles,
    reset,
  };
}
