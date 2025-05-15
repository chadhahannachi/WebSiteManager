import React, { useRef, useState, useEffect } from "react";
import { Rnd } from "react-rnd";
import "./TextEditorBlock.css";

const TextEditorBlock = ({
    initialText = "Double-cliquez ici pour éditer le texte",
    left,
    top,
    width,
    height,
    initialFontColor = "#000000",
    initialFontSize = 16,
    initialFontName = "Times New Roman",
}) => {
    const [showToolbar, setShowToolbar] = useState(false);
    const [fontSize, setFontSize] = useState(initialFontSize);
    const [alignment, setAlignment] = useState("left");
    const [fontFamily, setFontFamily] = useState(initialFontName);
    const [fontColor, setFontColor] = useState(initialFontColor);
    const [textEffect, setTextEffect] = useState("none");
    const [toolbarPosition, setToolbarPosition] = useState({ top: 0, left: 0 });
    const editorRef = useRef(null);
    const toolbarRef = useRef(null);

    useEffect(() => {
        if (editorRef.current) {
            editorRef.current.style.fontSize = `${fontSize}px`;
            editorRef.current.style.fontFamily = fontFamily;
            editorRef.current.style.color = fontColor;
            editorRef.current.style.textAlign = alignment;
            applyTextEffect(textEffect);
        }
    }, [fontSize, fontFamily, fontColor, alignment, textEffect]);

    const handleDoubleClick = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setToolbarPosition({
            top: rect.top,
            left: rect.right + 10 // 10px à droite du texte
        });
        setShowToolbar(true);
    };

    const applyTextEffect = (effect) => {
        if (!editorRef.current) return;
        editorRef.current.style.textShadow = "none";
        editorRef.current.style.webkitTextStroke = "none";

        switch (effect) {
            case "shadow":
                editorRef.current.style.textShadow = "2px 2px 4px rgba(0, 0, 0, 0.5)";
                break;
            case "outline":
                editorRef.current.style.webkitTextStroke = "1px black";
                break;
            case "glow":
                editorRef.current.style.textShadow = "0 0 8px rgba(255, 255, 255, 0.8)";
                break;
            default:
                break;
        }
    };

    return (
        <div className="editor-container">
            <Rnd
                default={{
                    x: left * 16,
                    y: top * 16,
                    width: width * 16,
                    height: height * 16,
                }}
                bounds="parent"
                style={{ zIndex: 2 }}
            >
                <div className="text-editor-wrapper">
                    <div
                        ref={editorRef}
                        className="editable"
                        contentEditable
                        suppressContentEditableWarning
                        onDoubleClick={handleDoubleClick}
                        onBlur={(e) => {
                            if (toolbarRef.current && toolbarRef.current.contains(e.relatedTarget)) {
                                return;
                            }
                            setShowToolbar(false);
                        }}
                        style={{
                            width: "100%",
                            height: "100%",
                            padding: "5px",
                            overflow: "auto",
                            fontSize: `${fontSize}px`,
                            fontFamily: fontFamily,
                            color: fontColor,
                            textAlign: alignment,
                        }}
                    >
                        {initialText}
                    </div>
                </div>
            </Rnd>

            {showToolbar && (
                <div 
                    className="toolbar" 
                    ref={toolbarRef}
                    style={{
                        position: 'absolute',
                        top: `${toolbarPosition.top}px`,
                        left: `${toolbarPosition.left}px`,
                    }}
                >
                    <div className="toolbar-section">
                        <label>Font:</label>
                        <select
                            value={fontFamily}
                            onChange={(e) => setFontFamily(e.target.value)}
                        >
                            <option value="Arial">Arial</option>
                            <option value="Times New Roman">Times New Roman</option>
                            <option value="Courier New">Courier New</option>
                            <option value="Verdana">Verdana</option>
                            <option value="Helvetica">Helvetica</option>
                        </select>
                    </div>

                    <div className="toolbar-section">
                        <label>Size:</label>
                        <input
                            type="range"
                            min="10"
                            max="48"
                            value={fontSize}
                            onChange={(e) => setFontSize(Number(e.target.value))}
                        />
                        <span>{fontSize}px</span>
                    </div>

                    <div className="toolbar-section">
                        <label>Color:</label>
                        <input
                            type="color"
                            value={fontColor}
                            onChange={(e) => setFontColor(e.target.value)}
                        />
                    </div>

                    <div className="toolbar-section">
                        <label>Style:</label>
                        <button onClick={() => document.execCommand("bold")}>B</button>
                        <button onClick={() => document.execCommand("italic")}>I</button>
                        <button onClick={() => document.execCommand("underline")}>U</button>
                    </div>

                    <div className="toolbar-section">
                        <label>Align:</label>
                        <button onClick={() => setAlignment("left")}>Left</button>
                        <button onClick={() => setAlignment("center")}>Center</button>
                        <button onClick={() => setAlignment("right")}>Right</button>
                    </div>

                    <div className="toolbar-section">
                        <label>Effect:</label>
                        <button onClick={() => setTextEffect("none")}>None</button>
                        <button onClick={() => setTextEffect("shadow")}>Shadow</button>
                        <button onClick={() => setTextEffect("outline")}>Outline</button>
                        <button onClick={() => setTextEffect("glow")}>Glow</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TextEditorBlock;