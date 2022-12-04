import childProcess from 'child_process';
import { SystemLoggerService } from '@cross-cutting-concerns/system-logger';

export class BaseChildProcessProcedure {
  constructor() {
    this.logger = new SystemLoggerService();
  }

  protected readonly logger: SystemLoggerService;

  private streamCallbackForLogs(
    internalLogger: SystemLoggerService,
  ): (chunk: string) => void {
    return (chunk: string): void => {
      internalLogger.info(chunk);
    };
  }

  protected async execShellCommand(shellCommand: string): Promise<void> {
    await new Promise((resolve, reject) => {
      const execCommand = childProcess.exec(
        shellCommand,
        { env: process.env },
        (err) => {
          if (err) {
            this.logger.error('Error when execute shell command!', { err });

            return reject(err);
          }

          resolve(true);
        },
      );

      execCommand.stdout.on('data', this.streamCallbackForLogs(this.logger));
      execCommand.stderr.on('data', this.streamCallbackForLogs(this.logger));
    });
  }
}
