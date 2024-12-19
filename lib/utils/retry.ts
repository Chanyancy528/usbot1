interface RetryOptions {
  retries: number;
  delay: number;
  onRetry?: (error: any, attempt: number) => void;
}

export async function retry<T>(
  fn: () => Promise<T>,
  options: RetryOptions
): Promise<T> {
  let lastError: any;

  for (let attempt = 1; attempt <= options.retries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      options.onRetry?.(error, attempt);
      
      if (attempt === options.retries) {
        throw error;
      }
      
      await new Promise(resolve => setTimeout(resolve, options.delay));
    }
  }

  throw lastError;
} 