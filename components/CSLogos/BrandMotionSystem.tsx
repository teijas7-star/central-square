import React, { createContext, useContext, useState } from 'react';

// Brand Motion System - Consistent timing and easing curves
export const BrandMotion = {
  // Timing scales
  timing: {
    instant: 0.1,
    fast: 0.2,
    normal: 0.4,
    slow: 0.6,
    slowest: 0.8
  },
  
  // Easing curves that match the organic root growth concept
  easing: {
    // Sharp entrance, gentle exit (like roots finding their path)
    rootGrowth: [0.4, 0.0, 0.2, 1],
    // Bouncy growth (like roots establishing themselves)
    rootSettle: [0.68, -0.55, 0.265, 1.55],
    // Natural breathing motion
    organic: [0.25, 0.46, 0.45, 0.94],
    // Smooth connection building
    connection: [0.4, 0.0, 0.6, 1],
    // Sharp attention-grabbing pulse
    pulse: [0.6, -0.28, 0.735, 0.045]
  },
  
  // Stagger delays for sequential animations
  stagger: {
    tight: 0.1,
    normal: 0.2,
    loose: 0.3
  },
  
  // Common animation patterns
  patterns: {
    fadeInGrow: {
      initial: { opacity: 0, scale: 0.8 },
      animate: { opacity: 1, scale: 1 },
      exit: { opacity: 0, scale: 0.8 }
    },
    slideUpFade: {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: -20 }
    },
    rootExpansion: {
      initial: { pathLength: 0, opacity: 0 },
      animate: { pathLength: 1, opacity: 1 },
      exit: { pathLength: 0, opacity: 0 }
    }
  }
};

// Sound System Context
interface SoundContextType {
  playSound: (soundType: SoundType) => void;
  isSoundEnabled: boolean;
  toggleSound: () => void;
}

type SoundType = 'hover' | 'click' | 'connect' | 'notification' | 'success' | 'error' | 'focus' | 'pulse';

const SoundContext = createContext<SoundContextType | null>(null);

export function SoundProvider({ children }: { children: React.ReactNode }) {
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);

  // Initialize Web Audio Context
  const initAudioContext = () => {
    if (!audioContext) {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      setAudioContext(ctx);
      return ctx;
    }
    return audioContext;
  };

  // Generate synthesized sounds using Web Audio API
  const playSound = (soundType: SoundType) => {
    if (!isSoundEnabled) return;
    
    const ctx = initAudioContext();
    if (!ctx) return;

    // Resume context if suspended (required for user gesture)
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    // Sound parameters based on interaction type
    const soundParams = {
      hover: { 
        frequency: 800, 
        duration: 0.1, 
        type: 'sine' as OscillatorType,
        volume: 0.1 
      },
      click: { 
        frequency: 1000, 
        duration: 0.15, 
        type: 'triangle' as OscillatorType,
        volume: 0.15 
      },
      connect: { 
        frequency: 600, 
        duration: 0.3, 
        type: 'sine' as OscillatorType,
        volume: 0.2,
        pitchBend: true 
      },
      notification: { 
        frequency: 800, 
        duration: 0.2, 
        type: 'square' as OscillatorType,
        volume: 0.1,
        pulse: true 
      },
      success: { 
        frequency: 660, 
        duration: 0.4, 
        type: 'sine' as OscillatorType,
        volume: 0.15,
        chord: true 
      },
      error: { 
        frequency: 300, 
        duration: 0.3, 
        type: 'sawtooth' as OscillatorType,
        volume: 0.1 
      },
      focus: { 
        frequency: 700, 
        duration: 0.12, 
        type: 'sine' as OscillatorType,
        volume: 0.08 
      },
      pulse: { 
        frequency: 550, 
        duration: 0.2, 
        type: 'sine' as OscillatorType,
        volume: 0.12,
        pulse: true 
      }
    };

    const params = soundParams[soundType];
    
    oscillator.type = params.type;
    oscillator.frequency.setValueAtTime(params.frequency, ctx.currentTime);
    
    // Special effects for certain sound types
    if (params.pitchBend) {
      oscillator.frequency.exponentialRampToValueAtTime(
        params.frequency * 1.5, 
        ctx.currentTime + params.duration
      );
    }
    
    if (params.chord) {
      // Play harmonic for success sound
      const harmonic = ctx.createOscillator();
      harmonic.connect(gainNode);
      harmonic.type = 'sine';
      harmonic.frequency.setValueAtTime(params.frequency * 1.5, ctx.currentTime);
      harmonic.start(ctx.currentTime);
      harmonic.stop(ctx.currentTime + params.duration);
    }

    // Volume envelope
    gainNode.gain.setValueAtTime(0, ctx.currentTime);
    gainNode.gain.linearRampToValueAtTime(params.volume, ctx.currentTime + 0.01);
    
    if (params.pulse) {
      // Create pulsing effect
      gainNode.gain.setValueAtTime(params.volume, ctx.currentTime + 0.1);
      gainNode.gain.linearRampToValueAtTime(params.volume * 0.3, ctx.currentTime + 0.15);
      gainNode.gain.linearRampToValueAtTime(params.volume, ctx.currentTime + 0.2);
    }
    
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + params.duration);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + params.duration);
  };

  const toggleSound = () => {
    setIsSoundEnabled(prev => !prev);
  };

  return (
    <SoundContext.Provider value={{ playSound, isSoundEnabled, toggleSound }}>
      {children}
    </SoundContext.Provider>
  );
}

export function useSound() {
  const context = useContext(SoundContext);
  if (!context) {
    throw new Error('useSound must be used within a SoundProvider');
  }
  return context;
}

// Preset motion variants using the brand system
export const createMotionVariants = (type: keyof typeof BrandMotion.patterns, customTiming?: number) => {
  const pattern = BrandMotion.patterns[type];
  const timing = customTiming || BrandMotion.timing.normal;
  
  return {
    initial: pattern.initial,
    animate: {
      ...pattern.animate,
      transition: {
        duration: timing,
        ease: BrandMotion.easing.rootGrowth
      }
    },
    exit: {
      ...pattern.exit,
      transition: {
        duration: timing,
        ease: BrandMotion.easing.rootGrowth
      }
    }
  };
};

// Staggered children animation helper
export const createStaggeredVariants = (staggerDelay: number = BrandMotion.stagger.normal) => ({
  animate: {
    transition: {
      staggerChildren: staggerDelay
    }
  }
});