// @ts-nocheck
'use client'
import { useState } from 'react'

function Square({ value, onSquareClick }) {
  return <button className=" square w-16 border" onClick={onSquareClick}>{value ?? '\u2060'}</button>;
}
function Board({ xIsNext, squares, onPlay }) {
  let handleClick = (ni: number) => {
    console.log("handle " + ni);
    const nextSquares = squares.slice();
    if (calculateWinner(squares) || nextSquares[ni] !== null)
      return;
    let niX = (xIsNext) ? false : true;
    nextSquares[ni] = niX ? "X" : "O";
    onPlay(nextSquares)
  }
  console.log("board runned")
  const winner = calculateWinner(squares);
  let status;
  if (winner)
    status = 'Winner: ' + winner;
  else
    status = (xIsNext ? 'O' : 'X');

  return (
    <div>
      <span className={`inline-flex items-center ${status === "X" ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"} text-xs font-medium mr-2 px-2.5 py-0.5 rounded-full ${status === "X" ? "dark:bg-red-900 dark:text-red-300" : "bg-green-100 text-green-800"}`}>
        <span className={`w-2 h-2 mr-1 ${status === "X" ? "bg-red-500" : "bg-green-500"} rounded-full`}></span>
        {status}
      </span>
      <div>
        < Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        < Square value={squares[1]} onSquareClick={() => handleClick(1)} />
        < Square value={squares[2]} onSquareClick={() => handleClick(2)} />
      </div>
      <div>
        < Square value={squares[3]} onSquareClick={() => handleClick(3)} />
        < Square value={squares[4]} onSquareClick={() => handleClick(4)} />
        < Square value={squares[5]} onSquareClick={() => handleClick(5)} />
      </div>
      <div>
        < Square value={squares[6]} onSquareClick={() => handleClick(6)} />
        < Square value={squares[7]} onSquareClick={() => handleClick(7)} />
        < Square value={squares[8]} onSquareClick={() => handleClick(8)} />
      </div>
    </div >
  )
}
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
export default function Game() {
  const [xIsNext, setXIsNext] = useState(true);
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setcurrentMove] = useState(0)
  const currentSquares = history[currentMove]
  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares]
    setHistory(nextHistory);
    setcurrentMove(nextHistory.length - 1);
    setXIsNext(!xIsNext);
  }
  function jumpTo(nextMove) {
    setcurrentMove(nextMove)
    setXIsNext(nextMove % 2 === 0)
  }
  const moves = history.map((squares, move) => {
    let description;
    if (move > 0)
      description = 'Go to move # ' + move
    else
      description = 'Go to game start'
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description} </button>
      </li>
    )
  })
  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </div>
  )
}
