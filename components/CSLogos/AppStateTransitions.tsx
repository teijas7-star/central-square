import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { BrandMotion, useSound } from './BrandMotionSystem';

// App states that demonstrate different root network behaviors
type AppState = 'loading' | 'connected' | 'offline' | 'syncing' | 'error' | 'success';

interface StateTransition {
  from: AppState;
  to: AppState;
  description: string;
  trigger: string;
}

const stateTransitions: StateTransition[] = [
  { from: 'loading', to: 'connected', description: 'Initial app load - roots establish connections', trigger: 'App Launch' },
  { from: 'connected', to: 'syncing', description: 'Data sync - pulse through existing network', trigger: 'Data Sync' },
  { from: 'syncing', to: 'success', description: 'Successful sync - network strengthens', trigger: 'Sync Complete' },
  { from: 'connected', to: 'offline', description: 'Network loss - roots fade and disconnect', trigger: 'Go Offline' },
  { from: 'offline', to: 'connected', description: 'Reconnection - roots regrow and reconnect', trigger: 'Come Online' },
  { from: 'connected', to: 'error', description: 'Error state - network disruption with alert', trigger: 'Trigger Error' },
  { from: 'error', to: 'connected', description: 'Recovery - roots heal and restore network', trigger: 'Recover' },
];

export default function AppStateTransitions({ showGrid }: { showGrid: boolean }) {
  const [currentState, setCurrentState] = useState<AppState>('loading');
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const { playSound } = useSound();

  // Auto-play demo sequence
  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const sequence = ['loading', 'connected', 'syncing', 'success', 'offline', 'connected'];
    let currentIndex = 0;
    
    const timer = setInterval(() => {
      currentIndex = (currentIndex + 1) % sequence.length;
      setCurrentState(sequence[currentIndex] as AppState);
      playSound('connect');
    }, 3000);
    
    return () => clearInterval(timer);
  }, [isAutoPlaying, playSound]);

  const handleStateChange = (newState: AppState) => {
    setCurrentState(newState);
    // Play appropriate sound based on state
    switch (newState) {
      case 'connected':
        playSound('success');
        break;
      case 'error':
        playSound('error');
        break;
      case 'syncing':
        playSound('pulse');
        break;
      case 'offline':
        playSound('error');
        break;
      default:
        playSound('click');
    }
  };

  const availableTransitions = stateTransitions.filter(t => t.from === currentState);

  return (
    <div className="space-y-8">
      {/* State Visualization */}
      <Card className="p-8 bg-card border-border/20">
        <div className="flex flex-col items-center gap-6">
          <div className="flex items-center gap-4 mb-4">
            <h3 className="text-lg font-medium">Current State: {currentState}</h3>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsAutoPlaying(!isAutoPlaying)}
            >
              {isAutoPlaying ? 'Stop Demo' : 'Auto Demo'}
            </Button>
          </div>
          
          <div className={`relative w-96 h-96 ${showGrid ? 'grid-bg' : ''} rounded-lg border border-border/10 flex items-center justify-center`}>
            <AppStateLogo state={currentState} />
          </div>
          
          <div className="text-sm text-muted-foreground text-center max-w-md">
            {getStateDescription(currentState)}
          </div>
        </div>
      </Card>

      {/* State Controls */}
      <Card className="p-6 bg-card border-border/20">
        <h4 className="font-medium mb-4">Available Transitions</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {availableTransitions.map((transition, index) => (
            <Button
              key={index}
              variant="outline"
              onClick={() => handleStateChange(transition.to)}
              className="justify-start text-left h-auto p-4"
            >
              <div>
                <div className="font-medium text-sm">{transition.trigger}</div>
                <div className="text-xs text-muted-foreground mt-1">
                  {transition.description}
                </div>
              </div>
            </Button>
          ))}
        </div>
      </Card>

      {/* All States Overview */}
      <Card className="p-6 bg-card border-border/20">
        <h4 className="font-medium mb-4">All App States</h4>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {(['loading', 'connected', 'offline', 'syncing', 'error', 'success'] as AppState[]).map((state) => (
            <button
              key={state}
              onClick={() => handleStateChange(state)}
              className={`p-4 rounded-lg border-2 transition-all hover:scale-105 ${
                currentState === state 
                  ? 'border-primary bg-primary/5' 
                  : 'border-border/20 hover:border-border/40'
              }`}
            >
              <div className="w-16 h-16 mx-auto mb-2 flex items-center justify-center">
                <AppStateLogo state={state} size={48} />
              </div>
              <div className="text-xs font-medium capitalize">{state}</div>
            </button>
          ))}
        </div>
      </Card>
    </div>
  );
}

