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
                {console.log(playerBoard)}
                {playerBoard.map((player) => {
                    return (
                        <tr>
                            <td>{player}</td>
                            <td>{playerBoard[player]}</td>
                        </tr>
                        )
                }
                )}
            </tbody>
            </table>
            </div>
        ) : (
            <div></div>
        )}
        </div>
    )
}