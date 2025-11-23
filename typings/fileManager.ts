export interface FileManagerConfig {
  enableCache?: boolean;
  enableMonitoring?: boolean;
  enableBackup?: boolean;
  maxCacheSize?: number;
  autoRecovery?: boolean;
  chunkSize?: number;
  retryAttempts?: number;
  timeout?: number;
  maxBackups?: number;
}

export interface FileOperation {
  id: string;
  type: string;
  startTime: number;
}

export interface CacheEntry {
  content: string;
  timestamp: number;
  size: number;
}

export interface BackupEntry {
  id: string;
  path: string;
  content: string;
  operation: string;
  timestamp: number;
  size: number;
}

export interface FileInfo {
  path: string;
  name: string;
  extension: string;
  size: number;
  modified: number;
  isFile: boolean;
  isDirectory: boolean;
  permissions: string;
}

export interface DirectoryItem {
  name: string;
  path: string;
  isFile: boolean;
  isDirectory: boolean;
  size: number;
  modified: number;
}

export interface SearchResult {
  file: string;
  path: string;
  matches: number;
  preview: string;
}

export interface OperationResult<T = any> {
  success: boolean;
  data: T;
  metadata: {
    timestamp: number;
    [key: string]: any;
  }
}

export interface Metrics {
  operations: {
    read: number;
    write: number;
    delete: number;
    create: number;
    [key: string]: number;
  };
  performance: {
    averageReadTime: number;
    averageWriteTime: number;
    totalBytesRead: number;
    totalBytesWritten: number;
  };
  errors: {
    total: number;
    byType: { [key: string]: number };
  };
}

export interface CacheStats {
  size: number;
  hits: number;
  misses: number;
  hitRate: number;
}