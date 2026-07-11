export interface CRMRecord {
  created_at: string;
  name: string;
  email: string;
  country_code: string;
  mobile_without_country_code: string;
  company: string;
  city: string;
  state: string;
  country: string;
  lead_owner: string;
  crm_status: string;
  crm_note: string;
  data_source: string;
  possession_time: string;
  description: string;
}

export interface ImportResult {
  success: boolean;
  totalImported: number;
  totalSkipped: number;
  records: CRMRecord[];
  processingTime?: number;
}

export interface UploadResponse {
  success: boolean;
  headers: string[];
  rowCount: number;
  message: string;
}

export interface ImportProgress {
  currentBatch: number;
  totalBatches: number;
  recordsProcessed: number;
  totalRecords: number;
  status: 'idle' | 'uploading' | 'processing' | 'complete' | 'error';
}