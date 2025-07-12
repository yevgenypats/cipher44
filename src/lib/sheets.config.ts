export const GOOGLE_SHEETS_CONFIG = {
  // The ID of your Google Spreadsheet
  // spreadsheetId: process.env.GOOGLE_SPREADSHEET_ID || '',
  
  // Google Service Account credentials
  client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || '',
  private_key: (process.env.GOOGLE_PRIVATE_KEY || '').replace(/\\n/g, '\n'),
  
  // The name of the sheet where we'll store prompts
  // sheetName: 'Prompts'
}; 