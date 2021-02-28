import React, { useState } from 'react'

export default function PlayerList(prop) {
    
    return (
        <div className={`list`}> 
        <h2>List of users</h2>
        <ol>
            {console.log(prop.userList)}
            {
                Object.keys(prop.userList).map(function(userName, keyIndex) {
                    return <li>{userName} - {prop.userList[userName]}</li>
                })
            }
        </ol>
        </div>
  )
}