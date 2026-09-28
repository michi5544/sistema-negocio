import { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { getSaleById, updateSale, addSale, getClients, getProducts, getMesa, updateComandaEstado, updateMesa } from "../services/api";
import { useAuth } from "../context/AuthContext";
import FactureModal from "../components/Facture";

function NuevaVenta() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { state: locationState } = useLocation();
  const { user } = useAuth();

  const [clientes, setClientes] = useState([]);
  const [clienteId, setClienteId] = useState("");
  const [mesas, setMesas] = useState([]);
  const [mesaId, setMesaId] = useState("");
  const [productos, setProductos] = useState([]);
  const [productoId, setProductoId] = useState("");
  const [cantidad, setCantidad] = useState(1);
  const [items, setItems] = useState([]);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [saleGuardada, setSaleGuardada] = useState(null);
  const [loading, setLoading] = useState(false);

  const getToday = () => new Date().toISOString().split("T")[0];
  const [fecha] = useState(getToday());

  useEffect(() => {
    getClients()
      .then((data) => setClientes(Array.isArray(data) ? data : data.customers || []))
      .catch(() => {});
    getProducts()
      .then((data) => setProductos(Array.isArray(data) ? data : data.product || []))
      .catch(() => {});
    getMesa()
      .then((data) => setMesas(Array.isArray(data) ? data : []))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (locationState?.fromComanda) {
      if (locationState.fromComanda.items) setItems(locationState.fromComanda.items);
      if (locationState.fromComanda.id_mesa) setMesaId(String(locationState.fromComanda.id_mesa));
    }
  }, [locationState]);

  useEffect(() => {
    if (id) {
      getSaleById(id)
        .then((data) => {
          setClienteId(data.customer_id);
          setItems(data.SaleDetails.map((d) => ({ productId: d.product_id, quantity: d.quantity })));
        })
        .catch(() => toast.error("Error al cargar la venta"));
    }
  }, [id]);

  const handleAddItem = () => {
    if (!productoId || cantidad <= 0) return;
    const pid = parseInt(productoId);
    const cant = parseInt(cantidad);
    const producto = productos.find((p) => p.id === pid);
    if (!producto) return;
    const existing = items.findIndex((i) => i.productId === pid);
    if (existing >= 0) {
      const updated = [...items];
      updated[existing] = { ...updated[existing], quantity: updated[existing].quantity + cant };
      setItems(updated);
    } else {
      setItems([...items, { productId: pid, nombre: producto.name, precio: parseFloat(producto.price), quantity: cant }]);
    }
    setProductoId("");
    setCantidad(1);
  };

  const handleRemoveItem = (index) => setItems(items.filter((_, i) => i !== index));

  const subtotal = items.reduce((sum, i) => {
    const p = productos.find((x) => x.id === i.productId);
    return sum + (p ? parseFloat(p.price) * i.quantity : 0);
  }, 0);

  const handleSubmit = async (e) => {
    e?.preventDefault();
    if (!clienteId || !mesaId || items.length === 0) {
      toast.error("Seleccione un cliente, una mesa y agregue al menos un producto");
      return;
    }
    setLoading(true);
    const payload = {
      customer_id: parseInt(clienteId),
      user_id: user?.id || 1,
      id_mesa: parseInt(mesaId),
      products: items.map(({ productId, quantity }) => ({ productId, quantity })),
      ...(locationState?.fromComanda?.id ? { id_comanda: locationState.fromComanda.id } : {}),
    };
    try {
      if (id) {
        await updateSale({ ...payload, id });
        toast.success("Venta actualizada correctamente");
        navigate("/sales");
      } else {
        const data = await addSale(payload);
        if (!data?.sale?.id) { toast.error(data?.error || "Error al registrar la venta"); return; }
        if (locationState?.fromComanda?.id) {
          await updateComandaEstado(locationState.fromComanda.id, "Cobrado").catch(() => {});
          const mesa = mesas.find((m) => m.id_mesa === parseInt(mesaId));
          if (mesa) await updateMesa({ ...mesa, estado: "Libre" }).catch(() => {});
        }
        const ventaCompleta = await getSaleById(data.sale.id);
        setSaleGuardada({ ...ventaCompleta, sale_date: data.sale.sale_date });
        toast.success("Venta registrada correctamente");
        setShowConfirm(true);
      }
    } catch {
      toast.error(id ? "Error al actualizar la venta" : "Error al registrar la venta");
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300";
  const labelClass = "block text-xs font-semibold text-gray-600 mb-1";

  if (showConfirm) {
    return (
      <div className="space-y-5">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-gray-800">Venta registrada</h1>
        </div>
        <div className="max-w-sm">
          <div className="bg-white rounded-xl shadow p-6 text-center space-y-4">
            <div className="text-4xl">✅</div>
            <p className="text-base font-semibold text-gray-700">¿Desea generar el comprobante?</p>
            <div className="flex gap-3">
              <button onClick={() => navigate("/sales")}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2.5 rounded-lg text-sm font-medium transition">
                No, volver
              </button>
              <button onClick={() => setShowModal(true)}
                className="flex-1 bg-[#005187] hover:bg-blue-900 text-white py-2.5 rounded-lg text-sm font-semibold transition">
                Sí, ver comprobante
              </button>
            </div>
          </div>
        </div>
        <FactureModal sale={saleGuardada} show={showModal} onClose={() => setShowModal(false)} />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Encabezado */}
      <div className="flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="text-gray-400 hover:text-gray-600 transition text-lg">←</button>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">{id ? "Editar Venta" : "Registrar Venta"}</h1>
          {locationState?.fromComanda && (
            <p className="text-xs text-emerald-700 font-medium mt-0.5">
              Productos precargados desde la Comanda #{locationState.fromComanda.id} · Seleccione el cliente y confirme
            </p>
          )}
        </div>
      </div>

      <div className="flex gap-6 items-start">
        {/* Panel izquierdo */}
        <div className="w-80 flex-shrink-0 space-y-4">

          {/* Datos de la venta */}
          <div className="bg-white rounded-xl shadow p-5 space-y-4">
            <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wide">Datos de la venta</h2>

            <div>
              <label className={labelClass}>Cliente <span className="text-red-500">*</span></label>
              <select value={clienteId} onChange={(e) => setClienteId(e.target.value)} className={inputClass} required>
                <option value="">Seleccione un cliente</option>
                {clientes.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className={labelClass}>Mesa <span className="text-red-500">*</span></label>
              <select value={mesaId} onChange={(e) => setMesaId(e.target.value)} className={inputClass} required>
                <option value="">Seleccione una mesa</option>
                {mesas.map((m) => (
                  <option key={m.id_mesa} value={m.id_mesa}>Mesa {m.numero_mesa} — {m.estado}</option>
                ))}
              </select>
            </div>

            <div>
              <label className={labelClass}>Fecha de venta</label>
              <input type="date" value={fecha} readOnly
                className={`${inputClass} bg-gray-50 cursor-default`} />
            </div>
          </div>

          {/* Agregar producto */}
          <div className="bg-white rounded-xl shadow p-5 space-y-3">
            <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wide">Agregar producto</h2>

            <div>
              <label className={labelClass}>Producto</label>
              <select value={productoId} onChange={(e) => setProductoId(e.target.value)} className={inputClass}>
                <option value="">Seleccione un producto</option>
                {productos.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} — S/ {parseFloat(p.price).toFixed(2)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className={labelClass}>Cantidad</label>
              <input type="number" min={1} value={cantidad} onChange={(e) => setCantidad(e.target.value)}
                className={inputClass} />
            </div>

            <button type="button" onClick={handleAddItem} disabled={!productoId}
              className="w-full bg-[#005187] hover:bg-blue-900 disabled:opacity-50 text-white py-2 rounded-lg text-sm font-semibold transition">
              + Agregar
            </button>
          </div>
        </div>

        {/* Panel derecho: tabla */}
        <div className="flex-1">
          <div className="bg-white rounded-xl shadow overflow-hidden">
            <div className="bg-[#005187] px-5 py-3 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-white">Productos de la venta</h2>
              {items.length > 0 && (
                <span className="text-xs bg-white/20 text-white px-2 py-0.5 rounded-full">
                  {items.length} ítem(s)
                </span>
              )}
            </div>

            {items.length === 0 ? (
              <div className="py-16 text-center text-gray-400">
                <p className="text-3xl mb-2">🛒</p>
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
                    {items.map((item, i) => {
                      const p = productos.find((x) => x.id === item.productId);
                      const precio = p ? parseFloat(p.price) : 0;
                      return (
                        <tr key={i} className="hover:bg-[#EEF4FA] transition-colors">
                          <td className="px-5 py-3 text-sm font-medium text-gray-800">
                            {p?.name ?? item.nombre ?? `ID ${item.productId}`}
                          </td>
                          <td className="px-5 py-3 text-sm text-center text-gray-700">{item.quantity}</td>
                          <td className="px-5 py-3 text-sm text-right text-gray-700">S/ {precio.toFixed(2)}</td>
                          <td className="px-5 py-3 text-sm text-right font-semibold text-gray-800">
                            S/ {(precio * item.quantity).toFixed(2)}
                          </td>
                          <td className="px-5 py-3 text-center">
                            <button type="button" onClick={() => handleRemoveItem(i)}
                              className="text-red-500 hover:text-red-700 text-xs font-medium">
                              Quitar
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>

                <div className="px-5 py-3 border-t flex items-center justify-between bg-gray-50">
                  <span className="text-sm font-semibold text-gray-600">Total estimado</span>
                  <span className="text-lg font-bold text-gray-800">S/ {subtotal.toFixed(2)}</span>
                </div>
              </>
            )}

            <div className="px-5 py-4 border-t flex gap-3">
              <button type="button" onClick={() => navigate(-1)}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2.5 rounded-lg text-sm font-medium transition">
                Cancelar
              </button>
              <button type="button" onClick={handleSubmit}
                disabled={loading || !clienteId || !mesaId || items.length === 0}
                className="flex-1 bg-[#005187] hover:bg-blue-900 disabled:opacity-50 text-white py-2.5 rounded-lg text-sm font-semibold transition">
                {loading ? "Guardando..." : id ? "Actualizar Venta" : "Guardar Venta"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NuevaVenta;
