import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getClients, deleteClient } from "../services/api.js";
import { useAuth } from "../context/AuthContext";
import Pagination from "../components/Pagination";

const PAGE_SIZE = 10;

function Clients() {
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    getClients()
      .then((data) => setClients(Array.isArray(data) ? data : (data?.customers ?? [])))
      .catch(() => toast.error("Error al cargar clientes"))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("¿Eliminar este cliente?")) return;
    try {
      await deleteClient(id);
      setClients((prev) => prev.filter((c) => c.id !== id));
      toast.success("Cliente eliminado");
    } catch {
      toast.error("Error al eliminar el cliente");
    }
  };

  const totalPages = Math.ceil(clients.length / PAGE_SIZE);
  const paginated = clients.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">CLIENTES</h2>
        {isAdmin && (
          <button
            onClick={() => navigate("/clientes/nuevo")}
            className="bg-[#005187] text-white px-4 py-2 rounded text-sm font-medium hover:bg-blue-900 transition"
          >
            + Nuevo Cliente
          </button>
        )}
      </div>

      {loading ? (
        <p className="text-gray-500">Cargando...</p>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr className="bg-[#005187] text-white">
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">ID</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Nombre</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Email</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Teléfono</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Dirección</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Fecha registro</th>
                  {isAdmin && (
                    <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider">Acciones</th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {paginated.length === 0 ? (
                  <tr>
                    <td colSpan={isAdmin ? 7 : 6} className="px-4 py-8 text-center text-gray-400">
                      No hay clientes registrados.
                    </td>
                  </tr>
                ) : (
                  paginated.map((c) => (
                    <tr key={c.id} className="hover:bg-[#EEF4FA] transition-colors">
                      <td className="px-4 py-3 text-sm text-gray-500">{c.id}</td>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">{c.name}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{c.email}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{c.phone}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{c.address}</td>
                      <td className="px-4 py-3 text-sm text-gray-500">{c.created_at}</td>
                      {isAdmin && (
                        <td className="px-4 py-3 text-center whitespace-nowrap">
                          <button
                            onClick={() => navigate(`/clientes/editar/${c.id}`)}
                            className="px-3 py-1.5 text-xs font-medium text-white bg-blue-600 rounded hover:bg-blue-700 transition"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => handleDelete(c.id)}
                            className="ml-2 px-3 py-1.5 text-xs font-medium text-white bg-red-600 rounded hover:bg-red-700 transition"
                          >
                            Eliminar
                          </button>
                        </td>
                      )}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <div className="border-t px-4">
            <div className="flex items-center justify-between py-2">
              <p className="text-xs text-gray-500">
                {clients.length} {clients.length === 1 ? "cliente" : "clientes"} en total
              </p>
              <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default Clients;
