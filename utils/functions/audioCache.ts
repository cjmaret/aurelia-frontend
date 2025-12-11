import * as FileSystem from 'expo-file-system';
import api from '@/lib/api';

const CACHE_DIR = `${FileSystem.cacheDirectory}tts/`;
const MAX_CACHE_SIZE_MB = 50;

function hashText(text: string): string {
  return text
    .split('')
    .reduce((hash, char) => {
      return ((hash << 5) - hash) + char.charCodeAt(0);
    }, 0)
    .toString();
}

async function ensureCacheDirectory(): Promise<void> {
  const dirInfo = await FileSystem.getInfoAsync(CACHE_DIR);
  if (!dirInfo.exists) {
    await FileSystem.makeDirectoryAsync(CACHE_DIR, { intermediates: true });
  }
}

async function getCacheSize(): Promise<number> {
  try {
    const dirInfo = await FileSystem.getInfoAsync(CACHE_DIR);
    if (!dirInfo.exists) {
      return 0;
    }

    const files = await FileSystem.readDirectoryAsync(CACHE_DIR);
    let totalSize = 0;

    for (const file of files) {
      const fileInfo = await FileSystem.getInfoAsync(`${CACHE_DIR}${file}`);
      if (fileInfo.exists && 'size' in fileInfo) {
        totalSize += fileInfo.size || 0;
      }
    }

    return totalSize;
  } catch (error) {
    console.error('Error calculating cache size:', error);
    return 0;
  }
}

export async function getAudioForText(text: string): Promise<string> {
  const textHash = hashText(text);
  const cachedFilePath = `${CACHE_DIR}${textHash}.mp3`;

  try {
    const fileInfo = await FileSystem.getInfoAsync(cachedFilePath);
    if (fileInfo.exists) {
      console.log('Using cached audio file:', cachedFilePath);
      return cachedFilePath;
    }

    await ensureCacheDirectory();

    const blob = await api.textToSpeech({ text });
    
    const base64String = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUrl = reader.result as string;
        const base64 = dataUrl.split(',')[1];
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
    
    await FileSystem.writeAsStringAsync(cachedFilePath, base64String, {
      encoding: FileSystem.EncodingType.Base64,
    });

    console.log('Cached audio file:', cachedFilePath);
    return cachedFilePath;
  } catch (error) {
    console.error('Error getting audio for text:', error);
    throw error;
  }
}

export async function clearCachedAudio(text: string): Promise<void> {
  const textHash = hashText(text);
  const cachedFilePath = `${CACHE_DIR}${textHash}.mp3`;

  try {
    const fileInfo = await FileSystem.getInfoAsync(cachedFilePath);
    if (fileInfo.exists) {
      await FileSystem.deleteAsync(cachedFilePath, { idempotent: true });
      console.log('Deleted cached audio:', cachedFilePath);
    }
  } catch (error) {
    console.error('Error clearing cached audio:', error);
  }
}

export async function clearAllCachedAudio(): Promise<void> {
  try {
    const dirInfo = await FileSystem.getInfoAsync(CACHE_DIR);
    if (dirInfo.exists) {
      await FileSystem.deleteAsync(CACHE_DIR, { idempotent: true });
      console.log('Audio cache cleared');
    }
  } catch (error) {
    console.error('Error clearing audio cache:', error);
  }
}

export async function cleanupOldCacheFiles(): Promise<void> {
  try {
    const cacheSizeBytes = await getCacheSize();
    const maxSizeBytes = MAX_CACHE_SIZE_MB * 1024 * 1024;

    if (cacheSizeBytes <= maxSizeBytes) {
      return;
    }

    const dirInfo = await FileSystem.getInfoAsync(CACHE_DIR);
    if (!dirInfo.exists) {
      return;
    }

    const files = await FileSystem.readDirectoryAsync(CACHE_DIR);
    const fileInfos = await Promise.all(
      files.map(async (file) => {
        const fullPath = `${CACHE_DIR}${file}`;
        const info = await FileSystem.getInfoAsync(fullPath);
        return {
          path: fullPath,
          modificationTime: info.exists && 'modificationTime' in info ? info.modificationTime || 0 : 0,
          size: info.exists && 'size' in info ? info.size || 0 : 0,
        };
      })
    );

    fileInfos.sort((a, b) => a.modificationTime - b.modificationTime);

    let currentSize = cacheSizeBytes;
    for (const fileInfo of fileInfos) {
      if (currentSize <= maxSizeBytes) {
        break;
      }

      await FileSystem.deleteAsync(fileInfo.path, { idempotent: true });
      currentSize -= fileInfo.size;
      console.log(`Deleted old cache file: ${fileInfo.path}`);
    }

    console.log(`Cache cleanup complete. New size: ${(currentSize / 1024 / 1024).toFixed(2)}MB`);
  } catch (error) {
    console.error('Error cleaning up cache files:', error);
  }
}

export async function getCacheStats(): Promise<{
  sizeBytes: number;
  sizeMB: number;
  fileCount: number;
}> {
  try {
    const dirInfo = await FileSystem.getInfoAsync(CACHE_DIR);
    if (!dirInfo.exists) {
      return { sizeBytes: 0, sizeMB: 0, fileCount: 0 };
    }

    const files = await FileSystem.readDirectoryAsync(CACHE_DIR);
    const sizeBytes = await getCacheSize();

    return {
      sizeBytes,
      sizeMB: parseFloat((sizeBytes / 1024 / 1024).toFixed(2)),
      fileCount: files.length,
    };
  } catch (error) {
    console.error('Error getting cache stats:', error);
    return { sizeBytes: 0, sizeMB: 0, fileCount: 0 };
  }
}
