import { useEffect, useState } from "react";
import { Box, Button, IconButton, Modal, TextField, Checkbox, useTheme } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import { tokens } from "../theme";
import Header from "../components/Header";

const FAQsManagement = () => {
  const [faqs, setFAQs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [currentFAQ, setCurrentFAQ] = useState({
    id: null,
    question: "",
    reponse: "",
    datePublication: "",
    isPublished: false,
  });
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  useEffect(() => {
    fetchFAQs();
  }, []);

  const fetchFAQs = async () => {
    try {
      const response = await axios.get("http://localhost:5000/contenus/FAQ");
      setFAQs(response.data);
    } catch (error) {
      console.error("Error fetching faqs", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      if (currentFAQ.id) {
        await axios.patch(`http://localhost:5000/contenus/FAQ/${currentFAQ.id}`, currentFAQ);
      } else {
        await axios.post("http://localhost:5000/contenus/FAQ", currentFAQ);
      }
      setOpen(false);
      fetchFAQs();
    } catch (error) {
      console.error("Error saving faq", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/contenus/FAQ/${id}`);
      fetchFAQs();
    } catch (error) {
      console.error("Error deleting faq", error);
    }
  };

  const columns = [
    { field: "question", headerName: "Question", flex: 2 },
    { field: "reponse", headerName: "Reponse", flex: 3 },
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
              setCurrentFAQ(params.row);
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
      <Header title="FAQS" subtitle="Managing the FAQs" />

      <Button variant="contained" color="warning" onClick={() => { setCurrentFAQ({ id: null, question: "", reponse: "", datePublication: "", isPublished: false }); setOpen(true); }}>
        Ajouter une FAQ
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
          rows={faqs}
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
            value={currentFAQ.question}
            onChange={(e) => setCurrentFAQ({ ...currentFAQ, question: e.target.value })}
            placeholder="Question de la faq"
          />
          <TextField
            fullWidth
            margin="dense"
            value={currentFAQ.reponse}
            onChange={(e) => setCurrentFAQ({ ...currentFAQ, reponse: e.target.value })}
            placeholder="Reponse de la faq"
          />
          
          <TextField
            fullWidth
            margin="dense"
            type="date"
            value={currentFAQ.datePublication}
            onChange={(e) => setCurrentFAQ({ ...currentFAQ, datePublication: e.target.value })}
            placeholder="Date de publication"
          />
          <Box display="flex" alignItems="center" mt={2}>
            <Checkbox
              checked={currentFAQ.isPublished}
              onChange={(e) => setCurrentFAQ({ ...currentFAQ, isPublished: e.target.checked })}
            />
            <span>Publié</span>
          </Box>
          <Box mt={2} display="flex" justifyContent="space-between">
            <Button onClick={() => setOpen(false)} color="secondary">Annuler</Button>
            <Button onClick={handleSave} color="primary">{currentFAQ.id ? "Modifier" : "Créer"}</Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default FAQsManagement;
