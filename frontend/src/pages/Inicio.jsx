import { useNavigate } from "react-router-dom";
import { UserGroupIcon } from "@heroicons/react/24/solid";
import { useAuth } from "../context/AuthContext";

function Inicio() {
  const navigate = useNavigate();
  const { isAdmin } = useAuth();

  const Card = ({ color, title, description, children }) => (
    <div className={`bg-white shadow rounded-lg p-5 hover:shadow-lg transition border-l-4 ${color}`}>
      <h2 className={`text-lg font-bold mb-1`}>{title}</h2>
      <p className="text-gray-500 text-sm mb-4">{description}</p>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );

  const Btn = ({ onClick, variant = "primary", children }) => {
    const styles = {
      primary: "bg-[#005187] text-white hover:bg-blue-900",
      secondary: "bg-gray-100 text-gray-700 hover:bg-gray-200",
    };
    return (
      <button
        onClick={onClick}
        className={`px-4 py-2 rounded text-sm font-medium transition ${styles[variant]}`}
      >
        {children}
      </button>
    );
  };

  return (
    <div className="flex-1 min-h-screen flex flex-col bg-gray-100">
      <section className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-5 p-2">
        {/* Clientes */}
        <Card color="border-green-500" title="Clientes" description="Gestión de clientes registrados en el sistema.">
          <Btn onClick={() => navigate("/clients")}>Ver Clientes</Btn>
          {isAdmin && (
            <Btn onClick={() => navigate("/clientes/nuevo")} variant="secondary">+ Nuevo Cliente</Btn>
          )}
        </Card>

        {/* Productos */}
        <Card color="border-blue-500" title="Productos" description="Inventario y control de productos disponibles.">
          <Btn onClick={() => navigate("/products")}>Ver Productos</Btn>
          {isAdmin && (
            <Btn onClick={() => navigate("/productos/nuevo")} variant="secondary">+ Nuevo Producto</Btn>
          )}
        </Card>

        {/* Ventas */}
        <Card color="border-purple-500" title="Ventas" description="Registro y detalle de ventas realizadas.">
          <Btn onClick={() => navigate("/sales")}>Ver Ventas</Btn>
        </Card>

        {/* Reportes — solo admin */}
        {isAdmin && (
          <Card color="border-red-500" title="Reportes" description="Visualización de reportes y estadísticas.">
            <Btn onClick={() => navigate("/reports")}>Ver Reportes</Btn>
          </Card>
        )}
      </section>

      <footer className="bg-gray-800 text-white p-4 text-center text-sm">
        © 2025 Sistema de Ventas - Michelle
      </footer>
    </div>
  );
}

export default Inicio;
