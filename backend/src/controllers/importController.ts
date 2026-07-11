import { Request, Response } from 'express';
import { ImportService } from '../services/importService';

let importService: ImportService | null = null;

function getImportService(): ImportService {
  if (!importService) {
    const apiKey = process.env.OPENROUTER_API_KEY;
    
    console.log('🚀 Initializing ImportService...');
    console.log('🔑 API Key exists:', !!apiKey);
    console.log('🔑 API Key starts with:', apiKey?.substring(0, 10));
    
    if (!apiKey) {
      throw new Error('OPENROUTER_API_KEY must be set in .env');
    }
    
    importService = new ImportService(apiKey);
    console.log('✅ ImportService initialized successfully');
  }
  return importService;
}

export const uploadCSV = async (req: Request, res: Response): Promise<void> => {
  try {
    const service = getImportService();

    if (!req.file) {
      res.status(400).json({ error: 'No file uploaded' });
      return;
    }

    const validation = await service.validateAndProcessCSV(req.file.buffer);
    
    res.json({
      success: true,
      headers: validation.headers,
      rowCount: validation.rowCount,
      message: 'CSV uploaded and validated successfully'
    });
    return;
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to process CSV upload'
    });
    return;
  }
};

export const processImport = async (req: Request, res: Response): Promise<void> => {
  try {
    const service = getImportService();

    if (!req.file) {
      res.status(400).json({ error: 'No file uploaded' });
      return;
    }

    const result = await service.processImport(req.file.buffer);
    
    res.json(result);
    return;
  } catch (error) {
    console.error('Import error:', error);
    
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to process import'
    });
    return;
  }
};