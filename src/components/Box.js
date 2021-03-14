import React, { useState } from "react";
import "../css/Board.css";

export default function Box(prop) {
  return (
    <div
      className={`box`}
      onClick={() => {
        prop.updateBoard(prop.id, prop.isChecked);
        //prop.updateCheck();
      }}
    >
      <p>{prop.value}</p>
    </div>
  );
}
