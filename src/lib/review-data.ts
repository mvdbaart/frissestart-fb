
import fs from 'fs/promises';
import path from 'path';
import type { Review } from '@/types/reviews';
import { unstable_noStore as noStore } from 'next/cache';

export async function getReviewsData(): Promise<Review[]> {
  noStore(); // Zorgt ervoor dat deze data niet statisch wordt gecached bij de build.
  try {
    const filePath = path.join(process.cwd(), 'reviews_20250530_115234.json');
    const jsonData = await fs.readFile(filePath, 'utf-8');
    const reviews = JSON.parse(jsonData) as Review[];
    // Sorteer reviews op datum, nieuwste eerst
    return reviews.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  } catch (error) {
    console.error("Failed to read or parse reviews.json:", error);
    return []; // Geef een lege array terug bij een fout
  }
}
