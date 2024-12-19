export class BrowserTTS {
  private static synth = typeof window !== 'undefined' ? window.speechSynthesis : null;

  static async textToSpeech(
    text: string,
    options: { voice?: string; rate?: number; pitch?: number } = {}
  ): Promise<void> {
    if (!this.synth) throw new Error('Speech synthesis not available');

    const { voice = '', rate = 1, pitch = 1 } = options;
    const utterance = new SpeechSynthesisUtterance(text);
    
    if (voice) {
      const voices = this.synth.getVoices();
      const selectedVoice = voices.find(v => v.name === voice);
      if (selectedVoice) utterance.voice = selectedVoice;
    }

    utterance.rate = rate;
    utterance.pitch = pitch;

    return new Promise((resolve, reject) => {
      utterance.onend = () => resolve();
      utterance.onerror = (error) => reject(error);
      this.synth.speak(utterance);
    });
  }

  static getVoices(): SpeechSynthesisVoice[] {
    return this.synth ? this.synth.getVoices() : [];
  }
} 