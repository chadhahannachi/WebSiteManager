import React, { useState, useEffect } from "react";
import axios from "axios";

const API_BASE_URL = "http://localhost:5000/formulaires";

const FormulaireComponent = () => {
  const [formTitle, setFormTitle] = useState("");
  const [fields, setFields] = useState([]);
  const [formulaires, setFormulaires] = useState([]);
  const [selectedForm, setSelectedForm] = useState(null);
  const [responses, setResponses] = useState({});

  useEffect(() => {
    fetchFormulaires();
  }, []);

  const fetchFormulaires = async () => {
    try {
      const response = await axios.get(API_BASE_URL);
      setFormulaires(response.data);
    } catch (error) {
      console.error("Error fetching formulaires:", error);
    }
  };

  const addField = () => {
    setFields([...fields, { nom: "", type: "text" }]);
  };

  const handleFieldChange = (index, key, value) => {
    const newFields = [...fields];
    newFields[index][key] = value;
    setFields(newFields);
  };

  const createForm = async () => {
    try {
      const response = await axios.post(API_BASE_URL, {
        titre: formTitle,
        champs: fields
      });
      alert("Formulaire créé avec succès !");
      fetchFormulaires();
      setFormTitle("");
      setFields([]);
    } catch (error) {
      console.error("Erreur lors de la création du formulaire:", error);
    }
  };

  const handleResponseChange = (champId, value) => {
    setResponses({ ...responses, [champId]: value });
  };

  const submitResponses = async () => {
    try {
      const responseArray = selectedForm.champs.map(champId => {
        const valeur = responses[champId];
        return {
          formulaire: selectedForm._id,
          champ: champId,
          valeur: valeur ? valeur.trim() !== "" ? valeur : "VALEUR_VIDE" : "VALEUR_VIDE",
        };
      });

      console.log("Données envoyées au backend :", responseArray);

      await axios.post(`${API_BASE_URL}/repondre`, responseArray);
      alert("Réponses envoyées avec succès !");
      setResponses({});
    } catch (error) {
      console.error("Erreur lors de l'envoi des réponses:", error);
    }
  };

  return (
    <div>
      <h2>Créer un formulaire</h2>
      <input
        type="text"
        placeholder="Titre du formulaire"
        value={formTitle}
        onChange={(e) => setFormTitle(e.target.value)}
      />
      <button onClick={addField}>Ajouter un champ</button>
      {fields.map((field, index) => (
        <div key={index}>
          <input
            type="text"
            placeholder="Nom du champ"
            value={field.nom}
            onChange={(e) => handleFieldChange(index, "nom", e.target.value)}
          />
          <select
            value={field.type}
            onChange={(e) => handleFieldChange(index, "type", e.target.value)}
          >
            <option value="text">Texte</option>
            <option value="number">Nombre</option>
          </select>
        </div>
      ))}
      <button onClick={createForm}>Créer le formulaire</button>

      <h2>Remplir un formulaire</h2>
      <select onChange={(e) => setSelectedForm(formulaires.find(f => f._id === e.target.value))}>
        <option value="">Sélectionner un formulaire</option>
        {formulaires.map((form) => (
          <option key={form._id} value={form._id}>{form.titre}</option>
        ))}
      </select>

      {selectedForm && (
  <div>
    <h3>{selectedForm.titre}</h3>
    {console.log("Selected Form:", selectedForm)} {/* Ajoutez ce log */}
    {(selectedForm.champs || []).map((champ) => (
      <div key={champ._id}>
        <label>{champ.nom}</label>
        <input
          type={champ.type}
          onChange={(e) => {
            console.log("Champ ID:", champ._id);
            handleResponseChange(champ._id, e.target.value);
          }}
        />
      </div>
    ))}
    <button onClick={submitResponses}>Envoyer les réponses</button>
  </div>
)}
    </div>
  );
};

export default FormulaireComponent;