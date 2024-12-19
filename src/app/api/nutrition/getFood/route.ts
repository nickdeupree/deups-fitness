// src/app/api/nutrition/getFood/route.ts
import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import Papa from 'papaparse';

export async function GET(request: NextRequest) {
    // Extract the 'name' query parameter
    const { searchParams } = new URL(request.url);
    const name = searchParams.get('name')?.toLowerCase();

    if (!name) {
        return NextResponse.json({ error: 'Missing name parameter' }, { status: 400 });
    }

    // Load and parse the CSV file
    const csvPath = path.join(process.cwd(), 'public', 'nutrition.csv');
    const file = fs.readFileSync(csvPath, 'utf8');
    const parsed = Papa.parse(file, { header: true, skipEmptyLines: true });
    const data = parsed.data as any[];

    // Find the food item by exact name match
    const foodItem = data.find(item => item.name?.toLowerCase() === name);

    if (!foodItem) {
        return NextResponse.json({ error: 'Food not found' }, { status: 404 });
    }

    return NextResponse.json(foodItem);
}
