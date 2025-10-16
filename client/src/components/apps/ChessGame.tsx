import { useState } from 'react';
import { Chess, Square } from 'chess.js';
import { Button } from '@/components/ui/button';
import * as Icons from 'lucide-react';
import { cn } from '@/lib/utils';

const pieceSymbols: Record<string, string> = {
  'p': '♟', 'n': '♞', 'b': '♝', 'r': '♜', 'q': '♛', 'k': '♚',
  'P': '♙', 'N': '♘', 'B': '♗', 'R': '♖', 'Q': '♕', 'K': '♔',
};

export function ChessGame() {
  const [game] = useState(new Chess());
  const [board, setBoard] = useState(game.board());
  const [selectedSquare, setSelectedSquare] = useState<Square | null>(null);
  const [gameOver, setGameOver] = useState(false);

  const handleSquareClick = (row: number, col: number) => {
    const square = `${String.fromCharCode(97 + col)}${8 - row}` as Square;

    if (selectedSquare) {
      try {
        game.move({ from: selectedSquare, to: square });
        setBoard(game.board());
        setSelectedSquare(null);

        if (game.isGameOver()) {
          setGameOver(true);
        } else {
          setTimeout(() => {
            const moves = game.moves({ verbose: true });
            if (moves.length > 0) {
              const randomMove = moves[Math.floor(Math.random() * moves.length)];
              game.move(randomMove);
              setBoard(game.board());
              if (game.isGameOver()) {
                setGameOver(true);
              }
            }
          }, 300);
        }
      } catch (e) {
        setSelectedSquare(square);
      }
    } else {
      setSelectedSquare(square);
    }
  };

  const resetGame = () => {
    game.reset();
    setBoard(game.board());
    setSelectedSquare(null);
    setGameOver(false);
  };

  return (
    <div className="flex flex-col items-center justify-center h-full gap-4 p-4">
      <div className="flex items-center justify-between w-full max-w-md">
        <div className="text-sm font-medium">
          Turn: {game.turn() === 'w' ? 'White' : 'Black'}
        </div>
        <Button onClick={resetGame} size="sm" data-testid="button-new-game">
          <Icons.RotateCw className="h-4 w-4 mr-2" />
          New Game
        </Button>
      </div>

      <div className="border-4 border-primary rounded-lg overflow-hidden" data-testid="chess-board">
        {board.map((row, rowIndex) => (
          <div key={rowIndex} className="flex">
            {row.map((piece, colIndex) => {
              const square = `${String.fromCharCode(97 + colIndex)}${8 - rowIndex}` as Square;
              const isLight = (rowIndex + colIndex) % 2 === 0;
              const isSelected = selectedSquare === square;

              return (
                <button
                  key={colIndex}
                  onClick={() => handleSquareClick(rowIndex, colIndex)}
                  className={cn(
                    "w-16 h-16 flex items-center justify-center text-4xl transition-colors",
                    isLight ? "bg-amber-100 dark:bg-amber-200" : "bg-amber-800 dark:bg-amber-900",
                    isSelected && "ring-4 ring-primary ring-inset",
                    !gameOver && "hover-elevate"
                  )}
                  data-testid={`square-${square}`}
                >
                  {piece && (
                    <span className={piece.color === 'w' ? 'text-white drop-shadow-lg' : 'text-black'}>
                      {pieceSymbols[piece.type.toUpperCase()]}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {gameOver && (
        <div className="text-lg font-semibold text-primary">
          {game.isCheckmate() ? `Checkmate! ${game.turn() === 'w' ? 'Black' : 'White'} wins!` : 'Game Over'}
        </div>
      )}

      <div className="text-sm text-muted-foreground">
        Click a piece to select, then click destination
      </div>
    </div>
  );
}
