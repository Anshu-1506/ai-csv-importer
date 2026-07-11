'use client';

import { useState } from 'react';
import * as Papa from 'papaparse';
import { ImportResult, ImportProgress, UploadResponse } from '@/types';

export function useCSVImport() {
  const [preview, setPreview] = useState<{
    headers: string[];
    rowCount: number;
    previewData: any[];
  } | null>(null);
  
  const [result, setResult] = useState<ImportResult | null>(null);
  const [progress, setProgress] = useState<ImportProgress>({
    currentBatch: 0,
    totalBatches: 0,
    recordsProcessed: 0,
    totalRecords: 0,
    status: 'idle'
  });
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const uploadFile = async (file: File): Promise<boolean> => {
    try {
      setError(null);
      setIsProcessing(true);
      setProgress(prev => ({ ...prev, status: 'uploading' }));

      // Parse CSV locally for preview
      const csvString = await file.text();
      const parsed = Papa.parse(csvString, {
        header: true,
        skipEmptyLines: true,
        transformHeader: (header: string) => header.trim()
      });

      if (parsed.errors.length > 0) {
        setError(`CSV parsing error: ${parsed.errors[0].message}`);
        return false;
      }

      const data = parsed.data.filter((row: any) => 
        Object.values(row).some((value) => value !== '' && value !== undefined && value !== null)
      );

      if (data.length === 0) {
        setError('CSV file is empty or contains no valid data');
        return false;
      }

      const headers = Object.keys(data[0] || {});
      
      // Upload to backend for validation
      const formData = new FormData();
      formData.append('file', file);

      const uploadResponse = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });

      if (!uploadResponse.ok) {
        const errorData = await uploadResponse.json();
        throw new Error(errorData.error || 'Failed to upload file');
      }

      const uploadResult: UploadResponse = await uploadResponse.json();

      setPreview({
        headers: headers,
        rowCount: data.length,
        previewData: data.slice(0, 100)
      });

      setProgress(prev => ({ 
        ...prev, 
        status: 'idle',
        totalRecords: data.length 
      }));

      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload file');
      return false;
    } finally {
      setIsProcessing(false);
    }
  };

  const processImport = async (file: File) => {
    try {
      setError(null);
      setIsProcessing(true);
      setProgress(prev => ({ 
        ...prev, 
        status: 'processing',
        currentBatch: 1,
        totalBatches: Math.ceil(preview?.rowCount || 0 / 20)
      }));

      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/import', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to process import');
      }

      const importResult: ImportResult = await response.json();

      setResult(importResult);
      setProgress(prev => ({ 
        ...prev, 
        status: 'complete',
        recordsProcessed: importResult.totalImported + importResult.totalSkipped
      }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process import');
      setProgress(prev => ({ ...prev, status: 'error' }));
    } finally {
      setIsProcessing(false);
    }
  };

  const reset = () => {
    setPreview(null);
    setResult(null);
    setProgress({
      currentBatch: 0,
      totalBatches: 0,
      recordsProcessed: 0,
      totalRecords: 0,
      status: 'idle'
    });
    setError(null);
    setIsProcessing(false);
  };

  return {
    preview,
    result,
    progress,
    error,
    isProcessing,
    uploadFile,
    processImport,
    reset
  };
}