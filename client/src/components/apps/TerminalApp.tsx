import { useState, useRef, useEffect } from 'react';
import { useStore } from '@/store/useStore';
import { Input } from '@/components/ui/input';
import * as Icons from 'lucide-react';

export function TerminalApp() {
  const { terminalHistory, addTerminalCommand } = useStore();
  const [input, setInput] = useState('');
  const [output, setOutput] = useState<Array<{ type: 'command' | 'output' | 'error'; text: string }>>([
    { type: 'output', text: 'WebOS Terminal v1.0.0' },
    { type: 'output', text: 'Type "help" for available commands' },
    { type: 'output', text: '' },
  ]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [output]);

  const commands = {
    help: () => [
      'Available commands:',
      '  help - Show this help message',
      '  clear - Clear the terminal',
      '  echo <text> - Print text',
      '  date - Show current date and time',
      '  whoami - Display current user',
      '  ls - List files (simulated)',
      '  pwd - Print working directory',
      '  calc <expression> - Calculate math expression',
      '',
    ],
    clear: () => {
      setOutput([]);
      return [];
    },
    echo: (args: string) => [args || ''],
    date: () => [new Date().toString()],
    whoami: () => ['user@webos'],
    ls: () => ['Desktop', 'Documents', 'Downloads', 'Pictures', ''],
    pwd: () => ['/home/user'],
    calc: (args: string) => {
      try {
        const result = eval(args);
        return [result.toString()];
      } catch {
        return ['Error: Invalid expression'];
      }
    },
  };

  const handleCommand = (cmd: string) => {
    if (!cmd.trim()) return;

    addTerminalCommand(cmd);
    const [command, ...args] = cmd.trim().split(' ');
    const argsStr = args.join(' ');

    setOutput((prev) => [...prev, { type: 'command', text: `$ ${cmd}` }]);

    if (command in commands) {
      const result = commands[command as keyof typeof commands](argsStr);
      if (result.length > 0) {
        setOutput((prev) => [...prev, ...result.map((text) => ({ type: 'output' as const, text }))]);
      }
    } else {
      setOutput((prev) => [
        ...prev,
        { type: 'error', text: `Command not found: ${command}. Type "help" for available commands.` },
      ]);
    }

    setInput('');
    setHistoryIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleCommand(input);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (terminalHistory.length > 0 && historyIndex < terminalHistory.length - 1) {
        const newIndex = historyIndex + 1;
        setHistoryIndex(newIndex);
        setInput(terminalHistory[terminalHistory.length - 1 - newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setInput(terminalHistory[terminalHistory.length - 1 - newIndex]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setInput('');
      }
    }
  };

  return (
    <div className="flex flex-col h-full bg-black/90 font-mono text-sm">
      {/* Output */}
      <div ref={scrollRef} className="flex-1 overflow-auto p-4 space-y-1">
        {output.map((line, i) => (
          <div
            key={i}
            className={
              line.type === 'command'
                ? 'text-primary'
                : line.type === 'error'
                ? 'text-red-400'
                : 'text-green-400'
            }
          >
            {line.text}
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="flex items-center gap-2 p-4 border-t border-white/10">
        <span className="text-primary">$</span>
        <Input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 bg-transparent border-0 focus-visible:ring-0 text-green-400 font-mono"
          placeholder="Enter command..."
          autoFocus
          data-testid="input-terminal"
        />
      </div>
    </div>
  );
}
