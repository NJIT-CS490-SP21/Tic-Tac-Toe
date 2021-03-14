import React, { useState, useEffect } from "react";
import "../css/Board.css";
import Box from "./Box.js";
import io from "socket.io-client";

const socket = io();

export default function Board(prop) {
  const [board, setBoard] = useState([``, ``, ``, ``, ``, ``, ``, ``, ``]);
  const [isTurn, setTurn] = useState(false);

  const [foundWinner, setFoundWinner] = useState(false);

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
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (
        updatedBoard[a] &&
        updatedBoard[a] === updatedBoard[b] &&
        updatedBoard[a] === updatedBoard[c]
      ) {
        return updatedBoard[a];
      }
    }
    return null;
  }

  function updateBoard(id, check) {
    socket.emit("validate", { value: prop.value, id: id, board: board });
  }

  function isBoardFull(updatedBoard) {
    console.log("TEST FUNCTION");
    const newBoard = updatedBoard.filter((box) => box === "");
    if (newBoard.length == 0) {
      return true;
    }
    return false;
  }

  useEffect(() => {
    socket.on("validate", (data) => {
      //console.log(data);
      const isTurn = data.isTurn;
      const id = data.id;
      const value = data.value;
      const updatedBoard = data.board;

      let isEmpty = false;

      if (isTurn) {
        let newBoard = updatedBoard;
        updatedBoard.forEach((box, boxId) => {
          if (boxId === id) {
            if (box === "") {
              isEmpty = true;
              newBoard[boxId] = value;
              return;
            }
          }
        });

        if (isEmpty) {
          //console.log(newBoard);
          setBoard(newBoard);

          const winner = calculateWinner(newBoard);

          let status;
          if (winner) {
            status = "Winner: " + winner;
            socket.emit("win", winner);
          }

          const isFull = isBoardFull(newBoard);
          if (isFull) {
            socket.emit("full");
          }

          socket.emit("go", value);
          socket.emit("update", { id: id, value: value, board: newBoard });
        }
      }
    });

    socket.on("update", (data) => {
      //console.log('Chat event received!');
      //console.log(board);
      //console.log(data);
      const id = data.id;
      const value = data.value;
      const updatedBoard = data.board;

      let isEmpty = false;

      let newBoard = updatedBoard;
      updatedBoard.forEach((box, boxId) => {
        if (boxId === id) {
          if (box === "") {
            isEmpty = true;
            newBoard[boxId] = value;
            return;
          }
        }
      });

      //console.log(newBoard);
      if (isEmpty) {
        socket.emit("go", value);
        setBoard(newBoard);

        const winner = calculateWinner(newBoard);

        let status;
        if (winner) {
          status = "Winner: " + winner;
          socket.emit("win", winner);
        }

        const isFull = isBoardFull(newBoard);
        if (isFull) {
          socket.emit("full");
        }
      }
    });

    socket.on("reset", (data) => {
      setBoard([``, ``, ``, ``, ``, ``, ``, ``, ``]);
    });
  }, []);

  return (
    <div className="item">
      <div className="board">
        {board.map((box, id) => {
          return <Box key={id} updateBoard={updateBoard} id={id} value={box} />;
        })}
      </div>
    </div>
  );
}
