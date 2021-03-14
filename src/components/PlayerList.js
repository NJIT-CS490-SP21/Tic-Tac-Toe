import React, { useState } from "react";
import "../css/PlayerList.css";
export default function PlayerList(prop) {
  return (
    <div className={`list`}>
      <p className="text-big text-bold">List of current users</p>
      <ol>
        {console.log(prop.userList)}
        {Object.keys(prop.userList).map(function (userName, keyIndex) {
          return (
            <li className="text-small ">
              {userName} - {prop.userList[userName]}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
