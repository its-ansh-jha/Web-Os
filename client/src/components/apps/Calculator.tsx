import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function Calculator() {
  const [display, setDisplay] = useState('0');
  const [previousValue, setPreviousValue] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [newNumber, setNewNumber] = useState(true);

  const handleNumber = (num: string) => {
    if (newNumber) {
      setDisplay(num);
      setNewNumber(false);
    } else {
      setDisplay(display === '0' ? num : display + num);
    }
  };

  const handleOperation = (op: string) => {
    const current = parseFloat(display);
    if (previousValue !== null && operation && !newNumber) {
      const result = calculate(previousValue, current, operation);
      setDisplay(result.toString());
      setPreviousValue(result);
    } else {
      setPreviousValue(current);
    }
    setOperation(op);
    setNewNumber(true);
  };

  const calculate = (a: number, b: number, op: string): number => {
    switch (op) {
      case '+': return a + b;
      case '-': return a - b;
      case '×': return a * b;
      case '÷': return a / b;
      default: return b;
    }
  };

  const handleEquals = () => {
    if (previousValue !== null && operation) {
      const result = calculate(previousValue, parseFloat(display), operation);
      setDisplay(result.toString());
      setPreviousValue(null);
      setOperation(null);
      setNewNumber(true);
    }
  };

  const handleClear = () => {
    setDisplay('0');
    setPreviousValue(null);
    setOperation(null);
    setNewNumber(true);
  };

  const handleDecimal = () => {
    if (newNumber) {
      setDisplay('0.');
      setNewNumber(false);
    } else if (!display.includes('.')) {
      setDisplay(display + '.');
    }
  };

  const buttons = [
    { label: 'C', onClick: handleClear, variant: 'destructive' },
    { label: '÷', onClick: () => handleOperation('÷'), variant: 'secondary' },
    { label: '×', onClick: () => handleOperation('×'), variant: 'secondary' },
    { label: '-', onClick: () => handleOperation('-'), variant: 'secondary' },
    { label: '7', onClick: () => handleNumber('7') },
    { label: '8', onClick: () => handleNumber('8') },
    { label: '9', onClick: () => handleNumber('9') },
    { label: '+', onClick: () => handleOperation('+'), variant: 'secondary', span: 'row' },
    { label: '4', onClick: () => handleNumber('4') },
    { label: '5', onClick: () => handleNumber('5') },
    { label: '6', onClick: () => handleNumber('6') },
    { label: '1', onClick: () => handleNumber('1') },
    { label: '2', onClick: () => handleNumber('2') },
    { label: '3', onClick: () => handleNumber('3') },
    { label: '=', onClick: handleEquals, variant: 'default', span: 'row' },
    { label: '0', onClick: () => handleNumber('0'), span: 'col' },
    { label: '.', onClick: handleDecimal },
  ];

  return (
    <div className="flex flex-col h-full p-4 gap-4">
      {/* Display */}
      <div className="bg-black/20 rounded-lg p-6 text-right">
        <div className="text-4xl font-mono" data-testid="calculator-display">{display}</div>
        {operation && (
          <div className="text-sm text-muted-foreground mt-1">
            {previousValue} {operation}
          </div>
        )}
      </div>

      {/* Buttons */}
      <div className="grid grid-cols-4 gap-2 flex-1">
        {buttons.map((btn, i) => (
          <Button
            key={i}
            onClick={btn.onClick}
            variant={btn.variant as any || 'outline'}
            className={cn(
              'text-xl font-semibold',
              btn.span === 'col' && 'col-span-2',
              btn.span === 'row' && 'row-span-2'
            )}
            data-testid={`button-${btn.label}`}
          >
            {btn.label}
          </Button>
        ))}
      </div>
    </div>
  );
}
