type LogLevel = 'info' | 'warn' | 'error' | 'debug';

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  data?: any;
  userId?: string;
  action?: string;
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development';

  private formatMessage(level: LogLevel, message: string, data?: any, userId?: string, action?: string): string {
    const timestamp = new Date().toISOString();
    const userInfo = userId ? `[User: ${userId}]` : '';
    const actionInfo = action ? `[Action: ${action}]` : '';
    
    let logMessage = `[${timestamp}] [${level.toUpperCase()}] ${userInfo} ${actionInfo} ${message}`;
    
    if (data && this.isDevelopment) {
      logMessage += `\nData: ${JSON.stringify(data, null, 2)}`;
    }
    
    return logMessage;
  }

  private log(level: LogLevel, message: string, data?: any, userId?: string, action?: string): void {
    const formattedMessage = this.formatMessage(level, message, data, userId, action);
    
    switch (level) {
      case 'error':
        console.error(formattedMessage);
        break;
      case 'warn':
        console.warn(formattedMessage);
        break;
      case 'debug':
        if (this.isDevelopment) {
          console.debug(formattedMessage);
        }
        break;
      default:
        console.log(formattedMessage);
    }
  }

  info(message: string, data?: any, userId?: string, action?: string): void {
    this.log('info', message, data, userId, action);
  }

  warn(message: string, data?: any, userId?: string, action?: string): void {
    this.log('warn', message, data, userId, action);
  }

  error(message: string, data?: any, userId?: string, action?: string): void {
    this.log('error', message, data, userId, action);
  }

  debug(message: string, data?: any, userId?: string, action?: string): void {
    this.log('debug', message, data, userId, action);
  }

  // Auth specific logging
  auth = {
    loginAttempt: (email: string, success: boolean, reason?: string) => {
      this.info(
        `Login attempt: ${success ? 'SUCCESS' : 'FAILED'}`,
        { email, success, reason },
        undefined,
        'LOGIN'
      );
    },
    
    registerAttempt: (email: string, success: boolean, reason?: string) => {
      this.info(
        `Register attempt: ${success ? 'SUCCESS' : 'FAILED'}`,
        { email, success, reason },
        undefined,
        'REGISTER'
      );
    },
    
    logout: (userId: string) => {
      this.info('User logged out', undefined, userId, 'LOGOUT');
    }
  };

  // API specific logging
  api = {
    request: (method: string, path: string, userId?: string) => {
      this.debug(`API Request: ${method} ${path}`, undefined, userId, 'API_REQUEST');
    },
    
    response: (method: string, path: string, status: number, duration?: number, userId?: string) => {
      this.info(
        `API Response: ${method} ${path} - ${status}`,
        { status, duration: duration ? `${duration}ms` : undefined },
        userId,
        'API_RESPONSE'
      );
    },
    
    error: (method: string, path: string, error: any, userId?: string) => {
      this.error(
        `API Error: ${method} ${path}`,
        { error: error.message || error },
        userId,
        'API_ERROR'
      );
    }
  };

  // Database specific logging
  db = {
    connect: (success: boolean, error?: any) => {
      if (success) {
        this.info('Database connection established');
      } else {
        this.error('Database connection failed', { error: error.message || error });
      }
    },
    
    query: (operation: string, collection: string, duration?: number, userId?: string) => {
      this.debug(
        `DB Query: ${operation} on ${collection}`,
        { duration: duration ? `${duration}ms` : undefined },
        userId,
        'DB_QUERY'
      );
    }
  };
}

// Singleton instance
export const logger = new Logger();

// Helper function for timing operations
export function timeOperation<T>(operation: () => Promise<T>, operationName: string): Promise<T> {
  const start = Date.now();
  return operation().then(
    (result) => {
      const duration = Date.now() - start;
      logger.debug(`Operation completed: ${operationName}`, { duration: `${duration}ms` });
      return result;
    },
    (error) => {
      const duration = Date.now() - start;
      logger.error(`Operation failed: ${operationName}`, { error: error.message || error, duration: `${duration}ms` });
      throw error;
    }
  );
}
