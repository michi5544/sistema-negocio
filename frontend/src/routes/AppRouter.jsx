/// CONFIGURANDO EL ENRUTADOR
import { HashRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useState } from "react";

import { AuthProvider } from "../context/AuthContext";
import ProtectedRoute from "../components/ProtectedRoute";

import Inicio from "../pages/Inicio.jsx";
import Clients from "../pages/Clients.jsx";
import Products from "../pages/Products.jsx";
import Sales from "../pages/Sales.jsx";
import Navbar from "../components/Navbar.jsx";
import NuevoCliente from "../pages/FrmNuevoCliente.jsx";
import NuevoProducto from "../pages/FrmNuevoProductos.jsx";
import NuevaVenta from "../pages/FrmNuevaVenta.jsx";
import Mesas from "../pages/Mesas.jsx";
import Reports from "../pages/Reports.jsx";
import FrmNuevaMesa from "../pages/FrmNuevaMesa.jsx";
import Users from "../pages/Users.jsx";
import NuevoUsuario from "../pages/FrmNuevoUsuario.jsx";
import SignIn from "../pages/Sign-In.jsx";
import Comandas from "../pages/Comandas.jsx";
import FrmNuevaComanda from "../pages/FrmNuevaComanda.jsx";
import Caja from "../pages/Caja.jsx";
import POS from "../pages/POS.jsx";

const ADMIN = ["admin"];
const ALL = ["admin", "employee"];

function AppLayout() {
  const [open, setOpen] = useState(true);
  const location = useLocation();
  const hideNavbar = location.pathname === "/login";

  return (
    <div className="flex">
      {!hideNavbar && <Navbar open={open} setOpen={setOpen} />}

      <main
        className={`transition-all duration-300 p-6 flex-1 bg-gray-100 min-h-screen ${
          hideNavbar ? "" : open ? "ml-64" : "ml-16"
        }`}
      >
        <Routes>
          {/* Rutas públicas */}
          <Route path="/login" element={<SignIn />} />
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* Rutas para admin y employee */}
          <Route path="/inicio" element={<ProtectedRoute allowedRoles={ALL}><Inicio /></ProtectedRoute>} />
          <Route path="/clients" element={<ProtectedRoute allowedRoles={ALL}><Clients /></ProtectedRoute>} />
          <Route path="/products" element={<ProtectedRoute allowedRoles={ALL}><Products /></ProtectedRoute>} />
          <Route path="/sales" element={<ProtectedRoute allowedRoles={ALL}><Sales /></ProtectedRoute>} />
          <Route path="/ventas/nueva" element={<ProtectedRoute allowedRoles={ALL}><NuevaVenta /></ProtectedRoute>} />
          <Route path="/ventas/factura/:id" element={<ProtectedRoute allowedRoles={ALL}><NuevaVenta /></ProtectedRoute>} />
          <Route path="/reports" element={<ProtectedRoute allowedRoles={ADMIN}><Reports /></ProtectedRoute>} />
          <Route path="/mesas" element={<ProtectedRoute allowedRoles={ALL}><Mesas /></ProtectedRoute>} />
          <Route path="/comandas" element={<ProtectedRoute allowedRoles={ALL}><Comandas /></ProtectedRoute>} />
          <Route path="/comandas/nueva" element={<ProtectedRoute allowedRoles={ALL}><FrmNuevaComanda /></ProtectedRoute>} />
          <Route path="/caja" element={<ProtectedRoute allowedRoles={ALL}><Caja /></ProtectedRoute>} />
          <Route path="/pos" element={<ProtectedRoute allowedRoles={ALL}><POS /></ProtectedRoute>} />

          {/* Rutas solo para admin */}
          <Route path="/clientes/nuevo" element={<ProtectedRoute allowedRoles={ADMIN}><NuevoCliente /></ProtectedRoute>} />
          <Route path="/clientes/editar/:id" element={<ProtectedRoute allowedRoles={ADMIN}><NuevoCliente /></ProtectedRoute>} />
          <Route path="/productos/nuevo" element={<ProtectedRoute allowedRoles={ADMIN}><NuevoProducto /></ProtectedRoute>} />
          <Route path="/productos/editar/:id" element={<ProtectedRoute allowedRoles={ADMIN}><NuevoProducto /></ProtectedRoute>} />
          <Route path="/ventas/editar/:id" element={<ProtectedRoute allowedRoles={ADMIN}><NuevaVenta /></ProtectedRoute>} />
          <Route path="/mesas/nueva" element={<ProtectedRoute allowedRoles={ADMIN}><FrmNuevaMesa /></ProtectedRoute>} />
          <Route path="/users" element={<ProtectedRoute allowedRoles={ADMIN}><Users /></ProtectedRoute>} />
          <Route path="/usuarios/nuevo" element={<ProtectedRoute allowedRoles={ADMIN}><NuevoUsuario /></ProtectedRoute>} />
          <Route path="/usuarios/editar/:id" element={<ProtectedRoute allowedRoles={ADMIN}><NuevoUsuario /></ProtectedRoute>} />

          {/* Ruta no encontrada */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </main>

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}

function AppRouter() {
  return (
    <HashRouter>
      <AuthProvider>
        <AppLayout />
      </AuthProvider>
    </HashRouter>
  );
}

export default AppRouter;
