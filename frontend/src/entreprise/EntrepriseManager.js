import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Button, Modal, Box, TextField, Typography } from "@mui/material";
import axios from "axios";

const EntrepriseManager = () => {
  const [entreprises, setEntreprises] = useState([]);
  const [open, setOpen] = useState(false);
  const [editingEntreprise, setEditingEntreprise] = useState(null);
  const [formData, setFormData] = useState({ nom: "", contact: "", numTel: "", adresse: "" });

  useEffect(() => {
    fetchEntreprises();
  }, []);

  const fetchEntreprises = async () => {
    try {
      const response = await axios.get("http://localhost:5000/entreprises");
      // Map the response data to include the required fields
      const mappedData = response.data.map((entreprise) => ({
        id: entreprise._id, // Use _id as the unique identifier
        nom: entreprise.nom,
        contact: entreprise.contact,
        numTel: entreprise.numTel,
        adresse: entreprise.adresse,
      }));
      setEntreprises(mappedData);
    } catch (error) {
      console.error("Error fetching entreprises:", error);
    }
  };

  const handleOpen = (entreprise = null) => {
    setEditingEntreprise(entreprise);
    setFormData(entreprise ? { nom: entreprise.nom, contact: entreprise.contact, numTel: entreprise.numTel, adresse: entreprise.adresse } : { nom: "", contact: "", numTel: "", adresse: "" });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingEntreprise(null);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      if (editingEntreprise) {
        await axios.patch(`http://localhost:5000/entreprises/${editingEntreprise.id}`, formData);
      } else {
        await axios.post("http://localhost:5000/entreprises", formData);
      }
      fetchEntreprises();
      handleClose();
    } catch (error) {
      console.error("Error saving entreprise:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/entreprises/${id}`);
      fetchEntreprises();
    } catch (error) {
      console.error("Error deleting entreprise:", error);
    }
  };

  const columns = [
    { field: "id", headerName: "ID", width: 90 },
    { field: "nom", headerName: "Name", width: 150 },
    { field: "contact", headerName: "Contact", width: 150 },
    { field: "numTel", headerName: "Phone Number", width: 150 },
    { field: "adresse", headerName: "Address", width: 200 },
    {
      field: "actions",
      headerName: "Actions",
      width: 200,
      renderCell: (params) => (
        <>
          <Button variant="contained" color="primary" onClick={() => handleOpen(params.row)}>Edit</Button>
          <Button variant="contained" color="secondary" onClick={() => handleDelete(params.row.id)} style={{ marginLeft: 10 }}>Delete</Button>
        </>
      ),
    },
  ];

  return (
    <div style={{ height: 400, width: "100%" }}>
      <Button variant="contained" color="primary" onClick={() => handleOpen()} style={{ marginBottom: 10 }}>Add Entreprise</Button>
      <DataGrid rows={entreprises} columns={columns} pageSize={5} checkboxSelection getRowId={(row) => row.id} />
      
      <Modal open={open} onClose={handleClose}>
        <Box sx={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: 400, bgcolor: "background.paper", boxShadow: 24, p: 4 }}>
          <Typography variant="h6">{editingEntreprise ? "Edit Entreprise" : "Add Entreprise"}</Typography>
          <TextField fullWidth label="Name" name="nom" value={formData.nom} onChange={handleChange} margin="normal" />
          <TextField fullWidth label="Contact" name="contact" value={formData.contact} onChange={handleChange} margin="normal" />
          <TextField fullWidth label="Phone Number" name="numTel" value={formData.numTel} onChange={handleChange} margin="normal" />
          <TextField fullWidth label="Address" name="adresse" value={formData.adresse} onChange={handleChange} margin="normal" />
          <Button variant="contained" color="primary" onClick={handleSubmit} style={{ marginTop: 10 }}>Save</Button>
          <Button variant="outlined" onClick={handleClose} style={{ marginTop: 10, marginLeft: 10 }}>Cancel</Button>
        </Box>
      </Modal>
    </div>
  );
};

export default EntrepriseManager;
