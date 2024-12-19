import { VoiceActivityDetector } from './voice-activity-detector';

export class SpeechRecognitionManager {
  private static recognition: SpeechRecognition | null = null;
  private static mediaRecorder: MediaRecorder | null = null;
  private static audioChunks: Blob[] = [];
  private static isRecording = false;
  private static CHUNK_INTERVAL = 250; // ms

  static async initialize() {
    if (!this.recognition) {
      this.recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
      this.setupRecognition();
    }

    // Initialize voice activity detection
    await VoiceActivityDetector.initialize(
      () => this.startRecording(),
      () => this.stopRecording()
    );
  }

  private static setupRecognition() {
    if (!this.recognition) return;

    this.recognition.continuous = true;
    this.recognition.interimResults = true;
    this.recognition.maxAlternatives = 1;

    this.recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map(result => result[0].transcript)
        .join('');
      
      // Update UI with interim results
      useChatStore.getState().setTranscript(transcript, !event.results[0].isFinal);
    };

    this.recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      this.stopRecording();
    };
  }

  private static async startRecording() {
    if (this.isRecording) return;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus',
        audioBitsPerSecond: 16000
      });

      this.audioChunks = [];
      this.isRecording = true;

      // Process audio in chunks
      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.audioChunks.push(event.data);
          this.processAudioChunk();
        }
      };

      this.mediaRecorder.start(this.CHUNK_INTERVAL);
      this.recognition?.start();
      useChatStore.getState().setIsListening(true);
    } catch (error) {
      console.error('Failed to start recording:', error);
    }
  }

  private static async processAudioChunk() {
    if (this.audioChunks.length === 0) return;

    const audioBlob = new Blob(this.audioChunks, { type: 'audio/webm' });
    // You can send this chunk to your speech-to-text service
    // or accumulate for later processing
  }

  private static stopRecording() {
    if (!this.isRecording) return;

    this.mediaRecorder?.stop();
    this.recognition?.stop();
    this.isRecording = false;
    useChatStore.getState().setIsListening(false);

    // Process any remaining audio
    if (this.audioChunks.length > 0) {
      this.processAudioChunk();
    }

    // Clean up
    this.mediaRecorder?.stream.getTracks().forEach(track => track.stop());
    this.audioChunks = [];
  }

  static cleanup() {
    this.stopRecording();
    VoiceActivityDetector.stop();
  }
} 