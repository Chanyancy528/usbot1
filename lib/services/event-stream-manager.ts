export class EventStreamManager {
  private static eventSource: EventSource | null = null;

  static initialize(endpoint: string) {
    if (this.eventSource) {
      this.eventSource.close();
    }

    this.eventSource = new EventSource(endpoint);
    this.setupEventHandlers();
  }

  private static setupEventHandlers() {
    if (!this.eventSource) return;

    this.eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        // Handle incoming data
        useChatStore.getState().addMessage(data);
      } catch (error) {
        console.error('Event stream error:', error);
      }
    };

    this.eventSource.onerror = (error) => {
      console.error('EventSource failed:', error);
      this.eventSource?.close();
      this.eventSource = null;
    };
  }

  static close() {
    this.eventSource?.close();
    this.eventSource = null;
  }
} 