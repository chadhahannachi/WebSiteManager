import { useEffect, useState } from "react";
import { Box, Button, IconButton, Modal, TextField, Checkbox, useTheme } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import { tokens } from "../theme";
import Header from "../components/Header";

const ArticlesManagement = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [currentArticle, setCurrentArticle] = useState({
    id: null,
    titre: "",
    description: "",
    image: "",
    datePublication: "",
    isPublished: false,
    categorie: "", // Ajout de la catégorie
    prix: "", // Ajout du prix
  });
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      const response = await axios.get("http://localhost:5000/contenus/Article");
      setArticles(response.data);
    } catch (error) {
      console.error("Error fetching articles", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      if (currentArticle.id) {
        await axios.patch(`http://localhost:5000/contenus/Article/${currentArticle.id}`, currentArticle);
      } else {
        await axios.post("http://localhost:5000/contenus/Article", currentArticle);
      }
      setOpen(false);
      fetchArticles();
    } catch (error) {
      console.error("Error saving article", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/contenus/Article/${id}`);
      fetchArticles();
    } catch (error) {
      console.error("Error deleting article", error);
    }
  };

  const columns = [
    { field: "titre", headerName: "Titre", flex: 2 },
    { field: "description", headerName: "Description", flex: 3 },
    { field: "image", headerName: "Image URL", flex: 2 },
    { field: "datePublication", headerName: "Date de Publication", flex: 2 },
    { field: "isPublished", headerName: "Publié", flex: 1, type: "boolean" },
    { field: "categorie", headerName: "Catégorie", flex: 2 },
    { field: "prix", headerName: "Prix", flex: 1 },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      renderCell: (params) => (
        <>
          <IconButton
            onClick={() => {
              setCurrentArticle(params.row);
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
      <Header title="ARTICLES" subtitle="Managing the Articles" />

      <Button variant="contained" color="warning" onClick={() => { setCurrentArticle({ id: null, titre: "", description: "", image: "", datePublication: "", isPublished: false, categorie: "", prix: "" }); setOpen(true); }}>
        Ajouter un Article
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
          rows={articles}
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
          <TextField fullWidth margin="dense" value={currentArticle.titre} onChange={(e) => setCurrentArticle({ ...currentArticle, titre: e.target.value })} placeholder="Titre de l'article" />
          <TextField fullWidth margin="dense" value={currentArticle.description} onChange={(e) => setCurrentArticle({ ...currentArticle, description: e.target.value })} placeholder="Description de l'article" />
          <TextField fullWidth margin="dense" value={currentArticle.image} onChange={(e) => setCurrentArticle({ ...currentArticle, image: e.target.value })} placeholder="URL de l'image" />
          <TextField fullWidth margin="dense" type="date" value={currentArticle.datePublication} onChange={(e) => setCurrentArticle({ ...currentArticle, datePublication: e.target.value })} placeholder="Date de publication" />
          <TextField fullWidth margin="dense" value={currentArticle.categorie} onChange={(e) => setCurrentArticle({ ...currentArticle, categorie: e.target.value })} placeholder="Catégorie" />
          <TextField fullWidth margin="dense" value={currentArticle.prix} onChange={(e) => setCurrentArticle({ ...currentArticle, prix: e.target.value })} placeholder="Prix" />
          <Box display="flex" alignItems="center" mt={2}>
            <Checkbox checked={currentArticle.isPublished} onChange={(e) => setCurrentArticle({ ...currentArticle, isPublished: e.target.checked })} />
            <span>Publié</span>
          </Box>
          <Box mt={2} display="flex" justifyContent="space-between">
            <Button onClick={() => setOpen(false)} color="secondary">Annuler</Button>
            <Button onClick={handleSave} color="primary">{currentArticle.id ? "Modifier" : "Créer"}</Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default ArticlesManagement;
