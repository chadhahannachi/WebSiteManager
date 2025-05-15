
// import React, { useState, useRef } from 'react';
// import './AboutUs.css';
// import logoblack from '../../images/aboutus.webp';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faArrowsUpDownLeftRight, faHandPointer, faTimes, faWandMagicSparkles } from '@fortawesome/free-solid-svg-icons';

// export default function AboutStyleOne() {
//   const [textStyles, setTextStyles] = useState({
//     h1: { color: '#000000', fontSize: '2rem', fontFamily: 'Arial' },
//     h2: { color: '#333333', fontSize: '1.5rem', fontFamily: 'Arial' },
//     p: { color: '#666666', fontSize: '1rem', fontFamily: 'Arial' },
//     button: { color: '#ffffff', backgroundColor: '#000000', fontSize: '1rem', fontFamily: 'Arial' },
//   });

//   const initialPositions = {
//     h1: { top: 50, left: 50 },
//     h2: { top: 120, left: 50 },
//     p: { top: 180, left: 50 },
//     button: { top: 350, left: 50 },
//     img: { top: 100, left: 500 },
//   };

//   const [positions, setPositions] = useState(initialPositions);
//   const [imgSize, setImgSize] = useState({ width: 200, height: 200 });
//   const [selectedElement, setSelectedElement] = useState(null);
//   const [editingElement, setEditingElement] = useState(null);
//   const [dragging, setDragging] = useState(null);
//   const [resizing, setResizing] = useState(null);
//   const offset = useRef({ x: 0, y: 0 });

//   const handleMouseDown = (element, e, handle = null) => {
//     e.stopPropagation();
//     if (handle) {
//       setResizing({ element, handle });
//       offset.current = {
//         x: e.clientX,
//         y: e.clientY,
//         width: imgSize.width,
//         height: imgSize.height,
//         top: positions[element].top,
//         left: positions[element].left,
//       };
//     } else {
//       offset.current = {
//         x: e.clientX - positions[element].left,
//         y: e.clientY - positions[element].top,
//       };
//       setDragging(element);
//     }
//   };

//   const handleMouseMove = (e) => {
//     if (dragging) {
//       setPositions((prev) => ({
//         ...prev,
//         [dragging]: {
//           top: e.clientY - offset.current.y,
//           left: e.clientX - offset.current.x,
//         },
//       }));
//     } else if (resizing) {
//       const { element, handle } = resizing;
//       let newWidth = imgSize.width;
//       let newHeight = imgSize.height;
//       let newTop = positions[element].top;
//       let newLeft = positions[element].left;

//       const deltaX = e.clientX - offset.current.x;
//       const deltaY = e.clientY - offset.current.y;

//       if (handle === 'bottom-right') {
//         newWidth = offset.current.width + deltaX;
//         newHeight = offset.current.height + deltaY;
//       } else if (handle === 'bottom-left') {
//         newWidth = offset.current.width - deltaX;
//         newLeft = offset.current.left + deltaX;
//         newHeight = offset.current.height + deltaY;
//       } else if (handle === 'top-right') {
//         newWidth = offset.current.width + deltaX;
//         newHeight = offset.current.height - deltaY;
//         newTop = offset.current.top + deltaY;
//       } else if (handle === 'top-left') {
//         newWidth = offset.current.width - deltaX;
//         newHeight = offset.current.height - deltaY;
//         newLeft = offset.current.left + deltaX;
//         newTop = offset.current.top + deltaY;
//       }

//       newWidth = Math.max(newWidth, 50);
//       newHeight = Math.max(newHeight, 50);

//       setImgSize({ width: newWidth, height: newHeight });
//       setPositions((prev) => ({
//         ...prev,
//         [element]: { top: newTop, left: newLeft },
//       }));
//     }
//   };

//   const handleMouseUp = () => {
//     setDragging(null);
//     setResizing(null);
//   };

//   const handleElementClick = (element, e) => {
//     e.stopPropagation();
//     setSelectedElement(element);
//   };

//   const handleStyleChange = (element, property, value) => {
//     setTextStyles((prev) => ({
//       ...prev,
//       [element]: { ...prev[element], [property]: value },
//     }));
//   };

//   const handleEditClick = () => {
//     setEditingElement(selectedElement);
//   };

