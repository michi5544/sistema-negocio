import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getMesa, updateMesa, getAmbiente, getComandas } from "../services/api";
import { useAuth } from "../context/AuthContext";
import mesaIcon from "../assets/mesa-icon.svg";

// Badge de estado (solo badge, el header es siempre el mismo color)
const ESTADO_CONFIG = {
  Libre:     { badge: "bg-green-100 text-green-800 border-green-300",   dot: "bg-green-500",  icon: "🟢" },
  Ocupada:   { badge: "bg-red-100 text-red-800 border-red-300",         dot: "bg-red-500",    icon: "🔴" },
  Reservada: { badge: "bg-amber-100 text-amber-800 border-amber-300",   dot: "bg-amber-500",  icon: "🟡" },
  Limpieza:  { badge: "bg-blue-100 text-blue-800 border-blue-300",      dot: "bg-blue-500",   icon: "🔵" },
};

function Mesas() {
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const [mesas, setMesas] = useState([]);
  const [ambientes, setAmbientes] = useState([]);
  const [mesaEditando, setMesaEditando] = useState(null);
  const [cantidadPersonas, setCantidadPersonas] = useState(4);
  const [estado, setEstado] = useState("Libre");
  const [comentarios, setComentarios] = useState("");
  const [panelComandas, setPanelComandas] = useState(null); // mesa seleccionada para ver comandas
  const [comandasDeMesa, setComandasDeMesa] = useState([]);
  const [cargandoComandas, setCargandoComandas] = useState(false);

  useEffect(() => {
    cargarMesas();
    getAmbiente()
      .then((data) => setAmbientes(Array.isArray(data) ? data : []))
      .catch(() => {});
  }, []);

  const cargarMesas = () => {
    getMesa()
      .then((data) => setMesas(Array.isArray(data) ? data : []))
      .catch(() => toast.error("Error al cargar mesas"));
  };

  const handleEditarMesa = (mesa) => {
    setPanelComandas(null);
    setMesaEditando(mesa);
    setCantidadPersonas(mesa.cantidad_personas);
    setEstado(mesa.estado);
    setComentarios(mesa.comentarios || "");
  };

  const handleAbrirComandas = async (mesa) => {
    setMesaEditando(null);
    setPanelComandas(mesa);
    setCargandoComandas(true);
    try {
      const data = await getComandas(null, null, mesa.id_mesa);
      setComandasDeMesa(Array.isArray(data) ? data : []);
    } catch {
      toast.error("Error al cargar comandas de la mesa");
      setComandasDeMesa([]);
    } finally {
      setCargandoComandas(false);
    }
  };

  const handleCancelar = () => {
    setMesaEditando(null);
    setPanelComandas(null);
    setComandasDeMesa([]);
    setCantidadPersonas(4);
    setEstado("Libre");
    setComentarios("");
  };

  const handleActualizarMesa = async (e) => {
    e.preventDefault();
    if (!mesaEditando) return;

    // Bloquear cambio de estado si la mesa estaba Ocupada y tiene comandas sin cobrar
    if (mesaEditando.estado === "Ocupada" && estado !== "Ocupada") {
      try {
        const comandas = await getComandas(null, null, mesaEditando.id_mesa);
        const ESTADOS_FINALES = ["Cobrado", "Cancelado"];
        const activas = (Array.isArray(comandas) ? comandas : []).filter(
          (c) => !ESTADOS_FINALES.includes(c.estado)
        );
        if (activas.length > 0) {
          toast.error(
            `No se puede cambiar el estado: la mesa tiene ${activas.length} comanda(s) pendiente(s) de cobro.`
          );
          return;
        }
      } catch {
        toast.error("No se pudo verificar las comandas de la mesa");
        return;
      }
    }

    try {
      await updateMesa({
        id_mesa: mesaEditando.id_mesa,
        numero_mesa: mesaEditando.numero_mesa,
        cantidad_personas: Number(cantidadPersonas),
        estado,
        comentarios,
        tiempo_ocupada: mesaEditando.tiempo_ocupada,
        id_usuario: mesaEditando.id_usuario,
        id_ambiente: mesaEditando.id_ambiente,
      });
      toast.success("Mesa actualizada correctamente");
      cargarMesas();
      handleCancelar();
    } catch {
      toast.error("Error al actualizar la mesa");
    }
  };

  // Contadores por estado para el resumen
  const conteos = mesas.reduce((acc, m) => {
    acc[m.estado] = (acc[m.estado] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="flex gap-6 min-h-screen">

      {/* Panel principal */}
      <div className="flex-1">
        {/* Encabezado */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Mesas</h1>
            <p className="text-sm text-gray-500 mt-0.5">{mesas.length} mesas registradas</p>
          </div>
          {isAdmin && (
            <button
              onClick={() => navigate("/mesas/nueva")}
              className="bg-[#005187] hover:bg-blue-900 text-white px-4 py-2 rounded-lg text-sm font-semibold transition"
            >
              + Nueva Mesa
            </button>
          )}
        </div>

        {/* Resumen de estados */}
        {mesas.length > 0 && (
          <div className="flex flex-wrap gap-3 mb-5">
            {Object.entries(ESTADO_CONFIG).map(([est, cfg]) =>
              conteos[est] ? (
                <div key={est} className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-semibold ${cfg.badge}`}>
                  <span className={`w-2 h-2 rounded-full ${cfg.dot}`} />
                  {est}: {conteos[est]}
                </div>
              ) : null
            )}
          </div>
        )}

        {/* Grid de cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {mesas.map((mesa) => {
            const cfg = ESTADO_CONFIG[mesa.estado] ?? ESTADO_CONFIG.Libre;
            const seleccionada = mesaEditando?.id_mesa === mesa.id_mesa;

            return (
              <div
                key={mesa.id_mesa}
                className={`bg-white rounded-2xl shadow-md overflow-hidden transition-all duration-200 hover:shadow-xl hover:-translate-y-1 ${
                  seleccionada ? "ring-2 ring-[#005187] shadow-xl" : ""
                }`}
              >
                {/* Header — color único para todas las cards */}
                <div className="bg-gradient-to-br from-[#005187] to-[#0077c2] px-4 pt-4 pb-8 relative">
                  {/* Badge estado */}
                  <span className={`absolute top-3 right-3 text-xs font-bold px-2.5 py-1 rounded-full border bg-white/90 ${cfg.badge}`}>
                    {mesa.estado}
                  </span>
                  {/* Imagen SVG + número */}
                  <div className="flex items-center gap-3">
                    <img
                      src={mesaIcon}
                      alt="mesa"
                      className="w-16 h-16 drop-shadow-md"
                    />
                    <div>
                      <p className="text-white/60 text-xs font-medium uppercase tracking-widest">Mesa</p>
                      <p className="text-white font-black text-3xl leading-none">#{mesa.numero_mesa}</p>
                    </div>
                  </div>
                </div>

                {/* Cuerpo de la card */}
                <div className="px-4 pt-3 pb-4 -mt-4 bg-white rounded-t-2xl relative space-y-2">
                  {/* Capacidad */}
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <span className="text-base">👥</span>
                    <span><span className="font-semibold">{mesa.cantidad_personas}</span> personas</span>
                  </div>

                  {/* Ambiente */}
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <span className="text-base">🏠</span>
                    <span>
                      {ambientes.find((a) => a.id_ambiente === mesa.id_ambiente)?.nombre || (
                        <span className="text-gray-400 italic">Sin ambiente</span>
                      )}
                    </span>
                  </div>

                  {/* Comentarios */}
                  {mesa.comentarios && (
                    <div className="flex items-start gap-2 text-xs text-gray-500 bg-gray-50 rounded-lg px-2 py-1.5">
                      <span className="mt-0.5">💬</span>
                      <span className="leading-tight">{mesa.comentarios}</span>
                    </div>
                  )}

                  {/* Botones */}
                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={() => handleEditarMesa(mesa)}
                      className="flex-1 bg-[#005187] hover:bg-blue-900 text-white text-xs font-semibold py-2 rounded-lg transition"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleAbrirComandas(mesa)}
                      disabled={mesa.estado !== "Ocupada"}
                      title={mesa.estado !== "Ocupada" ? "Cambia el estado a Ocupada para agregar una comanda" : ""}
                      className={`flex-1 text-white text-xs font-semibold py-2 rounded-lg transition ${
                        mesa.estado !== "Ocupada"
                          ? "bg-gray-300 cursor-not-allowed"
                          : panelComandas?.id_mesa === mesa.id_mesa
                            ? "bg-emerald-800 ring-2 ring-emerald-400"
                            : "bg-emerald-600 hover:bg-emerald-700"
                      }`}
                    >
                      + Comanda
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          {mesas.length === 0 && (
            <div className="col-span-4 text-center py-20 text-gray-400">
              <p className="text-4xl mb-3">🪑</p>
              <p className="text-sm">No hay mesas registradas.</p>
            </div>
          )}
        </div>
      </div>

      {/* Panel lateral */}
      <div className="w-72 flex-shrink-0">
        <div className="bg-white rounded-2xl shadow-md p-5 sticky top-4">
          {panelComandas ? (
            /* ── Vista de comandas de la mesa ── */
            <>
              <div className="flex items-center justify-between mb-1">
                <div>
                  <h2 className="text-base font-bold text-gray-800">Comandas</h2>
                  <p className="text-xs text-gray-500">Mesa #{panelComandas.numero_mesa}</p>
                </div>
                <button onClick={handleCancelar} className="text-gray-400 hover:text-gray-600 text-lg leading-none">✕</button>
              </div>

              <button
                onClick={() => navigate("/comandas/nueva", { state: { id_mesa: panelComandas.id_mesa, numero_mesa: panelComandas.numero_mesa, id_ambiente: panelComandas.id_ambiente } })}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 rounded-lg text-sm font-semibold transition mb-4"
              >
                + Nueva Comanda
              </button>

              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Historial</p>

              {cargandoComandas ? (
                <p className="text-xs text-gray-400 text-center py-4">Cargando...</p>
              ) : comandasDeMesa.length === 0 ? (
                <p className="text-xs text-gray-400 text-center py-4">No hay comandas para esta mesa.</p>
              ) : (
                <div className="space-y-2 max-h-[55vh] overflow-y-auto pr-1">
                  {comandasDeMesa.map((c) => {
                    const estadoColors = {
                      Pendiente:  "bg-amber-100 text-amber-800 border-amber-300",
                      "En proceso": "bg-blue-100 text-blue-800 border-blue-300",
                      Entregado:  "bg-green-100 text-green-800 border-green-300",
                      Cancelado:  "bg-red-100 text-red-800 border-red-300",
                    };
                    const colorClass = estadoColors[c.estado] ?? "bg-gray-100 text-gray-700 border-gray-300";
                    const total = c.DetalleComandas?.reduce((sum, d) => sum + parseFloat(d.subtotal || 0), 0) ?? 0;
                    return (
                      <div key={c.id_comanda} className="border rounded-lg px-3 py-2.5 text-xs space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-gray-700">Comanda #{c.id_comanda}</span>
                          <span className={`px-2 py-0.5 rounded-full border font-semibold text-[11px] ${colorClass}`}>{c.estado}</span>
                        </div>
                        <div className="text-gray-500">
                          {c.DetalleComandas?.length ?? 0} producto(s) · <span className="font-semibold text-gray-700">S/ {total.toFixed(2)}</span>
                        </div>
                        <button
                          onClick={() => navigate("/comandas", { state: { destacar: c.id_comanda } })}
                          className="text-[#005187] hover:underline text-[11px] font-medium"
                        >
                          Ver detalle →
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          ) : mesaEditando ? (
            <>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xl">✏️</span>
                <div>
                  <h2 className="text-base font-bold text-gray-800">Editar Mesa</h2>
                  <p className="text-xs text-gray-500">Mesa #{mesaEditando.numero_mesa}</p>
                </div>
              </div>

              <form onSubmit={handleActualizarMesa} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Capacidad (personas)</label>
                  <input
                    type="number"
                    value={cantidadPersonas}
                    onChange={(e) => setCantidadPersonas(e.target.value)}
                    className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                    required
                    min={1}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Estado</label>
                  <select
                    value={estado}
                    onChange={(e) => setEstado(e.target.value)}
                    className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                  >
                    <option>Libre</option>
                    <option>Ocupada</option>
                    <option>Reservada</option>
                    <option>Limpieza</option>
                  </select>
                  {ESTADO_CONFIG[estado] && (
                    <div className={`mt-1.5 text-xs px-2 py-1 rounded-lg border font-medium ${ESTADO_CONFIG[estado].badge}`}>
                      {ESTADO_CONFIG[estado].icon} {estado}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Comentarios</label>
                  <textarea
                    value={comentarios}
                    onChange={(e) => setComentarios(e.target.value)}
                    className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 resize-none"
                    rows={3}
                    placeholder="Observaciones opcionales..."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#005187] hover:bg-blue-900 text-white py-2.5 rounded-lg text-sm font-semibold transition"
                >
                  Guardar cambios
                </button>
                <button
                  type="button"
                  onClick={handleCancelar}
                  className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-2.5 rounded-lg text-sm font-medium transition"
                >
                  Cancelar
                </button>
              </form>
            </>
          ) : (
            <>
              <h2 className="text-base font-bold text-gray-800 mb-1">Panel de Mesas</h2>
              <p className="text-xs text-gray-500 mb-5">
                Selecciona <strong>Editar</strong> en una mesa para modificarla, o <strong>+ Comanda</strong> para registrar un pedido.
              </p>

              {/* Leyenda de estados */}
              <div className="space-y-2 mb-5">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Estados</p>
                {Object.entries(ESTADO_CONFIG).map(([est, cfg]) => (
                  <div key={est} className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-medium ${cfg.badge}`}>
                    <span className={`w-2 h-2 rounded-full flex-shrink-0 ${cfg.dot}`} />
                    {est}
                  </div>
                ))}
              </div>

              {isAdmin && (
                <button
                  onClick={() => navigate("/mesas/nueva")}
                  className="w-full bg-[#005187] hover:bg-blue-900 text-white py-2.5 rounded-lg text-sm font-semibold transition"
                >
                  + Agregar Nueva Mesa
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Mesas;
