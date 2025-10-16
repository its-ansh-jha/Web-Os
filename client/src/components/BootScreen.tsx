
import { useEffect, useState } from 'react';
import * as Icons from 'lucide-react';

interface BootScreenProps {
  action: 'shutdown' | 'restart' | 'lock';
  onComplete?: () => void;
}

export function BootScreen({ action, onComplete }: BootScreenProps) {
  const [stage, setStage] = useState(0);
  const [dots, setDots] = useState('');

  useEffect(() => {
    const dotInterval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? '' : prev + '.');
    }, 500);

    return () => clearInterval(dotInterval);
  }, []);

  useEffect(() => {
    const stages = action === 'lock' ? 1 : action === 'shutdown' ? 3 : 4;
    
    const timer = setInterval(() => {
      setStage(prev => {
        if (prev >= stages) {
          clearInterval(timer);
          if (action === 'restart') {
            setTimeout(() => {
              if (onComplete) onComplete();
            }, 1000);
          }
          return prev;
        }
        return prev + 1;
      });
    }, action === 'lock' ? 500 : 1500);

    return () => clearInterval(timer);
  }, [action, onComplete]);

  const getStageText = () => {
    if (action === 'lock') {
      return 'Locking system';
    }
    
    if (action === 'shutdown') {
      switch (stage) {
        case 0: return 'Saving your work';
        case 1: return 'Closing applications';
        case 2: return 'Shutting down';
        case 3: return 'Goodbye';
        default: return '';
      }
    }
    
    if (action === 'restart') {
      switch (stage) {
        case 0: return 'Saving your work';
        case 1: return 'Closing applications';
        case 2: return 'Restarting';
        case 3: return 'Booting WebOS';
        case 4: return 'Welcome back';
        default: return '';
      }
    }
  };

  const getIcon = () => {
    if (action === 'lock') return <Icons.Lock className="w-16 h-16 animate-pulse" />;
    if (action === 'shutdown') return <Icons.Power className="w-16 h-16 animate-pulse" />;
    return <Icons.RotateCw className="w-16 h-16 animate-spin" />;
  };

  return (
    <div 
      className="fixed inset-0 bg-black z-[99999] flex flex-col items-center justify-center"
      data-testid={`boot-screen-${action}`}
    >
      <div className="text-white text-center space-y-8">
        {getIcon()}
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold">{getStageText()}{dots}</h2>
          {action !== 'lock' && (
            <div className="w-64 h-2 bg-gray-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-500 transition-all duration-500"
                style={{ 
                  width: `${(stage / (action === 'shutdown' ? 3 : 4)) * 100}%` 
                }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
