/// CONFIGURANDO EL ENRUTADOR
import { HashRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import App from "../App.jsx";
import Clients from "../pages/Clients.jsx";
import Products from "../pages/Products.jsx";
import Sales from "../pages/Sales.jsx";
import Navbar from "../components/Navbar.jsx";
// FORMULARIOS
import NuevoCliente from "../pages/FrmNuevoCliente.jsx";
import NuevoProducto from "../pages/FrmNuevoProductos.jsx";
import NuevaVenta from "../pages/FrmNuevaVenta.jsx";
import Mesas from "../pages/Mesas.jsx";
import Reports from "../pages/Reports.jsx";
import FrmNuevaMesa from "../pages/FrmNuevaMesa.jsx";
import { useState } from "react";
import SignIn from "../pages/Sign-In.jsx";

function AppLayout() {
  const [open, setOpen] = useState(true);
  const location = useLocation();

  // Ocultar Navbar en /login
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
          {/* Login como entrada principal */}
          <Route path="/login" element={<SignIn />} />

          {/* Inicio / Dashboard */}
          <Route path="/inicio" element={<App />} />

          {/* Cualquier ruta raíz redirige al login */}
          <Route path="/" element={<Navigate to="/login" replace />} />

          <Route path="/clients" element={<Clients />} />
          <Route path="/clientes/nuevo" element={<NuevoCliente />} />
          <Route path="/clientes/editar/:id" element={<NuevoCliente />} />
          <Route path="/products" element={<Products />} />
          <Route path="/productos/nuevo" element={<NuevoProducto />} />
          <Route path="/productos/editar/:id" element={<NuevoProducto />} />
          <Route path="/sales" element={<Sales />} />
          <Route path="/ventas/nueva" element={<NuevaVenta />} />
          <Route path="/ventas/editar/:id" element={<NuevaVenta />} />
          <Route path="/ventas/factura/:id" element={<NuevaVenta />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/mesas" element={<Mesas />} />
          <Route path="/mesas/nueva" element={<FrmNuevaMesa />} />

          {/* Ruta no encontrada -> login */}
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
      <AppLayout />
    </HashRouter>
  );
}

export default AppRouter;