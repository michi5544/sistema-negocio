import { useState, useEffect, use } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { getMesa, getMesaById } from "../services/api";
import sillaMesaImg from "../Sillamesa.png";

function Mesas() {
      const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL; // URL base del backend desde variables de entorno
  const {id} = useParams(); // para obtener el ID de la mesa a editar (si existe)
  const [mesas, setMesas] = useState([]); // lista de mesas
  const [numero, setNumero] = useState("");
  const [cantidadPersonas, setCantidadPersonas] = useState(4);
  const [estado, setEstado] = useState("Disponible");
  const [ambiente, setAmbiente] = useState("Interior");
  const [comentarios, setComentarios] = useState("");

        useEffect(() => {
            console.log("Mesas cargadas:", mesas);
        }, [mesas]);


        useEffect(() => { // cargar mesas al montar el componente
    getMesa()
      .then((data) => {
        setMesas(data); // data debe ser un array de mesas
      })
      .catch((error) => {
            console.error("Error al cargar mesas:", error);
            toast.error("Error al cargar mesas");
        });
        }, []);

  // 👉 Agregar mesa dinámicamente
  const handleAddMesa = () => {
    const nuevaMesa = {
      id: Date.now(), // id único
      numero,
      cantidad_personas: cantidadPersonas,
      estado,
      ambiente,
      comentarios,
    };

    setMesas((prev) => [...prev, nuevaMesa]);

    // limpiar formulario
    setNumero("");
    setCantidadPersonas(4);
    setEstado("Disponible");
    setAmbiente("Interior");
    setComentarios("");
  };

    return (
    <div className="min-h-screen flex bg-gray-100">

      {/* Panel central: registros */}
      <div className="w-3/4 bg-white p-6 shadow mx-auto">
        <h2 className="text-xl font-semibold mb-4">Listado de Mesas</h2>
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
  {mesas.map((mesa) => (
    <div
      key={mesa.id}
      className="bg-gradient-to-br from-orange-400 to-yellow-300 shadow-lg rounded-xl p-5 border border-orange-500 transform hover:scale-105 transition duration-300"
    >
      <img
        src={sillaMesaImg}
        alt={`Mesa ${mesa.numero}`}
        className="w-full h-56 object-cover rounded-lg mb-4 border-2 border-white shadow-md"
      />
      <h3 className="text-xl font-bold text-orange-800 mb-3">
        Mesa #{mesa.numero}
      </h3>
      <p className="text-gray-900">
        <span className="font-semibold">Capacidad:</span> {mesa.cantidad_personas}
      </p>
      <p className="text-gray-900">
        <span className="font-semibold">Estado:</span> {mesa.estado}
      </p>
      <p className="text-gray-900">
        <span className="font-semibold">Ambiente:</span> {mesa.ambiente}
      </p>
      {mesa.comentarios && (
        <p className="text-gray-900">
          <span className="font-semibold">Comentarios:</span> {mesa.comentarios}
        </p>
      )}
      <div className="mt-4 flex gap-3">
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 shadow-md">
          Editar
        </button>
        <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 shadow-md">
          Eliminar
        </button>
      </div>
    </div>
  ))}
</div>


      </div>

      {/* Panel derecho: formulario para cambiar de estado una mesa*/}
      <div className="w-1/4 bg-gray-50 p-6 border-l">
        <h2 className="text-lg font-semibold mb-4">Abrir Mesa</h2>
                <form
          onSubmit={(e) => {
            e.preventDefault();
            handleAddMesa();
          }}
          className="space-y-4"
        >

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
            <label className="block text-gray-700">Comentarios</label>
            <textarea
              value={comentarios}
              onChange={(e) => setComentarios(e.target.value)}
              className="w-full border rounded px-3 py-2"
            />
          </div>
<button
  type="submit"
  className="w-full bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600"
>
  Actualizar Mesa
</button>

    <button
      type="button"
      onClick={() => navigate("/mesas/nueva")}
  className="w-full bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600"
    >
      Agregar Nueva Mesa
    </button>
        </form>
      </div>
    </div>
    );
}

export default Mesas;