import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getProducts, deleteProducts } from "../services/api";
import { useAuth } from "../context/AuthContext";
import Pagination from "../components/Pagination";

const PAGE_SIZE = 10;

function Products() {
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    getProducts()
      .then((data) => setProducts(Array.isArray(data) ? data : (data?.product ?? [])))
      .catch(() => toast.error("Error al cargar productos"))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("¿Eliminar este producto?")) return;
    try {
      await deleteProducts(id);
      setProducts((prev) => prev.filter((p) => p.id !== id));
      toast.success("Producto eliminado");
    } catch {
      toast.error("Error al eliminar el producto");
    }
  };

  const totalPages = Math.ceil(products.length / PAGE_SIZE);
  const paginated = products.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">PRODUCTOS</h2>
        {isAdmin && (
          <button
            onClick={() => navigate("/productos/nuevo")}
            className="bg-[#005187] text-white px-4 py-2 rounded text-sm font-medium hover:bg-blue-900 transition"
          >
            + Nuevo Producto
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
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Descripción</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Precio</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Stock</th>
                  {isAdmin && (
                    <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider">Acciones</th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {paginated.length === 0 ? (
                  <tr>
                    <td colSpan={isAdmin ? 6 : 5} className="px-4 py-8 text-center text-gray-400">
                      No hay productos registrados.
                    </td>
                  </tr>
                ) : (
                  paginated.map((p) => (
                    <tr key={p.id} className="hover:bg-[#EEF4FA] transition-colors">
                      <td className="px-4 py-3 text-sm text-gray-500">{p.id}</td>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">{p.name}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{p.description}</td>
                      <td className="px-4 py-3 text-sm font-semibold text-green-700">${parseFloat(p.price || 0).toFixed(2)}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{p.stock}</td>
                      {isAdmin && (
                        <td className="px-4 py-3 text-center whitespace-nowrap">
                          <button
                            onClick={() => navigate(`/productos/editar/${p.id}`)}
                            className="px-3 py-1.5 text-xs font-medium text-white bg-blue-600 rounded hover:bg-blue-700 transition"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => handleDelete(p.id)}
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
                {products.length} {products.length === 1 ? "producto" : "productos"} en total
              </p>
              <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default Products;
