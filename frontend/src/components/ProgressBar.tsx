'use client';

import React from 'react';
import * as Progress from '@radix-ui/react-progress';
import { Loader2 } from 'lucide-react';

interface ProgressBarProps {
  currentBatch: number;
  totalBatches: number;
  recordsProcessed: number;
  totalRecords: number;
  status: 'idle' | 'uploading' | 'processing' | 'complete' | 'error';
  error?: string;
}

export function ProgressBar({
  currentBatch,
  totalBatches,
  recordsProcessed,
  totalRecords,
  status,
  error
}: ProgressBarProps) {
  const progress = totalRecords > 0 ? (recordsProcessed / totalRecords) * 100 : 0;
  const isProcessing = status === 'uploading' || status === 'processing';

  return (
    <div className="w-full max-w-2xl mx-auto space-y-4">
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-2">
          {isProcessing && <Loader2 className="w-4 h-4 animate-spin" />}
          <span className="font-medium">
            {status === 'uploading' && 'Uploading file...'}
            {status === 'processing' && 'Processing with AI...'}
            {status === 'complete' && '✅ Complete!'}
            {status === 'error' && '❌ Error'}
          </span>
        </div>
        <span className="text-muted-foreground">
          {status === 'processing' && `${currentBatch}/${totalBatches} batches`}
          {status === 'processing' && ` • ${recordsProcessed}/${totalRecords} records`}
          {status === 'complete' && 'All done!'}
        </span>
      </div>

      <Progress.Root
        className="h-2 w-full bg-secondary rounded-full overflow-hidden"
        value={progress}
      >
        <Progress.Indicator
          className={`
            h-full transition-all duration-500 ease-in-out
            ${status === 'error' ? 'bg-destructive' : 'bg-primary'}
          `}
          style={{ width: `${Math.min(progress, 100)}%` }}
        />
      </Progress.Root>

      {error && (
        <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
          {error}
        </div>
      )}
    </div>
  );
}