import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { getMesa, addMesa, deleteMesa, getAmbiente, deleteAmbiente, addAmbiente } from "../services/api";

function FrmNuevaMesa() {
  const [activeTab, setActiveTab] = useState("mesas");

  // Estados para Mesas
  const [mesas, setMesas] = useState([]);
  const [numero, setNumero] = useState("");
  const [cantidadPersonas, setCantidadPersonas] = useState(4);
  const [estado, setEstado] = useState("Libre");
  const [idAmbiente, setIdAmbiente] = useState("");
  const [comentarios, setComentarios] = useState("");

  // Estados para Ambientes
  const [ambientes, setAmbientes] = useState([]);
  const [codigo, setCodigo] = useState("");
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");

  useEffect(() => {
    getMesa()
      .then((data) => setMesas(Array.isArray(data) ? data : []))
      .catch(() => toast.error("Error al cargar mesas"));
    getAmbiente()
      .then((data) => setAmbientes(Array.isArray(data) ? data : []))
      .catch(() => toast.error("Error al cargar ambientes"));
  }, []);

  // ── Mesas ──────────────────────────────────────────────────────────────────

  const handleAddMesa = async (e) => {
    e.preventDefault();
    try {
      const nueva = await addMesa({
        numero_mesa: numero,
        cantidad_personas: cantidadPersonas,
        estado,
        comentarios,
        id_ambiente: idAmbiente,
      });
      setMesas((prev) => [...prev, nueva]);
      setNumero("");
      setCantidadPersonas(4);
      setEstado("Libre");
      setIdAmbiente("");
      setComentarios("");
      toast.success("Mesa agregada correctamente");
    } catch {
      toast.error("Error al agregar la mesa");
    }
  };

  const handleDeleteMesa = async (id) => {
    if (!window.confirm("¿Eliminar esta mesa?")) return;
    try {
      await deleteMesa(id);
      setMesas((prev) => prev.filter((m) => m.id_mesa !== id));
      toast.info("Mesa eliminada");
    } catch {
      toast.error("Error al eliminar la mesa");
    }
  };

  // ── Ambientes ──────────────────────────────────────────────────────────────

  const handleAddAmbiente = async (e) => {
    e.preventDefault();
    try {
      const data = await addAmbiente({ codigo, nombre, descripcion });
      setAmbientes((prev) => [...prev, data]);
      setCodigo("");
      setNombre("");
      setDescripcion("");
      toast.success("Ambiente agregado correctamente");
    } catch {
      toast.error("Error al agregar el ambiente");
    }
  };

  const handleDeleteAmbiente = async (id) => {
    const relacionadas = mesas.filter((m) => m.id_ambiente === id);
    if (relacionadas.length > 0) {
      toast.error("Este ambiente tiene mesas asignadas. Elimínalas primero.");
      return;
    }
    if (!window.confirm("¿Eliminar este ambiente?")) return;
    try {
      await deleteAmbiente(id);
      setAmbientes((prev) => prev.filter((a) => a.id_ambiente !== id));
      toast.info("Ambiente eliminado");
    } catch {
      toast.error("Error al eliminar el ambiente");
    }
  };

  // ── Helpers ────────────────────────────────────────────────────────────────

  const inputClass =
    "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300";
  const labelClass = "block text-xs font-semibold text-gray-600 mb-1";

  return (
    <div className="space-y-5">
      {/* Encabezado */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Configuración de Mesas</h1>
        <p className="text-sm text-gray-500 mt-0.5">Administra mesas y ambientes del local</p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        {[{ key: "mesas", label: "Mesas" }, { key: "ambiente", label: "Ambientes" }].map((t) => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key)}
            className={`px-5 py-2.5 text-sm font-semibold transition border-b-2 -mb-px ${
              activeTab === t.key
                ? "border-[#005187] text-[#005187]"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ── TAB MESAS ─────────────────────────────────────────────────────── */}
      {activeTab === "mesas" && (
        <div className="flex gap-6">
          {/* Tabla */}
          <div className="flex-1 bg-white rounded-xl shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr className="bg-[#005187] text-white">
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">#</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Capacidad</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Estado</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Ambiente</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Comentarios</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {mesas.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-4 py-10 text-center text-gray-400 text-sm">
                        No hay mesas registradas.
                      </td>
                    </tr>
                  ) : (
                    mesas.map((mesa) => (
                      <tr key={mesa.id_mesa} className="hover:bg-[#EEF4FA] transition-colors">
                        <td className="px-4 py-3 text-sm font-semibold text-gray-800">#{mesa.numero_mesa}</td>
                        <td className="px-4 py-3 text-sm text-gray-700">{mesa.cantidad_personas} personas</td>
                        <td className="px-4 py-3 text-sm">
                          <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                            {mesa.estado}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700">
                          {ambientes.find((a) => a.id_ambiente === mesa.id_ambiente)?.nombre || (
                            <span className="text-gray-400 italic">Sin ambiente</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-500">{mesa.comentarios || "—"}</td>
                        <td className="px-4 py-3 text-center">
                          <button
                            onClick={() => handleDeleteMesa(mesa.id_mesa)}
                            className="px-3 py-1.5 text-xs font-semibold text-white bg-red-600 rounded-lg hover:bg-red-700 transition"
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
            <div className="px-4 py-2 border-t">
              <p className="text-xs text-gray-400">{mesas.length} mesas registradas</p>
            </div>
          </div>

          {/* Formulario Mesa */}
          <div className="w-72 flex-shrink-0">
            <div className="bg-white rounded-xl shadow p-5">
              <h2 className="text-base font-bold text-gray-800 mb-4">Agregar Mesa</h2>
              <form onSubmit={handleAddMesa} className="space-y-4">
                <div>
                  <label className={labelClass}>Número de mesa</label>
                  <input
                    type="number"
                    value={numero}
                    onChange={(e) => setNumero(e.target.value)}
                    className={inputClass}
                    placeholder="Ej: 1"
                    required
                    min={1}
                  />
                </div>
                <div>
                  <label className={labelClass}>Capacidad (personas)</label>
                  <input
                    type="number"
                    value={cantidadPersonas}
                    onChange={(e) => setCantidadPersonas(e.target.value)}
                    className={inputClass}
                    placeholder="Ej: 4"
                    required
                    min={1}
                  />
                </div>
                <div>
                  <label className={labelClass}>Estado inicial</label>
                  <select
                    value={estado}
                    onChange={(e) => setEstado(e.target.value)}
                    className={inputClass}
                  >
                    <option>Libre</option>
                    <option>Ocupada</option>
                    <option>Reservada</option>
                    <option>Limpieza</option>
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Ambiente</label>
                  <select
                    value={idAmbiente}
                    onChange={(e) => setIdAmbiente(e.target.value)}
                    className={inputClass}
                  >
                    <option value="">Sin ambiente</option>
                    {ambientes.map((a) => (
                      <option key={a.id_ambiente} value={a.id_ambiente}>
                        {a.nombre}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Comentarios (opcional)</label>
                  <textarea
                    value={comentarios}
                    onChange={(e) => setComentarios(e.target.value)}
                    className={`${inputClass} resize-none`}
                    rows={3}
                    placeholder="Observaciones..."
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-[#005187] hover:bg-blue-900 text-white py-2.5 rounded-lg text-sm font-semibold transition"
                >
                  Guardar Mesa
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ── TAB AMBIENTES ─────────────────────────────────────────────────── */}
      {activeTab === "ambiente" && (
        <div className="flex gap-6">
          {/* Tabla */}
          <div className="flex-1 bg-white rounded-xl shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr className="bg-[#005187] text-white">
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Código</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Nombre</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Descripción</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Mesas</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {ambientes.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-4 py-10 text-center text-gray-400 text-sm">
                        No hay ambientes registrados.
                      </td>
                    </tr>
                  ) : (
                    ambientes.map((ambiente) => {
                      const count = mesas.filter((m) => m.id_ambiente === ambiente.id_ambiente).length;
                      return (
                        <tr key={ambiente.id_ambiente} className="hover:bg-[#EEF4FA] transition-colors">
                          <td className="px-4 py-3 text-sm font-semibold text-gray-800">{ambiente.codigo}</td>
                          <td className="px-4 py-3 text-sm text-gray-700">{ambiente.nombre}</td>
                          <td className="px-4 py-3 text-sm text-gray-500">{ambiente.descripcion || "—"}</td>
                          <td className="px-4 py-3 text-sm">
                            <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                              {count} {count === 1 ? "mesa" : "mesas"}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <button
                              onClick={() => handleDeleteAmbiente(ambiente.id_ambiente)}
                              className="px-3 py-1.5 text-xs font-semibold text-white bg-red-600 rounded-lg hover:bg-red-700 transition"
                            >
                              Eliminar
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
            <div className="px-4 py-2 border-t">
              <p className="text-xs text-gray-400">{ambientes.length} ambientes registrados</p>
            </div>
          </div>

          {/* Formulario Ambiente */}
          <div className="w-72 flex-shrink-0">
            <div className="bg-white rounded-xl shadow p-5">
              <h2 className="text-base font-bold text-gray-800 mb-4">Agregar Ambiente</h2>
              <form onSubmit={handleAddAmbiente} className="space-y-4">
                <div>
                  <label className={labelClass}>Código</label>
                  <input
                    type="text"
                    value={codigo}
                    onChange={(e) => setCodigo(e.target.value)}
                    className={inputClass}
                    placeholder="Ej: A1"
                    required
                  />
                </div>
                <div>
                  <label className={labelClass}>Nombre</label>
                  <input
                    type="text"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    className={inputClass}
                    placeholder="Ej: Salón Principal"
                    required
                  />
                </div>
                <div>
                  <label className={labelClass}>Descripción (opcional)</label>
                  <textarea
                    value={descripcion}
                    onChange={(e) => setDescripcion(e.target.value)}
                    className={`${inputClass} resize-none`}
                    rows={3}
                    placeholder="Descripción del ambiente..."
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-[#005187] hover:bg-blue-900 text-white py-2.5 rounded-lg text-sm font-semibold transition"
                >
                  Guardar Ambiente
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default FrmNuevaMesa;
