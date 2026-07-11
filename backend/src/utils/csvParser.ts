// @ts-ignore
const Papa = require('papaparse');

export const parseCSV = (buffer: Buffer): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    const csvString = buffer.toString('utf-8');
    
    Papa.parse(csvString, {
      header: true,
      skipEmptyLines: true,
      trimHeaders: true,
      transformHeader: (header: string) => header.trim(),
      complete: (results: any) => {
        if (results.errors.length > 0) {
          console.error('CSV parsing errors:', results.errors);
          reject(new Error(`CSV parsing error: ${results.errors[0].message}`));
        } else {
          const data = results.data.filter((row: any) => 
            Object.values(row).some((value) => value !== '' && value !== undefined && value !== null)
          );
          resolve(data);
        }
      },
      error: (error: Error) => {
        reject(error);
      }
    });
  });
};