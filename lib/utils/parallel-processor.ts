export class ParallelProcessor {
  static async processAll<T>(tasks: Promise<T>[]): Promise<T[]> {
    try {
      return await Promise.all(tasks)
    } catch (error) {
      console.error('Parallel processing error:', error)
      throw error
    }
  }

  static async processWithFallback<T>(
    mainTask: Promise<T>,
    fallbackTask: Promise<T>,
    timeout: number
  ): Promise<T> {
    try {
      return await Promise.race([
        mainTask,
        fallbackTask,
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Operation timed out')), timeout)
        )
      ])
    } catch (error) {
      console.error('Task processing error:', error)
      throw error
    }
  }
} 