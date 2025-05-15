import React, { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowsUpDownLeftRight, faTimes, faWandMagicSparkles } from '@fortawesome/free-solid-svg-icons';

export default function EditorUnitGrid({ unites, initialPosition = { top: 0, left: 0 }, initialStyles = { width: 1400 }, onSelect }) {
  const [position, setPosition] = useState({
    top: initialPosition.top || 0,
    left: typeof initialPosition.left === 'number' ? initialPosition.left : 0,
  });
  const [styles, setStyles] = useState({
    width: parseFloat(initialStyles.width) || 1400,
    header: {
      title: {
        color: initialStyles.header?.title?.color || '#f59e0b',
        fontSize: initialStyles.header?.title?.fontSize || '20px',
        fontFamily: initialStyles.header?.title?.fontFamily || 'inherit',
        fontWeight: initialStyles.header?.title?.fontWeight || '600',
      },
      subtitle: {
        color: initialStyles.header?.subtitle?.color || '#000',
        fontSize: initialStyles.header?.subtitle?.fontSize || '38px',
        fontFamily: initialStyles.header?.subtitle?.fontFamily || 'inherit',
        fontWeight: initialStyles.header?.subtitle?.fontWeight || '600',
      }
    },
    card: {
      collapsed: {
        backgroundColor: initialStyles.card?.collapsed?.backgroundColor || 'white',
        width: initialStyles.card?.collapsed?.width || '200px',
        height: initialStyles.card?.collapsed?.height || '430px',
      },
      expanded: {
        backgroundColor: initialStyles.card?.expanded?.backgroundColor || '#014268',
        width: initialStyles.card?.expanded?.width || '800px',
      },
      title: {
        color: initialStyles.card?.title?.color || 'white',
        fontSize: initialStyles.card?.title?.fontSize || '38px',
        fontFamily: initialStyles.card?.title?.fontFamily || 'inherit',
        fontWeight: initialStyles.card?.title?.fontWeight || '600',
      },
      description: {
        color: initialStyles.card?.description?.color || '#e0e0e0',
        fontSize: initialStyles.card?.description?.fontSize || '18px',
        fontFamily: initialStyles.card?.description?.fontFamily || 'inherit',
      },
      button: {
        backgroundColor: initialStyles.card?.button?.backgroundColor || '#f59e0b',
        color: initialStyles.card?.button?.color || '#184969',
        fontSize: initialStyles.card?.button?.fontSize || '14px',
      }
    }
  });
  const [unitData, setUnitData] = useState(unites);
  const [isDragging, setIsDragging] = useState(false);
  const [isEditingStyles, setIsEditingStyles] = useState(false);
  const [isSelected, setIsSelected] = useState(false);
  const [resizing, setResizing] = useState(null);
  const [expandedIndex, setExpandedIndex] = useState(0);
  const offset = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (isDragging || resizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    } else {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, resizing]);

  const handleMouseDown = (e) => {
    e.stopPropagation();
    offset.current = {
      x: e.clientX - position.left,
      y: e.clientY - position.top,
    };
    setIsDragging(true);
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      requestAnimationFrame(() => {
        setPosition({
          top: e.clientY - offset.current.y,
          left: e.clientX - offset.current.x,
        });
      });
    } else if (resizing) {
      const deltaX = e.clientX - offset.current.x;
      const newWidth = Math.max(offset.current.width + deltaX, 300);
      setStyles(prev => ({ ...prev, width: newWidth }));
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setResizing(null);
  };

  const handleResizeMouseDown = (e) => {
    e.stopPropagation();
    setResizing(true);
    offset.current = {
      x: e.clientX,
      y: e.clientY,
      width: styles.width,
    };
  };

  const handleElementClick = (e) => {
    e.stopPropagation();
    setIsSelected(true);
    if (onSelect) onSelect('unitGrid');
  };

  const handleToggle = (index) => {
    if (index === expandedIndex) return;
    setExpandedIndex(index);
  };

  const handleStyleChange = (property, value, group = null, subGroup = null) => {
    if (group && subGroup) {
      setStyles(prev => ({
        ...prev,
        [group]: {
          ...prev[group],
          [subGroup]: {
            ...prev[group][subGroup],
            [property]: value
          }
        }
      }));
    } else if (group) {
      setStyles(prev => ({
        ...prev,
        [group]: {
          ...prev[group],
          [property]: value
        }
      }));
    } else {
      setStyles(prev => ({
        ...prev,
        [property]: value
      }));
    }
  };

  const toggleTextStyle = (property, group, subGroup, value, defaultValue) => {
    handleStyleChange(
      property, 
      styles[group][subGroup][property] === value ? defaultValue : value, 
      group, 
      subGroup
    );
  };

  const renderControlButtons = () => {
    if (!isSelected) return null;

    return (
      <div
        className="element-controls"
        style={{
          position: 'absolute',
          top: position.top - 40,
          left: position.left,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '5px',
          backgroundColor: '#fff',
          padding: '8px',
          border: '1px solid #ccc',
          borderRadius: '4px',
          zIndex: 1000,
        }}
      >
        <button
          onMouseDown={handleMouseDown}
          style={{
            cursor: 'grab',
            fontSize: '16px',
            color: '#000',
            background: '#fff',
            border: '1px solid #ccc',
            borderRadius: '4px',
            padding: '4px',
          }}
        >
          <FontAwesomeIcon icon={faArrowsUpDownLeftRight} />
        </button>
        <button
          onClick={() => setIsEditingStyles(true)}
          style={{
            cursor: 'pointer',
            fontSize: '16px',
            color: '#000',
            background: '#fff',
            border: '1px solid #ccc',
            borderRadius: '4px',
            padding: '4px',
          }}
        >
          <FontAwesomeIcon icon={faWandMagicSparkles} />
        </button>
      </div>
    );
  };

  const renderResizeHandles = () => {
    if (!isSelected) return null;

    return (
      <div
        style={{
          position: 'absolute',
          top: position.top,
          left: position.left + styles.width - 8,
          width: 16,
          height: 16,
          backgroundColor: 'blue',
          cursor: 'ew-resize',
          zIndex: 20,
        }}
        onMouseDown={handleResizeMouseDown}
      />
    );
  };

  return (
    <div
      onClick={() => setIsSelected(false)}
      style={{ position: 'relative' }}
    >
      {renderControlButtons()}
      {renderResizeHandles()}
      {isEditingStyles && (
        <div
          className="style-editor-panel visible"
          style={{
            position: 'absolute',
            top: `${position.top || 0}px`,
            left: `${(position.left || 0) + styles.width + 20}px`,
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '8px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
            zIndex: 100,
            width: '300px',
          }}
        >
          <button
            onClick={() => setIsEditingStyles(false)}
            style={{
              position: 'absolute',
              top: '5px',
              right: '5px',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              fontSize: '16px',
              color: '#999',
            }}
            aria-label="Close editor"
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>

          <div className="style-controls">
            <h3>Edit Unit Grid Style</h3>
            <div>
              <label>Container Width: </label>
              <input
                type="number"
                min="300"
                value={styles.width}
                onChange={(e) => handleStyleChange('width', parseInt(e.target.value))}
              />
            </div>

            <h3>Card Styles</h3>
            <div>
              <label>Collapsed Background: </label>
              <input
                type="color"
                value={styles.card.collapsed.backgroundColor}
                onChange={(e) => handleStyleChange('backgroundColor', e.target.value, 'card', 'collapsed')}
              />
            </div>
            <div>
              <label>Collapsed Width: </label>
              <input
                type="number"
                min="100"
                value={parseInt(styles.card.collapsed.width)}
                onChange={(e) => handleStyleChange('width', `${e.target.value}px`, 'card', 'collapsed')}
              />
            </div>
            <div>
              <label>Collapsed Height: </label>
              <input
                type="number"
                min="100"
                value={parseInt(styles.card.collapsed.height)}
                onChange={(e) => handleStyleChange('height', `${e.target.value}px`, 'card', 'collapsed')}
              />
            </div>
            <div>
              <label>Expanded Background: </label>
              <input
                type="color"
                value={styles.card.expanded.backgroundColor}
                onChange={(e) => handleStyleChange('backgroundColor', e.target.value, 'card', 'expanded')}
              />
            </div>
            <div>
              <label>Expanded Width: </label>
              <input
                type="number"
                min="300"
                value={parseInt(styles.card.expanded.width)}
                onChange={(e) => handleStyleChange('width', `${e.target.value}px`, 'card', 'expanded')}
              />
            </div>

            <h3>Card Title Styles</h3>
            <div>
              <label>Title Color: </label>
              <input
                type="color"
                value={styles.card.title.color}
                onChange={(e) => handleStyleChange('color', e.target.value, 'card', 'title')}
              />
            </div>
            <div>
              <label>Title Font Size: </label>
              <input
                type="range"
                min="10"
                max="50"
                step="1"
                value={parseInt(styles.card.title.fontSize)}
                onChange={(e) => handleStyleChange('fontSize', `${e.target.value}px`, 'card', 'title')}
              />
            </div>

            <h3>Card Description Styles</h3>
            <div>
              <label>Description Color: </label>
              <input
                type="color"
                value={styles.card.description.color}
                onChange={(e) => handleStyleChange('color', e.target.value, 'card', 'description')}
              />
            </div>
            <div>
              <label>Description Font Size: </label>
              <input
                type="range"
                min="10"
                max="30"
                step="1"
                value={parseInt(styles.card.description.fontSize)}
                onChange={(e) => handleStyleChange('fontSize', `${e.target.value}px`, 'card', 'description')}
              />
            </div>

            <h3>Button Styles</h3>
            <div>
              <label>Button Background: </label>
              <input
                type="color"
                value={styles.card.button.backgroundColor}
                onChange={(e) => handleStyleChange('backgroundColor', e.target.value, 'card', 'button')}
              />
            </div>
            <div>
              <label>Button Text Color: </label>
              <input
                type="color"
                value={styles.card.button.color}
                onChange={(e) => handleStyleChange('color', e.target.value, 'card', 'button')}
              />
            </div>
            <div>
              <label>Button Font Size: </label>
              <input
                type="range"
                min="10"
                max="20"
                step="1"
                value={parseInt(styles.card.button.fontSize)}
                onChange={(e) => handleStyleChange('fontSize', `${e.target.value}px`, 'card', 'button')}
              />
            </div>
          </div>
        </div>
      )}
      <div
        className="units-wrapper"
        style={{
          position: 'absolute',
          top: position.top,
          left: position.left,
          width: styles.width,
          cursor: 'pointer',
        }}
        onClick={handleElementClick}
      >
        
        
        <div 
          className="units-container style-two"
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '20px',
            margin: '0 auto',
            maxWidth: '1400px',
            padding: '0 15px',
          }}
        >
          {unitData.map((unit, index) => (
            <div
              key={index}
              className={`unit-card ${expandedIndex === index ? 'expanded' : ''}`}
              onClick={() => handleToggle(index)}
              style={{
                background: expandedIndex === index 
                  ? styles.card.expanded.backgroundColor 
                  : styles.card.collapsed.backgroundColor,
                borderRadius: '16px',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                display: 'flex',
                alignItems: 'center',
                width: expandedIndex === index 
                  ? styles.card.expanded.width 
                  : styles.card.collapsed.width,
                height: styles.card.collapsed.height,
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                overflow: 'hidden',
              }}
            >
              {expandedIndex === index && (
                <div className="unit-content" style={{ flex: 1, padding: '40px' }}>
                  <h3 style={{
                    fontSize: styles.card.title.fontSize,
                    fontFamily: styles.card.title.fontFamily,
                    fontWeight: styles.card.title.fontWeight,
                    color: styles.card.title.color,
                    marginBottom: '30px',
                  }}>
                    {unit.titre}
                  </h3>
                  <p className="expanded" style={{
                    fontSize: styles.card.description.fontSize,
                    fontFamily: styles.card.description.fontFamily,
                    color: styles.card.description.color,
                    lineHeight: '1.8',
                  }}>
                    {unit.description}
                  </p>
                  <button className="read-more-btn" style={{
                    backgroundColor: styles.card.button.backgroundColor,
                    color: styles.card.button.color,
                    fontSize: styles.card.button.fontSize,
                    border: 'none',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    fontWeight: '700',
                    padding: '12px 20px',
                    textTransform: 'uppercase',
                    marginTop: '10px',
                  }}>
                    {expandedIndex === index ? 'LIRE MOINS' : 'LIRE PLUS'}
                  </button>
                </div>
              )}
              <div 
                className="unit-image-container" 
                style={{
                  width: '200px',
                  height: '200px',
                  borderRadius: '10px',
                  overflow: 'hidden',
                }}
              >
                <img
                  src={unit.image || 'https://via.placeholder.com/150'}
                  alt={unit.titre}
                  className="unit-image"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}