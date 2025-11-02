import { v4 as uuidv4 } from 'uuid';

// Generate request ID for tracing
export function generateRequestId(): string {
  return uuidv4();
}

// Structured log entry
export interface LogEntry {
  requestId: string;
  userId?: string;
  endpoint: string;
  method: string;
  status: number;
  timestamp: string;
  message?: string;
  error?: string;
}

// Logger utility
export class Logger {
  private requestId: string;

  constructor(requestId?: string) {
    this.requestId = requestId || generateRequestId();
  }

  log(entry: Partial<LogEntry>): void {
    const logEntry: LogEntry = {
      requestId: this.requestId,
      timestamp: new Date().toISOString(),
      ...entry,
    } as LogEntry;

    // In production, send to structured logging service
    // For MVP, console.log is sufficient
    console.log(JSON.stringify(logEntry));
  }

  error(message: string, error?: Error): void {
    this.log({
      error: error?.message || message,
      message: error?.stack || message,
    });
  }

  getRequestId(): string {
    return this.requestId;
  }
}

// Create logger instance
export function createLogger(requestId?: string): Logger {
  return new Logger(requestId);
}

