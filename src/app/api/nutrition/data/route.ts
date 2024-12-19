import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';
import Papa from 'papaparse';
import { FoodItem } from '../../../types/nutrition';

let cachedData: FoodItem[] | null = null;

function loadData(): FoodItem[] {
  if (cachedData) {
    return cachedData;
  }
  const csvPath = path.join(process.cwd(), 'public', 'nutrition.csv');
  const file = fs.readFileSync(csvPath, 'utf8');
  const parsed = Papa.parse<FoodItem>(file, { header: true });
  cachedData = parsed.data;
  return cachedData;
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json({ success: true });
}

export { loadData };
