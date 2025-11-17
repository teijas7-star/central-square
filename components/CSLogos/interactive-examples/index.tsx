import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BrandMotion, useSound } from '../BrandMotionSystem';

// Interactive Context Components
export function HoverButtonExample() {
  const [isHovered, setIsHovered] = useState(false);
  const { playSound } = useSound();
  
  return (
    <motion.button
      className="flex items-center gap-3 px-6 py-3 bg-primary text-primary-foreground rounded-lg"
      onHoverStart={() => {
        setIsHovered(true);
        playSound('hover');
      }}
      onHoverEnd={() => setIsHovered(false)}
      onClick={() => playSound('click')}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <motion.svg width={24} height={24} viewBox="0 0 64 64" fill="none">
        <motion.circle 
          cx="32" 
          cy="32" 
          r="6" 
          fill="currentColor"
          animate={{ 
            scale: isHovered ? [1, 1.2, 1] : 1,
            transition: { 
              duration: BrandMotion.timing.slow, 
              ease: BrandMotion.easing.rootGrowth 
            }
          }}
        />
        
        <motion.path
          d="M32 26 Q32 18 32 8"
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
          animate={{ 
            pathLength: isHovered ? 1 : 0.3,
            opacity: isHovered ? 1 : 0.6,
            transition: { 
              duration: BrandMotion.timing.normal, 
              delay: BrandMotion.stagger.tight,
              ease: BrandMotion.easing.rootGrowth 
            }
          }}
        />
        
        <motion.path
          d="M38 32 Q46 32 56 32"
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
          animate={{ 
            pathLength: isHovered ? 1 : 0.3,
            opacity: isHovered ? 1 : 0.6,
            transition: { 
              duration: BrandMotion.timing.normal, 
              delay: BrandMotion.stagger.normal,
              ease: BrandMotion.easing.rootGrowth 
            }
          }}
        />
        
        <motion.path
          d="M32 38 Q32 46 32 56"
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
          animate={{ 
            pathLength: isHovered ? 1 : 0.3,
            opacity: isHovered ? 1 : 0.6,
            transition: { 
              duration: BrandMotion.timing.normal, 
              delay: BrandMotion.stagger.loose,
              ease: BrandMotion.easing.rootGrowth 
            }
          }}
        />
        
        <motion.path
          d="M26 32 Q18 32 8 32"
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
          animate={{ 
            pathLength: isHovered ? 1 : 0.3,
            opacity: isHovered ? 1 : 0.6,
            transition: { 
              duration: BrandMotion.timing.normal, 
              delay: BrandMotion.stagger.loose + BrandMotion.stagger.tight,
              ease: BrandMotion.easing.rootGrowth 
            }
          }}
        />
      </motion.svg>
      Join Community
    </motion.button>
  );
}

export function LoadingStateExample() {
  return (
    <div className="flex flex-col items-center gap-3">
      <motion.svg width={40} height={40} viewBox="0 0 64 64" fill="none">
        <motion.circle 
          cx="32" 
          cy="32" 
          r="6" 
          fill="currentColor"
          animate={{ 
            scale: [1, 1.1, 1],
            transition: { duration: 1.5, repeat: Infinity }
          }}
        />
        
        {[
          "M32 26 Q32 18 32 8",
          "M38 32 Q46 32 56 32", 
          "M32 38 Q32 46 32 56",
          "M26 32 Q18 32 8 32"
        ].map((path, index) => (
          <motion.path
            key={index}
            d={path}
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
            animate={{ 
              pathLength: [0, 1, 0],
              opacity: [0.3, 1, 0.3],
              transition: { 
                duration: 2,
                delay: index * 0.3,
                repeat: Infinity,
                ease: "easeInOut"
              }
            }}
          />
        ))}
      </motion.svg>
      <div className="text-sm text-muted-foreground">Connecting...</div>
    </div>
  );
}

export function NotificationExample() {
  const [hasNotification, setHasNotification] = useState(true);
  
  useEffect(() => {
    const timer = setInterval(() => {
      setHasNotification(prev => !prev);
    }, 4000);
    return () => clearInterval(timer);
  }, []);
  
  return (
    <div className="relative">
      <motion.div className="p-3 bg-muted rounded-lg">
        <motion.svg width={32} height={32} viewBox="0 0 64 64" fill="none">
          <motion.circle 
            cx="32" 
            cy="32" 
            r="6" 
            fill="currentColor"
            animate={{ 
              scale: hasNotification ? [1, 1.3, 1] : 1,
              transition: { duration: 0.8, ease: "easeOut" }
            }}
          />
          
          <motion.path
            d="M32 26 Q32 18 32 8"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
            animate={{ 
              pathLength: hasNotification ? [0, 1] : 0.5,
              opacity: hasNotification ? [0.5, 1] : 0.7,
              transition: { duration: 0.6, delay: 0.2 }
            }}
          />
        </motion.svg>
      </motion.div>
      
      {hasNotification && (
        <motion.div 
          className="absolute -top-2 -right-2 w-5 h-5 bg-destructive rounded-full flex items-center justify-center"
          initial={{ scale: 0 }}
          animate={{ scale: [0, 1.2, 1] }}
          transition={{ duration: 0.4 }}
        >
          <motion.div 
            className="w-2 h-2 bg-destructive-foreground rounded-full"
            animate={{ 
              scale: [1, 1.2, 1],
              transition: { duration: 1, repeat: Infinity }
            }}
          />
        </motion.div>
      )}
    </div>
  );
}

