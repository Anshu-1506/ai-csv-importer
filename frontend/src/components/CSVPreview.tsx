'use client';

import React, { useMemo, useState } from 'react';
import { FixedSizeGrid as Grid } from 'react-window';
import { ChevronDown, ChevronUp, Table } from 'lucide-react';

interface CSVPreviewProps {
  data: any[];
  headers: string[];
  rowCount: number;
  onImport: () => void;
  isProcessing?: boolean;
}

export function CSVPreview({ data, headers, rowCount, onImport, isProcessing = false }: CSVPreviewProps) {
  const [showAllColumns, setShowAllColumns] = useState(false);
  const previewData = useMemo(() => data.slice(0, 100), [data]);

  const displayedHeaders = showAllColumns ? headers : headers.slice(0, 8);

  const getCellValue = (row: any, header: string) => {
    const value = row[header];
    if (value === undefined || value === null) return '-';
    if (typeof value === 'string' && value.length > 50) {
      return value.slice(0, 50) + '...';
    }
    return String(value);
  };

  const Cell = ({ columnIndex, rowIndex, style }: any) => {
    const header = displayedHeaders[columnIndex];
    const row = previewData[rowIndex];
    const value = getCellValue(row, header);
    
    return (
      <div
        style={style}
        className="border-r border-b border-border px-3 py-2 text-sm truncate"
      >
        {value}
      </div>
    );
  };

  const HeaderCell = ({ columnIndex, style }: any) => {
    const header = displayedHeaders[columnIndex];
    return (
      <div
        style={style}
        className="sticky top-0 z-10 bg-secondary border-r border-b border-border px-3 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wider"
      >
        {header}
      </div>
    );
  };

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-secondary rounded-lg">
            <Table className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium">{rowCount} rows</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-secondary rounded-lg">
            <span className="text-sm font-medium">{headers.length} columns</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {headers.length > 8 && (
            <button
              onClick={() => setShowAllColumns(!showAllColumns)}
              className="flex items-center gap-1 px-3 py-1.5 text-sm bg-secondary rounded-lg hover:bg-secondary/80 transition-colors"
            >
              {showAllColumns ? (
                <>
                  <ChevronUp className="w-4 h-4" />
                  Show less
                </>
              ) : (
                <>
                  <ChevronDown className="w-4 h-4" />
                  Show all columns
                </>
              )}
            </button>
          )}
          
          <button
            onClick={onImport}
            disabled={isProcessing}
            className="px-6 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isProcessing ? 'Processing...' : 'Confirm Import'}
          </button>
        </div>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <div className="overflow-auto max-h-[500px]">
          <Grid
            columnCount={displayedHeaders.length}
            columnWidth={180}
            height={400}
            rowCount={Math.min(previewData.length + 1, 101)}
            rowHeight={40}
            width={Math.min(displayedHeaders.length * 180, 1200)}
          >
            {({ columnIndex, rowIndex, style }) => {
              if (rowIndex === 0) {
                return <HeaderCell columnIndex={columnIndex} style={style} />;
              }
              return (
                <Cell
                  columnIndex={columnIndex}
                  rowIndex={rowIndex - 1}
                  style={style}
                />
              );
            }}
          </Grid>
        </div>
      </div>

      {previewData.length < rowCount && (
        <p className="text-sm text-muted-foreground text-center">
          Showing first {previewData.length} of {rowCount} rows
        </p>
      )}
    </div>
  );
}