//   const renderControlButtons = () => {
//     if (!selectedElement) return null;

//     const pos = positions[selectedElement];
//     const isImage = selectedElement === 'img';

//     return (
//       <div
//         className="element-controls"
//         style={{
//           position: 'absolute',
//           top: pos.top, // Align with the top of the element
//           left: pos.left - 40, // Position to the left of the element
//           display: 'flex',
//           flexDirection: 'column', // Stack buttons vertically
//           alignItems: 'center',
//           gap: '5px', // Small gap between buttons
//           zIndex: 10,
//         }}
//       >
//         <button
//           onMouseDown={(e) => handleMouseDown(selectedElement, e)}
//           style={{ cursor: 'grab', fontSize: '20px', color: 'black' }}
//         >
//           <FontAwesomeIcon icon={faArrowsUpDownLeftRight} />
//         </button>
//         {!isImage && (
//           <button
//             onClick={handleEditClick}
//             style={{ cursor: 'grab', fontSize: '20px', color: 'black' }}
//           >
//             <FontAwesomeIcon icon={faWandMagicSparkles} />
//           </button>
//         )}
//       </div>
//     );
//   };

//   const renderResizeHandles = () => {
//     if (selectedElement !== 'img') return null;

//     const pos = positions.img;
//     const { width, height } = imgSize;
//     const handleSize = 8;

//     const handles = [
//       { name: 'top-left', cursor: 'nwse-resize', top: -handleSize / 2, left: -handleSize / 2 },
//       { name: 'top-right', cursor: 'nesw-resize', top: -handleSize / 2, left: width - handleSize / 2 },
//       { name: 'bottom-left', cursor: 'nesw-resize', top: height - handleSize / 2, left: -handleSize / 2 },
//       { name: 'bottom-right', cursor: 'nwse-resize', top: height - handleSize / 2, left: width - handleSize / 2 },
//     ];

//     return handles.map((handle) => (
//       <div
//         key={handle.name}
//         style={{
//           position: 'absolute',
//           top: pos.top + handle.top,
//           left: pos.left + handle.left,
//           width: handleSize,
//           height: handleSize,
//           backgroundColor: 'blue',
//           cursor: handle.cursor,
//           zIndex: 20,
//         }}
//         onMouseDown={(e) => handleMouseDown('img', e, handle.name)}
//       />
//     ));
//   };

//   return (
//     <div
//       className="editor-container"
//       onMouseMove={handleMouseMove}
//       onMouseUp={handleMouseUp}
//       onClick={() => setSelectedElement(null)}
//       style={{ position: 'relative', width: '100%', height: '100vh' }}
//     >
//       {renderControlButtons()}
//       {renderResizeHandles()}

//       {editingElement && editingElement !== 'img' && (
//         <div
//           className="style-editor-panel visible"
//           style={{
//             position: 'absolute',
//             top: `${positions[editingElement]?.top || 0}px`,
//             left: `${(positions[editingElement]?.left || 0) + 300}px`,
//           }}
//         >
//           <button
//             onClick={() => setEditingElement(null)}
//             style={{
//               position: 'absolute',
//               top: '5px',
//               right: '5px',
//               background: 'transparent',
//               border: 'none',
//               cursor: 'pointer',
//               fontSize: '16px',
//               color: '#999',
//             }}
//             aria-label="Close editor"
//           >
//             <FontAwesomeIcon icon={faTimes} />
//           </button>

