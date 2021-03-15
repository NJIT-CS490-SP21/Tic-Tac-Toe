import React, { useState, useEffect } from 'react';
import '../css/Board.css';
import io from 'socket.io-client';
import Box from './Box';

const socket = io();

export default function Board(prop) {
  const [board, setBoard] = useState(['', '', '', '', '', '', '', '', '']);

  function calculateWinner(updatedBoard) {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i += 1) {
      const [a, b, c] = lines[i];
      if (
        updatedBoard[a]
        && updatedBoard[a] === updatedBoard[b]
        && updatedBoard[a] === updatedBoard[c]
      ) {
        return updatedBoard[a];
      }
    }
    return null;
  }

  function updateBoard(id) {
    socket.emit('validate', { value: prop.value, id, board });
  }

  function isBoardFull(updatedBoard) {
    const newBoard = updatedBoard.filter((box) => box === '');
    if (newBoard.length === 0) {
      return true;
    }
    return false;
  }

  useEffect(() => {
    socket.on('validate', (data) => {
      // console.log(data);
      const { isTurn } = data;
      const { id } = data;
      const { value } = data;
      const updatedBoard = data.board;

      let isEmpty = false;

      if (isTurn) {
        const newBoard = updatedBoard;
        updatedBoard.forEach((box, boxId) => {
          if (boxId === id) {
            if (box === '') {
              isEmpty = true;
              newBoard[boxId] = value;
            }
          }
        });

        if (isEmpty) {
          // console.log(newBoard);
          setBoard(newBoard);

          const winner = calculateWinner(newBoard);

          // let status;
          if (winner) {
            // status = "Winner: " + winner;
            socket.emit('win', winner);
          }

          const isFull = isBoardFull(newBoard);
          if (isFull) {
            socket.emit('full');
          }

          socket.emit('go', value);
          socket.emit('update', { id, value, board: newBoard });
        }
      }
    });

    socket.on('update', (data) => {
      const { id } = data;
      const { value } = data;
      const updatedBoard = data.board;

      let isEmpty = false;

      const newBoard = updatedBoard;
      updatedBoard.forEach((box, boxId) => {
        if (boxId === id) {
          if (box === '') {
            isEmpty = true;
            newBoard[boxId] = value;
          }
        }
      });

      if (isEmpty) {
        socket.emit('go', value);
        setBoard(newBoard);

        const winner = calculateWinner(newBoard);

        // let status;
        if (winner) {
          // status = "Winner: " + winner;
          socket.emit('win', winner);
        }

        const isFull = isBoardFull(newBoard);
        if (isFull) {
          socket.emit('full');
        }
      }
    });

    socket.on('reset', () => {
      setBoard(['', '', '', '', '', '', '', '', '']);
    });
  }, []);

  return (
    <div className="item">
      <div className="board">
        {board.map((box, id) => <Box key={id} updateBoard={updateBoard} id={id} value={box} />)}
      </div>
    </div>
  );
}
