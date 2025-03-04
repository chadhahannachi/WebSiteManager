import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Button, Modal, Box, TextField, Typography, List, ListItem, ListItemText } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode"; // Import jwtDecode
import BeenhereIcon from '@mui/icons-material/Beenhere';

const EntrepriseManager = () => {
  const [entreprises, setEntreprises] = useState([]);
  const [open, setOpen] = useState(false);
  const [editingEntreprise, setEditingEntreprise] = useState(null);
  const [formData, setFormData] = useState({ nom: "", contact: "", numTel: "", adresse: "", raisonSociale: "" });
  const navigate = useNavigate();
  const [userEntrepriseId, setUserEntrepriseId] = useState(null); // State to store user's entreprise ID

  const [usersModalOpen, setUsersModalOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [selectedEntreprise, setSelectedEntreprise] = useState(null);

  useEffect(() => {
    fetchEntreprises();
    fetchUserEntrepriseId(); // Fetch user's entreprise ID
  }, []);

  const fetchUserEntrepriseId = () => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        const userId = decodedToken?.sub;
        if (userId) {
          axios.get(`http://localhost:5000/auth/user/${userId}`)
            .then(response => {
              setUserEntrepriseId(response.data.entreprise);
            })
            .catch(error => {
              console.error("Error fetching user entreprise:", error);
            });
        }
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  };

  const fetchEntreprises = async () => {
    try {
      const response = await axios.get("http://localhost:5000/entreprises");
      const mappedData = response.data.map((entreprise) => ({
        id: entreprise._id,
        nom: entreprise.nom,
        contact: entreprise.contact,
        numTel: entreprise.numTel,
        adresse: entreprise.adresse,
        raisonSociale: entreprise.raisonSociale
      }));
      setEntreprises(mappedData);
    } catch (error) {
      console.error("Error fetching entreprises:", error);
    }
  };

  const handleOpen = (entreprise = null) => {
    setEditingEntreprise(entreprise);
    setFormData(entreprise ? { nom: entreprise.nom, contact: entreprise.contact, numTel: entreprise.numTel, adresse: entreprise.adresse, raisonSociale: entreprise.raisonSociale } : { nom: "", contact: "", numTel: "", adresse: "", raisonSociale: "" });
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

  const handleAddSuperAdmin = (entrepriseId) => {
    navigate(`/add-super-admin-company/${entrepriseId}`);
  };

  const handleShowMembers = async (entrepriseId, entrepriseNom) => {
    try {
      const response = await axios.get(`http://localhost:5000/auth/entreprise/${entrepriseId}/users`);
      setUsers(response.data);
      // setSelectedEntreprise(entrepriseId);
      setSelectedEntreprise({ id: entrepriseId, nom: entrepriseNom }); // Stocker le nom aussi
      setUsersModalOpen(true);
    } catch (error) {
      console.error("Error fetching users by entreprise:", error);
    }
  };


  const columns = [
    { field: "nom", headerName: "Name", width: 150 },
    { field: "contact", headerName: "Contact", width: 150 },
    { field: "numTel", headerName: "Phone Number", width: 150 },
    { field: "adresse", headerName: "Address", width: 100 },
    { field: "raisonSociale", headerName: "raisonSociale", width: 150 },

    {
      field: "Members",
      headerName: "Members",
      width: 150,
      renderCell: (params) => (
        <>
          <Button variant="contained" color="primary" onClick={() => handleShowMembers(params.row.id, params.row.nom )} >Show Members</Button>
        </>
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 180,
      renderCell: (params) => (
        <>
          <Button variant="contained" color="secondary" onClick={() => handleOpen(params.row)}>Edit</Button>
          <Button variant="contained" color="error"  onClick={() => handleDelete(params.row.id)} style={{ marginLeft: 10 }}>Delete</Button>
        </>
      ),
    },
    {
      field: "AddSuperAdmin",
      headerName: "",
      width: 200,
      renderCell: (params) => (
        <>
          <Button
            variant="contained"
            color="success"
            onClick={() => handleAddSuperAdmin(params.row.id)}
            style={{ marginLeft: 10 }}
            disabled={userEntrepriseId === params.row.id} // Disable button if user's entreprise ID matches row ID
          >
            Add Super Admin
          </Button>
        </>
      ),
    },
    ,
    {
      field: "Licence",
      headerName: "Licence",
      width: 200,
      renderCell: (params) => (
        <>
          <Button
            variant="contained"
            color="success"
            
            style={{ marginLeft: 10 }}
          >
            <BeenhereIcon/>
          </Button>
        </>
      ),
    },
  ];

  return (
    <div style={{ height: 400, width: "100%" }}>
      <Button variant="contained" color="warning" onClick={() => handleOpen()} style={{ marginBottom: 10 }}>Add Entreprise</Button>
      <DataGrid rows={entreprises} columns={columns} pageSize={5} checkboxSelection getRowId={(row) => row.id} />

      <Modal open={open} onClose={handleClose}>
        <Box sx={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: 400, bgcolor: "background.paper", boxShadow: 24, p: 4 }}>
          <Typography variant="h6">{editingEntreprise ? "Edit Entreprise" : "Add Entreprise"}</Typography>
          <TextField fullWidth label="Name" name="nom" value={formData.nom} onChange={handleChange} margin="normal" />
          <TextField fullWidth label="Contact" name="contact" value={formData.contact} onChange={handleChange} margin="normal" />
          <TextField fullWidth label="Phone Number" name="numTel" value={formData.numTel} onChange={handleChange} margin="normal" />
          <TextField fullWidth label="Address" name="adresse" value={formData.adresse} onChange={handleChange} margin="normal" />
          <TextField fullWidth label="raisonSociale" name="raisonSociale" value={formData.raisonSociale} onChange={handleChange} margin="normal" />

          <Button variant="contained" color="primary" onClick={handleSubmit} style={{ marginTop: 10 }}>Save</Button>
          <Button variant="outlined" onClick={handleClose} style={{ marginTop: 10, marginLeft: 10 }}>Cancel</Button>
        </Box>
      </Modal>

      {/* Modal for users */}
      {/* Modal for users */}
<Modal open={usersModalOpen} onClose={() => setUsersModalOpen(false)}>
  <Box
    sx={{
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      width: 400,
      bgcolor: "background.paper",
      boxShadow: 24,
      p: 4,
    }}
  >
    <Typography variant="h6">  Membres de {selectedEntreprise?.nom || "l'entreprise"}
    </Typography>

    {users.length > 0 ? (
      <>
        {/* Administrateurs */}
        <Typography variant="subtitle1" sx={{ mt: 2, fontWeight: "bold" }}>
          Administrateurs
        </Typography>
        <List>
          {users
            .filter(
              (user) =>
                user.role === "superadminabshore" ||
                user.role === "superadminentreprise"
            )
            .map((user) => (
              <ListItem key={user._id}>
                <ListItemText primary={user.nom} secondary={user.email} />
              </ListItem>
            ))}
        </List>

        {/* Modérateurs */}
        <Typography variant="subtitle1" sx={{ mt: 2, fontWeight: "bold" }}>
          Modérateurs
        </Typography>
        <List>
          {users
            .filter((user) => user.role === "moderateur")
            .map((user) => (
              <ListItem key={user._id}>
                <ListItemText primary={user.nom} secondary={user.email} />
              </ListItem>
            ))}
        </List>
      </>
    ) : (
      <Typography>No members added yet.</Typography>
    )}

    <Button
      variant="outlined"
      onClick={() => setUsersModalOpen(false)}
      style={{ marginTop: 10 }}
    >
      Close
    </Button>
  </Box>
</Modal>

    </div>
  );
};

export default EntrepriseManager;