export function FormFocusExample() {
  const [isFocused, setIsFocused] = useState(false);
  const { playSound } = useSound();
  
  return (
    <div className="flex items-center gap-3 w-full max-w-xs">
      <motion.svg width={20} height={20} viewBox="0 0 64 64" fill="none">
        <motion.circle 
          cx="32" 
          cy="32" 
          r="6" 
          fill="currentColor"
          animate={{ 
            scale: isFocused ? 1.1 : 1,
            transition: { duration: 0.3 }
          }}
        />
        
        <motion.path
          d="M38 32 Q46 32 56 32"
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
          animate={{ 
            pathLength: isFocused ? 1 : 0.2,
            opacity: isFocused ? 1 : 0.4,
            transition: { duration: 0.4, ease: "easeOut" }
          }}
        />
      </motion.svg>
      
      <input
        type="text"
        placeholder="Search communities..."
        className="flex-1 px-3 py-2 bg-input-background border border-border rounded-md text-sm"
        onFocus={() => {
          setIsFocused(true);
          playSound('focus');
        }}
        onBlur={() => setIsFocused(false)}
      />
    </div>
  );
}

export function SocialConnectionExample() {
  const [connections, setConnections] = useState(2);
  const { playSound } = useSound();
  
  const handleConnect = () => {
    setConnections(prev => {
      const newValue = Math.min(prev + 1, 6);
      if (newValue > prev) {
        playSound('connect');
      }
      return newValue;
    });
  };
  
  return (
    <div className="flex flex-col items-center gap-3">
      <motion.svg width={48} height={48} viewBox="0 0 64 64" fill="none">
        <motion.circle 
          cx="32" 
          cy="32" 
          r="6" 
          fill="currentColor"
          animate={{ 
            scale: [1, 1.05, 1],
            transition: { duration: 2, repeat: Infinity }
          }}
        />
        
        {[
          { path: "M32 26 Q32 18 32 8", active: connections >= 1 },
          { path: "M38 32 Q46 32 56 32", active: connections >= 2 },
          { path: "M32 38 Q32 46 32 56", active: connections >= 3 },
          { path: "M26 32 Q18 32 8 32", active: connections >= 4 },
          { path: "M44 20 Q48 16 52 12", active: connections >= 5 },
          { path: "M44 44 Q48 48 52 52", active: connections >= 6 }
        ].map((item, index) => (
          <motion.path
            key={index}
            d={item.path}
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
            animate={{ 
              pathLength: item.active ? 1 : 0,
              opacity: item.active ? 1 : 0.2,
              transition: { 
                duration: 0.8, 
                delay: item.active ? index * 0.2 : 0,
                ease: "easeOut" 
              }
            }}
          />
        ))}
      </motion.svg>
      
      <button 
        onClick={handleConnect}
        className="px-4 py-2 bg-secondary text-secondary-foreground rounded-md text-sm"
        disabled={connections >= 6}
      >
        {connections >= 6 ? 'All Connected' : 'Connect'}
      </button>
    </div>
  );
}

export function MenuNavigationExample() {
  const [activeItem, setActiveItem] = useState<number | null>(null);
  const { playSound } = useSound();
  
  const menuItems = ['Home', 'Communities', 'Messages', 'Profile'];
  
  return (
    <div className="flex flex-col gap-2">
      {menuItems.map((item, index) => (
        <motion.button
          key={item}
          className={`flex items-center gap-3 px-3 py-2 text-left rounded-md transition-colors ${
            activeItem === index ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
          }`}
          onHoverStart={() => {
            setActiveItem(index);
            playSound('hover');
          }}
          onHoverEnd={() => setActiveItem(null)}
        >
          <motion.svg width={16} height={16} viewBox="0 0 64 64" fill="none">
            <motion.circle 
              cx="32" 
              cy="32" 
              r="4" 
              fill="currentColor"
              animate={{ 
                scale: activeItem === index ? 1.2 : 1,
                transition: { duration: 0.2 }
              }}
            />
            
            <motion.path
              d="M36 32 Q42 32 48 32"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
              animate={{ 
                pathLength: activeItem === index ? 1 : 0.3,
                opacity: activeItem === index ? 1 : 0.5,
                transition: { duration: 0.3, ease: "easeOut" }
              }}
            />
          </motion.svg>
          <span className="text-sm">{item}</span>
        </motion.button>
      ))}
    </div>
  );
}