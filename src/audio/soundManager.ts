class SoundManager {
  private ctx: AudioContext | null = null;
  private humOscillators: Map<string, { osc: OscillatorNode; oscs?: OscillatorNode[]; gain: GainNode }> = new Map();
  private muted = false;

  setMuted(muted: boolean) {
    this.muted = muted;
    if (muted) {
      this.stopAllHums();
    }
  }

  isMuted() {
    return this.muted;
  }

  private getContext(): AudioContext {
    if (!this.ctx) {
      // @ts-ignore
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  playClick() {
    if (this.muted) return;
    try {
      const ctx = this.getContext();
      const now = ctx.currentTime;

      // Noise click (armature contact)
      const bufferSize = ctx.sampleRate * 0.01; // 10ms
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const noiseFilter = ctx.createBiquadFilter();
      noiseFilter.type = 'highpass';
      noiseFilter.frequency.setValueAtTime(1500, now);

      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(0.3, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.01, now + 0.008);

      noise.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(ctx.destination);

      // Low metallic rebound
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.exponentialRampToValueAtTime(300, now + 0.03);

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.03);

      osc.connect(gain);
      gain.connect(ctx.destination);

      noise.start(now);
      osc.start(now);
      osc.stop(now + 0.04);
    } catch (e) {
      console.warn('Audio failed to play:', e);
    }
  }

  playButton() {
    if (this.muted) return;
    try {
      const ctx = this.getContext();
      const now = ctx.currentTime;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(150, now);
      osc.frequency.exponentialRampToValueAtTime(80, now + 0.05);

      gain.gain.setValueAtTime(0.4, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.06);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.07);

      // Add a tiny mechanical click
      this.playClick();
    } catch (e) {
      console.warn('Audio failed to play:', e);
    }
  }

  playWire() {
    if (this.muted) return;
    try {
      const ctx = this.getContext();
      const now = ctx.currentTime;

      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(523.25, now); // C5
      osc1.frequency.exponentialRampToValueAtTime(783.99, now + 0.1); // G5

      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(659.25, now); // E5
      osc2.frequency.exponentialRampToValueAtTime(1046.50, now + 0.1); // C6

      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 0.15);
      osc2.stop(now + 0.15);
    } catch (e) {
      console.warn('Audio failed to play:', e);
    }
  }

  playSpark() {
    if (this.muted) return;
    try {
      const ctx = this.getContext();
      const now = ctx.currentTime;

      const bufferSize = ctx.sampleRate * 0.25; // 250ms
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        // Crackling white noise
        const crackle = Math.random() > 0.9 ? (Math.random() * 2 - 1) : 0;
        data[i] = (Math.random() * 2 - 1) * 0.3 + crackle * 0.7;
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(600, now);
      filter.Q.setValueAtTime(3, now);

      // Modulator for crackle frequency
      const osc = ctx.createOscillator();
      const oscGain = ctx.createGain();
      osc.frequency.setValueAtTime(120, now);
      oscGain.gain.setValueAtTime(400, now);

      osc.connect(oscGain);
      oscGain.connect(filter.frequency);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.6, now);
      gain.gain.linearRampToValueAtTime(0.3, now + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      noise.start(now);
      osc.stop(now + 0.25);
      noise.stop(now + 0.25);
    } catch (e) {
      console.warn('Audio failed to play:', e);
    }
  }

  playSuccess() {
    if (this.muted) return;
    try {
      const ctx = this.getContext();
      const now = ctx.currentTime;
      const notes = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99, 1046.50]; // C4, E4, G4, C5, E5, G5, C6

      notes.forEach((freq, index) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + index * 0.08);

        gain.gain.setValueAtTime(0.0, now);
        gain.gain.linearRampToValueAtTime(0.15, now + index * 0.08 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + index * 0.08 + 0.5);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + index * 0.08);
        osc.stop(now + index * 0.08 + 0.6);
      });
    } catch (e) {
      console.warn('Audio failed to play:', e);
    }
  }

  playFailure() {
    if (this.muted) return;
    try {
      const ctx = this.getContext();
      const now = ctx.currentTime;

      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.type = 'sawtooth';
      osc1.frequency.setValueAtTime(120, now);
      osc1.frequency.linearRampToValueAtTime(70, now + 0.4);

      osc2.type = 'square';
      osc2.frequency.setValueAtTime(121.5, now);
      osc2.frequency.linearRampToValueAtTime(71, now + 0.4);

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(300, now);

      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.45);

      osc1.connect(filter);
      osc2.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 0.45);
      osc2.stop(now + 0.45);
    } catch (e) {
      console.warn('Audio failed to play:', e);
    }
  }

  startHum(id: string, type: 'motor' | 'bulb' | 'buzzer' = 'bulb') {
    if (this.muted) return;
    try {
      if (this.humOscillators.has(id)) return;

      const ctx = this.getContext();
      const now = ctx.currentTime;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      if (type === 'motor') {
        const osc2 = ctx.createOscillator();
        
        // Low mechanical rumbling base tone (audible 80Hz)
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(80, now);

        // Bearing / rotational whir harmonic (triangle 160Hz)
        osc2.type = 'triangle';
        osc2.frequency.setValueAtTime(160, now);

        // LFO for pitch wobble / motor vibration
        const lfo = ctx.createOscillator();
        const lfoGain = ctx.createGain();
        lfo.frequency.value = 11; // 11 Hz wobble
        lfoGain.gain.value = 8;   // Modulation depth
        lfo.connect(lfoGain);
        lfoGain.connect(osc.frequency);
        lfoGain.connect(osc2.frequency);

        // Open filter to allow mechanical frequencies
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(450, now);
        
        // Master gain of the motor sound
        gain.gain.setValueAtTime(0.08, now);

        osc.connect(filter);
        osc2.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);

        lfo.start(now);
        osc.start(now);
        osc2.start(now);

        this.humOscillators.set(id, { 
          osc, 
          oscs: [osc, osc2, lfo], 
          gain 
        });
        return;
      } else if (type === 'buzzer') {
        osc.type = 'square';
        osc.frequency.setValueAtTime(240, now); // Buzzer buzz
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(800, now);
        gain.gain.setValueAtTime(0.12, now);
      } else {
        // Bulb hum
        osc.type = 'sine';
        osc.frequency.setValueAtTime(120, now); // 120Hz hum
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(200, now);
        gain.gain.setValueAtTime(0.03, now);
      }

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      this.humOscillators.set(id, { osc, gain });
    } catch (e) {
      console.warn('Audio hum failed:', e);
    }
  }

  playCardScan() {
    if (this.muted) return;
    try {
      const ctx = this.getContext();
      const now = ctx.currentTime;

      // Two quick beep-chime notes: first 2000Hz, then 2500Hz
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(2000, now);
      osc.frequency.setValueAtTime(2500, now + 0.06);

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.setValueAtTime(0.2, now + 0.06);
      gain.gain.exponentialRampToValueAtTime(0.005, now + 0.15);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.16);
    } catch (e) {
      console.warn('Audio playCardScan failed:', e);
    }
  }

  stopHum(id: string) {
    const hum = this.humOscillators.get(id);
    if (hum) {
      try {
        const ctx = this.getContext();
        const now = ctx.currentTime;
        // Fade out slightly
        hum.gain.gain.cancelScheduledValues(now);
        hum.gain.gain.setValueAtTime(hum.gain.gain.value, now);
        hum.gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
        setTimeout(() => {
          try {
            if (hum.oscs) {
              hum.oscs.forEach(o => {
                try {
                  o.stop();
                  o.disconnect();
                } catch(e){}
              });
            } else {
              hum.osc.stop();
              hum.osc.disconnect();
            }
          } catch(e){}
        }, 60);
      } catch (e) {}
      this.humOscillators.delete(id);
    }
  }

  stopAllHums() {
    Array.from(this.humOscillators.keys()).forEach(id => this.stopHum(id));
  }
}

export const soundManager = new SoundManager();
