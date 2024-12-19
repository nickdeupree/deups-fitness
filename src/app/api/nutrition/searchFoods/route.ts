import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import Papa from 'papaparse';

export async function GET(request: NextRequest) {
    // Extract query parameters
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query')?.toLowerCase();

    if (!query) {
        return NextResponse.json({ error: 'Missing query parameter' }, { status: 400 });
    }

    // Load and parse the CSV file
    const csvPath = path.join(process.cwd(), 'public', 'nutrition.csv');
    const file = fs.readFileSync(csvPath, 'utf8');
    const parsed = Papa.parse(file, { header: true, skipEmptyLines: true });
    const data = parsed.data as any[];

    // Filter results based on the query
    const queryWords = query.split(' ');
    const results = data.filter(item => {
      const itemName = item.name?.toLowerCase() || '';
      return queryWords.every(word => itemName.includes(word));
    });

    return NextResponse.json(results);
}