//           <div className="style-controls">
//             <h3>Edit {editingElement} Style</h3>
//             <div>
//               <label>Color: </label>
//               <input
//                 type="color"
//                 value={textStyles[editingElement].color}
//                 onChange={(e) => handleStyleChange(editingElement, 'color', e.target.value)}
//               />
//             </div>
//             <div>
//               <label>Font Size: </label>
//               <input
//                 type="range"
//                 min="0.5"
//                 max="3"
//                 step="0.1"
//                 value={parseFloat(textStyles[editingElement].fontSize)}
//                 onChange={(e) => handleStyleChange(editingElement, 'fontSize', `${e.target.value}rem`)}
//               />
//             </div>
//             <div>
//               <label>Font Family: </label>
//               <select
//                 value={textStyles[editingElement].fontFamily}
//                 onChange={(e) => handleStyleChange(editingElement, 'fontFamily', e.target.value)}
//               >
//                 <option value="Arial" style={{fontFamily: 'Arial'}}>Arial</option>
//                 <option value="Times New Roman" style={{fontFamily: 'Times New Roman'}}>Times New Roman</option>
//                 <option value="Courier New" style={{fontFamily: 'Courier New'}}>Courier New</option>
//                 <option value="Georgia" style={{fontFamily: 'Georgia'}}>Georgia</option>
//                 <option value="Verdana" style={{fontFamily: 'Verdana'}}>Verdana</option>
//                 <option value="Tahoma" style={{fontFamily: 'Tahoma'}}>Tahoma</option>
//                 <option value="Trebuchet MS" style={{fontFamily: 'Trebuchet MS'}}>Trebuchet MS</option>
//                 <option value="Bookman" style={{fontFamily: 'Bookman'}}>Bookman</option>
//                 <option value="Comic Sans MS" style={{fontFamily: 'Comic Sans MS'}}>Comic Sans MS</option>
//                 <option value="Impact" style={{fontFamily: 'Impact'}}>Impact</option>
//                 <option value="Lucida Sans Unicode" style={{fontFamily: 'Lucida Sans Unicode'}}>Lucida Sans Unicode</option>
//                 <option value="Geneva" style={{fontFamily: 'Geneva'}}>Geneva</option>
//                 <option value="Lucida Console" style={{fontFamily: 'Lucida Console'}}>Lucida Console</option>
//                 <option value="Lucida Bright" style={{fontFamily: 'Lucida Bright'}}>Lucida Bright</option>
//               </select>
//             </div>
//             {editingElement === 'button' && (
//               <div>
//                 <label>Background Color: </label>
//                 <input
//                   type="color"
//                   value={textStyles[editingElement].backgroundColor}
//                   onChange={(e) => handleStyleChange(editingElement, 'backgroundColor', e.target.value)}
//                 />
//               </div>
//             )}
//           </div>
//         </div>
//       )}

//       <div className="editable-area" style={{ position: 'relative' }}>
//         <h1
//           style={{ ...textStyles.h1, position: 'absolute', ...positions.h1, cursor: 'pointer' }}
//           onClick={(e) => handleElementClick('h1', e)}
//         >
//           About Us
//         </h1>
//         <h2
//           style={{ ...textStyles.h2, position: 'absolute', ...positions.h2, cursor: 'pointer' }}
//           onClick={(e) => handleElementClick('h2', e)}
//         >
//           Abshore is a Digital Services Company.
//         </h2>
//         <p
//           style={{ ...textStyles.p, position: 'absolute', ...positions.p, cursor: 'pointer', width: '400px' }}
//           onClick={(e) => handleElementClick('p', e)}
//         >
//           Since 2012, our company has been supporting...
//         </p>
//         <button
//           style={{ ...textStyles.button, position: 'absolute', ...positions.button, cursor: 'pointer' }}
//           onClick={(e) => handleElementClick('button', e)}
//         >
//           Read More
//         </button>
//         <img
//           src={logoblack}
//           alt="Logo"
//           style={{
//             position: 'absolute',
//             ...positions.img,
//             cursor: 'pointer',
//             width: `${imgSize.width}px`,
//             height: `${imgSize.height}px`,
//           }}
//           onClick={(e) => handleElementClick('img', e)}
//         />
//       </div>
//     </div>
//   );
// }



import React, { useState, useRef } from 'react';
import './AboutUs.css';
import logoblack from '../../images/aboutus.webp';
import EditorText from './EditorText';
import EditorImage from './EditorImage';
import EditorButton from './EditorButton';

