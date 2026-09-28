import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { getClientById, addClient, updateClient } from "../services/api";

function NuevoCliente({ onClientAdded, onClientSaved }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [client, setClient] = useState({ name: "", email: "", phone: "", address: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (id) {
      getClientById(id)
        .then((data) => setClient(data))
        .catch(() => toast.error("Error al cargar el cliente"));
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isEditing) {
        const updated = await updateClient({ id, ...client });
        toast.success("Cliente actualizado correctamente");
        if (onClientSaved) onClientSaved(updated);
        navigate("/clients");
      } else {
        const newClient = await addClient(client);
        if (onClientAdded) onClientAdded(newClient);
        setClient({ name: "", email: "", phone: "", address: "" });
        toast.success("Cliente registrado correctamente");
        navigate("/clients");
      }
    } catch {
      toast.error(isEditing ? "Error al actualizar el cliente" : "Error al registrar el cliente");
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300";
  const labelClass = "block text-xs font-semibold text-gray-600 mb-1";

  return (
    <div className="space-y-5">
      {/* Encabezado */}
      <div className="flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="text-gray-400 hover:text-gray-600 transition text-lg">←</button>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">{isEditing ? "Editar Cliente" : "Registrar Cliente"}</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {isEditing ? "Modifica los datos del cliente" : "Completa el formulario para registrar un nuevo cliente"}
          </p>
        </div>
      </div>

      <div className="max-w-md">
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <div className="bg-[#005187] px-5 py-3">
            <h2 className="text-sm font-semibold text-white uppercase tracking-wide">Datos del cliente</h2>
          </div>

          <form onSubmit={handleSubmit} className="p-5 space-y-4">
            <div>
              <label className={labelClass}>Nombre</label>
              <input type="text" value={client.name}
                onChange={(e) => setClient({ ...client, name: e.target.value })}
                placeholder="Nombre del cliente" required className={inputClass} />
            </div>

            <div>
              <label className={labelClass}>Correo electrónico</label>
              <input type="email" value={client.email}
                onChange={(e) => setClient({ ...client, email: e.target.value })}
                placeholder="correo@ejemplo.com" required className={inputClass} />
            </div>

            <div>
              <label className={labelClass}>Teléfono</label>
              <input type="tel" value={client.phone}
                onChange={(e) => setClient({ ...client, phone: e.target.value })}
                placeholder="000-000-0000" required className={inputClass} />
            </div>

            <div>
              <label className={labelClass}>Dirección</label>
              <input type="text" value={client.address}
                onChange={(e) => setClient({ ...client, address: e.target.value })}
                placeholder="Dirección del cliente" required className={inputClass} />
            </div>

            <div className="flex gap-3 pt-2">
              <button type="button" onClick={() => navigate("/clients")}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2.5 rounded-lg text-sm font-medium transition">
                Cancelar
              </button>
              <button type="submit" disabled={loading}
                className="flex-1 bg-[#005187] hover:bg-blue-900 disabled:opacity-50 text-white py-2.5 rounded-lg text-sm font-semibold transition">
                {loading ? "Guardando..." : isEditing ? "Actualizar" : "Guardar Cliente"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default NuevoCliente;
