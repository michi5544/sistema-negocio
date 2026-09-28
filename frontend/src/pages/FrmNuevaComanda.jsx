import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { getAmbiente, getMesa, getProducts, addComanda, getCajaActual } from "../services/api";

export default function FrmNuevaComanda() {
  const navigate = useNavigate();
  const location = useLocation();
  const locationState = location.state;

  const [ambientes, setAmbientes] = useState([]);
  const [mesas, setMesas] = useState([]);
  const [productos, setProductos] = useState([]);

  // Pre-cargar desde la navegación si vienen valores
  const [ambienteId, setAmbienteId] = useState(
    locationState?.id_ambiente ? String(locationState.id_ambiente) : ""
  );
  const [mesaId, setMesaId] = useState(
    locationState?.id_mesa ? String(locationState.id_mesa) : ""
  );

  const [productoId, setProductoId] = useState("");
  const [cantidad, setCantidad] = useState(1);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [cajaAbierta, setCajaAbierta] = useState(null); // null = verificando, false = cerrada, true = abierta

  const precargada = !!(locationState?.id_mesa);

  useEffect(() => {
    Promise.all([getAmbiente(), getMesa(), getProducts(), getCajaActual()])
      .then(([as, ms, ps, { caja }]) => {
        setAmbientes(Array.isArray(as) ? as : []);
        setMesas(Array.isArray(ms) ? ms : []);
        setProductos(Array.isArray(ps) ? ps : []);
        setCajaAbierta(!!caja);
      })
      .catch(() => toast.error("Error al cargar los datos"));
  }, []);

  const mesasFiltradas = ambienteId
    ? mesas.filter((m) => m.id_ambiente === parseInt(ambienteId))
    : mesas;

  const handleAddItem = () => {
    if (!productoId || cantidad <= 0) return;
    const pid = parseInt(productoId);
    const cant = parseInt(cantidad);
    const producto = productos.find((p) => p.id === pid);
    if (!producto) return;

    const existing = items.findIndex((i) => i.id_producto === pid);
    if (existing >= 0) {
      const updated = [...items];
      updated[existing] = { ...updated[existing], cantidad: updated[existing].cantidad + cant };
      setItems(updated);
    } else {
      setItems([...items, { id_producto: pid, nombre: producto.name, precio: parseFloat(producto.price), cantidad: cant }]);
    }
    setProductoId("");
    setCantidad(1);
  };

  const handleRemoveItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const subtotal = items.reduce((sum, i) => sum + i.precio * i.cantidad, 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!mesaId) { toast.error("Seleccione una mesa"); return; }
    if (items.length === 0) { toast.error("Agregue al menos un producto"); return; }
    setLoading(true);
    try {
      await addComanda({
        id_mesa: parseInt(mesaId),
        productos: items.map(({ id_producto, cantidad }) => ({ id_producto, cantidad })),
      });
      toast.success("Comanda registrada exitosamente");
      navigate("/comandas");
    } catch (err) {
      const msg = err?.response?.data?.error || "Error al registrar la comanda";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const mesaSeleccionada = mesas.find((m) => m.id_mesa === parseInt(mesaId));
  const ambienteSeleccionado = ambientes.find((a) => a.id_ambiente === parseInt(ambienteId));

  const inputClass = "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300";
  const labelClass = "block text-xs font-semibold text-gray-600 mb-1";

  // Bloquear formulario si caja está cerrada
  if (cajaAbierta === false) {
    return (
      <div className="space-y-5">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="text-gray-400 hover:text-gray-600 transition text-lg">←</button>
          <h1 className="text-2xl font-bold text-gray-800">Nueva Comanda</h1>
        </div>
        <div className="max-w-md bg-white rounded-xl shadow p-6 text-center space-y-4">
          <p className="text-4xl">🔒</p>
          <p className="text-base font-semibold text-gray-700">Caja cerrada</p>
          <p className="text-sm text-gray-500">No puedes registrar comandas sin una caja abierta. Abre la caja primero.</p>
          <button
            onClick={() => navigate("/caja")}
            className="w-full bg-[#005187] hover:bg-blue-900 text-white py-2.5 rounded-lg text-sm font-semibold transition"
          >
            Ir a Caja
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Encabezado */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="text-gray-400 hover:text-gray-600 transition"
          title="Volver"
        >
          ←
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Nueva Comanda</h1>
          {precargada && (
            <p className="text-xs text-emerald-700 font-medium mt-0.5">
              Mesa #{locationState.numero_mesa}{ambienteSeleccionado ? ` · ${ambienteSeleccionado.nombre}` : ""} pre-seleccionada
            </p>
          )}
        </div>
      </div>

      <div className="flex gap-6 items-start">
        {/* Panel izquierdo: formulario */}
        <div className="w-80 flex-shrink-0 space-y-4">

          {/* Ambiente */}
          <div className="bg-white rounded-xl shadow p-5 space-y-4">
            <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wide">Ubicación</h2>

            <div>
              <label className={labelClass}>Ambiente</label>
              {precargada && ambienteSeleccionado ? (
                <div className="border border-blue-200 bg-blue-50 rounded-lg px-3 py-2 text-sm font-semibold text-blue-800">
                  {ambienteSeleccionado.nombre}
                </div>
              ) : (
                <select
                  value={ambienteId}
                  onChange={(e) => { setAmbienteId(e.target.value); setMesaId(""); }}
                  className={inputClass}
                >
                  <option value="">Todos los ambientes</option>
                  {ambientes.map((a) => (
                    <option key={a.id_ambiente} value={a.id_ambiente}>{a.nombre}</option>
                  ))}
                </select>
              )}
            </div>

            <div>
              <label className={labelClass}>Mesa <span className="text-red-500">*</span></label>
              {precargada && mesaSeleccionada ? (
                <div className="border border-blue-200 bg-blue-50 rounded-lg px-3 py-2 text-sm">
                  <span className="font-semibold text-blue-800">Mesa {mesaSeleccionada.numero_mesa}</span>
                  <span className="text-xs text-gray-500 ml-2">— {mesaSeleccionada.estado}</span>
                </div>
              ) : (
                <select
                  value={mesaId}
                  onChange={(e) => setMesaId(e.target.value)}
                  className={inputClass}
                  required
                >
                  <option value="">Seleccione una mesa</option>
                  {mesasFiltradas.map((m) => (
                    <option key={m.id_mesa} value={m.id_mesa}>
                      Mesa {m.numero_mesa} — {m.estado}
                    </option>
                  ))}
                </select>
              )}
            </div>
          </div>

          {/* Agregar producto */}
          <div className="bg-white rounded-xl shadow p-5 space-y-3">
            <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wide">Agregar producto</h2>
            <div>
              <label className={labelClass}>Producto</label>
              <select
                value={productoId}
                onChange={(e) => setProductoId(e.target.value)}
                className={inputClass}
              >
                <option value="">Seleccione un producto</option>
                {productos.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} — S/ {parseFloat(p.price).toFixed(2)}
                    {p.stock !== undefined ? ` (stock: ${p.stock})` : ""}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>Cantidad</label>
              <input
                type="number"
                min={1}
                value={cantidad}
                onChange={(e) => setCantidad(e.target.value)}
                className={inputClass}
              />
            </div>
            <button
              type="button"
              onClick={handleAddItem}
              disabled={!productoId}
              className="w-full bg-[#005187] hover:bg-blue-900 disabled:opacity-50 text-white py-2 rounded-lg text-sm font-semibold transition"
            >
              + Agregar
            </button>
          </div>
        </div>

        {/* Panel derecho: resumen de productos */}
        <div className="flex-1">
          <div className="bg-white rounded-xl shadow overflow-hidden">
            <div className="bg-[#005187] px-5 py-3 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-white">Productos de la comanda</h2>
              {items.length > 0 && (
                <span className="text-xs bg-white/20 text-white px-2 py-0.5 rounded-full">
                  {items.length} ítem(s)
                </span>
              )}
            </div>

            {items.length === 0 ? (
              <div className="py-16 text-center text-gray-400">
                <p className="text-3xl mb-2">🍽️</p>
                <p className="text-sm">Aún no has agregado productos.</p>
              </div>
            ) : (
              <>
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-5 py-2.5 text-left text-xs font-semibold text-gray-500 uppercase">Producto</th>
                      <th className="px-5 py-2.5 text-center text-xs font-semibold text-gray-500 uppercase">Cant.</th>
                      <th className="px-5 py-2.5 text-right text-xs font-semibold text-gray-500 uppercase">P. Unit.</th>
                      <th className="px-5 py-2.5 text-right text-xs font-semibold text-gray-500 uppercase">Subtotal</th>
                      <th className="px-5 py-2.5"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {items.map((item, i) => (
                      <tr key={i} className="hover:bg-[#EEF4FA] transition-colors">
                        <td className="px-5 py-3 text-sm font-medium text-gray-800">{item.nombre}</td>
                        <td className="px-5 py-3 text-sm text-center text-gray-700">{item.cantidad}</td>
                        <td className="px-5 py-3 text-sm text-right text-gray-700">S/ {item.precio.toFixed(2)}</td>
                        <td className="px-5 py-3 text-sm text-right font-semibold text-gray-800">
                          S/ {(item.precio * item.cantidad).toFixed(2)}
                        </td>
                        <td className="px-5 py-3 text-center">
                          <button
                            type="button"
                            onClick={() => handleRemoveItem(i)}
                            className="text-red-500 hover:text-red-700 text-xs font-medium"
                          >
                            Quitar
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Total */}
                <div className="px-5 py-3 border-t flex items-center justify-between bg-gray-50">
                  <span className="text-sm font-semibold text-gray-600">Total estimado</span>
                  <span className="text-lg font-bold text-gray-800">S/ {subtotal.toFixed(2)}</span>
                </div>
              </>
            )}

            {/* Botones de acción */}
            <div className="px-5 py-4 border-t flex gap-3">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2.5 rounded-lg text-sm font-medium transition"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading || !mesaId || items.length === 0}
                className="flex-1 bg-[#005187] hover:bg-blue-900 disabled:opacity-50 text-white py-2.5 rounded-lg text-sm font-semibold transition"
              >
                {loading ? "Guardando..." : "Guardar Comanda"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
