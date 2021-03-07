import React, { useState, useEffect } from 'react'
import io from 'socket.io-client';

const socket = io(); 

export default function PlayerBoard() {
    const [isDisplayed, setIsDisplayed] = useState(false);
    const [playerBoard, setPlayerBoard] = useState({});
    
    function onClickDisplay(){
        setIsDisplayed(!isDisplayed);
    }
    useEffect(() => {
        socket.on('player_board', (data) => {
            setPlayerBoard(data['players']);
        });
    }, []);
    
    function getSortedPlayerBoard () {
        var sorted = [];
        for(let player in playerBoard) {
        let score = playerBoard[player];
        sorted[score] = player;
        }
        sorted.sort();
        
        console.log("SORT??")
        console.log(sorted);
        
        let sortedBoard = [];
        for(let score in sorted) {
            let player = playerBoard[score];
            sortedBoard.push(
                <tr>
                    <td>{player}</td>
                    <td>{score}</td>
                </tr>
            )
        }
        
        return sortedBoard;
    }

    
  
    return (
        <div className='item border'>
        <div className="item">
        <button className="btn btn-info" onClick={onClickDisplay}>Click here to {isDisplayed === true ? ("hide") : ("display")} player board!</button>
        </div>
        {isDisplayed === true ? (
            <div className="item">
            <table class="table">
            <thead>
                <tr>
                    <th scope="col">Username</th>
                    <th scope="col">Score</th>
                </tr>
            </thead>
            <tbody>
                {getSortedPlayerBoard()}
            </tbody>
            </table>
            </div>
        ) : (
            <div></div>
        )}
        </div>
    )
}