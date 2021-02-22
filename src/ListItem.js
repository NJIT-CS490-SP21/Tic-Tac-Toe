import React, { useState } from 'react'

export default function ListItem(prop)  {
    return (
        <li>
        {prop.name}
        </li>
    )
}