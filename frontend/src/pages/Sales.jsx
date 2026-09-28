import { useState, useEffect } from "react";
import { getSales, deleteSale, getSaleById } from "../services/api";
import { toast } from "react-toastify";
import FactureModal from "../components/Facture";
import { useAuth } from "../context/AuthContext";
import Pagination from "../components/Pagination";

const PAGE_SIZE = 10;

function Sales() {
  const { isAdmin } = useAuth();
  const API_URL = import.meta.env.VITE_API_URL;

  const [data, setData] = useState([]);
  const [sales, setSales] = useState([]);
  const [selectedSale, setSelectedSale] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchSales();
    getSales().then((d) => setSales(Array.isArray(d) ? d : []));
  }, []);

  const fetchSales = async () => {
    try {
      const res = await fetch(`${API_URL}/sales/sp`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const result = await res.json();
      setData(Array.isArray(result) ? result : []);
    } catch (err) {
      console.error("Error al cargar ventas:", err);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFacture = async (id) => {
    try {
      const sale = await getSaleById(id);
      setSelectedSale(sale);
      setShowModal(true);
    } catch {
      toast.error("Error al obtener los detalles de la venta");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Eliminar esta venta?")) return;
    try {
      await deleteSale(id);
      setData((prev) => prev.filter((item) => item.ventaId !== id));
      setSales((prev) => prev.filter((s) => s.id !== id));
      toast.success("Venta eliminada");
      fetchSales();
    } catch {
      toast.error("Error al eliminar la venta");
    }
  };

  const totalPages = Math.ceil(data.length / PAGE_SIZE);
  const paginated = data.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">DETALLE DE VENTAS</h2>
      </div>

      {loading ? (
        <p className="text-gray-500">Cargando...</p>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr className="bg-[#005187] text-white">
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Venta #</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Fecha</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Total</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Cliente</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Producto</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider">Cant.</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider">Precio unit.</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {paginated.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-8 text-center text-gray-400">
                      No hay ventas registradas.
                    </td>
                  </tr>
                ) : (
                  paginated.map((item, index) => (
                    <tr key={index} className="hover:bg-[#EEF4FA] transition-colors">
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">#{item.ventaId}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{item.sale_date}</td>
                      <td className="px-4 py-3 text-sm font-semibold text-green-700">${parseFloat(item.total || 0).toFixed(2)}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{item.cliente}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{item.producto}</td>
                      <td className="px-4 py-3 text-sm text-center text-gray-700">{item.quantity}</td>
                      <td className="px-4 py-3 text-sm text-right text-gray-700">${parseFloat(item.price || 0).toFixed(2)}</td>
                      <td className="px-4 py-3 text-center whitespace-nowrap">
                        <button
                          onClick={() => handleFacture(item.ventaId)}
                          className="px-3 py-1.5 text-xs font-medium text-white bg-yellow-500 rounded hover:bg-yellow-600 transition"
                        >
                          Factura
                        </button>
                        {isAdmin && (
                          <button
                            onClick={() => handleDelete(item.ventaId)}
                            className="ml-2 px-3 py-1.5 text-xs font-medium text-white bg-red-600 rounded hover:bg-red-700 transition"
                          >
                            Eliminar
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <div className="border-t px-4">
            <div className="flex items-center justify-between py-2">
              <p className="text-xs text-gray-500">{data.length} registros en total</p>
              <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
            </div>
          </div>
        </div>
      )}

      <FactureModal
        sale={selectedSale}
        show={showModal}
        onClose={() => setShowModal(false)}
      />
    </section>
  );
}

export default Sales;
