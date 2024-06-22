import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import styles from '../_styles/Mines.module.scss';

const BOARD_SIZE = 10;
const MINE_COUNT = 10;

interface Cell {
  isMine: boolean;
  isOpen: boolean;
  isFlagged: boolean;
  count: number;
}

const Mines = () => {
  const [board, setBoard] = useState<Cell[][]>([]);
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [time, setTime] = useState(0);
  const [flags, setFlags] = useState(MINE_COUNT);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    initializeBoard();
    startTimer();
    return () => {
      stopTimer();
    };
  }, []);

  useEffect(() => {
    if (gameOver || gameWon) {
      stopTimer();
    }
  }, [gameOver, gameWon]);

  const startTimer = () => {
    timerRef.current = setInterval(() => {
      setTime((prevTime) => prevTime + 1);
    }, 1000);
  };

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const initializeBoard = () => {
    const newBoard: Cell[][] = [];

    for (let i = 0; i < BOARD_SIZE; i++) {
      newBoard.push([]);
      for (let j = 0; j < BOARD_SIZE; j++) {
        newBoard[i].push({
          isMine: false,
          isOpen: false,
          isFlagged: false,
          count: 0,
        });
      }
    }

    let minesPlaced = 0;
    while (minesPlaced < MINE_COUNT) {
      const randRow = Math.floor(Math.random() * BOARD_SIZE);
      const randCol = Math.floor(Math.random() * BOARD_SIZE);
      if (!newBoard[randRow][randCol].isMine) {
        newBoard[randRow][randCol].isMine = true;
        minesPlaced++;
      }
    }

    for (let i = 0; i < BOARD_SIZE; i++) {
      for (let j = 0; j < BOARD_SIZE; j++) {
        if (!newBoard[i][j].isMine) {
          let count = 0;
          for (let di = -1; di <= 1; di++) {
            for (let dj = -1; dj <= 1; dj++) {
              if (di !== 0 || dj !== 0) {
                const ni = i + di;
                const nj = j + dj;
                if (ni >= 0 && ni < BOARD_SIZE && nj >= 0 && nj < BOARD_SIZE) {
                  if (newBoard[ni][nj].isMine) {
                    count++;
                  }
                }
              }
            }
          }
          newBoard[i][j].count = count;
        }
      }
    }

    setBoard(newBoard);
    setGameOver(false);
    setGameWon(false);
    setTime(0);
    setFlags(MINE_COUNT);
  };

  const handleCellClick = (row: number, col: number) => {
    if (
      gameOver ||
      gameWon ||
      board[row][col].isOpen ||
      board[row][col].isFlagged
    ) {
      return;
    }

    let newBoard = [...board];
    newBoard[row][col].isOpen = true;

    if (newBoard[row][col].isMine) {
      setGameOver(true);
      revealAllMines(newBoard);
    } else {
      if (newBoard[row][col].count === 0) {
        newBoard = openAdjacentCells(newBoard, row, col);
      }

      if (checkGameWon(newBoard)) {
        setGameWon(true);
      }

      setBoard(newBoard);
    }
  };

  const handleRightClick = (
    event: React.MouseEvent,
    row: number,
    col: number,
  ) => {
    event.preventDefault();

    if (gameOver || gameWon || board[row][col].isOpen) {
      return;
    }

    let newBoard = [...board];
    if (newBoard[row][col].isFlagged) {
      newBoard[row][col].isFlagged = false;
      setFlags((prevFlags) => prevFlags + 1);
    } else {
      newBoard[row][col].isFlagged = true;
      setFlags((prevFlags) => prevFlags - 1);
    }

    setBoard(newBoard);
  };

  const openAdjacentCells = (
    currentBoard: Cell[][],
    row: number,
    col: number,
  ): Cell[][] => {
    let newBoard = [...currentBoard];
    newBoard[row][col].isOpen = true;

    for (let di = -1; di <= 1; di++) {
      for (let dj = -1; dj <= 1; dj++) {
        if (di !== 0 || dj !== 0) {
          const ni = row + di;
          const nj = col + dj;
          if (
            ni >= 0 &&
            ni < BOARD_SIZE &&
            nj >= 0 &&
            nj < BOARD_SIZE &&
            !newBoard[ni][nj].isOpen
          ) {
            newBoard[ni][nj].isOpen = true;
            if (newBoard[ni][nj].count === 0) {
              newBoard = openAdjacentCells(newBoard, ni, nj);
            }
          }
        }
      }
    }

    return newBoard;
  };

  const checkGameWon = (currentBoard: Cell[][]): boolean => {
    for (let i = 0; i < BOARD_SIZE; i++) {
      for (let j = 0; j < BOARD_SIZE; j++) {
        if (!currentBoard[i][j].isMine && !currentBoard[i][j].isOpen) {
          return false;
        }
      }
    }
    return true;
  };

  const revealAllMines = (currentBoard: Cell[][]): void => {
    let newBoard = [...currentBoard];
    for (let i = 0; i < BOARD_SIZE; i++) {
      for (let j = 0; j < BOARD_SIZE; j++) {
        if (newBoard[i][j].isMine) {
          newBoard[i][j].isOpen = true;
        }
      }
    }
    setBoard(newBoard);
  };

  const resetGame = () => {
    initializeBoard();
    startTimer();
  };

  const renderBoard = () => {
    return board.map((row, rowIndex) => (
      <div key={rowIndex} className={styles.row}>
        {row.map((cell, colIndex) => (
          <div
            key={`${rowIndex}-${colIndex}`}
            className={`${styles.cell} ${cell.isOpen ? styles.open : ''} ${
              cell.isMine && gameOver ? styles.mine : ''
            }`}
            onClick={() => handleCellClick(rowIndex, colIndex)}
            onContextMenu={(e) => handleRightClick(e, rowIndex, colIndex)}
          >
            {cell.isOpen && !cell.isMine && cell.count > 0 && cell.count}
            {cell.isOpen && cell.isMine && (
              <span role='img' aria-label='mine'>
                <Image
                  src='/icons/bomb.webp'
                  alt='Bomb'
                  width={20}
                  height={20}
                />
              </span>
            )}
            {cell.isFlagged && !cell.isOpen && (
              <span role='img' aria-label='flag'>
                <Image
                  src='/icons/flag.webp'
                  alt='Flag'
                  width={20}
                  height={20}
                />
              </span>
            )}
          </div>
        ))}
      </div>
    ));
  };

  return (
    <div className={styles.minesweeper}>
      <h1>Mines</h1>
      <div className={styles.header}>
        <div className={styles.info}>
          <span>
            <i>Bombs:</i> <b>{flags}</b>
          </span>
          {gameOver && (
            <Image
              src='/icons/lost.webp'
              alt='Sad Face'
              width={32}
              height={32}
            />
          )}
          {!(gameWon || gameOver) && (
            <Image
              src='/icons/idle.webp'
              alt='Smile Face'
              width={32}
              height={32}
            />
          )}
          {gameWon && (
            <Image
              src='/icons/won.webp'
              alt='Happy Face'
              width={32}
              height={32}
            />
          )}
          <span>
            <i>Time:</i> <b>{time}</b>
          </span>
        </div>
      </div>
      <div className={styles.board}>{renderBoard()}</div>
      <button className={styles.button} onClick={resetGame}>
        Reset Game
      </button>
      {(gameOver || gameWon) && (
        <div className={styles.modal}>
          {gameOver && (
            <div className={styles.message}>Game Over! Try Again.</div>
          )}
          {gameWon && (
            <div className={`${styles.message} ${styles.won}`}>
              Congratulations! You won!
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Mines;
