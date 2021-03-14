import React from "react";
import "../css/Board.css";

export default function Box(prop) {
  return (
    <div
      className={`box`}
      onClick={() => {
        prop.updateBoard(prop.id, prop.isChecked);
      }}
    >
      <p>{prop.value}</p>
    </div>
  );
}
