import React, { useState } from 'react';
import './Units.css';
import EditorText from '../aboutus/EditorText';
import EditorUnitGrid from './EditorUnitCard';

export default function UnitStyleTwo({ unites }) {
  const [selectedElement, setSelectedElement] = useState(null);

  const initialPositions = {
    sectionName: { top: 0, left: 0 },
    subtitle: { top: 60, left: 0 },
    unitGrid: { top: 140, left: 0 },
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
    unitGrid: {
      width: 1400,
      header: {
        title: {
          color: '#f59e0b',
          fontSize: '20px',
          fontWeight: '600',
        },
        subtitle: {
          color: '#000',
          fontSize: '38px',
          fontWeight: '600',
        }
      },
      card: {
        collapsed: {
          backgroundColor: 'white',
          width: '200px',
          height: '430px',
        },
        expanded: {
          backgroundColor: '#014268',
          width: '800px',
        },
        title: {
          color: 'white',
          fontSize: '38px',
          fontWeight: '600',
        },
        description: {
          color: '#e0e0e0',
          fontSize: '18px',
        },
        button: {
          backgroundColor: '#f59e0b',
          color: '#184969',
          fontSize: '14px',
        }
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
      
      <EditorUnitGrid
        unites={unites}
        initialPosition={initialPositions.unitGrid}
        initialStyles={initialStyles.unitGrid}
        onSelect={setSelectedElement}
      />
    </div>
  );
}