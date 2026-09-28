import { useEffect, useState, useCallback } from "react";
import { getSales, getClients, getProducts, getComandas, getMesa } from "../services/api";
import Pagination from "../components/Pagination";

const PAGE_SIZE = 15;

const getToday = () => new Date().toISOString().split("T")[0];
const getFirstDayOfMonth = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-01`;
};

function formatDate(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (isNaN(d)) return dateStr;
  return d.toLocaleDateString("es-SV", { year: "numeric", month: "2-digit", day: "2-digit" });
}

const ESTADO_COLOR = {
  Pendiente: "bg-yellow-100 text-yellow-800",
  "En preparacion": "bg-blue-100 text-blue-800",
  Listo: "bg-green-100 text-green-800",
  Entregado: "bg-purple-100 text-purple-800",
  Cobrado: "bg-teal-100 text-teal-800",
  Cancelado: "bg-red-100 text-red-800",
};

export default function Reports() {
  const [sales, setSales] = useState([]);
  const [comandas, setComandas] = useState([]);
  const [mesas, setMesas] = useState([]);
  const [totalClientes, setTotalClientes] = useState(0);
  const [totalProductos, setTotalProductos] = useState(0);
  const [loading, setLoading] = useState(true);

  const [desde, setDesde] = useState(getFirstDayOfMonth());
  const [hasta, setHasta] = useState(getToday());
  const [filtroActivo, setFiltroActivo] = useState({ desde: getFirstDayOfMonth(), hasta: getToday() });
  const [tablaPage, setTablaPage] = useState(1);

  const cargarDatos = useCallback((d, h) => {
    setLoading(true);
    Promise.all([
      getSales(d, h),
      getComandas(d, h),
      getClients(),
      getProducts(),
      getMesa(),
    ])
      .then(([ventasData, comandasData, clientesData, productosData, mesasData]) => {
        setSales(Array.isArray(ventasData) ? ventasData : []);
        setComandas(Array.isArray(comandasData) ? comandasData : []);
        setTotalClientes(Array.isArray(clientesData) ? clientesData.length : 0);
        setTotalProductos(Array.isArray(productosData) ? productosData.length : 0);
        setMesas(Array.isArray(mesasData) ? mesasData : []);
      })
      .catch(() => {
        setSales([]);
        setComandas([]);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    cargarDatos(filtroActivo.desde, filtroActivo.hasta);
  }, [filtroActivo, cargarDatos]);

  const handleFiltrar = () => {
    if (!desde || !hasta) return;
    setFiltroActivo({ desde, hasta });
    setTablaPage(1);
  };

  const handleLimpiar = () => {
    const d = getFirstDayOfMonth();
    const h = getToday();
    setDesde(d);
    setHasta(h);
    setFiltroActivo({ desde: d, hasta: h });
    setTablaPage(1);
  };

  // Totales de ventas
  const totalIngresos = sales.reduce((sum, v) => sum + parseFloat(v.total || 0), 0).toFixed(2);

  // Filas detalladas de ventas
  const filas = sales.flatMap((v) =>
    (v.SaleDetails || []).map((det) => ({
      ventaId: v.id,
      sale_date: v.sale_date,
      cliente: v.Customer?.name ?? "N/A",
      producto: det.Product?.name ?? "N/A",
      quantity: det.quantity,
      price: det.price,
      total: v.total,
    }))
  );

  // Resumen de comandas por estado
  const estadosCounts = comandas.reduce((acc, c) => {
    acc[c.estado] = (acc[c.estado] || 0) + 1;
    return acc;
  }, {});

  // Tabla cruzada por mesa: join comandas y ventas por id_mesa
  const mesaMap = {};
  mesas.forEach((m) => {
    mesaMap[m.id_mesa] = m.numero_mesa;
  });
  // También usar numero_mesa desde las comandas (ya incluyen Mesa via JOIN)
  comandas.forEach((c) => {
    if (c.Mesa?.numero_mesa) mesaMap[c.id_mesa] = c.Mesa.numero_mesa;
  });

  const tablaMesaData = {};
  sales.forEach((v) => {
    if (!v.id_mesa) return;
    if (!tablaMesaData[v.id_mesa]) tablaMesaData[v.id_mesa] = { id_mesa: v.id_mesa, ventas: [], comandas: [] };
    tablaMesaData[v.id_mesa].ventas.push(v);
  });
  comandas.forEach((c) => {
    if (!tablaMesaData[c.id_mesa]) tablaMesaData[c.id_mesa] = { id_mesa: c.id_mesa, ventas: [], comandas: [] };
    tablaMesaData[c.id_mesa].comandas.push(c);
  });

  const tablaMesas = Object.values(tablaMesaData).sort((a, b) => a.id_mesa - b.id_mesa);

  const totalTablaPages = Math.ceil(filas.length / PAGE_SIZE);
  const filasPaginadas = filas.slice((tablaPage - 1) * PAGE_SIZE, tablaPage * PAGE_SIZE);

  const esFiltrado = filtroActivo.desde || filtroActivo.hasta;

  return (
    <section className="space-y-6">
      <h1 className="text-2xl font-bold text-center text-gray-800">REPORTES</h1>

      {/* Filtro por fechas */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <h2 className="text-sm font-semibold text-gray-600 uppercase mb-3">Filtrar por rango de fechas</h2>
        <div className="flex flex-wrap items-end gap-3">
          <div>
            <label className="block text-xs text-gray-500 mb-1">Desde</label>
            <input
              type="date"
              value={desde}
              onChange={(e) => setDesde(e.target.value)}
              className="border rounded px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Hasta</label>
            <input
              type="date"
              value={hasta}
              onChange={(e) => setHasta(e.target.value)}
              className="border rounded px-3 py-2 text-sm"
            />
          </div>
          <button
            onClick={handleFiltrar}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded text-sm font-medium"
          >
            Filtrar
          </button>
          <button
            onClick={handleLimpiar}
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded text-sm"
          >
            Mes actual
          </button>
        </div>
        {esFiltrado && (
          <p className="text-xs text-gray-500 mt-2">
            Mostrando datos del {formatDate(filtroActivo.desde)} al {formatDate(filtroActivo.hasta)}
          </p>
        )}
      </div>

      {loading ? (
        <p className="text-center text-gray-500">Cargando reportes...</p>
      ) : (
        <>
          {/* Cards resumen ventas */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-[#FF692A] p-6 rounded-lg shadow-md text-center text-white">
              <h3 className="text-sm font-semibold uppercase">Ventas</h3>
              <p className="text-3xl font-bold mt-1">{sales.length}</p>
            </div>
            <div className="bg-[#2D9966] p-6 rounded-lg shadow-md text-center text-white">
              <h3 className="text-sm font-semibold uppercase">Clientes</h3>
              <p className="text-3xl font-bold mt-1">{totalClientes}</p>
            </div>
            <div className="bg-[#155DFC] p-6 rounded-lg shadow-md text-center text-white">
              <h3 className="text-sm font-semibold uppercase">Productos</h3>
              <p className="text-3xl font-bold mt-1">{totalProductos}</p>
            </div>
            <div className="bg-[#7C3AED] p-6 rounded-lg shadow-md text-center text-white">
              <h3 className="text-sm font-semibold uppercase">Ingresos</h3>
              <p className="text-2xl font-bold mt-1">${totalIngresos}</p>
            </div>
          </div>

          {/* Resumen de comandas */}
          {comandas.length > 0 && (
            <div className="bg-white p-5 rounded-lg shadow-md">
              <h2 className="text-lg font-bold text-gray-700 mb-3">
                Comandas del período
                <span className="ml-2 text-sm font-normal text-gray-400">({comandas.length} total)</span>
              </h2>
              <div className="flex flex-wrap gap-2">
                {Object.entries(estadosCounts).map(([estado, count]) => (
                  <span
                    key={estado}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold ${ESTADO_COLOR[estado] || "bg-gray-100 text-gray-700"}`}
                  >
                    {estado}: {count}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Tabla cruzada por mesa */}
          {tablaMesas.length > 0 && (
            <div className="bg-white p-5 rounded-lg shadow-md">
              <h2 className="text-lg font-bold text-gray-700 mb-4">Actividad por Mesa</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm border">
                  <thead>
                    <tr className="bg-gray-100 text-gray-700">
                      <th className="py-2 px-4 text-left">Mesa</th>
                      <th className="py-2 px-4 text-center">Comandas</th>
                      <th className="py-2 px-4 text-left">Estados comandas</th>
                      <th className="py-2 px-4 text-center">Ventas</th>
                      <th className="py-2 px-4 text-right">Total vendido</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tablaMesas.map((row) => {
                      const totalMesa = row.ventas.reduce((s, v) => s + parseFloat(v.total || 0), 0);
                      const estadosResumen = row.comandas.reduce((acc, c) => {
                        acc[c.estado] = (acc[c.estado] || 0) + 1;
                        return acc;
                      }, {});
                      return (
                        <tr key={row.id_mesa} className="border-t hover:bg-gray-50">
                          <td className="py-2 px-4 font-medium">
                            Mesa {mesaMap[row.id_mesa] ?? `#${row.id_mesa}`}
                          </td>
                          <td className="py-2 px-4 text-center">{row.comandas.length}</td>
                          <td className="py-2 px-4">
                            <div className="flex flex-wrap gap-1">
                              {Object.entries(estadosResumen).map(([e, n]) => (
                                <span key={e} className={`text-xs px-2 py-0.5 rounded-full ${ESTADO_COLOR[e] || "bg-gray-100 text-gray-700"}`}>
                                  {e} ({n})
                                </span>
                              ))}
                              {row.comandas.length === 0 && <span className="text-gray-400 text-xs">—</span>}
                            </div>
                          </td>
                          <td className="py-2 px-4 text-center">{row.ventas.length}</td>
                          <td className="py-2 px-4 text-right font-semibold text-green-700">
                            {row.ventas.length > 0 ? `$${totalMesa.toFixed(2)}` : "—"}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                  <tfoot>
                    <tr className="bg-gray-50 font-semibold border-t-2">
                      <td className="py-2 px-4">Total</td>
                      <td className="py-2 px-4 text-center">{comandas.length}</td>
                      <td className="py-2 px-4"></td>
                      <td className="py-2 px-4 text-center">{sales.length}</td>
                      <td className="py-2 px-4 text-right text-green-700">${totalIngresos}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          )}

          {/* Tabla detalle ventas */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4 text-gray-700">
              Detalle de Ventas
              <span className="ml-2 text-sm font-normal text-gray-400">
                ({filas.length} {filas.length === 1 ? "línea" : "líneas"})
              </span>
            </h2>

            {filas.length === 0 ? (
              <p className="text-gray-500 text-center py-6">
                Sin ventas en el período seleccionado.
              </p>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 text-sm">
                    <thead>
                      <tr className="bg-[#005187] text-white">
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Venta #</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Fecha</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Cliente</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Producto</th>
                        <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider">Cant.</th>
                        <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider">Precio unit.</th>
                        <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {filasPaginadas.map((f, i) => (
                        <tr key={i} className="hover:bg-[#EEF4FA] transition-colors">
                          <td className="px-4 py-3 text-gray-900 font-medium">#{f.ventaId}</td>
                          <td className="px-4 py-3 text-gray-700">{formatDate(f.sale_date)}</td>
                          <td className="px-4 py-3 text-gray-700">{f.cliente}</td>
                          <td className="px-4 py-3 text-gray-700">{f.producto}</td>
                          <td className="px-4 py-3 text-center text-gray-700">{f.quantity}</td>
                          <td className="px-4 py-3 text-right text-gray-700">${parseFloat(f.price || 0).toFixed(2)}</td>
                          <td className="px-4 py-3 text-right font-semibold text-green-700">${parseFloat(f.total || 0).toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="border-t px-4">
                  <div className="flex items-center justify-between py-2">
                    <p className="text-xs text-gray-500">{filas.length} líneas en total</p>
                    <Pagination currentPage={tablaPage} totalPages={totalTablaPages} onPageChange={setTablaPage} />
                  </div>
                </div>
              </>
            )}
          </div>
        </>
      )}
    </section>
  );
}
