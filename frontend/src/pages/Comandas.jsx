import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getComandas, updateComandaEstado, getAmbiente, getMesa, getCajaActual } from "../services/api";
import { useAuth } from "../context/AuthContext";

const ESTADOS = ["Pendiente", "En preparacion", "Listo", "Entregado", "Cobrado", "Cancelado"];

const NEXT_ESTADO = {
  Pendiente: "En preparacion",
  "En preparacion": "Listo",
  Listo: "Entregado",
};

const HEADER_COLOR = {
  Pendiente: "bg-yellow-400",
  "En preparacion": "bg-blue-400",
  Listo: "bg-green-500",
  Entregado: "bg-purple-500",
  Cobrado: "bg-teal-500",
  Cancelado: "bg-red-400",
};

const BORDER_COLOR = {
  Pendiente: "border-yellow-300",
  "En preparacion": "border-blue-300",
  Listo: "border-green-300",
  Entregado: "border-purple-300",
  Cobrado: "border-teal-300",
  Cancelado: "border-red-300",
};

function ComandaCard({ comanda, onNext, onCobrar, onCancelar, isAdmin }) {
  const next = NEXT_ESTADO[comanda.estado];
  const detalles = comanda.DetalleComandas || [];

  return (
    <div className="bg-white rounded shadow-sm border border-gray-200 p-3 text-sm space-y-2">
      <p className="font-bold text-gray-800">Mesa #{comanda.Mesa?.numero_mesa ?? comanda.id_mesa}</p>

      {detalles.length > 0 && (
        <ul className="text-gray-600 space-y-0.5">
          {detalles.map((d) => (
            <li key={d.id_detalle_comanda} className="flex justify-between">
              <span>{d.Product?.name ?? `Prod. ${d.id_producto}`}</span>
              <span className="font-medium">×{d.cantidad}</span>
            </li>
          ))}
        </ul>
      )}

      <div className="flex flex-col gap-1 pt-1">
        {next && (
          <button
            onClick={() => onNext(comanda.id_comanda, next)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded text-xs w-full"
          >
            → {next}
          </button>
        )}
        {comanda.estado === "Entregado" && (
          <button
            onClick={() => onCobrar(comanda)}
            className="bg-green-600 hover:bg-green-700 text-white px-2 py-1 rounded text-xs w-full"
          >
            Cobrar
          </button>
        )}
        {isAdmin && !["Entregado", "Cobrado", "Cancelado"].includes(comanda.estado) && (
          <button
            onClick={() => onCancelar(comanda.id_comanda)}
            className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-xs w-full"
          >
            Cancelar
          </button>
        )}
      </div>
    </div>
  );
}

export default function Comandas() {
  const [comandas, setComandas] = useState([]);
  const [ambientes, setAmbientes] = useState([]);
  const [mesas, setMesas] = useState([]);
  const [ambienteSelec, setAmbienteSelec] = useState(null);
  const [mesaSelec, setMesaSelec] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cajaInfo, setCajaInfo] = useState(null);
  const [desdeLabel, setDesdeLabel] = useState("");
  const [desdeFiltro, setDesdeFiltro] = useState(null);
  const { isAdmin } = useAuth();
  const navigate = useNavigate();

  const cargar = useCallback(async (desde) => {
    setLoading(true);
    try {
      const [cs, as, ms] = await Promise.all([
        getComandas(desde),
        getAmbiente(),
        getMesa()
      ]);
      setComandas(Array.isArray(cs) ? cs : []);
      setAmbientes(Array.isArray(as) ? as : []);
      setMesas(Array.isArray(ms) ? ms : []);
    } catch {
      toast.error("Error al cargar las comandas");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const init = async () => {
      try {
        const { caja } = await getCajaActual();
        setCajaInfo(caja || null);
        let desde;
        if (caja) {
          desde = caja.fecha_apertura;
          setDesdeLabel(`apertura de caja (${new Date(caja.fecha_apertura).toLocaleString("es-SV")})`);
        } else {
          const hoy = new Date();
          hoy.setHours(0, 0, 0, 0);
          desde = hoy.toISOString();
          setDesdeLabel("hoy");
        }
        setDesdeFiltro(desde);
        cargar(desde);
      } catch {
        cargar();
      }
    };
    init();
  }, [cargar]);

  const mesasDelAmbiente = ambienteSelec
    ? mesas.filter((m) => m.id_ambiente === ambienteSelec)
    : mesas;

  const comandasFiltradas = comandas.filter((c) => {
    if (mesaSelec) return c.id_mesa === mesaSelec;
    if (ambienteSelec) {
      const ids = mesasDelAmbiente.map((m) => m.id_mesa);
      return ids.includes(c.id_mesa);
    }
    return true;
  });

  const handleNext = async (id, estado) => {
    try {
      await updateComandaEstado(id, estado);
      toast.success(`Estado actualizado: ${estado}`);
      cargar(desdeFiltro);
    } catch {
      toast.error("Error al actualizar el estado");
    }
  };

  const handleCancelar = async (id) => {
    if (!window.confirm("¿Cancelar esta comanda?")) return;
    try {
      await updateComandaEstado(id, "Cancelado");
      toast.success("Comanda cancelada");
      cargar(desdeFiltro);
    } catch {
      toast.error("Error al cancelar la comanda");
    }
  };

  const handleCobrar = (comanda) => {
    const items = (comanda.DetalleComandas || []).map((d) => ({
      productId: d.id_producto,
      quantity: d.cantidad,
    }));
    navigate("/ventas/nueva", {
      state: { fromComanda: { id: comanda.id_comanda, items, id_mesa: comanda.id_mesa } },
    });
  };

  if (loading) return <p className="text-center mt-10 text-gray-500">Cargando comandas...</p>;

  return (
    <section className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Comandas</h1>
      </div>

      {/* Banner de filtro por caja */}
      {desdeLabel && (
        <div className={`flex items-center gap-2 px-4 py-2 rounded text-sm ${cajaInfo ? "bg-green-50 border border-green-200 text-green-800" : "bg-blue-50 border border-blue-200 text-blue-800"}`}>
          <span>{cajaInfo ? "🟢 Caja abierta —" : "📅"} Mostrando comandas desde {desdeLabel}</span>
          {!cajaInfo && (
            <span className="ml-2 text-xs text-yellow-700 bg-yellow-100 border border-yellow-300 px-2 py-0.5 rounded">
              Sin caja abierta
            </span>
          )}
        </div>
      )}

      {/* Filtro por ambiente */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => { setAmbienteSelec(null); setMesaSelec(null); }}
          className={`px-3 py-1 rounded font-medium text-sm ${
            !ambienteSelec ? "bg-purple-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          Todos
        </button>
        {ambientes.map((a) => (
          <button
            key={a.id_ambiente}
            onClick={() => { setAmbienteSelec(a.id_ambiente); setMesaSelec(null); }}
            className={`px-3 py-1 rounded font-medium text-sm ${
              ambienteSelec === a.id_ambiente
                ? "bg-purple-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {a.nombre}
          </button>
        ))}
      </div>

      {/* Filtro por mesa (solo si hay ambiente seleccionado) */}
      {ambienteSelec && mesasDelAmbiente.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <span className="text-xs text-gray-500 self-center">Mesas:</span>
          <button
            onClick={() => setMesaSelec(null)}
            className={`px-3 py-1 rounded text-xs ${
              !mesaSelec ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            Todas
          </button>
          {mesasDelAmbiente.map((m) => (
            <button
              key={m.id_mesa}
              onClick={() => setMesaSelec(m.id_mesa)}
              className={`px-3 py-1 rounded text-xs ${
                mesaSelec === m.id_mesa
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              Mesa {m.numero_mesa}
            </button>
          ))}
        </div>
      )}

      {/* Kanban */}
      <div className="flex gap-3 overflow-x-auto pb-4">
        {ESTADOS.map((estado) => {
          const grupo = comandasFiltradas.filter((c) => c.estado === estado);
          return (
            <div key={estado} className="flex-shrink-0 w-56">
              <div className={`${HEADER_COLOR[estado]} text-white text-center text-sm font-semibold py-2 rounded-t`}>
                {estado}
                <span className="ml-1 bg-white bg-opacity-30 px-1.5 rounded-full text-xs">
                  {grupo.length}
                </span>
              </div>
              <div
                className={`border-2 ${BORDER_COLOR[estado]} rounded-b p-2 min-h-32 space-y-2 bg-gray-50`}
              >
                {grupo.map((c) => (
                  <ComandaCard
                    key={c.id_comanda}
                    comanda={c}
                    onNext={handleNext}
                    onCobrar={handleCobrar}
                    onCancelar={handleCancelar}
                    isAdmin={isAdmin}
                  />
                ))}
                {grupo.length === 0 && (
                  <p className="text-center text-gray-400 text-xs py-6">Sin comandas</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