function AppStateLogo({ state, size = 120 }: { state: AppState; size?: number }) {
  const baseMotion = {
    transition: {
      duration: BrandMotion.timing.slow,
      ease: BrandMotion.easing.rootGrowth
    }
  };

  return (
    <AnimatePresence mode="wait">
      <motion.svg
        key={state}
        width={size}
        height={size}
        viewBox="0 0 64 64"
        fill="none"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        {...baseMotion}
      >
        {/* Central hub - varies by state */}
        <motion.circle
          cx="32"
          cy="32"
          r="6"
          fill="currentColor"
          animate={getHubAnimation(state)}
          transition={{
            duration: BrandMotion.timing.normal,
            ease: BrandMotion.easing.organic,
            repeat: getHubRepeat(state)
          }}
        />

        {/* State-specific root network */}
        {getRootNetwork(state)}

        {/* State indicators */}
        {getStateIndicators(state)}
      </motion.svg>
    </AnimatePresence>
  );
}

function getHubAnimation(state: AppState) {
  switch (state) {
    case 'loading':
      return { scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] };
    case 'connected':
      return { scale: 1, opacity: 1 };
    case 'offline':
      return { scale: 0.8, opacity: 0.3 };
    case 'syncing':
      return { scale: [1, 1.3, 1], opacity: [1, 0.8, 1] };
    case 'error':
      return { scale: [1, 1.1, 1], opacity: [1, 0.7, 1] };
    case 'success':
      return { scale: [1, 1.2, 1.1], opacity: 1 };
    default:
      return { scale: 1, opacity: 1 };
  }
}

function getHubRepeat(state: AppState) {
  return ['loading', 'syncing', 'error'].includes(state) ? Infinity : 0;
}

function getRootNetwork(state: AppState) {
  const paths = [
    "M32 26 Q32 18 32 8 Q30 6 28 4",
    "M38 32 Q46 32 54 32 Q56 30 58 28",
    "M32 38 Q32 46 32 54 Q34 56 36 58",
    "M26 32 Q18 32 10 32 Q8 34 6 36",
  ];

  const diagonalPaths = [
    "M44 20 Q48 16 52 12",
    "M44 44 Q48 48 52 52",
    "M20 44 Q16 48 12 52",
    "M20 20 Q16 16 12 12",
  ];

  return (
    <>
      {/* Main roots */}
      {paths.map((path, index) => (
        <motion.path
          key={`main-${index}`}
          d={path}
          stroke="currentColor"
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
          animate={getPathAnimation(state, index, 'main')}
          transition={{
            duration: BrandMotion.timing.slow,
            delay: index * BrandMotion.stagger.normal,
            ease: BrandMotion.easing.rootGrowth,
            repeat: getPathRepeat(state)
          }}
        />
      ))}
      
      {/* Diagonal roots */}
      {diagonalPaths.map((path, index) => (
        <motion.path
          key={`diagonal-${index}`}
          d={path}
          stroke="currentColor"
          strokeWidth="1.5"
          fill="none"
          strokeLinecap="round"
          animate={getPathAnimation(state, index, 'diagonal')}
          transition={{
            duration: BrandMotion.timing.normal,
            delay: (index + 4) * BrandMotion.stagger.tight,
            ease: BrandMotion.easing.connection,
            repeat: getPathRepeat(state)
          }}
        />
      ))}
    </>
  );
}

