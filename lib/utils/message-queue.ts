type QueueTask = () => Promise<void>

export class MessageQueue {
  private static queue: QueueTask[] = []
  private static isProcessing = false

  static async enqueue(task: QueueTask) {
    this.queue.push(task)
    if (!this.isProcessing) {
      await this.processQueue()
    }
  }

  private static async processQueue() {
    if (this.isProcessing || this.queue.length === 0) return

    this.isProcessing = true
    while (this.queue.length > 0) {
      const task = this.queue.shift()
      if (task) {
        try {
          await task()
        } catch (error) {
          console.error('Task processing error:', error)
        }
      }
    }
    this.isProcessing = false
  }
} 