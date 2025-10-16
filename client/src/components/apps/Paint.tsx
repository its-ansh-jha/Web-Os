import { useRef, useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import * as Icons from 'lucide-react';
import { cn } from '@/lib/utils';

type Tool = 'brush' | 'eraser' | 'line' | 'rectangle' | 'circle' | 'fill';

export function Paint() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [tool, setTool] = useState<Tool>('brush');
  const [color, setColor] = useState('#000000');
  const [lineWidth, setLineWidth] = useState(3);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setStartPos({ x, y });
    setIsDrawing(true);

    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.strokeStyle = tool === 'eraser' ? 'white' : color;
    ctx.lineWidth = lineWidth;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (tool === 'brush' || tool === 'eraser') {
      ctx.lineTo(x, y);
      ctx.stroke();
    }
  };

  const stopDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (tool === 'line') {
      ctx.beginPath();
      ctx.moveTo(startPos.x, startPos.y);
      ctx.lineTo(x, y);
      ctx.stroke();
    } else if (tool === 'rectangle') {
      ctx.strokeRect(startPos.x, startPos.y, x - startPos.x, y - startPos.y);
    } else if (tool === 'circle') {
      const radius = Math.sqrt(Math.pow(x - startPos.x, 2) + Math.pow(y - startPos.y, 2));
      ctx.beginPath();
      ctx.arc(startPos.x, startPos.y, radius, 0, 2 * Math.PI);
      ctx.stroke();
    }

    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  const saveImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const url = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = 'painting.png';
    a.click();
  };

  const tools = [
    { id: 'brush', icon: 'Brush', label: 'Brush' },
    { id: 'eraser', icon: 'Eraser', label: 'Eraser' },
    { id: 'line', icon: 'Minus', label: 'Line' },
    { id: 'square', icon: 'Square', label: 'Rectangle', value: 'rectangle' },
    { id: 'circle', icon: 'Circle', label: 'Circle' },
  ];

  return (
    <div className="flex h-full">
      {/* Toolbar */}
      <div className="w-20 border-r border-border/50 p-2 space-y-2">
        {tools.map((t) => {
          const IconComponent = Icons[t.icon as keyof typeof Icons] as any;
          return (
            <Button
              key={t.id}
              variant={tool === (t.value || t.id) ? 'default' : 'ghost'}
              size="icon"
              className="w-full h-12"
              onClick={() => setTool((t.value || t.id) as Tool)}
              data-testid={`tool-${t.id}`}
            >
              <IconComponent className="h-5 w-5" />
            </Button>
          );
        })}
        <div className="pt-4 space-y-2">
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="w-full h-12 rounded-md cursor-pointer"
            data-testid="color-picker"
          />
          <select
            value={lineWidth}
            onChange={(e) => setLineWidth(Number(e.target.value))}
            className="w-full h-10 rounded-md bg-background border border-border px-2"
            data-testid="line-width"
          >
            <option value="1">1px</option>
            <option value="3">3px</option>
            <option value="5">5px</option>
            <option value="10">10px</option>
            <option value="20">20px</option>
          </select>
        </div>
      </div>

      {/* Canvas Area */}
      <div className="flex-1 flex flex-col">
        <div className="flex items-center gap-2 p-2 border-b border-border/50">
          <Button size="sm" variant="ghost" onClick={clearCanvas} data-testid="button-clear">
            <Icons.Trash2 className="h-4 w-4 mr-2" />
            Clear
          </Button>
          <Button size="sm" variant="ghost" onClick={saveImage} data-testid="button-save">
            <Icons.Download className="h-4 w-4 mr-2" />
            Save
          </Button>
        </div>
        <div className="flex-1 flex items-center justify-center p-4 bg-muted/20">
          <canvas
            ref={canvasRef}
            width={700}
            height={500}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            className="bg-white border border-border shadow-lg cursor-crosshair"
            data-testid="paint-canvas"
          />
        </div>
      </div>
    </div>
  );
}
