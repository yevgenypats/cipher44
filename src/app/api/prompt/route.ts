import { GoogleSpreadsheet } from 'google-spreadsheet';
import { GOOGLE_SHEETS_CONFIG } from '@/lib/sheets.config';
import { NextResponse } from 'next/server';
import { JWT } from 'google-auth-library';

export async function POST(request: Request) {
  try {
    const { prompt } = await request.json();

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    // Create JWT client
    const serviceAccountAuth = new JWT({
      email: GOOGLE_SHEETS_CONFIG.client_email,
      key: GOOGLE_SHEETS_CONFIG.private_key,
      scopes: [
        'https://www.googleapis.com/auth/spreadsheets',
      ],
    });

    // Initialize the Google Spreadsheet
    const doc = new GoogleSpreadsheet('1LUGZCGU_V8EeGP5VaxSoWKsUzoyMVeje_IdD1blPUoE', serviceAccountAuth);
    
    // Load the document
    await doc.loadInfo();

    // Get the sheet or create it if it doesn't exist
    let sheet = doc.sheetsByTitle['Sheet1'];
    // if (!sheet) {
    //   sheet = await doc.addSheet({ 
    //     title: GOOGLE_SHEETS_CONFIG.sheetName,
    //     headerValues: ['Timestamp', 'Prompt']
    //   });
    // }

    // Add the new row
    await sheet.addRow({
      Timestamp: new Date().toISOString(),
      Prompt: prompt
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving prompt:', error);
    return NextResponse.json(
      { error: 'Failed to save prompt' },
      { status: 500 }
    );
  }
} 