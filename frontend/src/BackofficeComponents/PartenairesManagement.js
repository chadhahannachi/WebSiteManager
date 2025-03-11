import { useEffect, useState } from "react";
import { Box, Button, IconButton, Modal, TextField, Checkbox, useTheme } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import { tokens } from "../theme";
import Header from "../components/Header";

const PartenairesManagement = () => {
  const [partenaires, setPartenaires] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [currentPartenaire, setCurrentPartenaire] = useState({
    id: null,
    titre: "",
    description: "",
    image: "",
    datePublication: "",
    isPublished: false,
    secteurActivite: "",
  });
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  useEffect(() => {
    fetchPartenaires();
  }, []);

  const fetchPartenaires = async () => {
    try {
      const response = await axios.get("http://localhost:5000/contenus/Partenaire");
      setPartenaires(response.data);
    } catch (error) {
      console.error("Error fetching partenaires", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      if (currentPartenaire.id) {
        await axios.patch(`http://localhost:5000/contenus/Partenaire/${currentPartenaire.id}`, currentPartenaire);
      } else {
        await axios.post("http://localhost:5000/contenus/Partenaire", currentPartenaire);
      }
      setOpen(false);
      fetchPartenaires();
    } catch (error) {
      console.error("Error saving partenaire", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/contenus/Partenaire/${id}`);
      fetchPartenaires();
    } catch (error) {
      console.error("Error deleting partenaire", error);
    }
  };

  const columns = [
    { field: "titre", headerName: "Titre", flex: 2 },
    { field: "description", headerName: "Description", flex: 3 },
    { field: "image", headerName: "Image URL", flex: 2 },
    { field: "datePublication", headerName: "Date de Publication", flex: 2 },
    { field: "isPublished", headerName: "Publié", flex: 1, type: "boolean" },
    { field: "secteurActivite", headerName: "Secteur d'activite", flex: 2 },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      renderCell: (params) => (
        <>
          <IconButton
            onClick={() => {
              setCurrentPartenaire(params.row);
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
      <Header title="PARTENAIRES" subtitle="Gestion des Partenaires" />

      <Button variant="contained" color="warning" onClick={() => { setCurrentPartenaire({ id: null, titre: "", description: "", image: "", datePublication: "", isPublished: false, secteurActivite: "" }); setOpen(true); }}>
        Ajouter un Partenaire
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
          rows={partenaires}
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
            value={currentPartenaire.titre}
            onChange={(e) => setCurrentPartenaire({ ...currentPartenaire, titre: e.target.value })}
            placeholder="Titre de Partenariat"
          />
          <TextField
            fullWidth
            margin="dense"
            value={currentPartenaire.description}
            onChange={(e) => setCurrentPartenaire({ ...currentPartenaire, description: e.target.value })}
            placeholder="Description de Partenariat"
          />
          <TextField
            fullWidth
            margin="dense"
            value={currentPartenaire.image}
            onChange={(e) => setCurrentPartenaire({ ...currentPartenaire, image: e.target.value })}
            placeholder="URL de l'image"
          />
          <TextField
            fullWidth
            margin="dense"
            value={currentPartenaire.secteurActivite}
            onChange={(e) => setCurrentPartenaire({ ...currentPartenaire, secteurActivite: e.target.value })}
            placeholder="Secteur d'activite du partenaire"
          />
          <TextField
            fullWidth
            margin="dense"
            type="date"
            value={currentPartenaire.datePublication}
            onChange={(e) => setCurrentPartenaire({ ...currentPartenaire, datePublication: e.target.value })}
            placeholder="Date de publication"
          />
          <Box display="flex" alignItems="center" mt={2}>
            <Checkbox
              checked={currentPartenaire.isPublished}
              onChange={(e) => setCurrentPartenaire({ ...currentPartenaire, isPublished: e.target.checked })}
            />
            <span>Publié</span>
          </Box>
          <Box mt={2} display="flex" justifyContent="space-between">
            <Button onClick={() => setOpen(false)} color="secondary">Annuler</Button>
            <Button onClick={handleSave} color="primary">{currentPartenaire.id ? "Modifier" : "Créer"}</Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default PartenairesManagement;
