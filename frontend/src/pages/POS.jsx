import { useState, useEffect, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { getProducts, getClients, addSale, getSaleById } from "../services/api";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";
import FactureModal from "../components/Facture";

const TIPOS_COMP = ["N. Venta", "Boleta", "Factura"];
const SERIES_MAP = {
  "N. Venta": ["NV01", "NV02"],
  Boleta: ["B001", "B002"],
  Factura: ["F001", "F002"],
};
const METODOS_PAGO_OPTS = ["Efectivo", "Tarjeta", "Transferencia", "Cheque"];

export default function POS() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [productos, setProductos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saleGuardada, setSaleGuardada] = useState(null);
  const [pagoGuardado, setPagoGuardado] = useState(null);
  const [showFactura, setShowFactura] = useState(false);

  // Modal cobro
  const [showCobrar, setShowCobrar] = useState(false);
  const [tipoComp, setTipoComp] = useState("N. Venta");
  const [serie, setSerie] = useState("NV01");
  const [clienteBusqueda, setClienteBusqueda] = useState("");
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null);
  const [showSugerencias, setShowSugerencias] = useState(false);
  const [metodos, setMetodos] = useState([{ tipo: "Efectivo", monto: "", ref: "" }]);
  const clienteInputRef = useRef(null);

  useEffect(() => {
    getProducts()
      .then((d) => setProductos(Array.isArray(d) ? d : (d?.product ?? [])))
      .catch(() => toast.error("Error al cargar productos"));
    getClients()
      .then((d) => setClientes(Array.isArray(d) ? d : (d?.customers ?? [])))
      .catch(() => {});
  }, []);

  const productosFiltrados = useMemo(
    () => productos.filter((p) => p.name.toLowerCase().includes(busqueda.toLowerCase())),
    [productos, busqueda]
  );

  const sugerenciasCliente = useMemo(() => {
    if (!clienteBusqueda.trim()) return [];
    return clientes
      .filter(
        (c) =>
          c.name?.toLowerCase().includes(clienteBusqueda.toLowerCase()) ||
          c.phone?.includes(clienteBusqueda)
      )
      .slice(0, 5);
  }, [clientes, clienteBusqueda]);

  // ── Carrito ──────────────────────────────────────────────────────────────────

  const addToCart = (producto) => {
    const stockDisponible = producto.stock ?? 0;
    if (stockDisponible <= 0) {
      toast.error(`"${producto.name}" no tiene stock disponible`);
      return;
    }
    setCart((prev) => {
      const existing = prev.find((i) => i.product.id === producto.id);
      if (existing) {
        if (existing.quantity >= stockDisponible) {
          toast.warning(`Stock máximo: ${stockDisponible} unidades`);
          return prev;
        }
        return prev.map((i) =>
          i.product.id === producto.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { product: producto, quantity: 1 }];
    });
  };

  const updateQty = (productId, qty) => {
    if (qty <= 0) {
      setCart((prev) => prev.filter((i) => i.product.id !== productId));
    } else {
      const item = cart.find((i) => i.product.id === productId);
      if (item && qty > (item.product.stock ?? Infinity)) {
        toast.warning(`Stock máximo: ${item.product.stock} unidades`);
        return;
      }
      setCart((prev) =>
        prev.map((i) => (i.product.id === productId ? { ...i, quantity: qty } : i))
      );
    }
  };

  const total = useMemo(
    () => cart.reduce((sum, i) => sum + parseFloat(i.product.price || 0) * i.quantity, 0),
    [cart]
  );

  // ── Modal cobro ───────────────────────────────────────────────────────────────

  const abrirModalCobro = () => {
    if (cart.length === 0) {
      toast.error("Agrega al menos un producto al carrito");
      return;
    }
    setMetodos([{ tipo: "Efectivo", monto: total.toFixed(2), ref: "" }]);
    setClienteBusqueda("");
    setClienteSeleccionado(null);
    setTipoComp("N. Venta");
    setSerie("NV01");
    setShowCobrar(true);
  };

  const sumaPagos = useMemo(
    () => metodos.reduce((s, m) => s + parseFloat(m.monto || 0), 0),
    [metodos]
  );

  const cambio = sumaPagos > total ? sumaPagos - total : 0;
  const puedeFinalizarVenta = sumaPagos >= total && !loading;

  const updateMetodo = (idx, campo, valor) => {
    setMetodos((prev) => prev.map((m, i) => (i === idx ? { ...m, [campo]: valor } : m)));
  };

  const addMetodo = () =>
    setMetodos((prev) => [...prev, { tipo: "Efectivo", monto: "", ref: "" }]);

  const removeMetodo = (idx) =>
    setMetodos((prev) => prev.filter((_, i) => i !== idx));

  const handleFinalizar = async () => {
    if (!puedeFinalizarVenta) return;
    setLoading(true);
    try {
      const payload = {
        user_id: user?.id || 1,
        customer_id: clienteSeleccionado ? clienteSeleccionado.id : null,
        products: cart.map((i) => ({ productId: i.product.id, quantity: i.quantity })),
      };

      const data = await addSale(payload);

      if (!data?.sale?.id) {
        toast.error(data?.error || "Error al registrar la venta");
        return;
      }

      const ventaCompleta = await getSaleById(data.sale.id);
      setSaleGuardada({ ...ventaCompleta, sale_date: data.sale.sale_date });
      setPagoGuardado({ pagado: sumaPagos, vuelto: cambio });
      toast.success("Venta registrada ✅");
      setCart([]);
      setShowCobrar(false);
      setShowFactura(true);
    } catch (err) {
      toast.error(err?.message || "Error al procesar la venta");
    } finally {
      setLoading(false);
    }
  };

  // ── Render ────────────────────────────────────────────────────────────────────

  return (
    <div className="flex gap-4 h-full">
      {/* Panel izquierdo: catálogo */}
      <div className="flex-1 flex flex-col space-y-3 min-w-0">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-800">Punto de Venta</h1>
          <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
            {productos.length} productos
          </span>
        </div>

        <input
          type="text"
          placeholder="Buscar producto..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="w-full border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
        />

        <div
          className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 overflow-y-auto pr-1"
          style={{ maxHeight: "calc(100vh - 210px)" }}
        >
          {productosFiltrados.map((p) => {
            const sinStock = (p.stock ?? 0) <= 0;
            const enCarrito = cart.find((i) => i.product.id === p.id);
            const stockRestante = (p.stock ?? 0) - (enCarrito?.quantity || 0);
            return (
              <button
                key={p.id}
                onClick={() => addToCart(p)}
                disabled={sinStock}
                className={`relative rounded-xl border-2 p-4 text-left transition-all ${
                  sinStock
                    ? "border-gray-200 bg-gray-50 opacity-60 cursor-not-allowed"
                    : enCarrito
                    ? "bg-blue-50 border-blue-500 hover:shadow-md"
                    : "bg-white border-gray-200 hover:border-blue-300 hover:shadow-md"
                }`}
              >
                {enCarrito && !sinStock && (
                  <span className="absolute top-2 right-2 bg-blue-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                    {enCarrito.quantity}
                  </span>
                )}
                <span
                  className={`inline-block text-xs px-1.5 py-0.5 rounded-full font-medium mb-1 ${
                    sinStock
                      ? "bg-red-100 text-red-600"
                      : stockRestante <= 5
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-green-100 text-green-700"
                  }`}
                >
                  {sinStock ? "Sin stock" : `Stock: ${p.stock}`}
                </span>
                <p className="font-medium text-gray-900 text-sm leading-snug">{p.name}</p>
                {p.description && (
                  <p className="text-xs text-gray-400 mt-0.5 leading-tight truncate">
                    {p.description}
                  </p>
                )}
                <p className="text-green-600 font-bold text-base mt-1">
                  ${parseFloat(p.price || 0).toFixed(2)}
                </p>
              </button>
            );
          })}

          {productosFiltrados.length === 0 && (
            <p className="col-span-4 text-center text-gray-400 py-16 text-sm">
              No se encontraron productos.
            </p>
          )}
        </div>
      </div>

      {/* Panel derecho: carrito */}
      <div className="w-72 xl:w-80 flex flex-col bg-white rounded-xl shadow-md overflow-hidden shrink-0 self-start sticky top-4">
        <div className="bg-[#005187] text-white px-4 py-3 flex items-center justify-between">
          <span className="font-bold text-sm uppercase tracking-wide">Carrito</span>
          {cart.length > 0 && (
            <span className="bg-white text-[#005187] text-xs font-bold px-2 py-0.5 rounded-full">
              {cart.reduce((s, i) => s + i.quantity, 0)} items
            </span>
          )}
        </div>

        <div className="overflow-y-auto divide-y divide-gray-100" style={{ maxHeight: "340px" }}>
          {cart.length === 0 ? (
            <p className="text-center text-gray-400 text-sm py-10">Sin productos</p>
          ) : (
            cart.map((item) => (
              <div key={item.product.id} className="flex items-center gap-2 px-3 py-2">
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-gray-900 leading-tight truncate">
                    {item.product.name}
                  </p>
                  <p className="text-xs text-gray-400">
                    ${parseFloat(item.product.price || 0).toFixed(2)} c/u
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => updateQty(item.product.id, item.quantity - 1)}
                    className="w-6 h-6 bg-gray-100 rounded hover:bg-red-100 hover:text-red-600 text-sm font-bold flex items-center justify-center transition"
                  >
                    −
                  </button>
                  <span className="w-5 text-center text-sm font-semibold">{item.quantity}</span>
                  <button
                    onClick={() => updateQty(item.product.id, item.quantity + 1)}
                    disabled={item.quantity >= (item.product.stock ?? Infinity)}
                    className="w-6 h-6 bg-gray-100 rounded hover:bg-green-100 hover:text-green-600 text-sm font-bold flex items-center justify-center transition disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    +
                  </button>
                </div>
                <p className="text-xs font-semibold text-green-700 w-12 text-right">
                  ${(parseFloat(item.product.price || 0) * item.quantity).toFixed(2)}
                </p>
              </div>
            ))
          )}
        </div>

        <div className="border-t p-3 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600 font-medium">Total</span>
            <span className="text-xl font-bold text-green-700">${total.toFixed(2)}</span>
          </div>

          <button
            onClick={abrirModalCobro}
            disabled={cart.length === 0}
            className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 rounded-lg font-bold text-sm transition"
          >
            Cobrar ${total.toFixed(2)}
          </button>

          {cart.length > 0 && (
            <button
              onClick={() => setCart([])}
              className="w-full text-center text-xs text-red-400 hover:text-red-600 transition py-1"
            >
              Vaciar carrito
            </button>
          )}
        </div>
      </div>

      {/* ── Modal de Cobro ── */}
      {showCobrar && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowCobrar(false);
            setShowSugerencias(false);
          }}
        >
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm space-y-5 p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-gray-800">Cobro</h2>

            {/* Cliente */}
            <div>
              <label className="block text-sm text-gray-600 mb-1">Cliente</label>
              <div className="relative" ref={clienteInputRef}>
                <input
                  type="text"
                  value={
                    clienteSeleccionado
                      ? clienteSeleccionado.name
                      : clienteBusqueda
                  }
                  onChange={(e) => {
                    setClienteSeleccionado(null);
                    setClienteBusqueda(e.target.value);
                    setShowSugerencias(true);
                  }}
                  onFocus={() => setShowSugerencias(true)}
                  placeholder="Buscar cliente por nombre o teléfono..."
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
                {clienteSeleccionado && (
                  <button
                    onClick={() => { setClienteSeleccionado(null); setClienteBusqueda(""); }}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500 text-xs"
                  >
                    ✕
                  </button>
                )}
                {showSugerencias && sugerenciasCliente.length > 0 && !clienteSeleccionado && (
                  <ul className="absolute z-10 left-0 right-0 bg-white border rounded-lg shadow-lg mt-1 max-h-40 overflow-y-auto">
                    {sugerenciasCliente.map((c) => (
                      <li
                        key={c.id}
                        onClick={() => {
                          setClienteSeleccionado(c);
                          setClienteBusqueda("");
                          setShowSugerencias(false);
                        }}
                        className="px-3 py-2 text-sm hover:bg-blue-50 cursor-pointer flex flex-col"
                      >
                        <span className="font-medium text-gray-800">{c.name}</span>
                        {c.phone && <span className="text-xs text-gray-400">{c.phone}</span>}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              {clienteSeleccionado ? (
                <p className="text-xs text-green-600 mt-1">
                  Cliente seleccionado: <span className="font-semibold">{clienteSeleccionado.name}</span>
                </p>
              ) : (
                <p className="text-xs text-gray-400 mt-1">Sin selección → Consumidor Final</p>
              )}
              <button
                onClick={() => navigate("/clientes/nuevo")}
                className="mt-2 w-full bg-green-500 hover:bg-green-600 text-white py-2.5 rounded-lg text-sm font-semibold flex items-center justify-center gap-1 transition"
              >
                + Agregar Nuevo Cliente
              </button>
            </div>

            {/* Tipo de comprobante */}
            <div>
              <label className="block text-sm text-gray-600 mb-2">Tipo de comprobante</label>
              <div className="flex gap-2">
                {TIPOS_COMP.map((tipo) => (
                  <button
                    key={tipo}
                    onClick={() => {
                      setTipoComp(tipo);
                      setSerie(SERIES_MAP[tipo][0]);
                    }}
                    className={`flex-1 py-2 rounded-full text-xs font-semibold border-2 transition ${
                      tipoComp === tipo
                        ? "bg-[#005187] text-white border-[#005187]"
                        : "bg-white text-gray-600 border-gray-300 hover:border-[#005187]"
                    }`}
                  >
                    {tipo}
                  </button>
                ))}
              </div>
            </div>

            {/* Serie */}
            <div>
              <label className="block text-sm text-gray-600 mb-1">Serie</label>
              <select
                value={serie}
                onChange={(e) => setSerie(e.target.value)}
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
              >
                {SERIES_MAP[tipoComp].map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            {/* Métodos de pago */}
            <div>
              <label className="block text-sm text-gray-600 mb-2">Métodos de pago</label>
              <div className="space-y-2">
                {metodos.map((m, i) => (
                  <div key={i} className="flex gap-1.5 items-center">
                    <select
                      value={m.tipo}
                      onChange={(e) => updateMetodo(i, "tipo", e.target.value)}
                      className="border rounded-lg px-2 py-1.5 text-sm flex-1 focus:outline-none focus:ring-1 focus:ring-blue-300"
                    >
                      {METODOS_PAGO_OPTS.map((opt) => (
                        <option key={opt}>{opt}</option>
                      ))}
                    </select>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={m.monto}
                      onChange={(e) => updateMetodo(i, "monto", e.target.value)}
                      placeholder="0.00"
                      className="border rounded-lg px-2 py-1.5 text-sm w-20 focus:outline-none focus:ring-1 focus:ring-blue-300"
                    />
                    <input
                      type="text"
                      value={m.ref}
                      onChange={(e) => updateMetodo(i, "ref", e.target.value)}
                      placeholder="ref"
                      className="border rounded-lg px-2 py-1.5 text-sm w-14 focus:outline-none focus:ring-1 focus:ring-blue-300"
                    />
                    {metodos.length > 1 && (
                      <button
                        onClick={() => removeMetodo(i)}
                        className="text-gray-300 hover:text-red-500 transition text-lg leading-none px-1"
                        title="Eliminar"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <button
                onClick={addMetodo}
                className="mt-2 text-sm text-gray-500 hover:text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg px-3 py-1.5 transition"
              >
                Agregar método
              </button>
            </div>

            {/* Totales */}
            <div className="bg-gray-50 rounded-xl p-3 space-y-1 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Total a pagar</span>
                <span className="font-semibold text-gray-900">${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Suma de pagos</span>
                <span
                  className={`font-semibold ${
                    sumaPagos >= total ? "text-green-600" : "text-red-500"
                  }`}
                >
                  ${sumaPagos.toFixed(2)}
                </span>
              </div>
              {cambio > 0 && (
                <div className="flex justify-between text-green-700 font-semibold border-t pt-1 mt-1">
                  <span>Cambio</span>
                  <span>${cambio.toFixed(2)}</span>
                </div>
              )}
              {sumaPagos < total && (
                <p className="text-xs text-red-500 mt-1">
                  Falta: ${(total - sumaPagos).toFixed(2)}
                </p>
              )}
            </div>

            {/* Acciones */}
            <div className="flex gap-3">
              <button
                onClick={() => setShowCobrar(false)}
                className="flex-1 py-3 rounded-xl bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold text-sm transition"
              >
                Cancelar
              </button>
              <button
                onClick={handleFinalizar}
                disabled={!puedeFinalizarVenta}
                className="flex-1 py-3 rounded-xl bg-[#005187] hover:bg-blue-900 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-sm transition"
              >
                {loading ? "Procesando..." : "Finalizar venta"}
              </button>
            </div>
          </div>
        </div>
      )}

      <FactureModal
        sale={saleGuardada}
        show={showFactura}
        onClose={() => setShowFactura(false)}
        pagoInfo={pagoGuardado}
      />
    </div>
  );
}
