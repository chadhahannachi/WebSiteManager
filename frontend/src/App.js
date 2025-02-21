import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Topbar from "./scenes/global/Topbar";
import Sidebar from "./scenes/global/Sidebar";
import Dashboard from "./scenes/dashboard";
import Team from "./scenes/team";
import Invoices from "./scenes/invoices";
import Contacts from "./scenes/contacts";
import Bar from "./scenes/bar";
import Form from "./scenes/form";
import Line from "./scenes/line";
import Pie from "./scenes/pie";
import FAQ from "./scenes/faq";
import Geography from "./scenes/geography";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
import Calendar from "./scenes/calendar/calendar";
import ListAdminABshore from "./listuser/listSuperAdminABshore";
import UpdateUser from "./listuser/UpdateUser";
import SignupForm from "./user/registration";
import ListSuperAdminEnt from "./listuser/listSuperAdminEnt";
import ListModerateur from "./listuser/listModerateur";
import LoginForm from './user/login';
import { RequestPasswordReset, ResetPassword } from "./user/resetpwd";
import EntrepriseManager from "./entreprise/EntrepriseManager";

function App() {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);

  // Layout pour les routes avec Sidebar et Topbar
  const Layout = ({ children }) => {
    return (
      <div className="app">
        <Sidebar isSidebar={isSidebar} />
        <main className="content">
          <Topbar setIsSidebar={setIsSidebar} />
          {children}
        </main>
      </div>
    );
  };

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Routes>
          {/* Routes avec Layout (Sidebar et Topbar) */}
          <Route
            path="/"
            element={
              <Layout>
                <Dashboard />
              </Layout>
            }
          />
          <Route
            path="/team"
            element={
              <Layout>
                <Team />
              </Layout>
            }
          />
          <Route
            path="/contacts"
            element={
              <Layout>
                <Contacts />
              </Layout>
            }
          />
          <Route
            path="/invoices"
            element={
              <Layout>
                <Invoices />
              </Layout>
            }
          />
          <Route
            path="/form"
            element={
              <Layout>
                <Form />
              </Layout>
            }
          />
          <Route
            path="/bar"
            element={
              <Layout>
                <Bar />
              </Layout>
            }
          />
          <Route
            path="/pie"
            element={
              <Layout>
                <Pie />
              </Layout>
            }
          />
          <Route
            path="/line"
            element={
              <Layout>
                <Line />
              </Layout>
            }
          />
          <Route
            path="/faq"
            element={
              <Layout>
                <FAQ />
              </Layout>
            }
          />
          <Route
            path="/calendar"
            element={
              <Layout>
                <Calendar />
              </Layout>
            }
          />
          <Route
            path="/geography"
            element={
              <Layout>
                <Geography />
              </Layout>
            }
          />
          <Route
            path="/ListSuperAdminABshore"
            element={
              <Layout>
                <ListAdminABshore />
              </Layout>
            }
          />
          <Route
            path="/update-user/:id"
            element={
              <Layout>
                <UpdateUser />
              </Layout>
            }
          />
          <Route
            path="/registration"
            element={
              <Layout>
                <SignupForm />
              </Layout>
            }
          />
          <Route
            path="/ListSuperAdminEnt"
            element={
              <Layout>
                <ListSuperAdminEnt />
              </Layout>
            }
          />
          <Route
            path="/ListModerateur"
            element={
              <Layout>
                <ListModerateur />
              </Layout>
            }
          />

          <Route
            path="/EntrepriseManager"
            element={
              <Layout>
                <EntrepriseManager />
              </Layout>
            }
          />

          {/* Routes sans Layout (pas de Sidebar ni Topbar) */}
          <Route path="/login" element={<LoginForm />} />
          <Route path="/requestresetpwd" element={<RequestPasswordReset />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        </Routes>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;