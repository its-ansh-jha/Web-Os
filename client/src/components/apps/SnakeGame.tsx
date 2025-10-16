import { useState, useEffect, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { useCreateHighScore } from '@/hooks/useData';
import * as Icons from 'lucide-react';

type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';
type Position = { x: number; y: number };

const GRID_SIZE = 20;
const CELL_SIZE = 20;

export function SnakeGame() {
  const createHighScore = useCreateHighScore();
  const [snake, setSnake] = useState<Position[]>([{ x: 10, y: 10 }]);
  const [food, setFood] = useState<Position>({ x: 15, y: 15 });
  const [direction, setDirection] = useState<Direction>('RIGHT');
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const directionRef = useRef(direction);

  useEffect(() => {
    directionRef.current = direction;
  }, [direction]);

  const generateFood = useCallback(() => {
    const newFood = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };
    setFood(newFood);
  }, []);

  const resetGame = () => {
    setSnake([{ x: 10, y: 10 }]);
    setDirection('RIGHT');
    directionRef.current = 'RIGHT';
    setGameOver(false);
    setScore(0);
    setIsPlaying(false);
    generateFood();
  };

  const moveSnake = useCallback(() => {
    if (gameOver || !isPlaying) return;

    setSnake((prevSnake) => {
      const head = prevSnake[0];
      const currentDirection = directionRef.current;
      let newHead: Position;

      switch (currentDirection) {
        case 'UP':
          newHead = { x: head.x, y: head.y - 1 };
          break;
        case 'DOWN':
          newHead = { x: head.x, y: head.y + 1 };
          break;
        case 'LEFT':
          newHead = { x: head.x - 1, y: head.y };
          break;
        case 'RIGHT':
          newHead = { x: head.x + 1, y: head.y };
          break;
      }

      if (
        newHead.x < 0 ||
        newHead.x >= GRID_SIZE ||
        newHead.y < 0 ||
        newHead.y >= GRID_SIZE ||
        prevSnake.some((segment) => segment.x === newHead.x && segment.y === newHead.y)
      ) {
        setGameOver(true);
        setIsPlaying(false);
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      if (newHead.x === food.x && newHead.y === food.y) {
        setScore((s) => s + 10);
        generateFood();
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [gameOver, isPlaying, food, generateFood]);

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(moveSnake, 150);
    return () => clearInterval(interval);
  }, [isPlaying, moveSnake]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!isPlaying) return;
      const key = e.key;
      const currentDir = directionRef.current;

      if (key === 'ArrowUp' && currentDir !== 'DOWN') {
        setDirection('UP');
      } else if (key === 'ArrowDown' && currentDir !== 'UP') {
        setDirection('DOWN');
      } else if (key === 'ArrowLeft' && currentDir !== 'RIGHT') {
        setDirection('LEFT');
      } else if (key === 'ArrowRight' && currentDir !== 'LEFT') {
        setDirection('RIGHT');
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isPlaying]);

  useEffect(() => {
    if (gameOver && score > 0) {
      createHighScore.mutate({
        game: 'Snake',
        score,
        playerName: 'Player',
      });
    }
  }, [gameOver, score]);

  return (
    <div className="flex flex-col items-center justify-center h-full gap-4 p-6">
      <div className="flex items-center justify-between w-full max-w-md">
        <div className="text-xl font-semibold">Score: <span data-testid="snake-score">{score}</span></div>
        {!isPlaying && !gameOver && (
          <Button onClick={() => setIsPlaying(true)} data-testid="button-start">
            <Icons.Play className="h-4 w-4 mr-2" />
            Start
          </Button>
        )}
        {gameOver && (
          <Button onClick={resetGame} data-testid="button-restart">
            <Icons.RotateCw className="h-4 w-4 mr-2" />
            Restart
          </Button>
        )}
      </div>

      <div
        className="relative border-4 border-primary rounded-lg bg-muted/30"
        style={{
          width: GRID_SIZE * CELL_SIZE,
          height: GRID_SIZE * CELL_SIZE,
        }}
        data-testid="game-grid"
      >
        {snake.map((segment, i) => (
          <div
            key={i}
            className="absolute bg-primary rounded-sm"
            style={{
              left: segment.x * CELL_SIZE,
              top: segment.y * CELL_SIZE,
              width: CELL_SIZE - 2,
              height: CELL_SIZE - 2,
            }}
          />
        ))}
        <div
          className="absolute bg-destructive rounded-full"
          style={{
            left: food.x * CELL_SIZE,
            top: food.y * CELL_SIZE,
            width: CELL_SIZE - 2,
            height: CELL_SIZE - 2,
          }}
        />
        {gameOver && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-lg">
            <div className="text-2xl font-bold text-white">Game Over!</div>
          </div>
        )}
      </div>

      <div className="text-sm text-muted-foreground">
        Use arrow keys to control the snake
      </div>
    </div>
  );
}
