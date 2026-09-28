import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getUsers, deleteUser } from "../services/api";
import Pagination from "../components/Pagination";

const PAGE_SIZE = 10;

function Users() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    getUsers()
      .then((data) => setUsers(Array.isArray(data) ? data : []))
      .catch(() => toast.error("Error al cargar usuarios"))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("¿Estás seguro de eliminar este usuario?")) return;
    try {
      await deleteUser(id);
      setUsers((prev) => prev.filter((u) => u.id !== id));
      toast.success("Usuario eliminado");
    } catch {
      toast.error("Error al eliminar el usuario");
    }
  };

  const roleBadge = (role) => {
    const base = "px-2 py-0.5 rounded text-xs font-semibold";
    return role === "admin"
      ? `${base} bg-yellow-100 text-yellow-800`
      : `${base} bg-blue-100 text-blue-800`;
  };

  const totalPages = Math.ceil(users.length / PAGE_SIZE);
  const paginated = users.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">USUARIOS</h2>
        <button
          onClick={() => navigate("/usuarios/nuevo")}
          className="bg-[#005187] text-white px-4 py-2 rounded text-sm font-medium hover:bg-blue-900 transition"
        >
          + Nuevo Usuario
        </button>
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
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Rol</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {paginated.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-gray-400">
                      No hay usuarios registrados.
                    </td>
                  </tr>
                ) : (
                  paginated.map((u) => (
                    <tr key={u.id} className="hover:bg-[#EEF4FA] transition-colors">
                      <td className="px-4 py-3 text-sm text-gray-500">{u.id}</td>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">{u.name}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{u.email}</td>
                      <td className="px-4 py-3 text-sm">
                        <span className={roleBadge(u.role)}>{u.role}</span>
                      </td>
                      <td className="px-4 py-3 text-center whitespace-nowrap">
                        <button
                          onClick={() => navigate(`/usuarios/editar/${u.id}`)}
                          className="px-3 py-1.5 text-xs font-medium text-white bg-blue-600 rounded hover:bg-blue-700 transition"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleDelete(u.id)}
                          className="ml-2 px-3 py-1.5 text-xs font-medium text-white bg-red-600 rounded hover:bg-red-700 transition"
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <div className="border-t px-4">
            <div className="flex items-center justify-between py-2">
              <p className="text-xs text-gray-500">{users.length} usuarios en total</p>
              <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default Users;
