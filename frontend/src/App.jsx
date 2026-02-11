{/* PROYECTO DE REACT js +  TailwindCSS*/}
import { UserGroupIcon } from '@heroicons/react/24/solid'
import { useNavigate } from "react-router-dom";
import { Routes, Route } from 'react-router-dom';
import NuevoCliente from './pages/FrmNuevoCliente';
import Navbar from './components/Navbar';


function App() {
    const navigate = useNavigate();

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}


      {/* Contenido principal */}
      <div className="ml-64 flex-1 min-h-screen flex flex-col bg-gray-100">
        <main className="flex-grow p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Clientes */}
          <section className="bg-white shadow rounded p-4 hover:shadow-lg transition">
            <h2 className="flex items-center text-xl font-semibold mb-2 text-green-600">
              <span className="bg-green-100 p-2 rounded-full mr-2">
                <UserGroupIcon className="w-6 h-6 text-green-600" />
              </span>
              Clientes
            </h2>
            <p className="text-gray-700">Gestión de clientes registrados en el sistema.</p>
            <button
              onClick={() => navigate("/clientes/nuevo")}
              className="mt-3 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              Nuevo Cliente
            </button>
          </section>

    
          {/* Productos */}
          <section className="bg-white rounded shadow p-4 hover:shadow-lg transition">
            <h2 className="text-xl font-semibold mb-2 text-blue-600">Productos</h2>
            <p className="text-gray-700">Inventario y control de productos disponibles.</p>
            <button
              onClick={() => navigate("/productos/nuevo")}
              className="mt-3 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Nuevo Producto
            </button>
          </section>

          {/* Ventas */}
          <section className="bg-white rounded shadow p-4 hover:shadow-lg transition">
            <h2 className="text-xl font-semibold mb-2 text-purple-600">Ventas</h2>
            <p className="text-gray-700">Registro y detalle de ventas realizadas.</p>
            <button
              onClick={() => navigate("/ventas/nueva")}
              className="mt-3 bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
            >
              Nueva Venta
            </button>
          </section>
          {/* Reportes */}
          <section className="bg-white rounded shadow p-4 hover:shadow-lg transition">
            <h2 className="text-xl font-semibold mb-2 text-red-600">Reportes</h2>
            <p className="text-gray-700">Visualización de reportes y estadísticas.</p>
            <button
              onClick={() => navigate("/reports")}
              className="mt-3 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Generar Reporte
            </button>
          </section>
        </main>

        {/* Footer */}
        <footer className="bg-gray-800 text-white p-4 text-center">
          <p>© 2025 Sistema de Ventas - Michelle</p>
        </footer>
      </div>
    </div>

  );
}

export default App;
