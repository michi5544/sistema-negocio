import { useState, useEffect, use } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { getMesa, getMesaById,addMesa, deleteMesa, getAmbiente, deleteAmbiente, addAmbiente } from "../services/api";

function FrmNuevaMesa() {
  const API_URL = import.meta.env.VITE_API_URL; // URL base del backend desde variables de entorno
// estados para formulario de mesa
const [mesas, setMesas] = useState([]);
const [numero, setNumero] = useState("");
const [cantidadPersonas, setCantidadPersonas] = useState(4);
const [estado, setEstado] = useState("Libre"); 
const [idAmbiente, setIdAmbiente] = useState(""); 
const [comentarios, setComentarios] = useState("");
const [activeTab, setActiveTab] = useState("listado");
const [idusuario, setIdUsuario] = useState(null); // ID del usuario logueado (si es necesario)

// estados para formulario de ambiente
const [ambientes, setAmbientes] = useState([]);
const [codigo, setCodigo] = useState("");
const [nombre, setNombre] = useState("");
const [descripcion, setDescripcion] = useState("");


console.log("ambientes cargadas:", ambientes);
useEffect(() => {
  getMesa()
    .then((data) => setMesas(data)) // data debe ser un array de mesas
    .catch((error) => {
      console.error("Error al cargar mesas:", error);
      toast.error("Error al cargar mesas");
    });

  getAmbiente()
    .then((ambiente) => setAmbientes(ambiente)) // data debe ser un array de ambientes
    .catch((error) => {
      console.error("Error al cargar ambientes:", error);
      toast.error("Error al cargar ambientes");
    });
}, []);


  //                                      SECCION MESA

  //  agregar mesa dinámicamente
  const handleAddMesa = async (e) => {
    e.preventDefault();
    try {
      const nuevaMesa = await addMesa({
        numero_mesa: numero,
        cantidad_personas: cantidadPersonas,
        estado: estado,
        comentarios: comentarios,
        id_ambiente: idAmbiente
      });

      // Actualizar lista de mesas
      setMesas((prev) => [...prev, nuevaMesa]); // Agrega la nueva mesa al estado

      // Limpiar formulario
      setNumero("");
      setCantidadPersonas(4);
      setEstado("Disponible");
      setIdAmbiente("");
      setComentarios("");

      toast.success("Mesa agregada con éxito ✅");
    } catch (error) {
      console.error("Error al agregar mesa:", error);
      toast.error("A ocurrido un error al agregar la mesa!");
    }

  };

  // eliminar mesa
  const handleDeleteMesa = async (id) => {
    try {
      await deleteMesa(id);
      setMesas(mesas.filter((m) => m.id_mesa !== id));
      toast.info("Mesa eliminada con éxito ✅");
      setTimeout(() => toast.dismiss(), 3000); // borra mensaje en 3s
    } catch (error) {
      console.error("Error al eliminar mesa:", error);
      toast.error("A ocurrido un error al eliminar la mesa!");
    }
  };

  //                                      SECCION AMBIENTE 

  // agregar ambiente dinámicamente
const handleAddAmbiente = async (e) => {
  e.preventDefault();
  try {
    const data = await addAmbiente({ codigo, nombre, descripcion });
    // Actualizar lista de ambientes
    setAmbientes((prev) => [...prev, data]);

    // Limpiar formulario
    setCodigo("");
    setNombre("");
    setDescripcion("");

    toast.success("Ambiente agregado con éxito ✅");
  } catch (error) {
    console.error("Error al agregar ambiente:", error);
    toast.error("Ha ocurrido un error al agregar el ambiente!");
  }
};

// eliminar ambiente
const handleDeleteAmbiente = async (id) => {
  // 1. Verificar si alguna mesa está relacionada con este ambiente
  const mesasRelacionadas = mesas.filter((m) => m.id_ambiente === id);

  if (mesasRelacionadas.length > 0) {
    toast.error("⚠️ Este ambiente está relacionado con mesas. Elimina primero las mesas.");
    return; // detener aquí, no eliminar
  }

  try {
    // 2. Si no hay relación, eliminar ambiente
    await deleteAmbiente(id);
    setAmbientes(ambientes.filter((a) => a.id_ambiente !== id));
    toast.info("Ambiente eliminado con éxito ✅");
    setTimeout(() => toast.dismiss(), 3000);
  } catch (error) {
    console.error("Error al eliminar ambiente:", error);
    toast.error("❌ Ocurrió un error al eliminar el ambiente.");
  }
};

  return (
<div className="p-6">
      {/* Encabezado de Tabs */}
      <div className="flex border-b mb-4">
        <button
          onClick={() => setActiveTab("listado")}
          className={`px-4 py-2 ${
            activeTab === "listado"
              ? "border-b-2 border-purple-600 text-purple-600 font-semibold"
              : "text-gray-600"
          }`}
        >
          Mesas
        </button>
        <button
          onClick={() => setActiveTab("formulario")}
          className={`px-4 py-2 ${
            activeTab === "formulario"
              ? "border-b-2 border-purple-600 text-purple-600 font-semibold"
              : "text-gray-600"
          }`}
        >
         Ambiente
        </button>
      </div>

      {/* Contenido de Tabs */}
      {activeTab === "listado" && (
    <div className="flex">
      {/* Panel central: listado de mesas */}
      <div className="w-2/3 p-6">
        <h2 className="text-xl font-semibold mb-4">Listado de Mesas</h2>
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-[#005187] text-white">
              <th className="px-6 py-3 text-left text-sm font-semibold">Número</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Capacidad</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Estado</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Comentarios</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Ambiente</th>
              <th className="px-6 py-3 text-center text-sm font-semibold">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white">
          {mesas.map((mesa, index) => (
            <tr 
              key={mesa.id_mesa ?? index}
              className="bg-[#F1F5F9] hover:bg-[#CAD5E2] transition-colors"
            >
              <td>{mesa.numero_mesa}</td>
              <td>{mesa.cantidad_personas}</td>
              <td>{mesa.estado}</td>
              <td>{mesa.comentarios}</td>
              <td>            
                  {ambientes.find(a => a.id_ambiente === mesa.id_ambiente)?.nombre || "Sin ambiente"}
              </td>
              <td>
                <button 
                  onClick={() => handleDeleteMesa(mesa.id_mesa)}
                  className="px-7 py-3 ml-3 text-sm font-semibold text-white bg-red-600 rounded hover:bg-red-700 transition"
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}

          </tbody>
        </table>
      </div>

      {/* Panel derecho: formulario */}
      <div className="w-1/3 p-6 bg-gray-50 border-l">
        <h2 className="text-lg font-semibold mb-4">Agregar Mesa</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault(); // evita recargar la página
            handleAddMesa();
          }}
          className="space-y-4"
        >
          <div>
            <label className="block text-gray-700">Número</label>
            <input
              type="number"
              value={numero}
              onChange={(e) => setNumero(e.target.value)}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700">Capacidad</label>
            <input
              type="number"
              value={cantidadPersonas}
              onChange={(e) => setCantidadPersonas(e.target.value)}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700">Estado</label>
            <select
              value={estado}
              onChange={(e) => setEstado(e.target.value)}
              className="w-full border rounded px-3 py-2"
            >
              <option>Libre</option>
              <option>Ocupada</option>
              <option>Reservada</option>
              <option>Limpieza</option>
            </select>
          </div>
          <div>
            <label className="block text-gray-700">Ambiente</label>
          <select
            value={idAmbiente}
            onChange={(e) => setIdAmbiente(e.target.value)}
            className="border rounded px-3 py-2 flex-1"
          >
            <option value="">Seleccione un ambiente</option>
            {Array.isArray(ambientes) &&
              ambientes.map((a) => (
                <option key={a.id_ambiente} value={a.id_ambiente}>
                  {a.nombre}
                </option>
              ))}
          </select>
          </div>
          <div>
            <label className="block text-gray-700">Comentarios</label>
            <textarea
              value={comentarios}
              onChange={(e) => setComentarios(e.target.value)}
              className="w-full border rounded px-3 py-2"
            />
          </div>
  <button
    type="submit"
    onClick={handleAddMesa}
  className="w-full bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600"
  >
    Guardar Mesa
  </button>
        </form>
      </div>
    </div>
      )}


      {/* Contenido de Tab 2 "AMBIENTE"*/}
      {activeTab === "formulario" && (
<div className="flex">
      {/* Panel central: listado de mesas */}
      <div className="w-2/3 p-6">
        <h2 className="text-xl font-semibold mb-4">Listado de Ambiente</h2>
        <table className="w-3/4 max-w-2xl border border-gray-300 rounded-lg shadow-md">
          <thead>
            <tr className="bg-[#005187] text-white">
              <th className="px-6 py-3 text-left text-sm font-semibold">Codigo</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Nombre</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Descripcion</th>
              <th className="px-6 py-3 text-center text-sm font-semibold">Acciones</th>
            </tr>
          </thead>
<tbody className="bg-white"> 
  {ambientes.map((ambiente) => (
    <tr key={ambiente.id_ambiente}>
      <td className="px-6 py-4 text-sm text-gray-700">{ambiente.codigo}</td>
      <td className="px-6 py-4 text-sm  text-gray-700">{ambiente.nombre}</td>
      <td className="px-6 py-4 text-sm text-gray-700">{ambiente.descripcion}</td>
       <td>
       <button 
       onClick={() => handleDeleteAmbiente(ambiente.id_ambiente)}
       className="px-7 py-3 ml-3 text-sm font-semibold text-white bg-red-600 rounded hover:bg-red-700 transition">
       Eliminar 
       </button>
       </td>
    </tr>
  ))}
</tbody>
        </table>
      </div>

      {/* Panel derecho: formulario */}
      <div className="w-1/3 p-6 bg-gray-50 border-l">
        <h2 className="text-lg font-semibold mb-4">Agregar Ambiente</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleAddAmbiente();
          }}
          className="space-y-4"
        >
          <div>
            <label className="block text-gray-700">Codigo</label>
            <input
              type="text"
              value={codigo}
              onChange={(e) => setCodigo(e.target.value)}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700">Nombre</label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700">Descripcion</label>
            <textarea
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <button
            type="submit"
            onClick={handleAddAmbiente}
            className="w-full bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600"
          >
            Guardar Ambiente
          </button>
        </form>
      </div>
    </div>
      )}
    </div>
  );
}

export default FrmNuevaMesa