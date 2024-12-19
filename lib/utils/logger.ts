import winston from 'winston';
import { Logtail } from '@logtail/node';
import { LogtailTransport } from '@logtail/winston';

const logtail = new Logtail(process.env.LOGTAIL_SOURCE_TOKEN!);

export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  defaultMeta: { service: 'chat-service' },
  transports: [
    new winston.transports.Console({
      format: winston.format.simple(),
    }),
    new LogtailTransport(logtail),
    new winston.transports.File({ 
      filename: 'logs/error.log', 
      level: 'error' 
    }),
    new winston.transports.File({ 
      filename: 'logs/combined.log' 
    }),
  ],
});

// Create a performance monitoring wrapper
export function monitorPerformance<T>(
  operation: () => Promise<T>,
  operationName: string
): Promise<T> {
  const startTime = performance.now();
  
  return operation()
    .then((result) => {
      const duration = performance.now() - startTime;
      logger.info({
        message: `Operation completed`,
        operation: operationName,
        duration,
        success: true,
      });
      return result;
    })
    .catch((error) => {
      const duration = performance.now() - startTime;
      logger.error({
        message: `Operation failed`,
        operation: operationName,
        duration,
        error: error.message,
        stack: error.stack,
      });
      throw error;
    });
} 