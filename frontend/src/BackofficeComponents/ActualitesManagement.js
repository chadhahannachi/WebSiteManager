import { useEffect, useState } from "react";
import { Box, Button, IconButton, Modal, TextField, Checkbox, useTheme } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import { tokens } from "../theme";
import Header from "../components/Header";

const ActualitesManagement = () => {
  const [actualites, setActualites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [currentActualite, setCurrentActualite] = useState({
    id: null,
    titre: "",
    description: "",
    image: "",
    datePublication: "",
    isPublished: false,
  });
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  useEffect(() => {
    fetchActualites();
  }, []);

  const fetchActualites = async () => {
    try {
      const response = await axios.get("http://localhost:5000/contenus/Actualite");
      setActualites(response.data);
    } catch (error) {
      console.error("Error fetching actualites", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      if (currentActualite.id) {
        await axios.patch(`http://localhost:5000/contenus/Actualite/${currentActualite.id}`, currentActualite);
      } else {
        await axios.post("http://localhost:5000/contenus/Actualite", currentActualite);
      }
      setOpen(false);
      fetchActualites();
    } catch (error) {
      console.error("Error saving actualite", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/contenus/Actualite/${id}`);
      fetchActualites();
    } catch (error) {
      console.error("Error deleting actualite", error);
    }
  };

  const columns = [
    { field: "titre", headerName: "Titre", flex: 2 },
    { field: "description", headerName: "Description", flex: 3 },
    { field: "image", headerName: "Image URL", flex: 2 },
    { field: "datePublication", headerName: "Date de Publication", flex: 2 },
    { field: "isPublished", headerName: "Publié", flex: 1, type: "boolean" },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      renderCell: (params) => (
        <>
          <IconButton
            onClick={() => {
              setCurrentActualite(params.row);
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
      <Header title="ACTUALITES" subtitle="Managing the Actualites" />

      <Button variant="contained" color="warning" onClick={() => { setCurrentActualite({ id: null, titre: "", description: "", image: "", datePublication: "", isPublished: false }); setOpen(true); }}>
        Ajouter une Actualite
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
          rows={actualites}
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
            value={currentActualite.titre}
            onChange={(e) => setCurrentActualite({ ...currentActualite, titre: e.target.value })}
            placeholder="Titre de la actualite"
          />
          <TextField
            fullWidth
            margin="dense"
            value={currentActualite.description}
            onChange={(e) => setCurrentActualite({ ...currentActualite, description: e.target.value })}
            placeholder="Description de la actualite"
          />
          <TextField
            fullWidth
            margin="dense"
            value={currentActualite.image}
            onChange={(e) => setCurrentActualite({ ...currentActualite, image: e.target.value })}
            placeholder="URL de l'image"
          />
          <TextField
            fullWidth
            margin="dense"
            type="date"
            value={currentActualite.datePublication}
            onChange={(e) => setCurrentActualite({ ...currentActualite, datePublication: e.target.value })}
            placeholder="Date de publication"
          />
          <Box display="flex" alignItems="center" mt={2}>
            <Checkbox
              checked={currentActualite.isPublished}
              onChange={(e) => setCurrentActualite({ ...currentActualite, isPublished: e.target.checked })}
            />
            <span>Publié</span>
          </Box>
          <Box mt={2} display="flex" justifyContent="space-between">
            <Button onClick={() => setOpen(false)} color="secondary">Annuler</Button>
            <Button onClick={handleSave} color="primary">{currentActualite.id ? "Modifier" : "Créer"}</Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default ActualitesManagement;
