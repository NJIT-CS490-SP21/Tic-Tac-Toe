import logo from './logo.svg';
import './App.css';

import React from 'react';
import { useState, useRef } from 'react';
import { useEffect } from 'react';
import io from 'socket.io-client';

import Board from './components/Board.js';
import PlayerList from './components/PlayerList.js';

const socket = io(); 

function App() {
  const inputRef = useRef(null);
  const [isLoggedIn, setLogIn] = useState(false);
  const [userList, setUserList] = useState({});
  const [userCount, setUserCount] = useState(0);
  const [currUser, setCurrUser] = useState('');
  const [foundWinner, setFoundWinner] = useState(false);
  const [winner, setWinner] = useState('');
  const [winnerVal, setWinnerVal] = useState('');
  const [isBoardFull, setBoardFull] = useState(false);
  const [start, setStart] = useState(false);
  
  function logInButton(){
    const userText = inputRef.current.value;
    setUserList((prevList) =>{
      const listCopy = {...prevList};
      
      let role = '';
      if (userCount == 0){
        role = "X";
      }
      else if (userCount == 1){
        role = "O";
      }
      else if (userCount > 1){
        role = "Spectator";
      }
      listCopy[userText] = role;
      setUserCount((prevCount) => prevCount+1);
      socket.emit('login', {'userList': listCopy, 'newUser': userText});
      return listCopy;
    });
    setCurrUser(userText);
    setLogIn(true);
  }

  function onClickReset(){
    socket.emit("reset");
    setFoundWinner(false);
    setBoardFull(false);
  }
  
  useEffect(() => {
    socket.on('login', (data) => {
        console.log('login event received!');
        console.log(data);
        const updatedList = data.userList;
        setUserList(updatedList);
        setUserCount((prevCount) => prevCount+1);
        socket.emit("start");
    });
    
    socket.on('win', (data) => {
      const winner = data.user;
      const value = data.value;
      
      setWinner(winner);
      setWinnerVal(value);
      
      setFoundWinner(true);
    });
    
    socket.on('full', (data) => {
      setBoardFull(true);
    });
    
    socket.on('reset', (data) => {
      setFoundWinner(false);
      setBoardFull(false);
    });
    
  }, []);
  
  return (
    <div className="App">
      <head>
        <link
          rel="stylesheet"
          href="https://maxcdn.bootstrapcdn.com/bootstrap/4.6.0/css/bootstrap.min.css"
          integrity="sha384-B0vP5xmATw1+K9KRQjQERJvTumQW0nPEzvF6L/Z6nronJ3oUOFUFpCjEUQouq2+l"
          crossorigin="anonymous"/>
      </head>
      <body>
          <h1>Tic Tac Toe</h1>
          {isLoggedIn === true ? (
            <div class='container'>
              <div className='item border'>
                <PlayerList userList={userList}/>
              </div>
              <Board currUser={currUser} value={userList[currUser]}/>
              <div className='item border'>
              {foundWinner === true  ? (
              <div>
                <div class="text-big" role="alert">
                    FOUND WINNER: {winner} - {winnerVal}
                </div>
                <button onClick={onClickReset}>Click here to reset game!</button>
              </div>
              ) : isBoardFull === true ? (
                <div>
                <div class="text-big" role="alert">
                    BOARD FULL!
                </div>
                <button onClick={onClickReset}>Click here to reset game!</button>
              </div>
              ) : (
                <ul>
                <p className="text-bold text-big">Your role is {userList[currUser]}</p>
                <li>Game only starts when there are at least 2 users</li>
                <li>If you are X, you are first</li>
                <li>You can only play if it's your turn</li>
                <li>If you're a Spectator, you cant make a move</li>
                </ul>
              )}
              </div>
            </div>
          ) : (
            <div>
              <input ref={inputRef} type="text" placeholder="Enter your username"/>
              <button onClick={logInButton}>Log In</button>
            </div>
          )}
      </body>
    </div>
  );
}

export default App;
