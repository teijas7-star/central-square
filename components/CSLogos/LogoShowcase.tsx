import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { SoundProvider, useSound } from './BrandMotionSystem';
import { Volume2, VolumeX } from 'lucide-react';

// Import extracted components
import {
  GeometricSquareLogo,
  RadiatingPathsLogo,
  ArchitecturalFrameLogo,
  GridPatternLogo,
  CircleSquareHybridLogo,
  MinimalMarkLogo
} from './logo-variants/index';

import {
  AnimatedRootsLogo,
  SequentialBloomLogo,
  PulseGrowLogo,
  BreathingNetworkLogo
} from './animated-logos/index';

import {
  HoverButtonExample,
  LoadingStateExample,
  NotificationExample,
  FormFocusExample,
  SocialConnectionExample,
  MenuNavigationExample
} from './interactive-examples/index';

import AppStateTransitions from './AppStateTransitions';
import BrandMotionGuide from './BrandMotionGuide';

function LogoShowcaseContent() {
  const [isDark, setIsDark] = useState(false);
  const [showGrid, setShowGrid] = useState(false);
  const { isSoundEnabled, toggleSound } = useSound();

  const logoVariants = [
    {
      id: 'animated-roots',
      name: 'Root Growth',
      description: 'Organic root-like expansion from central hub - primary logo',
      component: AnimatedRootsLogo,
    },
    {
      id: 'sequential-bloom',
      name: 'Sequential Bloom',
      description: 'Staggered root emergence with natural timing - animated variant',
      component: SequentialBloomLogo,
    },
    {
      id: 'pulse-grow',
      name: 'Pulse & Grow',
      description: 'Heartbeat-like pulse with growing connections - interactive states',
      component: PulseGrowLogo,
    },
    {
      id: 'breathing-network',
      name: 'Breathing Network',
      description: 'Subtle breathing motion for loading states - ambient animation',
      component: BreathingNetworkLogo,
    },
  ];

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDark ? 'dark bg-background' : 'bg-white'}`}>
      {/* Header */}
      <div className="border-b border-border/20">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-medium text-foreground">Central Square</h1>
              <p className="text-muted-foreground mt-2">Logo Design Concepts</p>
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setShowGrid(!showGrid)}
                size="sm"
              >
                {showGrid ? 'Hide Grid' : 'Show Grid'}
              </Button>
              <Button
                variant="outline"
                onClick={toggleSound}
                size="sm"
              >
                {isSoundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                <span className="ml-2">{isSoundEnabled ? 'Sound On' : 'Sound Off'}</span>
              </Button>
              <Button
                variant="outline"
                onClick={() => setIsDark(!isDark)}
                size="sm"
              >
                {isDark ? 'Light Mode' : 'Dark Mode'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Logo Grid */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {logoVariants.map((variant) => (
            <LogoCard
              key={variant.id}
              variant={variant}
              showGrid={showGrid}
            />
          ))}
        </div>

        {/* Animation Previews */}
        <div className="mt-16">
          <h2 className="text-2xl font-medium text-foreground mb-8">Animation Previews</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
            <AnimationExample
              title="Root Growth Animation"
              description="Organic root-like expansion from central hub"
              logo={<AnimatedRootsLogo size={80} />}
              showGrid={showGrid}
            />
            <AnimationExample
              title="Sequential Bloom"
              description="Staggered root emergence with natural timing"
              logo={<SequentialBloomLogo size={80} />}
              showGrid={showGrid}
            />
            <AnimationExample
              title="Pulse & Grow"
              description="Heartbeat-like pulse with growing connections"
              logo={<PulseGrowLogo size={80} />}
              showGrid={showGrid}
            />
            <AnimationExample
              title="Breathing Network"
              description="Subtle breathing motion for loading states"
              logo={<BreathingNetworkLogo size={80} />}
              showGrid={showGrid}
            />
          </div>
        </div>

        {/* Interactive Contexts */}
        <div className="mt-16">
          <h2 className="text-2xl font-medium text-foreground mb-8">Interactive Contexts</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8 mb-16">
            <InteractiveExample
              title="Button Hover"
              description="Root expansion on hover interaction"
              showGrid={showGrid}
            >
              <HoverButtonExample />
            </InteractiveExample>
            
            <InteractiveExample
              title="Loading State"
              description="Connection building during data fetch"
              showGrid={showGrid}
            >
              <LoadingStateExample />
            </InteractiveExample>
            
            <InteractiveExample
              title="Notification Alert"
              description="Pulse animation for new activity"
              showGrid={showGrid}
            >
              <NotificationExample />
            </InteractiveExample>
            
            <InteractiveExample
              title="Form Focus"
              description="Root growth when input becomes active"
              showGrid={showGrid}
            >
              <FormFocusExample />
            </InteractiveExample>
            
            <InteractiveExample
              title="Social Connection"
              description="Network expansion for friend connections"
              showGrid={showGrid}
            >
              <SocialConnectionExample />
            </InteractiveExample>
            
            <InteractiveExample
              title="Menu Navigation"
              description="Path highlighting for navigation states"
              showGrid={showGrid}
            >
              <MenuNavigationExample />
            </InteractiveExample>
          </div>
        </div>

        {/* App State Transitions */}
        <div className="mt-16">
          <h2 className="text-2xl font-medium text-foreground mb-8">App State Transitions</h2>
          <p className="text-muted-foreground mb-8">
            Experience how the Central Square logo adapts to different application states, 
            using the root metaphor to communicate system status and user feedback.
          </p>
          <AppStateTransitions showGrid={showGrid} />
        </div>

        {/* Brand Motion System Guide */}
        <div className="mt-16">
          <h2 className="text-2xl font-medium text-foreground mb-8">Brand Motion System</h2>
          <BrandMotionGuide />
        </div>

        {/* Usage Examples */}
        <div className="mt-16">
          <h2 className="text-2xl font-medium text-foreground mb-8">Usage Examples</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <UsageExample
              title="App Icon"
              size="large"
              logo={<AnimatedRootsLogo size={80} />}
              showGrid={showGrid}
            />
            <UsageExample
              title="Header Logo"
              size="medium"
              logo={
                <div className="flex items-center gap-3">
                  <AnimatedRootsLogo size={32} />
                  <span className="text-xl font-medium">Central Square</span>
                </div>
              }
              showGrid={showGrid}
            />
            <UsageExample
              title="Loading State"
              size="medium"
              logo={<SequentialBloomLogo size={48} />}
              showGrid={showGrid}
            />
            <UsageExample
              title="Business Card"
              size="medium"
              logo={
                <div className="flex items-center gap-2">
                  <RadiatingPathsLogo size={24} />
                  <div>
                    <div className="font-medium">Central Square</div>
                    <div className="text-sm text-muted-foreground">Social Platform</div>
                  </div>
                </div>
              }
              showGrid={showGrid}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// Logo Card Component
function LogoCard({ variant, showGrid }: any) {
  const LogoComponent = variant.component;
  
  return (
    <Card className="p-6 bg-card border-border/20">
      {/* Logo Display */}
      <div className={`relative aspect-square bg-background rounded-lg border border-border/10 mb-4 flex items-center justify-center ${showGrid ? 'grid-bg' : ''}`}>
        <LogoComponent size={64} />
      </div>
      
      {/* Logo Info */}
      <div>
        <h3 className="font-medium text-foreground mb-1">{variant.name}</h3>
        <p className="text-sm text-muted-foreground mb-4">{variant.description}</p>
        
        {/* Size Variations */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <LogoComponent size={32} />
            <LogoComponent size={24} />
            <LogoComponent size={16} />
            <LogoComponent size={12} />
          </div>
        </div>
      </div>
    </Card>
  );
}

// Animation Example Component
function AnimationExample({ title, description, logo, showGrid }: any) {
  return (
    <Card className="p-6 bg-card border-border/20">
      <h3 className="font-medium text-foreground mb-1">{title}</h3>
      <p className="text-sm text-muted-foreground mb-4">{description}</p>
      <div className={`bg-background rounded-lg border border-border/10 p-8 flex items-center justify-center ${showGrid ? 'grid-bg' : ''}`}>
        {logo}
      </div>
    </Card>
  );
}

// Interactive Example Component
function InteractiveExample({ title, description, children, showGrid }: any) {
  return (
    <Card className="p-6 bg-card border-border/20">
      <h3 className="font-medium text-foreground mb-1">{title}</h3>
      <p className="text-sm text-muted-foreground mb-4">{description}</p>
      <div className={`bg-background rounded-lg border border-border/10 p-6 flex items-center justify-center ${showGrid ? 'grid-bg' : ''}`}>
        {children}
      </div>
    </Card>
  );
}

// Usage Example Component
function UsageExample({ title, size, logo, showGrid }: any) {
  return (
    <Card className="p-6 bg-card border-border/20">
      <h3 className="font-medium text-foreground mb-4">{title}</h3>
      <div className={`bg-background rounded-lg border border-border/10 p-6 flex items-center justify-center ${showGrid ? 'grid-bg' : ''}`}>
        {logo}
      </div>
    </Card>
  );
}

// Wrap the main component with SoundProvider
export default function LogoShowcase() {
  return (
    <SoundProvider>
      <LogoShowcaseContent />
    </SoundProvider>
  );
}