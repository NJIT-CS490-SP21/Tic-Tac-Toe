import React, { useState, useEffect } from 'react'
import io from 'socket.io-client';

const socket = io(); 

export default function PlayerBoard() {
    const [isDisplayed, setIsDisplayed] = useState(false);
    const [users, setUsers] = useState([]);
    const [scores, setScores] = useState([]);
    
    function onClickDisplay(){
        setIsDisplayed(!isDisplayed);
    }
    useEffect(() => {
        socket.on('player_board', (data) => {
            setUsers(data['users']);
            setScores(data['scores'])
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
                    <th scope="col">#</th>
                    <th scope="col">Username</th>
                    <th scope="col">Score</th>
                </tr>
            </thead>
            <tbody>
                {users.map((user, index) => {
                    return(
                    <tr>
                        <th scope="row">{index + 1}</th>
                        <td>{user}</td>
                        <td>{scores[index]}</td>
                        </tr>
                    )
                })}
            </tbody>
            </table>
            </div>
        ) : (
            <div></div>
        )}
        </div>
    )
}