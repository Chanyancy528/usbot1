export class VoiceActivityDetector {
  private static audioContext: AudioContext | null = null;
  private static analyser: AnalyserNode | null = null;
  private static mediaStream: MediaStream | null = null;
  private static silenceTimeout: NodeJS.Timeout | null = null;
  private static noiseReducer: NoiseReducer | null = null;

  // Configuration
  private static readonly SILENCE_THRESHOLD = -50; // dB
  private static readonly SILENCE_DURATION = 1500; // ms
  private static readonly FFT_SIZE = 2048;
  private static readonly NOISE_REDUCTION_SETTINGS = {
    threshold: -60,  // Noise gate threshold
    ratio: 12,       // Compression ratio
    attack: 0.002,   // Attack time in seconds
    release: 0.1,    // Release time in seconds
    smoothing: 0.2   // Smoothing factor for noise estimation
  };

  static async initialize(onSpeechStart: () => void, onSpeechEnd: () => void) {
    try {
      this.audioContext = new AudioContext();
      this.analyser = this.audioContext.createAnalyser();
      this.analyser.fftSize = this.FFT_SIZE;
      
      // Get microphone stream with noise reduction
      this.mediaStream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          channelCount: 1, // Mono for better noise processing
        }
      });

      // Create audio processing chain
      const source = this.audioContext.createMediaStreamSource(this.mediaStream);
      
      // Initialize noise reducer
      this.noiseReducer = new NoiseReducer(this.audioContext, this.NOISE_REDUCTION_SETTINGS);
      
      // Connect nodes: source -> noise reduction -> analyser
      source
        .connect(this.noiseReducer.input)
        .connect(this.analyser);

      // Start monitoring
      this.monitorAudioLevel(onSpeechStart, onSpeechEnd);
    } catch (error) {
      console.error('Failed to initialize voice activity detector:', error);
      throw error;
    }
  }

  private static monitorAudioLevel(onSpeechStart: () => void, onSpeechEnd: () => void) {
    if (!this.analyser) return;

    const dataArray = new Float32Array(this.analyser.frequencyBinCount);
    let isSpeaking = false;

    const checkLevel = () => {
      this.analyser!.getFloatTimeDomainData(dataArray);
      
      // Calculate RMS value
      let sum = 0;
      for (let i = 0; i < dataArray.length; i++) {
        sum += dataArray[i] * dataArray[i];
      }
      const rms = Math.sqrt(sum / dataArray.length);
      const db = 20 * Math.log10(rms);

      // Detect speech
      if (db > this.SILENCE_THRESHOLD) {
        if (!isSpeaking) {
          isSpeaking = true;
          onSpeechStart();
        }
        this.resetSilenceTimeout(onSpeechEnd);
      }

      requestAnimationFrame(checkLevel);
    };

    checkLevel();
  }

  private static resetSilenceTimeout(onSpeechEnd: () => void) {
    if (this.silenceTimeout) {
      clearTimeout(this.silenceTimeout);
    }

    this.silenceTimeout = setTimeout(() => {
      onSpeechEnd();
    }, this.SILENCE_DURATION);
  }

  static stop() {
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach(track => track.stop());
    }
    if (this.audioContext) {
      this.audioContext.close();
    }
    if (this.silenceTimeout) {
      clearTimeout(this.silenceTimeout);
    }
  }
}

// Noise reduction implementation
class NoiseReducer {
  private context: AudioContext;
  private compressor: DynamicsCompressorNode;
  private filter: BiquadFilterNode;
  private noiseGate: GainNode;
  private settings: typeof VoiceActivityDetector.NOISE_REDUCTION_SETTINGS;
  private analyser: AnalyserNode;
  private noiseLevel: number = -Infinity;

  constructor(context: AudioContext, settings: typeof VoiceActivityDetector.NOISE_REDUCTION_SETTINGS) {
    this.context = context;
    this.settings = settings;

    // Create nodes
    this.compressor = context.createDynamicsCompressor();
    this.filter = context.createBiquadFilter();
    this.noiseGate = context.createGain();
    this.analyser = context.createAnalyser();

    // Configure high-pass filter to remove low frequency noise
    this.filter.type = 'highpass';
    this.filter.frequency.value = 85; // Hz
    this.filter.Q.value = 0.7;

    // Configure compressor for dynamic range control
    this.compressor.threshold.value = this.settings.threshold;
    this.compressor.ratio.value = this.settings.ratio;
    this.compressor.attack.value = this.settings.attack;
    this.compressor.release.value = this.settings.release;
    this.compressor.knee.value = 40;

    // Configure analyser for noise level detection
    this.analyser.fftSize = 2048;
    this.analyser.smoothingTimeConstant = this.settings.smoothing;

    // Connect nodes
    this.filter
      .connect(this.compressor)
      .connect(this.noiseGate)
      .connect(this.analyser);

    // Start noise level monitoring
    this.updateNoiseGate();
  }

  private updateNoiseGate = () => {
    const dataArray = new Float32Array(this.analyser.frequencyBinCount);
    this.analyser.getFloatTimeDomainData(dataArray);

    // Calculate current RMS
    let sum = 0;
    for (let i = 0; i < dataArray.length; i++) {
      sum += dataArray[i] * dataArray[i];
    }
    const rms = Math.sqrt(sum / dataArray.length);
    const db = 20 * Math.log10(rms);

    // Update noise level estimate
    if (db < this.noiseLevel || this.noiseLevel === -Infinity) {
      this.noiseLevel = db;
    } else {
      this.noiseLevel += (db - this.noiseLevel) * this.settings.smoothing;
    }

    // Apply noise gate
    const gateGain = db > this.noiseLevel + 10 ? 1 : 0;
    this.noiseGate.gain.setTargetAtTime(
      gateGain,
      this.context.currentTime,
      gateGain === 0 ? this.settings.release : this.settings.attack
    );

    requestAnimationFrame(this.updateNoiseGate);
  };

  get input(): AudioNode {
    return this.filter;
  }

  get output(): AudioNode {
    return this.analyser;
  }

  setThreshold(value: number) {
    this.settings.threshold = value;
    this.compressor.threshold.value = value;
  }

  setRatio(value: number) {
    this.settings.ratio = value;
    this.compressor.ratio.value = value;
  }

  disconnect() {
    this.filter.disconnect();
    this.compressor.disconnect();
    this.noiseGate.disconnect();
    this.analyser.disconnect();
  }
} 