function getPathAnimation(state: AppState, index: number, type: 'main' | 'diagonal') {
  const baseOpacity = type === 'main' ? 1 : 0.7;
  
  switch (state) {
    case 'loading':
      return {
        pathLength: [0, 1, 0],
        opacity: [0, baseOpacity, 0.3]
      };
    case 'connected':
      return {
        pathLength: 1,
        opacity: baseOpacity
      };
    case 'offline':
      return {
        pathLength: 0.2,
        opacity: 0.2
      };
    case 'syncing':
      return {
        pathLength: [0.5, 1, 0.5],
        opacity: [baseOpacity * 0.5, baseOpacity, baseOpacity * 0.5]
      };
    case 'error':
      return {
        pathLength: [1, 0.3, 1],
        opacity: [baseOpacity, 0.3, baseOpacity]
      };
    case 'success':
      return {
        pathLength: 1,
        opacity: baseOpacity
      };
    default:
      return {
        pathLength: 1,
        opacity: baseOpacity
      };
  }
}

function getPathRepeat(state: AppState) {
  return ['loading', 'syncing', 'error'].includes(state) ? Infinity : 0;
}

function getStateIndicators(state: AppState) {
  switch (state) {
    case 'error':
      return (
        <motion.g>
          {/* Error pulse rings */}
          {[16, 20, 24].map((r, i) => (
            <motion.circle
              key={i}
              cx="32"
              cy="32"
              r={r}
              stroke="rgb(239, 68, 68)"
              strokeWidth="1"
              fill="none"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ 
                scale: [0, 1.2, 0], 
                opacity: [0, 0.6, 0] 
              }}
              transition={{
                duration: 1.5,
                delay: i * 0.2,
                repeat: Infinity,
                ease: BrandMotion.easing.pulse
              }}
            />
          ))}
        </motion.g>
      );
    case 'success':
      return (
        <motion.g>
          {/* Success glow */}
          <motion.circle
            cx="32"
            cy="32"
            r="12"
            stroke="rgb(34, 197, 94)"
            strokeWidth="2"
            fill="none"
            opacity="0.3"
            initial={{ scale: 0 }}
            animate={{ scale: [0, 1.3, 1] }}
            transition={{
              duration: BrandMotion.timing.slow,
              ease: BrandMotion.easing.rootSettle
            }}
          />
        </motion.g>
      );
    case 'syncing':
      return (
        <motion.g>
          {/* Syncing particles */}
          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
            <motion.circle
              key={i}
              cx="32"
              cy="32"
              r="1"
              fill="currentColor"
              style={{ transformOrigin: '32px 32px' }}
              animate={{
                rotate: 360,
                x: [0, Math.cos(angle * Math.PI / 180) * 16, 0],
                y: [0, Math.sin(angle * Math.PI / 180) * 16, 0]
              }}
              transition={{
                duration: 2,
                delay: i * 0.1,
                repeat: Infinity,
                ease: "linear"
              }}
            />
          ))}
        </motion.g>
      );
    default:
      return null;
  }
}

function getStateDescription(state: AppState): string {
  const descriptions = {
    loading: 'The Central Square network is establishing initial connections. Roots grow organically to find and connect communities.',
    connected: 'All systems operational. The root network is fully established, connecting all communities in the Central Square ecosystem.',
    offline: 'Network connectivity lost. Root connections fade but the central hub remains, ready to reconnect when service is restored.',
    syncing: 'Data synchronization in progress. Energy pulses through the root network, updating and refreshing community connections.',
    error: 'System disruption detected. The network shows warning signals while attempting to diagnose and resolve the issue.',
    success: 'Operation completed successfully. The root network glows with positive energy, confirming all connections are healthy and strong.'
  };
  
  return descriptions[state];
}