export default function AboutStyleOne() {
  const initialPositions = {
    h1: { top: 50, left: 50 },
    h2: { top: 120, left: 50 },
    p: { top: 180, left: 50 },
    button: { top: 350, left: 50 },
    img: { top: 100, left: 500 },
  };

  const initialStyles = {
    h1: { color: '#000000', fontSize: '2rem', fontFamily: 'Arial' },
    h2: { color: '#333333', fontSize: '1.5rem', fontFamily: 'Arial' },
    p: { color: '#666666', fontSize: '1rem', fontFamily: 'Arial' },
    button: { color: '#ffffff', backgroundColor: '#000000', fontSize: '1rem', fontFamily: 'Arial', borderRadius: '0px', hoverColor: '#ff0000' },
    img: { width: 200, height: 200, borderRadius: '0px' },

  };

  const [positions, setPositions] = useState(initialPositions);
  const [imgSize, setImgSize] = useState({ width: 200, height: 200 });
  const [selectedElement, setSelectedElement] = useState(null);
  const [resizing, setResizing] = useState(null);
  const offset = useRef({ x: 0, y: 0 });

  const handleMouseDown = (element, e, handle) => {
    e.stopPropagation();
    setResizing({ element, handle });
    offset.current = {
      x: e.clientX,
      y: e.clientY,
      width: imgSize.width,
      height: imgSize.height,
      top: positions[element].top,
      left: positions[element].left,
    };
  };

  const handleMouseMove = (e) => {
    if (resizing) {
      const { element, handle } = resizing;
      let newWidth = imgSize.width;
      let newHeight = imgSize.height;
      let newTop = positions[element].top;
      let newLeft = positions[element].left;

      const deltaX = e.clientX - offset.current.x;
      const deltaY = e.clientY - offset.current.y;

      if (handle === 'bottom-right') {
        newWidth = offset.current.width + deltaX;
        newHeight = offset.current.height + deltaY;
      } else if (handle === 'bottom-left') {
        newWidth = offset.current.width - deltaX;
        newLeft = offset.current.left + deltaX;
        newHeight = offset.current.height + deltaY;
      } else if (handle === 'top-right') {
        newWidth = offset.current.width + deltaX;
        newHeight = offset.current.height - deltaY;
        newTop = offset.current.top + deltaY;
      } else if (handle === 'top-left') {
        newWidth = offset.current.width - deltaX;
        newHeight = offset.current.height - deltaY;
        newLeft = offset.current.left + deltaX;
        newTop = offset.current.top + deltaY;
      }

      newWidth = Math.max(newWidth, 50);
      newHeight = Math.max(newHeight, 50);

      setImgSize({ width: newWidth, height: newHeight });
      setPositions((prev) => ({
        ...prev,
        [element]: { top: newTop, left: newLeft },
      }));
    }
  };

  const handleMouseUp = () => {
    setResizing(null);
  };

  const handleElementClick = (element, e) => {
    e.stopPropagation();
    setSelectedElement(element);
  };

  const renderResizeHandles = () => {
    if (selectedElement !== 'img') return null;

    const pos = positions.img;
    const { width, height } = imgSize;
    const handleSize = 8;

    const handles = [
      { name: 'top-left', cursor: 'nwse-resize', top: -handleSize / 2, left: -handleSize / 2 },
      { name: 'top-right', cursor: 'nesw-resize', top: -handleSize / 2, left: width - handleSize / 2 },
      { name: 'bottom-left', cursor: 'nesw-resize', top: height - handleSize / 2, left: -handleSize / 2 },
      { name: 'bottom-right', cursor: 'nwse-resize', top: height - handleSize / 2, left: width - handleSize / 2 },
    ];

    return handles.map((handle) => (
      <div
        key={handle.name}
        style={{
          position: 'absolute',
          top: pos.top + handle.top,
          left: pos.left + handle.left,
          width: handleSize,
          height: handleSize,
          backgroundColor: 'blue',
          cursor: handle.cursor,
          zIndex: 20,
        }}
        onMouseDown={(e) => handleMouseDown('img', e, handle.name)}
      />
    ));
  };

  return (
    <div
      className="editor-container"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onClick={() => setSelectedElement(null)}
      style={{ position: 'relative', width: '100%', height: '100vh' }}
    >
      {renderResizeHandles()}

      <div className="editable-area" style={{ position: 'relative' }}>
        <EditorText
          elementType="h1"
          initialPosition={initialPositions.h1}
          initialStyles={initialStyles.h1}
          onSelect={setSelectedElement}
        >
          About Us
        </EditorText>
        <EditorText
          elementType="h2"
          initialPosition={initialPositions.h2}
          initialStyles={initialStyles.h2}
          onSelect={setSelectedElement}
        >
          Abshore is a Digital Services Company.
        </EditorText>
        <EditorText
          elementType="p"
          initialPosition={initialPositions.p}
          initialStyles={{ ...initialStyles.p, width: '400px' }}
          onSelect={setSelectedElement}
        >
          Since 2012, our company has been supporting...
        </EditorText>
        
        <EditorButton
          initialPosition={initialPositions.button}
          initialStyles={initialStyles.button}
          onSelect={setSelectedElement}
        >
          Read More
        </EditorButton>
        <EditorImage
          initialPosition={initialPositions.img}
          initialStyles={initialStyles.img}
          src={logoblack}
          alt="Logo"
          onSelect={setSelectedElement}
        />
      </div>
    </div>
  );
}


