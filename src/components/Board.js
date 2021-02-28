import React, { useState, useEffect } from 'react'
import '../css/Board.css'
import Box from './Box.js'
import io from 'socket.io-client';

const socket = io(); 

export default function Board(prop) {
    const [board, setBoard] = useState([``,``,``,``,``,``,``,``,``]);
    const [check, setCheck] = useState(true);
    const [isTurn, setTurn] = useState(false);
    
    function updateCheck(){
        setCheck(!check);
    }
    function _helper(id, value){
        const newBoard = board.map((box,boxId) => {
        if (boxId === id) {
            return value;
        }
        return box;
        });
        return newBoard;
    }
    
    function updateBoard(id, check){
        socket.emit('validate', {'value':prop.value, 'id': id, "board":board});
        
        /*
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
        */
        
    }
    
  useEffect(() => {
    socket.on('validate', (data) => {
        console.log(data);
        const isTurn = data.isTurn;
        const id = data.id;
        const value = data.value;
        const updatedBoard = data.board;
        
        if (isTurn){
            const newBoard = updatedBoard.map((box,boxId) => {
            if (boxId === id) {
                return value;
            }
            return box;
            });
            
            console.log("test board");
            console.log(newBoard);
            setBoard(newBoard);
            
            socket.emit('go', value);
            socket.emit('update', { "id": id, "value": value, "board":newBoard });
            setCheck(!check);
        }
        
    });
    
    socket.on('update', (data) => {
        console.log('Chat event received!');
        console.log(board);
        console.log(data);
      
        // If the server sends a message (on behalf of another client), then we
        // add it to the list of messages to render it on the UI.
        const id = data.id;
        const value = data.value;
        const updatedBoard = data.board;    
        setCheck(!check);
        
        const newBoard = updatedBoard.map((box,boxId) => {
            if (boxId === id) {
                return value;
            }
            return box;
        });
        socket.emit('go', value);
        setBoard(newBoard);
    
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
                        />
            })}
        </div>
    )
}