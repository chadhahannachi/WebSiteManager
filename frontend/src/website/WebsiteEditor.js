import React from "react";
import TextEditorBlock from "./TextEditorBlock";

export default function Editor() {
  const parentStyle = { width: 40, height: 40 };

  return (
    <div
      style={{
        width: `${parentStyle.width}rem`,
        height: `${parentStyle.height}rem`,
        backgroundColor: "#F3F0D1",
        position: "relative",
        overflow: "hidden",
        border: "2px solid #aaa",
      }}
    >
      <TextEditorBlock
        width={16.5}
        height={7}
        top={3}
        left={5.5}
        initialText="hello world"
        initialFontColor="#ff0000"
        initialFontSize={50}
        initialFontName="Arial"
      />
    </div>
  );
}