// import React, { useState, useRef } from 'react';
// import './AboutUs.css';
// // import logoblack from '../../images/logo-black.png';
// import logoblack from '../../images/aboutus.webp';

// export default function AboutStyleOne() {
//   const [textStyles, setTextStyles] = useState({
//     h1: { color: '#000000', fontSize: '2rem', fontFamily: 'Arial' },
//     h2: { color: '#333333', fontSize: '1.5rem', fontFamily: 'Arial' },
//     p: { color: '#666666', fontSize: '1rem', fontFamily: 'Arial' },
//     button: { color: '#ffffff', backgroundColor: '#000000', fontSize: '1rem', fontFamily: 'Arial' }
//   });

//   // const [positions, setPositions] = useState({
//   //   textContent: { x: 0, y: 0 },
//   //   imageContent: { x: 0, y: 0 }
//   // });

//   const [selectedElement, setSelectedElement] = useState(null);
//   const [panelPosition, setPanelPosition] = useState({ top: 0, left: 0 });
//   // const dragItem = useRef();
//   // const dragOverItem = useRef();

//   const handleStyleChange = (element, property, value) => {
//     setTextStyles(prev => ({
//       ...prev,
//       [element]: { ...prev[element], [property]: value }
//     }));
//   };

//   // const handleDragStart = (e, positionKey) => {
//   //   dragItem.current = positionKey;
//   //   e.dataTransfer.setData('text/plain', positionKey);
//   //   e.dataTransfer.effectAllowed = 'move';
//   // };

//   // const handleDragOver = (e) => {
//   //   e.preventDefault();
//   //   dragOverItem.current = e.currentTarget.getAttribute('data-position');
//   // };

//   // const handleDrop = (e) => {
//   //   e.preventDefault();
//   //   const draggedItem = e.dataTransfer.getData('text/plain');
    
//   //   if (draggedItem && dragOverItem.current) {
//   //     setPositions(prev => {
//   //       const newPositions = { ...prev };
//   //       const temp = { ...newPositions[draggedItem] };
//   //       newPositions[draggedItem] = { ...newPositions[dragOverItem.current] };
//   //       newPositions[dragOverItem.current] = temp;
//   //       return newPositions;
//   //     });
//   //   }
//   // };

//   const handleElementClick = (element, e) => {
//     setSelectedElement(element);
    
//     const rect = e.currentTarget.getBoundingClientRect();
//     setPanelPosition({
//       top: rect.top + window.scrollY,
//       left: rect.left + rect.width + 20
//     });
//   };

//   // const [elements, setElements] = useState({
//   //   h1: { x: 0, y: 0, width: 300, height: 60 },
//   //   h2: { x: 0, y: 80, width: 500, height: 40 },
//   //   p: { x: 0, y: 140, width: 600, height: 240 },
//   //   button: { x: 0, y: 400, width: 120, height: 40 },
//   //   image: { x: 450, y: 0, width: 200, height: 200 }
//   // });

//   // const handleElementUpdate = (element, data) => {
//   //   setElements(prev => ({
//   //     ...prev,
//   //     [element]: {
//   //       ...prev[element],
//   //       x: data.x,
//   //       y: data.y,
//   //       width: data.width,
//   //       height: data.height
//   //     }
//   //   }));
//   // };

