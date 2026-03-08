import { environment } from "../environments/environment";

export function isFileSizeValid(file: File): boolean {
  const maxSizeMB = environment.MAX_FILE_SIZE_MB;
  const maxSizeBytes = maxSizeMB * 1024 * 1024;

  return file.size <= maxSizeBytes;
}
