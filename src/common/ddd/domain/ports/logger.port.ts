export const ApplicationLoggerSymbol = Symbol('ApplicationLogger');
export interface LoggerPort {
  log(message: string, params?: Record<string, unknown>): void;
  error(message: string, error?: Error | Record<string, unknown>): void;
  warn(message: string, params?: Record<string, unknown>): void;
  debug(message: string, params?: Record<string, unknown>): void;
  verbose(message: string, params?: Record<string, unknown>): void;
}

export interface LoggerWithContextPort extends LoggerPort {
  info(message: string, params?: Record<string, unknown>): void;
  setContext(contextName: string): LoggerWithContextPort;
  getContext(): string;
  getApplicationName(): string;
}
