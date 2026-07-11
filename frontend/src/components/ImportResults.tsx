'use client';

import React, { useState } from 'react';
import { CheckCircle, XCircle, Clock, Users, ChevronDown, ChevronUp } from 'lucide-react';
import { CRMRecord } from '@/types';

interface ImportResultsProps {
  totalImported: number;
  totalSkipped: number;
  records: CRMRecord[];
  processingTime?: number;
}

export function ImportResults({ totalImported, totalSkipped, records, processingTime }: ImportResultsProps) {
  const [showAll, setShowAll] = useState(false);
  
  const stats = [
    {
      label: 'Total Records',
      value: totalImported + totalSkipped,
      icon: Users,
      color: 'text-blue-500 bg-blue-500/10'
    },
    {
      label: 'Imported',
      value: totalImported,
      icon: CheckCircle,
      color: 'text-green-500 bg-green-500/10'
    },
    {
      label: 'Skipped',
      value: totalSkipped,
      icon: XCircle,
      color: 'text-red-500 bg-red-500/10'
    },
    ...(processingTime ? [{
      label: 'Processing Time',
      value: `${(processingTime / 1000).toFixed(1)}s`,
      icon: Clock,
      color: 'text-purple-500 bg-purple-500/10'
    }] : [])
  ];

  const displayRecords = showAll ? records : records.slice(0, 10);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-card rounded-lg p-4 border border-border"
          >
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${stat.color}`}>
                <stat.icon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className="text-2xl font-semibold">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {records.length > 0 && (
        <div className="border rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-secondary sticky top-0">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">#</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Name</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Email</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Mobile</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Company</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">City</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {displayRecords.map((record, index) => (
                  <tr key={index} className="hover:bg-secondary/50 transition-colors">
                    <td className="px-4 py-3 text-sm text-muted-foreground">{index + 1}</td>
                    <td className="px-4 py-3 text-sm">{record.name || '-'}</td>
                    <td className="px-4 py-3 text-sm">{record.email || '-'}</td>
                    <td className="px-4 py-3 text-sm">{record.mobile_without_country_code || '-'}</td>
                    <td className="px-4 py-3 text-sm">{record.company || '-'}</td>
                    <td className="px-4 py-3 text-sm">{record.city || '-'}</td>
                    <td className="px-4 py-3 text-sm">
                      <span className={`
                        inline-flex px-2 py-1 rounded-full text-xs font-medium
                        ${record.crm_status === 'GOOD_LEAD_FOLLOW_UP' ? 'bg-green-500/10 text-green-500' : ''}
                        ${record.crm_status === 'DID_NOT_CONNECT' ? 'bg-yellow-500/10 text-yellow-500' : ''}
                        ${record.crm_status === 'BAD_LEAD' ? 'bg-red-500/10 text-red-500' : ''}
                        ${record.crm_status === 'SALE_DONE' ? 'bg-purple-500/10 text-purple-500' : ''}
                      `}>
                        {record.crm_status.replace(/_/g, ' ')}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="px-4 py-3 border-t border-border bg-secondary/30 flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              Showing {displayRecords.length} of {records.length} records
            </span>
            
            {records.length > 10 && (
              <button
                onClick={() => setShowAll(!showAll)}
                className="flex items-center gap-1 px-3 py-1.5 text-sm bg-primary/10 hover:bg-primary/20 text-primary rounded-lg transition-colors"
              >
                {showAll ? (
                  <>
                    <ChevronUp className="w-4 h-4" />
                    Show Less
                  </>
                ) : (
                  <>
                    <ChevronDown className="w-4 h-4" />
                    Show All ({records.length} records)
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}