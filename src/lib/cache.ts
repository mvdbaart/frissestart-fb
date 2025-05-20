
import fs from 'fs/promises';
import path from 'path';

// Create a .custom_cache directory in the project root if it doesn't exist.
// Note: For serverless deployments, this directory might be read-only or ephemeral.
const CACHE_DIR = path.join(process.cwd(), '.custom_cache');
const EXPIRATION_TIME_MS = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

interface CacheEntry<T> {
  timestamp: number;
  data: T;
}

async function ensureCacheDirExists() {
  try {
    await fs.access(CACHE_DIR);
  } catch {
    try {
      await fs.mkdir(CACHE_DIR, { recursive: true });
    } catch (mkdirError) {
      console.error(`[Cache] Failed to create cache directory ${CACHE_DIR}:`, mkdirError);
      // Depending on the strategy, you might want to throw this error
      // or allow the application to continue without caching.
    }
  }
}

function getCacheFilePath(fileName: string): string {
  // Basic sanitization to create a safe file name
  const safeFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_') + '.json';
  return path.join(CACHE_DIR, safeFileName);
}

async function readFromCache<T>(fileName: string): Promise<T | null> {
  await ensureCacheDirExists();
  const filePath = getCacheFilePath(fileName);
  try {
    const fileContent = await fs.readFile(filePath, 'utf-8');
    const entry: CacheEntry<T> = JSON.parse(fileContent);

    if (Date.now() - entry.timestamp < EXPIRATION_TIME_MS) {
      console.log(`[Cache] HIT for ${fileName}`);
      return entry.data;
    }
    console.log(`[Cache] STALE for ${fileName}`);
    // Optionally, delete stale cache file here
    // await fs.unlink(filePath).catch(err => console.error(`[Cache] Failed to delete stale cache for ${fileName}:`, err));
    return null;
  } catch (error) {
    // Cache miss or error reading/parsing file
    console.log(`[Cache] MISS or ERROR reading cache for ${fileName}`);
    return null;
  }
}

async function writeToCache<T>(fileName: string, data: T): Promise<void> {
  await ensureCacheDirExists();
  const filePath = getCacheFilePath(fileName);
  const entry: CacheEntry<T> = {
    timestamp: Date.now(),
    data,
  };
  try {
    await fs.writeFile(filePath, JSON.stringify(entry, null, 2), 'utf-8');
    console.log(`[Cache] WROTE for ${fileName}`);
  } catch (error) {
    console.error(`[Cache] FAILED TO WRITE cache for ${fileName}:`, error);
  }
}

export async function fetchAndCache<T>(
  url: string,
  cacheKey: string, // Use an explicit cacheKey for the file name
): Promise<T[]> { // Assuming the API always returns an array of T
  const cachedData = await readFromCache<T[]>(cacheKey);
  if (cachedData) {
    return cachedData;
  }

  console.log(`[Cache] FETCHING for ${cacheKey} from ${url}`);
  try {
    // Use { cache: 'no-store' } to ensure Next.js's fetch cache doesn't interfere
    // with this manual file caching if this code runs in an environment where
    // Next.js fetch caching is active (e.g., server components by default).
    const response = await fetch(url, { cache: 'no-store' }); 
    if (!response.ok) {
      console.error(`[API Fetch] Failed to fetch ${url}: ${response.statusText} (${response.status})`);
      // Return empty array or throw error based on desired error handling
      return []; 
    }
    const data = await response.json() as T[];
    if (data) { // Ensure data is not null/undefined before caching
        await writeToCache<T[]>(cacheKey, data);
    }
    return data || []; // Return data or empty array if data is nullish
  } catch (error) {
    console.error(`[API Fetch] Error fetching ${url}:`, error);
    return []; // Return empty array on fetch error
  }
}
