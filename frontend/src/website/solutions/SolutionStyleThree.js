// src/components/SolutionStyleThree.js
import React, { useState, useEffect } from 'react';
import './OurSolutions.css';
import EditorText from '../aboutus/EditorText';
import EditorSolutionStyleThree from './EditorSolutionStyleThree';
import axios from 'axios';
import { toast } from 'react-toastify';
import { jwtDecode } from 'jwt-decode';

const DESCRIPTION_LIMIT = 50;

export default function SolutionStyleThree({ solutions, contentType = 'solutions', styleKey = 'styleThree' }) {
  const [selectedElement, setSelectedElement] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [positions, setPositions] = useState({
    sectionName: { top: 0, left: 0 },
    solutionGrid: { top: 50, left: 0 },
  });
  const [styles, setStyles] = useState({
    sectionName: {
      color: '#f59e0b',
      fontSize: '20px',
      fontFamily: 'Arial',
      fontWeight: '600',
      width: '100%',
      maxWidth: '600px',
    },
    solutionGrid: {
      width: 1600,
      minHeight: 400,
    },
  });
  const [texts, setTexts] = useState({
    sectionName: 'NOS SOLUTIONS',
  });
  const [pendingSolutionStyles, setPendingSolutionStyles] = useState({});
  const [pendingSolutionPositions, setPendingSolutionPositions] = useState({});
  const [userEntreprise, setUserEntreprise] = useState(null);

  // Validation functions
  const isValidPosition = (pos) => pos && typeof pos === 'object' && typeof pos.top === 'number' && typeof pos.left === 'number';
  const isValidStyle = (style) => style && typeof style === 'object' && Object.keys(style).length > 0;
  const isValidText = (text) => typeof text === 'string' && text.trim().length > 0;

  // Fetch user enterprise
  const token = localStorage.getItem('token');
  let userId = null;
  
  if (token) {
    try {
      const decodedToken = jwtDecode(token);
      userId = decodedToken?.sub;
    } catch (error) {
      console.error('Error decoding token:', error);
      // Ne pas bloquer le rendu pour une erreur de token
    }
  }

  const fetchUserEntreprise = async () => {
    if (!token || !userId) {
      console.log('No token or userId available, skipping user enterprise fetch');
      return;
    }

    try {
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };
      const userResponse = await axios.get(`http://localhost:5000/auth/user/${userId}`, config);
      const user = userResponse.data;
      if (user.entreprise) {
        setUserEntreprise(user.entreprise);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      // Ne pas bloquer le rendu pour une erreur de récupération des données utilisateur
    }
  };

  // Fetch preferences
  const fetchPreferences = async () => {
    if (!userEntreprise) {
      console.log('userEntreprise not yet available, skipping preferences fetch');
      return;
    }

    try {
      const response = await axios.get(
        `http://localhost:5000/preferences/entreprise/${userEntreprise}/preferences`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const fetchedPreferences = response.data.preferences?.[contentType]?.[styleKey] || {};

      const newPositions = {
        sectionName: isValidPosition(fetchedPreferences.positions?.sectionName)
          ? fetchedPreferences.positions.sectionName
          : positions.sectionName,
        solutionGrid: isValidPosition(fetchedPreferences.positions?.solutionGrid)
          ? fetchedPreferences.positions.solutionGrid
          : positions.solutionGrid,
      };

      const newStyles = {
        sectionName: isValidStyle(fetchedPreferences.styles?.sectionName)
          ? fetchedPreferences.styles.sectionName
          : styles.sectionName,
        solutionGrid: isValidStyle(fetchedPreferences.styles?.solutionGrid)
          ? fetchedPreferences.styles.solutionGrid
          : styles.solutionGrid,
      };

      const newTexts = {
        sectionName: isValidText(fetchedPreferences.texts?.sectionName)
          ? fetchedPreferences.texts.sectionName
          : texts.sectionName,
      };

      setPositions(newPositions);
      setStyles(newStyles);
      setTexts(newTexts);
    } catch (error) {
      console.error('Error fetching preferences:', error);
      // Ne pas bloquer le rendu pour une erreur de préférences
    }
  };

  useEffect(() => {
    if (token && userId) {
      fetchUserEntreprise();
    }
  }, []);

  useEffect(() => {
    if (userEntreprise) {
      fetchPreferences();
    }
  }, [userEntreprise]);

  const handlePositionChange = (element, newPosition) => {
    if (isValidPosition(newPosition)) {
      setPositions((prev) => ({
        ...prev,
        [element]: newPosition,
      }));
    }
  };

  const handleStyleChange = (element, newStyles) => {
    if (isValidStyle(newStyles)) {
      setStyles((prev) => ({
        ...prev,
        [element]: newStyles,
      }));
    }
  };

  const handleTextChange = (element, newText) => {
    if (isValidText(newText)) {
      setTexts((prev) => ({
        ...prev,
        [element]: newText,
      }));
    }
  };

  const handleSolutionStyleChange = (solutionId, newStyles) => {
    if (solutionId && isValidStyle(newStyles)) {
      setPendingSolutionStyles((prev) => {
        const existingStyles = prev[solutionId] || {};
        const mergedStyles = {
          ...existingStyles,
          ...newStyles,
          card: { ...existingStyles.card, ...newStyles.card },
          title: { ...existingStyles.title, ...newStyles.title },
          description: { ...existingStyles.description, ...newStyles.description },
          image: { ...existingStyles.image, ...newStyles.image },
        };
        
        return {
          ...prev,
          [solutionId]: mergedStyles,
        };
      });
    }
  };

  const handleSolutionPositionChange = (solutionId, newPositions) => {
    if (solutionId && newPositions && typeof newPositions === 'object') {
      setPendingSolutionPositions((prev) => ({
        ...prev,
        [solutionId]: newPositions,
      }));
    }
  };

  const saveAllChanges = async () => {
    if (!userEntreprise) {
      toast.error("ID de l'entreprise manquant");
      return;
    }

    if (
      !isValidPosition(positions.sectionName) ||
      !isValidPosition(positions.solutionGrid) ||
      !isValidStyle(styles.sectionName) ||
      !isValidStyle(styles.solutionGrid) ||
      !isValidText(texts.sectionName)
    ) {
      toast.error('Données de position, style ou texte invalides');
      return;
    }

    try {
      const preferencesResponse = await axios.post(
        'http://localhost:5000/preferences/entreprise',
        {
          entreprise: userEntreprise,
          preferences: {
            [contentType]: {
              [styleKey]: {
                positions,
                styles,
                texts,
              },
            },
          },
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      for (const [solutionId, solutionStyles] of Object.entries(pendingSolutionStyles)) {
        if (solutionId && isValidStyle(solutionStyles)) {
          try {
            await axios.patch(
              `http://localhost:5000/contenus/Solution/${solutionId}/styles`,
              solutionStyles,
              {
                headers: { Authorization: `Bearer ${token}` },
              }
            );
          } catch (error) {
            console.error(`Failed to save styles for solution ${solutionId}:`, error.response?.status, error.response?.data);
            toast.error(`Erreur lors de la sauvegarde des styles pour la solution ${solutionId}`);
          }
        }
      }

      for (const [solutionId, solutionPositions] of Object.entries(pendingSolutionPositions)) {
        if (solutionId && solutionPositions) {
          try {
            await axios.patch(
              `http://localhost:5000/contenus/Solution/${solutionId}`,
              { positions: solutionPositions },
              {
                headers: { Authorization: `Bearer ${token}` },
              }
            );
          } catch (error) {
            console.error(`Failed to save positions for solution ${solutionId}:`, error.response?.status, error.response?.data);
            toast.error(`Erreur lors de la sauvegarde des positions pour la solution ${solutionId}`);
          }
        }
      }

      setPendingSolutionStyles({});
      setPendingSolutionPositions({});
      toast.success('Modifications sauvegardées avec succès');
    } catch (error) {
      console.error('Error saving changes:', error);
      toast.error('Erreur lors de la sauvegarde');
    }
  };

  // Si pas de solutions, afficher un message
  if (!solutions || solutions.length === 0) {
    return (
      <div className="solutions-style-three-container">
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <h3>Aucune solution disponible</h3>
          <p>Veuillez ajouter des solutions pour les afficher ici.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="solutions-style-three-container">
      <EditorText
        elementType="h1"
        initialPosition={positions.sectionName}
        initialStyles={styles.sectionName}
        onSelect={setSelectedElement}
        onPositionChange={(newPosition) => handlePositionChange('sectionName', newPosition)}
        onStyleChange={(newStyles) => handleStyleChange('sectionName', newStyles)}
        onTextChange={(newText) => handleTextChange('sectionName', newText)}
      >
        {texts.sectionName}
      </EditorText>
      <EditorSolutionStyleThree
        solutions={solutions}
        initialPosition={positions.solutionGrid}
        initialStyles={styles.solutionGrid}
        onSelect={setSelectedElement}
        onPositionChange={(newPosition) => handlePositionChange('solutionGrid', newPosition)}
        onStyleChange={handleSolutionStyleChange}
        onUpdate={handleSolutionPositionChange}
      />
      {userEntreprise && (
        <button onClick={saveAllChanges}>Enregistrer les modifications</button>
      )}
    </div>
  );
}