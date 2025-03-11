import { useEffect, useState } from "react";
import { Box, Button, IconButton, Modal, TextField, Checkbox, useTheme } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import { tokens } from "../theme";
import Header from "../components/Header";

const TemoignagesManagement = () => {
  const [temoignages, setTemoignages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [currentTemoignage, setCurrentTemoignage] = useState({
    id: null,
    titre: "",
    description: "",
    image: "",
    datePublication: "",
    isPublished: false,
    auteur: "",
  });
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  useEffect(() => {
    fetchTemoignages();
  }, []);

  const fetchTemoignages = async () => {
    try {
      const response = await axios.get("http://localhost:5000/contenus/Temoignage");
      setTemoignages(response.data);
    } catch (error) {
      console.error("Error fetching temoignages", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      if (currentTemoignage.id) {
        await axios.patch(`http://localhost:5000/contenus/Temoignage/${currentTemoignage.id}`, currentTemoignage);
      } else {
        await axios.post("http://localhost:5000/contenus/Temoignage", currentTemoignage);
      }
      setOpen(false);
      fetchTemoignages();
    } catch (error) {
      console.error("Error saving temoignage", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/contenus/Temoignage/${id}`);
      fetchTemoignages();
    } catch (error) {
      console.error("Error deleting temoignage", error);
    }
  };

  const columns = [
    { field: "titre", headerName: "Titre", flex: 2 },
    { field: "description", headerName: "Description", flex: 3 },
    { field: "image", headerName: "Image URL", flex: 2 },
    { field: "datePublication", headerName: "Date de Publication", flex: 2 },
    { field: "isPublished", headerName: "Publié", flex: 1, type: "boolean" },
    { field: "auteur", headerName: "Auteur", flex: 2 },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      renderCell: (params) => (
        <>
          <IconButton
            onClick={() => {
              setCurrentTemoignage(params.row);
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
      <Header title="TÉMOIGNAGES" subtitle="Gestion des Témoignages" />

      <Button variant="contained" color="warning" onClick={() => { setCurrentTemoignage({ id: null, titre: "", description: "", image: "", datePublication: "", isPublished: false, auteur: "" }); setOpen(true); }}>
        Ajouter un Témoignage
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
          rows={temoignages}
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
          <TextField
            fullWidth
            margin="dense"
            value={currentTemoignage.titre}
            onChange={(e) => setCurrentTemoignage({ ...currentTemoignage, titre: e.target.value })}
            placeholder="Titre du temoignage"
          />
          <TextField
            fullWidth
            margin="dense"
            value={currentTemoignage.description}
            onChange={(e) => setCurrentTemoignage({ ...currentTemoignage, description: e.target.value })}
            placeholder="Description du temoignage"
          />
          <TextField
            fullWidth
            margin="dense"
            value={currentTemoignage.image}
            onChange={(e) => setCurrentTemoignage({ ...currentTemoignage, image: e.target.value })}
            placeholder="URL de l'image"
          />
          <TextField
            fullWidth
            margin="dense"
            value={currentTemoignage.auteur}
            onChange={(e) => setCurrentTemoignage({ ...currentTemoignage, auteur: e.target.value })}
            placeholder="Auteur du temoignage"
          />
          <TextField
            fullWidth
            margin="dense"
            type="date"
            value={currentTemoignage.datePublication}
            onChange={(e) => setCurrentTemoignage({ ...currentTemoignage, datePublication: e.target.value })}
            placeholder="Date de publication"
          />
          <Box display="flex" alignItems="center" mt={2}>
            <Checkbox
              checked={currentTemoignage.isPublished}
              onChange={(e) => setCurrentTemoignage({ ...currentTemoignage, isPublished: e.target.checked })}
            />
            <span>Publié</span>
          </Box>
          <Box mt={2} display="flex" justifyContent="space-between">
            <Button onClick={() => setOpen(false)} color="secondary">Annuler</Button>
            <Button onClick={handleSave} color="primary">{currentTemoignage.id ? "Modifier" : "Créer"}</Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default TemoignagesManagement;
