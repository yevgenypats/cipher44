import { GoogleSpreadsheet } from 'google-spreadsheet';
import { GOOGLE_SHEETS_CONFIG } from '@/lib/sheets.config';
import { NextResponse } from 'next/server';
import { JWT } from 'google-auth-library';

export async function POST(request: Request) {
  try {
    const { prompt, userId, email, type } = await request.json();

    // Validate required fields based on type
    if (type === 'prompt' && !prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    if (type === 'waitlist' && !email) {
      return NextResponse.json(
        { error: 'Email is required' },
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
    const sheet = doc.sheetsByTitle['Sheet1'];

    // Add the new row
    await sheet.addRow({
      Timestamp: new Date().toISOString(),
      UserId: userId || 'unknown',
      Type: type,
      Email: email || '',
      Prompt: prompt || ''
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving data:', error);
    return NextResponse.json(
      { error: 'Failed to save data' },
      { status: 500 }
    );
  }
} 