/// CONFIGURANDO EL ENRUTADOR
import { BrowserRouter, Routes,Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import App from "../App.jsx";
import Clients from "../pages/Clients.jsx"
import Products from "../pages/Products.jsx"
import Sales from "../pages/Sales.jsx"
import Navbar from "../components/Navbar.jsx";
//  FORMULARIOS
import NuevoCliente from "../pages/FrmNuevoCliente.jsx"
import NuevoProducto from "../pages/FrmNuevoProductos.jsx";
import NuevaVenta from "../pages/FrmNuevaVenta.jsx";
import Reports from "../pages/Reports.jsx";

function AppRouter() {
    return(
    <BrowserRouter>
      <div className="flex">
        {/* Navbar lateral */}
        <Navbar />

        {/* Contenido principal */}
        <div className="flex-1 p-6 bg-gray-100 min-h-screen">
          <Routes>
            <Route path="/" element={<App />} />
            <Route path="/clients" element={<Clients />} />
            <Route path="/clientes/nuevo" element={<NuevoCliente />} />
            <Route path="/clientes/editar/:id" element={<NuevoCliente />} />
            <Route path="/products" element={<Products />} />
            <Route path="/productos/nuevo" element={<NuevoProducto />} />
            <Route path="/productos/editar/:id" element={<NuevoProducto />} />
            <Route path="/sales" element={<Sales />} />
            <Route path="/ventas/nueva" element={<NuevaVenta />} />
            <Route path="/reports" element={<Reports />} />
          </Routes>
        </div>
      </div>

      {/* Contenedor global de notificaciones */}
      <ToastContainer position="top-right" autoClose={3000} />
    </BrowserRouter>

    );
}


export default AppRouter;