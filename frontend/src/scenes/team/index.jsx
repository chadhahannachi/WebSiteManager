// import { Box, Typography, useTheme } from "@mui/material";
// import { DataGrid } from "@mui/x-data-grid";
// import { tokens } from "../../theme";
// import { mockDataTeam } from "../../data/mockData";
// import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
// import LockOpenOutlinedIcon from "@mui/icons-material/LockOpenOutlined";
// import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";
// import Header from "../../components/Header";

// const Team = () => {
//   const theme = useTheme();
//   const colors = tokens(theme.palette.mode);
//   const columns = [
//     { field: "id", headerName: "ID" },
//     {
//       field: "name",
//       headerName: "Name",
//       flex: 1,
//       cellClassName: "name-column--cell",
//     },
//     {
//       field: "age",
//       headerName: "Age",
//       type: "number",
//       headerAlign: "left",
//       align: "left",
//     },
//     {
//       field: "phone",
//       headerName: "Phone Number",
//       flex: 1,
//     },
//     {
//       field: "email",
//       headerName: "Email",
//       flex: 1,
//     },
//     {
//       field: "accessLevel",
//       headerName: "Access Level",
//       flex: 1,
//       renderCell: ({ row: { access } }) => {
//         return (
//           <Box
//             width="60%"
//             m="0 auto"
//             p="5px"
//             display="flex"
//             justifyContent="center"
//             backgroundColor={
//               access === "admin"
//                 ? colors.greenAccent[600]
//                 : access === "manager"
//                 ? colors.greenAccent[700]
//                 : colors.greenAccent[700]
//             }
//             borderRadius="4px"
//           >
//             {access === "admin" && <AdminPanelSettingsOutlinedIcon />}
//             {access === "manager" && <SecurityOutlinedIcon />}
//             {access === "user" && <LockOpenOutlinedIcon />}
//             <Typography color={colors.grey[100]} sx={{ ml: "5px" }}>
//               {access}
//             </Typography>
//           </Box>
//         );
//       },
//     },
//   ];

//   return (
//     <Box m="20px">
//       <Header title="TEAM" subtitle="Managing the Team Members" />
//       <Box
//         m="40px 0 0 0"
//         height="75vh"
//         sx={{
//           "& .MuiDataGrid-root": {
//             border: "none",
//           },
//           "& .MuiDataGrid-cell": {
//             borderBottom: "none",
//           },
//           "& .name-column--cell": {
//             color: colors.greenAccent[300],
//           },
//           "& .MuiDataGrid-columnHeaders": {
//             backgroundColor: colors.blueAccent[700],
//             borderBottom: "none",
//           },
//           "& .MuiDataGrid-virtualScroller": {
//             backgroundColor: colors.primary[400],
//           },
//           "& .MuiDataGrid-footerContainer": {
//             borderTop: "none",
//             backgroundColor: colors.blueAccent[700],
//           },
//           "& .MuiCheckbox-root": {
//             color: `${colors.greenAccent[200]} !important`,
//           },
//         }}
//       >
//         <DataGrid checkboxSelection rows={mockDataTeam} columns={columns} />
//       </Box>
//     </Box>
//   );
// };

// export default Team;

import React, { useEffect, useState } from "react";
import { Box, Typography, useTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import LockOpenOutlinedIcon from "@mui/icons-material/LockOpenOutlined";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";
import Header from "../../components/Header";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

const Team = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Récupérer le token du localStorage
  const token = localStorage.getItem("token");

  // Décoder le token pour obtenir l'ID de l'utilisateur connecté
  const decodedToken = jwtDecode(token);
  const userId = decodedToken.id;

  // Fonction pour récupérer les utilisateurs de la même entreprise
  const fetchUsersByEntreprise = async () => {
    try {
      // Récupérer l'utilisateur connecté pour obtenir son entreprise
      const response = await axios.get(`http://localhost:5000/auth/user/${userId}`);
      const user = response.data;

      // Récupérer les utilisateurs de la même entreprise
      const usersResponse = await axios.get(`http://localhost:5000/auth/entreprise/${user.entreprise}/users`);
      setUsers(usersResponse.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des utilisateurs :", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsersByEntreprise();
  }, []);

  const columns = [
    { field: "id", headerName: "ID" },
    {
      field: "nom",
      headerName: "Name",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "email",
      headerName: "Email",
      flex: 1,
    },
    {
      field: "role",
      headerName: "Role",
      flex: 1,
      renderCell: ({ row: { role } }) => {
        return (
          <Box
            width="60%"
            m="0 auto"
            p="5px"
            display="flex"
            justifyContent="center"
            backgroundColor={
              role === "SuperAdminABshore"
                ? colors.greenAccent[600]
                : role === "SuperAdminEntreprise"
                ? colors.greenAccent[700]
                : colors.greenAccent[700]
            }
            borderRadius="4px"
          >
            {role === "SuperAdminABshore" && <AdminPanelSettingsOutlinedIcon />}
            {role === "SuperAdminEntreprise" && <SecurityOutlinedIcon />}
            {role === "Moderateur" && <LockOpenOutlinedIcon />}
            <Typography color={colors.grey[100]} sx={{ ml: "5px" }}>
              {role}
            </Typography>
          </Box>
        );
      },
    },
  ];

  if (loading) {
    return <Typography>Chargement...</Typography>;
  }

  return (
    <Box m="20px">
      <Header title="TEAM" subtitle="Managing the Team Members" />
      <Box
        m="40px 0 0 0"
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
          },
          "& .name-column--cell": {
            color: colors.greenAccent[300],
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: colors.blueAccent[700],
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: colors.primary[400],
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            backgroundColor: colors.blueAccent[700],
          },
          "& .MuiCheckbox-root": {
            color: `${colors.greenAccent[200]} !important`,
          },
        }}
      >
        <DataGrid checkboxSelection rows={users} columns={columns} />
      </Box>
    </Box>
  );
};

export default Team;