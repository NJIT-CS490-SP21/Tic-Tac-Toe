import React, { useState, useEffect } from 'react'
import '../css/Board.css'
import Box from './Box.js'
import io from 'socket.io-client';

const socket = io(); 

export default function Board() {
    const [board, setBoard] = useState([``,``,``,``,``,``,``,``,``]);
    const [check, setCheck] = useState(true);
    
    function updateCheck(){
        setCheck(!check);
    }
    function _helper(id, check){
        const newBoard = board.map((box,boxId) => {
        if (boxId === id) {
            let newBox = `X`;
            if (!check){
                newBox = `O`;
            }
        return newBox;
      }
      return box;
    });
    return newBoard;
    }
 
    function updateBoard(id, check){
        const newBoard = board.map((box,boxId) => {
            if (boxId === id) {
                let newBox = `X`;
                if (!check){
                    newBox = `O`;
                }
            return newBox;
            }
            return box;
        });
        setBoard(newBoard);

        socket.emit('update', { "id": id, "check": check, "board":newBoard });
        setCheck(!check);
    }
  
  useEffect(() => {
    // Listening for a chat event emitted by the server. If received, we
    // run the code in the function that is passed in as the second arg
    socket.on('update', (data) => {
        console.log('Chat event received!');
        console.log(board);
        console.log(data);
      
        // If the server sends a message (on behalf of another client), then we
        // add it to the list of messages to render it on the UI.
        const id = data.id;
        const check = data.check;
        const updatedBoard = data.board;    
        setCheck(!check);
        const newBoard = updatedBoard.map((box,boxId) => {
            if (boxId === id) {
                let newBox = `X`;
                if (!check){
                    newBox = `O`;
                }
                return newBox;
            }
            return box;
        });
    
        setBoard(newBoard);
    
        console.log(newBoard);    
        //setBoard(prevBoard => [...prevBoard, prevBoard[id] = value]);
    });
  }, []);
  
  
  return (
        <div className="board">
            {board.map((box,id) => {
                return <Box 
                            key={id} 
                            updateBoard={updateBoard} 
                            id={id} 
                            value={box} 
                            isChecked={check} 
                            updateCheck={updateCheck}
                        />
            })}
        </div>
    )
}