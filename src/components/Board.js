import React, { useState } from 'react'
import '../css/Board.css'
import Box from './Box.js'

export default function Board() {
    const [board, setBoard] = useState([``,``,``,``,``,``,``,``,``]);
    const [check, setCheck] = useState(true);
    
    function updateCheck(){
        setCheck(!check);
    }
    
    function updateBoard(id, check){
        console.log(check);
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
  }
  
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