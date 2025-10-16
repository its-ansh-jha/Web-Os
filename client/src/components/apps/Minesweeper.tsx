import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import * as Icons from 'lucide-react';
import { cn } from '@/lib/utils';

interface Cell {
  isMine: boolean;
  isRevealed: boolean;
  isFlagged: boolean;
  neighborMines: number;
}

const ROWS = 10;
const COLS = 10;
const MINES = 15;

export function Minesweeper() {
  const [board, setBoard] = useState<Cell[][]>([]);
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);
  const [minesLeft, setMinesLeft] = useState(MINES);

  useEffect(() => {
    initBoard();
  }, []);

  const initBoard = () => {
    const newBoard: Cell[][] = Array(ROWS).fill(null).map(() =>
      Array(COLS).fill(null).map(() => ({
        isMine: false,
        isRevealed: false,
        isFlagged: false,
        neighborMines: 0,
      }))
    );

    let minesPlaced = 0;
    while (minesPlaced < MINES) {
      const row = Math.floor(Math.random() * ROWS);
      const col = Math.floor(Math.random() * COLS);
      if (!newBoard[row][col].isMine) {
        newBoard[row][col].isMine = true;
        minesPlaced++;
      }
    }

    for (let row = 0; row < ROWS; row++) {
      for (let col = 0; col < COLS; col++) {
        if (!newBoard[row][col].isMine) {
          let count = 0;
          for (let dr = -1; dr <= 1; dr++) {
            for (let dc = -1; dc <= 1; dc++) {
              const newRow = row + dr;
              const newCol = col + dc;
              if (
                newRow >= 0 &&
                newRow < ROWS &&
                newCol >= 0 &&
                newCol < COLS &&
                newBoard[newRow][newCol].isMine
              ) {
                count++;
              }
            }
          }
          newBoard[row][col].neighborMines = count;
        }
      }
    }

    setBoard(newBoard);
    setGameOver(false);
    setWon(false);
    setMinesLeft(MINES);
  };

  const revealCell = (row: number, col: number) => {
    if (gameOver || won || board[row][col].isRevealed || board[row][col].isFlagged) return;

    const newBoard = [...board.map((r) => [...r])];
    
    if (newBoard[row][col].isMine) {
      newBoard[row][col].isRevealed = true;
      setBoard(newBoard);
      setGameOver(true);
      return;
    }

    const reveal = (r: number, c: number) => {
      if (r < 0 || r >= ROWS || c < 0 || c >= COLS || newBoard[r][c].isRevealed) return;
      newBoard[r][c].isRevealed = true;

      if (newBoard[r][c].neighborMines === 0 && !newBoard[r][c].isMine) {
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            reveal(r + dr, c + dc);
          }
        }
      }
    };

    reveal(row, col);
    setBoard(newBoard);

    const revealedCount = newBoard.flat().filter((c) => c.isRevealed).length;
    if (revealedCount === ROWS * COLS - MINES) {
      setWon(true);
    }
  };

  const toggleFlag = (e: React.MouseEvent, row: number, col: number) => {
    e.preventDefault();
    if (gameOver || won || board[row][col].isRevealed) return;

    const newBoard = [...board.map((r) => [...r])];
    newBoard[row][col].isFlagged = !newBoard[row][col].isFlagged;
    setBoard(newBoard);
    setMinesLeft(minesLeft + (newBoard[row][col].isFlagged ? -1 : 1));
  };

  return (
    <div className="flex flex-col items-center justify-center h-full gap-4 p-4">
      <div className="flex items-center justify-between w-full max-w-md gap-4">
        <div className="flex items-center gap-2">
          <Icons.Flag className="h-5 w-5" />
          <span className="font-semibold" data-testid="mines-left">{minesLeft}</span>
        </div>
        <Button onClick={initBoard} size="sm" data-testid="button-new-game">
          <Icons.RotateCw className="h-4 w-4 mr-2" />
          New Game
        </Button>
        {(gameOver || won) && (
          <span className={cn("font-semibold", won ? "text-green-500" : "text-red-500")}>
            {won ? 'You Won!' : 'Game Over'}
          </span>
        )}
      </div>

      <div className="inline-block border-4 border-primary rounded-lg overflow-hidden" data-testid="minesweeper-grid">
        {board.map((row, rowIndex) => (
          <div key={rowIndex} className="flex">
            {row.map((cell, colIndex) => (
              <button
                key={colIndex}
                onClick={() => revealCell(rowIndex, colIndex)}
                onContextMenu={(e) => toggleFlag(e, rowIndex, colIndex)}
                className={cn(
                  "w-8 h-8 border border-border/30 flex items-center justify-center text-sm font-semibold transition-colors",
                  cell.isRevealed
                    ? cell.isMine
                      ? "bg-destructive text-destructive-foreground"
                      : "bg-muted"
                    : "bg-card hover-elevate"
                )}
                data-testid={`cell-${rowIndex}-${colIndex}`}
              >
                {cell.isRevealed ? (
                  cell.isMine ? (
                    <Icons.Bomb className="h-4 w-4" />
                  ) : cell.neighborMines > 0 ? (
                    cell.neighborMines
                  ) : null
                ) : cell.isFlagged ? (
                  <Icons.Flag className="h-3 w-3 text-primary" />
                ) : null}
              </button>
            ))}
          </div>
        ))}
      </div>

      <div className="text-sm text-muted-foreground">
        Left click to reveal, right click to flag
      </div>
    </div>
  );
}
