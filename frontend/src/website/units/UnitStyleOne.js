// import React from 'react';
// import './Units.css';
// import company from '../../images/company.jpg';

// export default function UnitStyleOne({ unites }) {
//   return (
//     <div className="units-wrapper">
//       <div className="text-content">
//         <h1>Our Units</h1>
//         <p> - A reliable partner to meet all your development and digital services needs.</p>
//         <div>
//           {unites.length > 0 ? (
//             unites.map((unit, index) => (
//               <div key={index}>
//                 <h2>
//                   {unit.image && (
//                     <img
//                       src={unit.image}
//                       alt={unit.titre || "Image de l'unité"}
//                       style={{
//                         width: '40px',
//                         height: '40px',
//                         objectFit: 'cover',
//                         marginRight: '8px',
//                         verticalAlign: 'middle',
//                       }}
//                       onError={(e) => {
//                         e.target.src = "https://via.placeholder.com/40";
//                       }}
//                     />
//                   )}
//                   {unit.titre}
//                 </h2>
//                 <p>{unit.description}</p>
//               </div>
//             ))
//           ) : (
//             <p>Aucune unité publiée pour le moment.</p>
//           )}
//         </div>
//       </div>
//       <div className="image-content">
//            <img src={company} alt="Logo" />
//       </div>
//     </div>
//   );
// }



import React, { useState } from 'react';
import './Units.css';
import company from '../../images/company.jpg';
import EditorText from '../aboutus/EditorText';
import EditorImage from '../aboutus/EditorImage';
import EditorUnitContent from './EditorUnitContent';

export default function UnitStyleOne({ unites }) {
  const [selectedElement, setSelectedElement] = useState(null);

  const initialPositions = {
    sectionName: { top: 0, left: 0 },
    subtitle: { top: 60, left: 0 },
    img: { 
      top: 160, 
      left: '60%',
      marginLeft: '20px',
      width: '45%'
    },
    unitContent: { 
      top: 120, 
      left: 0,
      width: '50%'
    }
  };

  const initialStyles = {
    sectionName: { 
      color: '#f59e0b', 
      fontSize: '20px', 
      fontFamily: 'inherit',
      fontWeight: '600',
    },
    subtitle: { 
      color: '#000', 
      fontSize: '38px', 
      fontFamily: 'inherit',
      fontWeight: '600',
    },
    img: { 
      width: '400px', 
      height: 'auto', 
      borderRadius: '0px',
      position: 'absolute',
      left: '50%'
    },
    unitContent: {
      title: {
        color: '#358dcc',
        fontSize: '20px',
        fontWeight: '600',
      },
      description: {
        color: '#666',
        fontSize: '18px',
      }
    }
  };

  return (
    <div className="units-wrapper">
      <EditorText
        elementType="sectionName"
        initialPosition={initialPositions.sectionName}
        initialStyles={initialStyles.sectionName}
        onSelect={setSelectedElement}
      >
        Our Unite
      </EditorText>

      <EditorText
        elementType="subtitle"
        initialPosition={initialPositions.subtitle}
        initialStyles={initialStyles.subtitle}
        onSelect={setSelectedElement}
      >
        A reliable partner to meet all your development and digital services needs.
      </EditorText>
      
      <EditorUnitContent
        unites={unites}
        initialPosition={initialPositions.unitContent}
        initialStyles={initialStyles.unitContent}
        onSelect={setSelectedElement}
      />

      <div className="image-content">
        <EditorImage
          initialPosition={initialPositions.img}
          initialStyles={initialStyles.img}
          src={company}
          alt="FAQ illustration"
          onSelect={setSelectedElement}
        />
      </div>
    </div>
  );
}