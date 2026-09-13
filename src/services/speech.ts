// Speech Recognition and Synthesis Wrapper for Italian (it-IT)

export interface SpeechRecognitionHandlers {
  onResult: (transcript: string, isFinal: boolean) => void;
  onError: (error: string) => void;
  onEnd: () => void;
  onAudioLevel?: (level: number) => void; // 0.0 to 1.0 for waveform animation
}

// Extend Window interface for WebkitSpeechRecognition
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

class SpeechManager {
  private recognition: any = null;
  private isListening = false;
  private audioContext: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private micStream: MediaStream | null = null;
  private animFrameId: number | null = null;

  constructor() {
    const SpeechRecognitionClass = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognitionClass) {
      this.recognition = new SpeechRecognitionClass();
      this.recognition.continuous = true;
      this.recognition.interimResults = true;
      this.recognition.lang = 'it-IT';
    }
  }

  isSupported(): boolean {
    return Boolean(window.SpeechRecognition || window.webkitSpeechRecognition);
  }

  async startListening(handlers: SpeechRecognitionHandlers) {
    if (!this.recognition) {
      handlers.onError("Web Speech Recognition non è supportato su questo browser. Usa la tastiera.");
      return;
    }

    if (this.isListening) {
      this.stopListening();
    }

    this.isListening = true;

    this.recognition.onresult = (event: any) => {
      let finalTranscript = '';
      let interimTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        const result = event.results[i];
        if (result.isFinal) {
          finalTranscript += result[0].transcript;
        } else {
          interimTranscript += result[0].transcript;
        }
      }

      handlers.onResult(finalTranscript || interimTranscript, Boolean(finalTranscript));
    };

    this.recognition.onerror = (event: any) => {
      console.warn("Speech recognition error:", event.error);
      if (event.error !== 'no-speech') {
        handlers.onError(`Errore microfono: ${event.error}`);
      }
    };

    this.recognition.onend = () => {
      this.isListening = false;
      this.stopAudioAnalysis();
      handlers.onEnd();
    };

    try {
      this.recognition.start();
      await this.startAudioAnalysis(handlers.onAudioLevel);
    } catch (err) {
      console.error("Start speech error:", err);
      handlers.onError("Impossibile avviare il microfono.");
      this.isListening = false;
    }
  }

  stopListening() {
    if (this.recognition && this.isListening) {
      try {
        this.recognition.stop();
      } catch (e) {
        // ignore
      }
    }
    this.isListening = false;
    this.stopAudioAnalysis();
  }

  private async startAudioAnalysis(onLevel?: (level: number) => void) {
    if (!onLevel) return;
    try {
      if (!navigator.mediaDevices?.getUserMedia) return;
      this.micStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      this.audioContext = new AudioCtx();
      const source = this.audioContext.createMediaStreamSource(this.micStream);
      this.analyser = this.audioContext.createAnalyser();
      this.analyser.fftSize = 64;
      source.connect(this.analyser);

      const dataArray = new Uint8Array(this.analyser.frequencyBinCount);

      const updateLevel = () => {
        if (!this.analyser || !this.isListening) return;
        this.analyser.getByteFrequencyData(dataArray);
        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) {
          sum += dataArray[i];
        }
        const avg = sum / dataArray.length;
        const normalized = Math.min(1.0, avg / 128.0);
        onLevel(normalized);
        this.animFrameId = requestAnimationFrame(updateLevel);
      };

      updateLevel();
    } catch (e) {
      // Fallback pulse generator if audio context blocked
      const fallbackPulse = () => {
        if (!this.isListening) return;
        onLevel(Math.random() * 0.7 + 0.3);
        this.animFrameId = requestAnimationFrame(fallbackPulse);
      };
      fallbackPulse();
    }
  }

  private stopAudioAnalysis() {
    if (this.animFrameId) {
      cancelAnimationFrame(this.animFrameId);
      this.animFrameId = null;
    }
    if (this.micStream) {
      this.micStream.getTracks().forEach(t => t.stop());
      this.micStream = null;
    }
    if (this.audioContext) {
      this.audioContext.close().catch(() => {});
      this.audioContext = null;
    }
  }

  /**
   * Speak Maestro Marco's reply using Web Speech Synthesis API (it-IT)
   */
  speakItalian(text: string, onEnd?: () => void) {
    if (!('speechSynthesis' in window)) {
      if (onEnd) onEnd();
      return;
    }

    // Cancel current speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'it-IT';
    utterance.rate = 0.95;
    utterance.pitch = 0.95;

    // Pick Italian voice if available
    const voices = window.speechSynthesis.getVoices();
    const italianVoice = voices.find(v => v.lang.startsWith('it'));
    if (italianVoice) {
      utterance.voice = italianVoice;
    }

    if (onEnd) {
      utterance.onend = () => onEnd();
      utterance.onerror = () => onEnd();
    }

    window.speechSynthesis.speak(utterance);
  }

  stopSpeaking() {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }
}

export const speechService = new SpeechManager();
