
import { useState } from 'react';
import { useStore } from '@/store/useStore';
import { Button } from './ui/button';
import { Input } from './ui/input';
import * as Icons from 'lucide-react';
import { format } from 'date-fns';

export function LockScreen() {
  const { time, unlock } = useStore();
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple unlock mechanism - any non-empty password works
    if (password.length > 0) {
      unlock();
      setPassword('');
      setError(false);
    } else {
      setError(true);
      setTimeout(() => setError(false), 500);
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 z-[99998] flex flex-col items-center justify-center"
      data-testid="lock-screen"
    >
      <div className="text-white text-center space-y-8">
        <div className="space-y-2">
          <h1 className="text-7xl font-bold">{format(time, 'HH:mm')}</h1>
          <p className="text-xl opacity-80">{format(time, 'EEEE, MMMM d')}</p>
        </div>

        <div className="w-24 h-24 mx-auto rounded-full bg-white/20 flex items-center justify-center">
          <Icons.User className="w-12 h-12" />
        </div>

        <form onSubmit={handleUnlock} className="space-y-4">
          <div className={`transition-transform ${error ? 'animate-shake' : ''}`}>
            <Input
              type="password"
              placeholder="Enter password to unlock"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-80 bg-white/10 border-white/20 text-white placeholder:text-white/50"
              data-testid="input-unlock-password"
            />
          </div>
          <Button 
            type="submit" 
            className="w-full"
            data-testid="button-unlock"
          >
            <Icons.Unlock className="w-4 h-4 mr-2" />
            Unlock
          </Button>
        </form>
      </div>
    </div>
  );
}