//   return (
//     <div className="editor-container">
//       <div 
//         className={`style-editor-panel ${selectedElement ? 'visible' : ''}`}
//         style={{
//           top: `${panelPosition.top}px`,
//           left: `${panelPosition.left}px`
//         }}
//       >
//         {selectedElement && (
//           <div className="style-controls">
//             <h3>Edit {selectedElement} Style</h3>
//             <div>
//               <label>Color: </label>
//               <input 
//                 type="color" 
//                 value={textStyles[selectedElement].color}
//                 onChange={(e) => handleStyleChange(selectedElement, 'color', e.target.value)}
//               />
//             </div>
//             <div>
//               <label>Font Size: </label>
//               <input 
//                 type="range" 
//                 min="0.5" 
//                 max="3" 
//                 step="0.1"
//                 value={parseFloat(textStyles[selectedElement].fontSize)}
//                 onChange={(e) => handleStyleChange(selectedElement, 'fontSize', `${e.target.value}rem`)}
//               />
//             </div>
//             <div>
//               <label>Font Family: </label>
//               <select
//                 value={textStyles[selectedElement].fontFamily}
//                 onChange={(e) => handleStyleChange(selectedElement, 'fontFamily', e.target.value)}
//               >
//                 <option value="Arial" style={{fontFamily: 'Arial'}}>Arial</option>
//                 <option value="Times New Roman" style={{fontFamily: 'Times New Roman'}}>Times New Roman</option>
//                 <option value="Courier New" style={{fontFamily: 'Courier New'}}>Courier New</option>
//                 <option value="Georgia" style={{fontFamily: 'Georgia'}}>Georgia</option>
//                 <option value="Verdana" style={{fontFamily: 'Verdana'}}>Verdana</option>
//                 <option value="Tahoma" style={{fontFamily: 'Tahoma'}}>Tahoma</option>
//                 <option value="Trebuchet MS" style={{fontFamily: 'Trebuchet MS'}}>Trebuchet MS</option>
//                 <option value="Bookman" style={{fontFamily: 'Bookman'}}>Bookman</option>
//                 <option value="Comic Sans MS" style={{fontFamily: 'Comic Sans MS'}}>Comic Sans MS</option>
//                 <option value="Impact" style={{fontFamily: 'Impact'}}>Impact</option>
//                 <option value="Lucida Sans Unicode" style={{fontFamily: 'Lucida Sans Unicode'}}>Lucida Sans Unicode</option>
//                 <option value="Geneva" style={{fontFamily: 'Geneva'}}>Geneva</option>
//                 <option value="Lucida Console" style={{fontFamily: 'Lucida Console'}}>Lucida Console</option>
//                 <option value="Lucida Bright" style={{fontFamily: 'Lucida Bright'}}>Lucida Bright</option>

//               </select>
//             </div>
//             {selectedElement === 'button' && (
//               <div>
//                 <label>Background Color: </label>
//                 <input 
//                   type="color" 
//                   value={textStyles[selectedElement].backgroundColor}
//                   onChange={(e) => handleStyleChange(selectedElement, 'backgroundColor', e.target.value)}
//                 />
//               </div>
//             )}
//           </div>
//         )}
//       </div>

//       <div className="about-us-content style-one editable-area">
//         <div className="text-content draggable">
//           <h1 
//             style={textStyles.h1}
//             onClick={(e) => handleElementClick('h1', e)}
//             className={selectedElement === 'h1' ? 'selected-element' : ''}
//           >
//             About Us
//           </h1>
          
//           <h2 
//             style={textStyles.h2}
//             onClick={(e) => handleElementClick('h2', e)}
//             className={selectedElement === 'h2' ? 'selected-element' : ''}
//           >
//             Abshore is a Digital Services Company.
//           </h2>
//           <p 
//             style={textStyles.p}
//             onClick={(e) => handleElementClick('p', e)}
//             className={selectedElement === 'p' ? 'selected-element' : ''}
//           >
//             Since 2012, our company has been supporting our clients in the conception, development, and integration of business applications, providing personalized solutions that effectively address their unique and challenging demands.
//             We drive the digital transformation of organizations, advising and assisting our clients and partners in selecting appropriate technologies to enhance their performance.
//             At ABSHOHRE, We have a multidisciplinary teams that follows international project management standards. Additionally, we provide support services to companies for their infrastructures, thanks to our specialized DevOps and SysOps teams. Our project managers are certified according to PMI and ITIL standards.          </p>
//           <button 
//             style={textStyles.button}
//             onClick={(e) => handleElementClick('button', e)}
//             className={selectedElement === 'button' ? 'selected-element' : ''}
//           >
//             Read More
//           </button>
//         </div>
//         <div className="image-content draggable">
//           <img src={logoblack} alt="Logo" />
//         </div>
//       </div>
//     </div>
//   );
// }