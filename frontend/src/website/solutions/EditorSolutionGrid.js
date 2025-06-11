import React, { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowsUpDownLeftRight, faTimes, faWandMagicSparkles } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const API_URL = 'http://localhost:5000/couleurs';

export default function EditorSolutionGrid({ solutions = [], initialPosition = { top: 0, left: 0 }, initialStyles = { width: 1200, minHeight: 440 }, onSelect, onPositionChange, onUpdate, onStyleChange }) {
  const [position, setPosition] = useState({
    top: initialPosition.top || 0,
    left: initialPosition.left || 0,
  });
  const [gridStyles, setGridStyles] = useState({
    width: parseFloat(initialStyles.width) || 1200,
    minHeight: parseFloat(initialStyles.minHeight) || 440,
  });
  const [cardStyles, setCardStyles] = useState({
    card: {
      backgroundColor: initialStyles.card?.backgroundColor || '#ffffff',
      hoverBackgroundColor: initialStyles.card?.hoverBackgroundColor || '#f8f9fa',
      borderRadius: initialStyles.card?.borderRadius || '8px',
    },
    number: {
      color: initialStyles.number?.color || '#333333',
      fontSize: initialStyles.number?.fontSize || '24px',
    },
    title: {
      color: initialStyles.title?.color || '#333333',
      fontSize: initialStyles.title?.fontSize || '18px',
      fontFamily: initialStyles.title?.fontFamily || 'Arial',
      textAlign: initialStyles.title?.textAlign || 'left',
    },
    description: {
      color: initialStyles.description?.color || '#666666',
      fontSize: initialStyles.description?.fontSize || '14px',
      fontFamily: initialStyles.description?.fontFamily || 'Arial',
      textAlign: initialStyles.description?.textAlign || 'left',
    },
  });
  const [solutionData, setSolutionData] = useState([]);
  const [pendingChanges, setPendingChanges] = useState({});
  const [isDragging, setIsDragging] = useState(false);
  const [isEditingStyles, setIsEditingStyles] = useState(false);
  const [isSelected, setIsSelected] = useState(false);
  const [resizing, setResizing] = useState(null);
  const [editingSolutionIndex, setEditingSolutionIndex] = useState(null);
  const [editingField, setEditingField] = useState(null);
  const [draggingElement, setDraggingElement] = useState(null);
  const offset = useRef({ x: 0, y: 0 });
  const inputRef = useRef(null);
  const [colors, setColors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userEntreprise, setUserEntreprise] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const saveTimeoutRef = useRef(null);
  const pendingStyles = useRef({});

  // Fetch user enterprise
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        const userId = decodedToken?.sub;
        if (userId) {
          axios
            .get(`http://localhost:5000/auth/user/${userId}`, {
              headers: { Authorization: `Bearer ${token}` },
            })
            .then((response) => {
              setUserEntreprise(response.data.entreprise);
              setLoading(false);
            })
            .catch((err) => {
              console.error('Error fetching user data:', err);
              setError('Erreur lors de la récupération des données utilisateur.');
              setLoading(false);
            });
        } else {
          setError('ID utilisateur manquant.');
          setLoading(false);
        }
      } catch (err) {
        console.error('Error decoding token:', err);
        setError('Erreur lors du décodage du token.');
        setLoading(false);
      }
    } else {
      console.error('Token is missing from localStorage.');
      setError('Token manquant. Veuillez vous connecter.');
      setLoading(false);
    }
  }, []);

  // Fetch company colors
  useEffect(() => {
    if (userEntreprise) {
      axios
        .get(`${API_URL}/entreprise/${userEntreprise}/couleurs`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        })
        .then((res) => {
          setColors(res.data);
        })
        .catch((err) => {
          console.error('Erreur lors de la récupération des couleurs:', err);
          setError('Erreur lors de la récupération des couleurs.');
        });
    }
  }, [userEntreprise]);

  // Fonction pour sauvegarder les styles dans la base de données avec debounce
  const saveSolutionStyles = (solutionId, styles) => {
    if (!solutionId || !userEntreprise) {
      console.warn('ID de solution ou entreprise manquant pour la sauvegarde');
      return;
    }

    // Annuler le timeout précédent s'il existe
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    setIsSaving(true);

    // Créer un nouveau timeout pour la sauvegarde
    saveTimeoutRef.current = setTimeout(async () => {
      try {
        const token = localStorage.getItem('token');

        await axios.patch(
          `http://localhost:5000/contenus/Solution/${solutionId}/styles`,
          styles,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        console.log('Styles sauvegardés avec succès pour la solution:', solutionId);
      } catch (error) {
        console.error('Erreur lors de la sauvegarde des styles:', error);
        setError('Erreur lors de la sauvegarde des styles');
      } finally {
        setIsSaving(false);
      }
    }, 1000); // Délai de 1 seconde
  };

  // Fonction pour sauvegarder le contenu d'une solution
  const saveSolutionContent = async (solutionId, field, value) => {
    if (!solutionId || !userEntreprise) {
      console.warn('ID de solution ou entreprise manquant pour la sauvegarde');
      return;
    }

    try {
      const token = localStorage.getItem('token');

      await axios.patch(
        `http://localhost:5000/contenus/Solution/${solutionId}`,
        { [field]: value },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log(`${field} sauvegardé avec succès pour la solution:`, solutionId);
    } catch (error) {
      console.error(`Erreur lors de la sauvegarde du ${field}:`, error);
      setError(`Erreur lors de la sauvegarde du ${field}`);
    }
  };

  useEffect(() => {
    setSolutionData(solutions.map((solution) => ({
      ...solution,
      positions: {
        number: { top: 20, left: 20 },
        title: { top: 80, left: 20 },
        description: { top: 110, left: 20 },
      },
    })));
  }, [solutions]);

  useEffect(() => {
    if (isDragging || resizing || draggingElement) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    } else {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    }
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      // Nettoyer le timeout de sauvegarde
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [isDragging, resizing, draggingElement]);

  useEffect(() => {
    if (editingSolutionIndex !== null && inputRef.current) {
      inputRef.current.focus();
    }
  }, [editingSolutionIndex, editingField]);

  const handleMouseDown = (e) => {
    e.stopPropagation();
    offset.current = {
      x: e.clientX - position.left,
      y: e.clientY - position.top,
    };
    setIsDragging(true);
  };

  const handleElementDragStart = (e, solutionIndex, element) => {
    e.stopPropagation();
    const card = e.currentTarget.closest('.solution-card');
    const rect = card.getBoundingClientRect();
    offset.current = {
      x: e.clientX - rect.left - solutionData[solutionIndex].positions[element].left,
      y: e.clientY - rect.top - solutionData[solutionIndex].positions[element].top,
    };
    setDraggingElement({ solutionIndex, element });
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      requestAnimationFrame(() => {
        const newPosition = {
          top: e.clientY - offset.current.y,
          left: e.clientX - offset.current.x,
        };
        setPosition(newPosition);
        onPositionChange?.(newPosition);
      });
    } else if (resizing) {
      const deltaX = e.clientX - offset.current.x;
      const deltaY = e.clientY - offset.current.y;
      let newWidth = gridStyles.width;
      let newMinHeight = gridStyles.minHeight;
      if (resizing === 'bottom-right') {
        newWidth = offset.current.width + deltaX;
        newMinHeight = offset.current.minHeight + deltaY;
      }
      newWidth = Math.max(newWidth, 300);
      newMinHeight = Math.max(newMinHeight, 200);
      setGridStyles((prev) => ({
        ...prev,
        width: newWidth,
        minHeight: newMinHeight,
      }));
    } else if (draggingElement) {
      requestAnimationFrame(() => {
        const { solutionIndex, element } = draggingElement;
        const card = document.getElementsByClassName('solution-card')[solutionIndex];
        const rect = card.getBoundingClientRect();
        const cardWidth = parseInt(cardStyles.card.width);
        const cardHeight = 300; // Approximate height, adjust if needed
        const elementWidth = element === 'number' ? 50 : cardWidth - 40; // Approximate width for number
        const elementHeight = element === 'number' ? 50 : (element === 'title' ? 30 : 60);

        let newLeft = e.clientX - rect.left - offset.current.x;
        let newTop = e.clientY - rect.top - offset.current.y;

        newLeft = Math.max(0, Math.min(newLeft, cardWidth - elementWidth));
        newTop = Math.max(0, Math.min(newTop, cardHeight - elementHeight));

        setSolutionData((prev) => {
          const newSolutions = [...prev];
          newSolutions[solutionIndex] = {
            ...newSolutions[solutionIndex],
            positions: {
              ...newSolutions[solutionIndex].positions,
              [element]: { top: newTop, left: newLeft },
            },
          };
          if (newSolutions[solutionIndex]._id) {
            setPendingChanges((prev) => ({
              ...prev,
              [newSolutions[solutionIndex]._id]: {
                ...prev[newSolutions[solutionIndex]._id],
                positions: newSolutions[solutionIndex].positions,
              },
            }));
            onUpdate?.(newSolutions[solutionIndex]._id, { positions: newSolutions[solutionIndex].positions });
          }
          return newSolutions;
        });
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setResizing(null);
    setDraggingElement(null);
  };

  const handleResizeMouseDown = (handle, e) => {
    e.stopPropagation();
    setResizing(handle);
    offset.current = {
      x: e.clientX,
      y: e.clientY,
      width: gridStyles.width,
      minHeight: gridStyles.minHeight,
    };
  };

  const handleElementClick = (e) => {
    e.stopPropagation();
    setIsSelected(true);
    onSelect?.('solutionGrid');
  };

  const handleEditSolution = (index, field) => {
    setEditingSolutionIndex(index);
    setEditingField(field);
  };

  const handleSolutionChange = (e, index, field) => {
    const value = e.target.value;
    setSolutionData((prev) => {
      const newSolutions = [...prev];
      newSolutions[index] = { ...newSolutions[index], [field]: value };
      if (newSolutions[index]._id) {
        setPendingChanges((prev) => ({
          ...prev,
          [newSolutions[index]._id]: {
            ...prev[newSolutions[index]._id],
            [field]: value,
          },
        }));

        // Sauvegarder le contenu modifié
        saveSolutionContent(newSolutions[index]._id, field, value);

        onUpdate?.(newSolutions[index]._id, { [field]: value });
      }
      return newSolutions;
    });
  };

  const handleStyleChange = (property, value, subProperty, solutionIndex) => {
    setCardStyles((prev) => {
      const newStyles = {
        ...prev,
        [subProperty]: {
          ...prev[subProperty],
          [property]: value,
        },
      };

      // Propager les changements au parent
      if (onUpdate) {
        const solution = solutions[solutionIndex];
        if (solution && solution._id) {
          onUpdate(solution._id, newStyles);
        }
      }

      return newStyles;
    });
  };

  const toggleTextStyle = (property, subProperty, value, defaultValue) => {
    const currentValue = cardStyles[subProperty][property] || defaultValue;
    handleStyleChange(property, currentValue === value ? defaultValue : value, subProperty, editingSolutionIndex);
  };

  const handleBlur = () => {
    setEditingSolutionIndex(null);
    setEditingField(null);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && editingField !== 'description') {
      handleBlur();
    }
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
    const handleSize = 8;
    const handles = [
      {
        name: 'bottom-right',
        cursor: 'nwse-resize',
        top: gridStyles.minHeight - handleSize / 2,
        left: gridStyles.width - handleSize / 2,
      },
    ];
    return handles.map((handle) => (
      <div
        key={handle.name}
        style={{
          position: 'absolute',
          top: position.top + handle.top,
          left: position.left + handle.left,
          width: handleSize,
          height: handleSize,
          backgroundColor: 'blue',
          cursor: handle.cursor,
          zIndex: 20,
        }}
        onMouseDown={(e) => handleResizeMouseDown(handle.name, e)}
      />
    ));
  };

  if (!solutionData.length) {
    return <div>Loading solutions...</div>;
  }

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
            top: `${Math.max(position.top, 0)}px`,
            left: `${Math.min(position.left + gridStyles.width + 20, window.innerWidth - 350)}px`,
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '8px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
            zIndex: 100,
            maxWidth: '350px',
            maxHeight: '80vh',
            overflowY: 'auto',
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
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <h3>Edit Solution Grid Style</h3>
              {isSaving && (
                <span style={{ color: '#007bff', fontSize: '12px' }}>
                  Sauvegarde en cours...
                </span>
              )}
            </div>
            <h3>Card Styles</h3>
            <div>
              <label>Background Color: </label>
              {loading ? (
                <span>Chargement des couleurs...</span>
              ) : error ? (
                <span style={{ color: 'red' }}>{error}</span>
              ) : colors.length === 0 ? (
                <span>Aucune couleur disponible.</span>
              ) : (
                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '8px',
                    marginLeft: '10px',
                    marginTop: '5px',
                  }}
                >
                  {colors.map((c) => (
                    <div
                      key={c._id}
                      onClick={() => handleStyleChange('backgroundColor', c.couleur, 'card', editingSolutionIndex)}
                      style={{
                        width: '20px',
                        height: '20px',
                        backgroundColor: c.couleur,
                        border: cardStyles.card.backgroundColor === c.couleur ? '2px solid #000' : '1px solid #ccc',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        transition: 'border 0.2s ease',
                      }}
                      title={c.couleur}
                    />
                  ))}
                </div>
              )}
              <input
                type="color"
                value={cardStyles.card.backgroundColor}
                onChange={(e) => handleStyleChange('backgroundColor', e.target.value, 'card', editingSolutionIndex)}
              />
            </div>
            <div>
              <label>Hover Background Color: </label>
              {loading ? (
                <span>Chargement des couleurs...</span>
              ) : error ? (
                <span style={{ color: 'red' }}>{error}</span>
              ) : colors.length === 0 ? (
                <span>Aucune couleur disponible.</span>
              ) : (
                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '8px',
                    marginLeft: '10px',
                    marginTop: '5px',
                  }}
                >
                  {colors.map((c) => (
                    <div
                      key={c._id}
                      onClick={() => handleStyleChange('hoverBackgroundColor', c.couleur, 'card', editingSolutionIndex)}
                      style={{
                        width: '20px',
                        height: '20px',
                        backgroundColor: c.couleur,
                        border: cardStyles.card.hoverBackgroundColor === c.couleur ? '2px solid #000' : '1px solid #ccc',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        transition: 'border 0.2s ease',
                      }}
                      title={c.couleur}
                    />
                  ))}
                </div>
              )}
              <input
                type="color"
                value={cardStyles.card.hoverBackgroundColor}
                onChange={(e) => handleStyleChange('hoverBackgroundColor', e.target.value, 'card', editingSolutionIndex)}
              />
            </div>
            <div>
              <label>Border Radius: </label>
              <input
                type="range"
                min="0"
                max="50"
                value={parseInt(cardStyles.card.borderRadius)}
                onChange={(e) => handleStyleChange('borderRadius', `${e.target.value}px`, 'card', editingSolutionIndex)}
              />
            </div>
            <h3>Number Style</h3>
            <div>
              <label>Color: </label>
              {loading ? (
                <span>Chargement des couleurs...</span>
              ) : error ? (
                <span style={{ color: 'red' }}>{error}</span>
              ) : colors.length === 0 ? (
                <span>Aucune couleur disponible.</span>
              ) : (
                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '8px',
                    marginLeft: '10px',
                    marginTop: '5px',
                  }}
                >
                  {colors.map((c) => (
                    <div
                      key={c._id}
                      onClick={() => handleStyleChange('color', c.couleur, 'number', editingSolutionIndex)}
                      style={{
                        width: '20px',
                        height: '20px',
                        backgroundColor: c.couleur,
                        border: cardStyles.number.color === c.couleur ? '2px solid #000' : '1px solid #ccc',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        transition: 'border 0.2s ease',
                      }}
                      title={c.couleur}
                    />
                  ))}
                </div>
              )}
              <input
                type="color"
                value={cardStyles.number.color}
                onChange={(e) => handleStyleChange('color', e.target.value, 'number', editingSolutionIndex)}
              />
            </div>
            <div>
              <label>Font Size: </label>
              <input
                type="range"
                min="20"
                max="100"
                step="1"
                value={parseInt(cardStyles.number.fontSize)}
                onChange={(e) => handleStyleChange('fontSize', `${e.target.value}px`, 'number', editingSolutionIndex)}
              />
            </div>
            <h3>Title Text Style</h3>
            <div>
              <label>Color: </label>
              {loading ? (
                <span>Chargement des couleurs...</span>
              ) : error ? (
                <span style={{ color: 'red' }}>{error}</span>
              ) : colors.length === 0 ? (
                <span>Aucune couleur disponible.</span>
              ) : (
                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '8px',
                    marginLeft: '10px',
                    marginTop: '5px',
                  }}
                >
                  {colors.map((c) => (
                    <div
                      key={c._id}
                      onClick={() => handleStyleChange('color', c.couleur, 'title', editingSolutionIndex)}
                      style={{
                        width: '20px',
                        height: '20px',
                        backgroundColor: c.couleur,
                        border: cardStyles.title.color === c.couleur ? '2px solid #000' : '1px solid #ccc',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        transition: 'border 0.2s ease',
                      }}
                      title={c.couleur}
                    />
                  ))}
                </div>
              )}
              <input
                type="color"
                value={cardStyles.title.color}
                onChange={(e) => handleStyleChange('color', e.target.value, 'title', editingSolutionIndex)}
              />
            </div>
            <div>
              <label>Font Size: </label>
              <input
                type="range"
                min="10"
                max="50"
                step="1"
                value={parseInt(cardStyles.title.fontSize)}
                onChange={(e) => handleStyleChange('fontSize', `${e.target.value}px`, 'title', editingSolutionIndex)}
              />
            </div>
            <div>
              <label>Font Family: </label>
              <select
                value={cardStyles.title.fontFamily}
                onChange={(e) => handleStyleChange('fontFamily', e.target.value, 'title', editingSolutionIndex)}
              >
                <option value="Arial">Arial</option>
                <option value="Times New Roman">Times New Roman</option>
                <option value="Courier New">Courier New</option>
                <option value="Georgia">Georgia</option>
                <option value="Verdana">Verdana</option>
                <option value="Poppins">Poppins</option>
                <option value="Roboto">Roboto</option>
                <option value="Open Sans">Open Sans</option>
                <option value="Montserrat">Montserrat</option>
                <option value="Lato">Lato</option>
                <option value="Inter">Inter</option>
              </select>
            </div>
            <div>
              <label>Text Align: </label>
              <select
                value={cardStyles.title.textAlign}
                onChange={(e) => handleStyleChange('textAlign', e.target.value, 'title', editingSolutionIndex)}
              >
                <option value="left">Left</option>
                <option value="center">Center</option>
                <option value="right">Right</option>
                <option value="justify">Justify</option>
              </select>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => toggleTextStyle('fontWeight', 'title', '700', 'normal')}
                style={{
                  padding: '5px 10px',
                  backgroundColor: cardStyles.title.fontWeight === '700' ? '#ccc' : '#fff',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  cursor: 'pointer',
                }}
              >
                <strong>B</strong>
              </button>
              <button
                onClick={() => toggleTextStyle('fontStyle', 'title', 'italic', 'normal')}
                style={{
                  padding: '5px 10px',
                  backgroundColor: cardStyles.title.fontStyle === 'italic' ? '#ccc' : '#fff',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  cursor: 'pointer',
                }}
              >
                <em>I</em>
              </button>
              <button
                onClick={() => toggleTextStyle('textDecoration', 'title', 'underline', 'none')}
                style={{
                  padding: '5px 10px',
                  backgroundColor: cardStyles.title.textDecoration === 'underline' ? '#ccc' : '#fff',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  cursor: 'pointer',
                }}
              >
                <u>U</u>
              </button>
            </div>
            <h3>Description Text Style</h3>
            <div>
              <label>Color: </label>
              {loading ? (
                <span>Chargement des couleurs...</span>
              ) : error ? (
                <span style={{ color: 'red' }}>{error}</span>
              ) : colors.length === 0 ? (
                <span>Aucune couleur disponible.</span>
              ) : (
                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '8px',
                    marginLeft: '10px',
                    marginTop: '5px',
                  }}
                >
                  {colors.map((c) => (
                    <div
                      key={c._id}
                      onClick={() => handleStyleChange('color', c.couleur, 'description', editingSolutionIndex)}
                      style={{
                        width: '20px',
                        height: '20px',
                        backgroundColor: c.couleur,
                        border: cardStyles.description.color === c.couleur ? '2px solid #000' : '1px solid #ccc',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        transition: 'border 0.2s ease',
                      }}
                      title={c.couleur}
                    />
                  ))}
                </div>
              )}
              <input
                type="color"
                value={cardStyles.description.color}
                onChange={(e) => handleStyleChange('color', e.target.value, 'description', editingSolutionIndex)}
              />
            </div>
            <div>
              <label>Font Size: </label>
              <input
                type="range"
                min="10"
                max="50"
                step="1"
                value={parseInt(cardStyles.description.fontSize)}
                onChange={(e) => handleStyleChange('fontSize', `${e.target.value}px`, 'description', editingSolutionIndex)}
              />
            </div>
            <div>
              <label>Font Family: </label>
              <select
                value={cardStyles.description.fontFamily}
                onChange={(e) => handleStyleChange('fontFamily', e.target.value, 'description', editingSolutionIndex)}
              >
                <option value="Arial">Arial</option>
                <option value="Times New Roman">Times New Roman</option>
                <option value="Courier New">Courier New</option>
                <option value="Georgia">Georgia</option>
                <option value="Verdana">Verdana</option>
                <option value="Poppins">Poppins</option>
                <option value="Roboto">Roboto</option>
                <option value="Open Sans">Open Sans</option>
                <option value="Montserrat">Montserrat</option>
                <option value="Lato">Lato</option>
                <option value="Inter">Inter</option>
              </select>
            </div>
            <div>
              <label>Text Align: </label>
              <select
                value={cardStyles.description.textAlign}
                onChange={(e) => handleStyleChange('textAlign', e.target.value, 'description', editingSolutionIndex)}
              >
                <option value="left">Left</option>
                <option value="center">Center</option>
                <option value="right">Right</option>
                <option value="justify">Justify</option>
              </select>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => toggleTextStyle('fontWeight', 'description', '700', 'normal')}
                style={{
                  padding: '5px 10px',
                  backgroundColor: cardStyles.description.fontWeight === '700' ? '#ccc' : '#fff',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  cursor: 'pointer',
                }}
              >
                <strong>B</strong>
              </button>
              <button
                onClick={() => toggleTextStyle('fontStyle', 'description', 'italic', 'normal')}
                style={{
                  padding: '5px 10px',
                  backgroundColor: cardStyles.description.fontStyle === 'italic' ? '#ccc' : '#fff',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  cursor: 'pointer',
                }}
              >
                <em>I</em>
              </button>
              <button
                onClick={() => toggleTextStyle('textDecoration', 'description', 'underline', 'none')}
                style={{
                  padding: '5px 10px',
                  backgroundColor: cardStyles.description.textDecoration === 'underline' ? '#ccc' : '#fff',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  cursor: 'pointer',
                }}
              >
                <u>U</u>
              </button>
            </div>
            <h3>Grid Styles</h3>
            <div>
              <label>Grid Width: </label>
              <input
                type="number"
                min="300"
                value={gridStyles.width}
                onChange={(e) => setGridStyles((prev) => ({ ...prev, width: parseInt(e.target.value) }))}
              />
            </div>
            <div>
              <label>Grid Min Height: </label>
              <input
                type="number"
                min="200"
                value={gridStyles.minHeight}
                onChange={(e) => setGridStyles((prev) => ({ ...prev, minHeight: parseInt(e.target.value) }))}
              />
            </div>
          </div>
        </div>
      )}
      <div
        className="solutions-container style-one"
        style={{
          position: 'absolute',
          top: position.top,
          left: position.left,
          width: gridStyles.width,
          minHeight: gridStyles.minHeight,
          display: 'flex',
          flexWrap: 'wrap',
          gap: '30px',
          padding: '10px 20px',
        }}
        onClick={handleElementClick}
      >
        {solutionData.map((solution, index) => (
          <div
            key={solution._id || index}
            className="solution-card"
            style={{
              ...cardStyles.card,
              padding: '30px 25px',
              position: 'relative',
              overflow: 'hidden',
              transition: 'background-color 0.3s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = cardStyles.card.hoverBackgroundColor;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = cardStyles.card.backgroundColor;
            }}
          >
            <div
              className="draggable-element solution-number"
              style={{
                position: 'absolute',
                top: solution.positions.number.top,
                left: solution.positions.number.left,
                cursor: isSelected ? 'move' : 'default',
                ...cardStyles.number,
              }}
            >
              {isSelected && (
                <div
                  className="drag-handle"
                  onMouseDown={(e) => handleElementDragStart(e, index, 'number')}
                  style={{
                    position: 'absolute',
                    top: -15,
                    left: -15,
                    width: 12,
                    height: 12,
                    backgroundColor: '#fff',
                    border: '1px solid #ccc',
                    borderRadius: '50%',
                    cursor: 'move',
                    zIndex: 10,
                  }}
                >
                  <FontAwesomeIcon icon={faArrowsUpDownLeftRight} style={{ fontSize: '8px', color: '#000' }} />
                </div>
              )}
              {solution.id}
            </div>
            <div
              className="draggable-element"
              style={{
                position: 'absolute',
                top: solution.positions.title.top,
                left: solution.positions.title.left,
                cursor: isSelected ? 'move' : 'default',
                width: parseInt(cardStyles.card.width) - 50,
              }}
            >
              {isSelected && (
                <div
                  className="drag-handle"
                  onMouseDown={(e) => handleElementDragStart(e, index, 'title')}
                  style={{
                    position: 'absolute',
                    top: -15,
                    left: -15,
                    width: 12,
                    height: 12,
                    backgroundColor: '#fff',
                    border: '1px solid #ccc',
                    borderRadius: '50%',
                    cursor: 'move',
                    zIndex: 10,
                  }}
                >
                  <FontAwesomeIcon icon={faArrowsUpDownLeftRight} style={{ fontSize: '8px', color: '#000' }} />
                </div>
              )}
              <h3 style={{ ...cardStyles.title, margin: 0 }}>
                {editingSolutionIndex === index && editingField === 'title' ? (
                  <input
                    ref={inputRef}
                    type="text"
                    value={solution.title || ''}
                    onChange={(e) => handleSolutionChange(e, index, 'title')}
                    onBlur={handleBlur}
                    onKeyDown={handleKeyDown}
                    style={{ width: '100%', fontSize: cardStyles.title.fontSize }}
                  />
                ) : (
                  <span onClick={() => handleEditSolution(index, 'title')}>
                    {solution.title}
                  </span>
                )}
              </h3>
            </div>
            <div
              className="draggable-element"
              style={{
                position: 'absolute',
                top: solution.positions.description.top,
                left: solution.positions.description.left,
                cursor: isSelected ? 'move' : 'default',
                width: parseInt(cardStyles.card.width) - 50,
              }}
            >
              {isSelected && (
                <div
                  className="drag-handle"
                  onMouseDown={(e) => handleElementDragStart(e, index, 'description')}
                  style={{
                    position: 'absolute',
                    top: -15,
                    left: -15,
                    width: 12,
                    height: 12,
                    backgroundColor: '#fff',
                    border: '1px solid #ccc',
                    borderRadius: '50%',
                    cursor: 'move',
                    zIndex: 10,
                  }}
                >
                  <FontAwesomeIcon icon={faArrowsUpDownLeftRight} style={{ fontSize: '8px', color: '#000' }} />
                </div>
              )}
              <p style={{ ...cardStyles.description, margin: 0 }}>
                {editingSolutionIndex === index && editingField === 'description' ? (
                  <textarea
                    ref={inputRef}
                    value={solution.description || ''}
                    onChange={(e) => handleSolutionChange(e, index, 'description')}
                    onBlur={handleBlur}
                    style={{
                      width: '100%',
                      fontSize: cardStyles.description.fontSize,
                      resize: 'none',
                      height: '60px',
                    }}
                  />
                ) : (
                  <span onClick={() => handleEditSolution(index, 'description')}>
                    {solution.description}
                  </span>
                )}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}       