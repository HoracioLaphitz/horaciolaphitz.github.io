type LogLevel = 'info' | 'warn' | 'error' | 'debug';

interface LogEntry {
    level: LogLevel;
    message: string;
    timestamp: string;
    data?: unknown;
}

class Logger {
    private isDevelopment = import.meta.env.DEV;

    private formatMessage(entry: LogEntry): string {
        return `[${entry.timestamp}] [${entry.level.toUpperCase()}] ${entry.message}`;
    }

    private log(level: LogLevel, message: string, data?: unknown): void {
        const entry: LogEntry = {
            level,
            message,
            timestamp: new Date().toISOString(),
            data,
        };

        if (!this.isDevelopment && level === 'debug') {
            return;
        }

        const formattedMessage = this.formatMessage(entry);

        switch (level) {
            case 'error':
                console.error(formattedMessage, data);
                break;
            case 'warn':
                console.warn(formattedMessage, data);
                break;
            case 'debug':
                console.debug(formattedMessage, data);
                break;
            default:
                console.log(formattedMessage, data);
        }
    }

    info(message: string, data?: unknown): void {
        this.log('info', message, data);
    }

    warn(message: string, data?: unknown): void {
        this.log('warn', message, data);
    }

    error(message: string, data?: unknown): void {
        this.log('error', message, data);
    }

    debug(message: string, data?: unknown): void {
        this.log('debug', message, data);
    }
}

export const logger = new Logger();
