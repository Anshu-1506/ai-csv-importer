'use client';

import React, { useState } from 'react';
import { CSVUploader } from '@/components/CSVUploader';
import { CSVPreview } from '@/components/CSVPreview';
import { ImportResults } from '@/components/ImportResults';
import { ProgressBar } from '@/components/ProgressBar';
import { DarkModeToggle } from '@/components/DarkModeToggle';
import { useCSVImport } from '@/hooks/useCSVImport';
import { Upload, Sparkles, Database } from 'lucide-react';

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const {
    preview,
    result,
    progress,
    error,
    isProcessing,
    uploadFile,
    processImport,
    reset
  } = useCSVImport();

  const handleFileUpload = async (uploadedFile: File) => {
    setFile(uploadedFile);
    setShowPreview(false);
    setShowResults(false);
    
    const success = await uploadFile(uploadedFile);
    if (success) {
      setShowPreview(true);
    }
  };

  const handleImport = async () => {
    if (!file) return;
    setShowPreview(false);
    await processImport(file);
    setShowResults(true);
  };

  const handleReset = () => {
    reset();
    setFile(null);
    setShowPreview(false);
    setShowResults(false);
  };

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Sparkles className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-bold">AI CSV Importer</h1>
              <p className="text-xs text-muted-foreground">Intelligent field mapping</p>
            </div>
          </div>
          <DarkModeToggle />
        </div>
      </header>

      {/* Main Content */}
      <div className="container max-w-7xl mx-auto px-4 py-8">
        {!showPreview && !showResults && !isProcessing && (
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-3">Upload Your CSV</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our AI will automatically understand your column structure and map it to the CRM format
            </p>
          </div>
        )}

        {!showPreview && !showResults && (
          <CSVUploader onFileUpload={handleFileUpload} isProcessing={isProcessing} />
        )}

        {isProcessing && (
          <div className="mt-8">
            <ProgressBar
              currentBatch={progress.currentBatch}
              totalBatches={progress.totalBatches}
              recordsProcessed={progress.recordsProcessed}
              totalRecords={progress.totalRecords}
              status={progress.status}
              error={error || undefined}
            />
          </div>
        )}

        {showPreview && preview && !isProcessing && (
          <div className="mt-8">
            <CSVPreview
              data={preview.previewData || []}
              headers={preview.headers}
              rowCount={preview.rowCount}
              onImport={handleImport}
              isProcessing={isProcessing}
            />
          </div>
        )}

        {showResults && result && (
          <div className="mt-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Import Results</h2>
              <div className="flex gap-3">
                <button
                  onClick={handleReset}
                  className="px-4 py-2 text-sm bg-secondary rounded-lg hover:bg-secondary/80 transition-colors"
                >
                  Import Another File
                </button>
              </div>
            </div>
            <ImportResults
              totalImported={result.totalImported}
              totalSkipped={result.totalSkipped}
              records={result.records}
              processingTime={result.processingTime}
            />
          </div>
        )}

        {error && !showResults && (
          <div className="mt-4 p-4 rounded-lg bg-destructive/10 text-destructive text-center">
            {error}
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="border-t border-border mt-12">
        <div className="container max-w-7xl mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
          Powered by OpenRouter AI • Intelligent CSV Import
        </div>
      </footer>
    </main>
  );
}