import React from 'react';
import '../css/PlayerList.css';

export default function PlayerList(prop) {
  return (
    <div className="list">
      <p className="text-big text-bold">List of current users</p>
      <ol>
        {Object.keys(prop.userList).map((userName) => (
          <li className="text-small ">
            {userName}
            {' '}
            -
            {prop.userList[userName]}
          </li>
        ))}
      </ol>
    </div>
  );
}
