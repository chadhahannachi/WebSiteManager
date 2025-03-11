import { useEffect, useState } from "react";
import { Box, Button, IconButton, Modal, TextField, Checkbox, useTheme } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import { tokens } from "../theme";
import Header from "../components/Header";

const EvenementsManagement = () => {
  const [evenements, setEvenements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState(""); // État pour afficher un message d'erreur
  const [currentEvenement, setCurrentEvenement] = useState({
    id: null,
    titre: "",
    description: "",
    image: "",
    datePublication: "",
    dateDebut: "",
    dateFin: "",
    isPublished: false,
  });

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  useEffect(() => {
    fetchEvenements();
  }, []);

  const fetchEvenements = async () => {
    try {
      const response = await axios.get("http://localhost:5000/contenus/Evenement");
      setEvenements(response.data);
    } catch (error) {
      console.error("Error fetching evenements", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (currentEvenement.dateFin && currentEvenement.dateDebut && currentEvenement.dateFin < currentEvenement.dateDebut) {
      setError("La date de fin ne peut pas être inférieure à la date de début.");
      return;
    }
    
    try {
      if (currentEvenement.id) {
        await axios.patch(`http://localhost:5000/contenus/Evenement/${currentEvenement.id}`, currentEvenement);
      } else {
        await axios.post("http://localhost:5000/contenus/Evenement", currentEvenement);
      }
      setOpen(false);
      fetchEvenements();
      setError(""); // Réinitialiser l'erreur après l'enregistrement réussi
    } catch (error) {
      console.error("Error saving evenement", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/contenus/Evenement/${id}`);
      fetchEvenements();
    } catch (error) {
      console.error("Error deleting evenement", error);
    }
  };

  const handleDateChange = (field, value) => {
    setCurrentEvenement((prev) => {
      const newEvenement = { ...prev, [field]: value };
      if (newEvenement.dateFin && newEvenement.dateDebut && newEvenement.dateFin < newEvenement.dateDebut) {
        setError("La date de fin ne peut pas être inférieure à la date de début.");
      } else {
        setError("");
      }
      return newEvenement;
    });
  };

  const columns = [
    { field: "titre", headerName: "Titre", flex: 2 },
    { field: "description", headerName: "Description", flex: 3 },
    { field: "image", headerName: "Image URL", flex: 2 },
    { field: "datePublication", headerName: "Date de Publication", flex: 2 },
    { field: "dateDebut", headerName: "Date de Début", flex: 2 },
    { field: "dateFin", headerName: "Date de Fin", flex: 2 },
    { field: "isPublished", headerName: "Publié", flex: 1, type: "boolean" },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      renderCell: (params) => (
        <>
          <IconButton
            onClick={() => {
              setCurrentEvenement(params.row);
              setOpen(true);
            }}
          >
            <EditIcon style={{ cursor: "pointer" }} />
          </IconButton>
          <IconButton color="secondary" onClick={() => handleDelete(params.row.id)}>
            <DeleteIcon />
          </IconButton>
        </>
      ),
    },
  ];

  return (
    <Box m="20px">
      <Header title="ÉVÈNEMENTS" subtitle="Gérer les évènements" />

      <Button variant="contained" color="warning" onClick={() => { 
        setCurrentEvenement({ id: null, titre: "", description: "", image: "", datePublication: "", dateDebut: "", dateFin: "", isPublished: false });
        setError(""); 
        setOpen(true); 
      }}>
        Ajouter un Evènement
      </Button>

      <Box 
        m="15px 0 0 0"
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": { border: "none" },
          "& .MuiDataGrid-cell": { borderBottom: "none" },
          "& .MuiDataGrid-columnHeaders": { backgroundColor: colors.blueAccent[700], borderBottom: "none" },
          "& .MuiDataGrid-virtualScroller": { backgroundColor: colors.primary[400] },
          "& .MuiDataGrid-footerContainer": { borderTop: "none", backgroundColor: colors.blueAccent[700] },
          "& .MuiCheckbox-root": { color: `${colors.greenAccent[200]} !important` },
        }}
      >
        <DataGrid
          rows={evenements}
          columns={columns}
          getRowId={(row) => row._id}
          loading={loading}
          components={{ Toolbar: GridToolbar }}
          pageSize={5}
        />
      </Box>

      <Modal open={open} onClose={() => setOpen(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            p: 4,
            boxShadow: 24,
            borderRadius: 2,
          }}
        >
          <TextField fullWidth margin="dense" value={currentEvenement.titre} onChange={(e) => setCurrentEvenement({ ...currentEvenement, titre: e.target.value })} placeholder="Titre de l'événement" />
          <TextField fullWidth margin="dense" value={currentEvenement.description} onChange={(e) => setCurrentEvenement({ ...currentEvenement, description: e.target.value })} placeholder="Description" />
          <TextField fullWidth margin="dense" value={currentEvenement.image} onChange={(e) => setCurrentEvenement({ ...currentEvenement, image: e.target.value })} placeholder="URL de l'image" />
          <TextField fullWidth margin="dense" type="date" value={currentEvenement.datePublication} onChange={(e) => setCurrentEvenement({ ...currentEvenement, datePublication: e.target.value })} />
          <TextField fullWidth margin="dense" type="date" value={currentEvenement.dateDebut} onChange={(e) => handleDateChange("dateDebut", e.target.value)} />
          <TextField fullWidth margin="dense" type="date" value={currentEvenement.dateFin} onChange={(e) => handleDateChange("dateFin", e.target.value)} />
          {error && <Box color="red" mt={1}>{error}</Box>}
          <Box display="flex" alignItems="center" mt={2}>
            <Checkbox checked={currentEvenement.isPublished} onChange={(e) => setCurrentEvenement({ ...currentEvenement, isPublished: e.target.checked })} />
            <span>Publié</span>
          </Box>
          <Box mt={2} display="flex" justifyContent="space-between">
            <Button onClick={() => setOpen(false)} color="secondary">Annuler</Button>
            <Button onClick={handleSave} color="primary" disabled={!!error}>{currentEvenement.id ? "Modifier" : "Créer"}</Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default EvenementsManagement;
