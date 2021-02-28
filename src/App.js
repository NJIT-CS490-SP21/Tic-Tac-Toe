import logo from './logo.svg';
import './App.css';
import Board from './components/Board.js';
import React from 'react';
import { useState, useRef } from 'react';
import { useEffect } from 'react';
import io from 'socket.io-client';

const socket = io(); 

function App() {
  const inputRef = useRef(null);
  const [isLoggedIn, setLogIn] = useState(false);
  const [userList, setUserList] = useState({});
  const [userCount, setUserCount] = useState(0);
  const [currUser, setCurrUser] = useState('');
  
  function logInButton(){
    const userText = inputRef.current.value;
    setUserList((prevList) =>{
      const listCopy = {...prevList};
      
      let role = '';
      if (userCount == 0){
        role = 'X';
      }
      else if (userCount == 1){
        role = 'O';
      }
      else if (userCount > 1){
        role = 'Spectator';
      }
      listCopy[userText] = role;
      setUserCount((prevCount) => prevCount+1);
      socket.emit('login', {'userList': listCopy, 'newUser': userText});
      return listCopy;
    });
    setCurrUser(userText);
    setLogIn(true);
  }

  useEffect(() => {
   socket.on('login', (data) => {
        console.log('login event received!');
        console.log(data);
        const updatedList = data.userList;
        setUserList(updatedList);
        setUserCount((prevCount) => prevCount+1);
    });
  }, []);
  
  return (
    <div className="App">
      <body>
      <h1>Tic Tac Toe</h1>
      {isLoggedIn === true ? (
      <div>
      
        <Board currUser={currUser} value={userList[currUser]}/>
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
