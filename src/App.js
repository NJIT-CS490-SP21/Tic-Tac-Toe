import './App.css';

import React, { useState, useRef, useEffect } from 'react';

import io from 'socket.io-client';

import Board from './components/Board';
import PlayerList from './components/PlayerList';
import PlayerBoard from './components/PlayerBoard';

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

  function logInButton() {
    const userText = inputRef.current.value;
    setUserList((prevList) => {
      const listCopy = { ...prevList };

      let role = '';
      if (userCount === 0) {
        role = 'X';
      } else if (userCount === 1) {
        role = 'O';
      } else if (userCount > 1) {
        role = 'Spectator';
      }
      listCopy[userText] = role;
      setUserCount((prevCount) => prevCount + 1);
      socket.emit('login', { userList: listCopy, newUser: userText, role });
      return listCopy;
    });
    setCurrUser(userText);
    setLogIn(true);
  }

  function onClickReset() {
    socket.emit('reset', { found_winner: foundWinner, winner });
    setFoundWinner(false);
    setBoardFull(false);
  }

  useEffect(() => {
    socket.on('login', (data) => {
      const updatedList = data.userList;
      setUserList(updatedList);
      setUserCount((prevCount) => prevCount + 1);
      socket.emit('start');
    });

    socket.on('win', (data) => {
      const { win } = data;
      const { value } = data;

      setWinner(win);
      setWinnerVal(value);

      setFoundWinner(true);
    });

    socket.on('full', () => {
      setBoardFull(true);
    });

    socket.on('reset', () => {
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
          crossOrigin="anonymous"
        />
      </head>
      <body>
        <h1 className="font-weight-bold">Tic Tac Toe</h1>
        {isLoggedIn === true ? (
          <div className="container">
            <div className="item border">
              <PlayerList userList={userList} />
            </div>
            <Board currUser={currUser} value={userList[currUser]} />
            <div className="item border">
              {(function dashboard() {
                if (foundWinner) {
                  return (
                    <div>
                      <div className="text-big" role="alert">
                        FOUND WINNER:
                        {' '}
                        {winner}
                        {' '}
                        -
                        {' '}
                        {winnerVal}
                      </div>
                      <button
                        type="button"
                        className="btn btn-primary btn-sm"
                        onClick={onClickReset}
                      >
                        Click here to reset game!
                      </button>
                    </div>
                  );
                }
                if (isBoardFull) {
                  return (
                    <div>
                      <div className="text-big" role="alert">
                        BOARD FULL!
                      </div>
                      <button
                        type="button"
                        className="btn btn-primary btn-sm"
                        onClick={onClickReset}
                      >
                        Click here to reset game!
                      </button>
                    </div>
                  );
                }

                return (
                  <ul>
                    <p className="text-bold text-big">
                      Your role is
                      {' '}
                      {userList[currUser]}
                    </p>
                    <li className="text-small list-group-item">
                      Game only starts when there are at least 2 users
                    </li>
                    <li className="text-small list-group-item">
                      If you are X, you are first
                    </li>
                    <li className="text-small list-group-item">
                      You can only play if it&apos;s your turn
                    </li>
                    <li className="text-small list-group-item">
                      If you&apos;re a Spectator, you cant make a move
                    </li>
                  </ul>
                );
              }())}
            </div>
            <PlayerBoard currUser={currUser} />
          </div>
        ) : (
          <div>
            <input
              ref={inputRef}
              type="text"
              placeholder="Enter your username"
            />
            <button
              type="button"
              className="btn btn-primary"
              onClick={logInButton}
            >
              Log In
            </button>
          </div>
        )}
      </body>
    </div>
  );
}

export default App;
