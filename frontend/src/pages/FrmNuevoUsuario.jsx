import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { getUserById, addUser, updateUser } from "../services/api";

function NuevoUsuario() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [form, setForm] = useState({ name: "", email: "", password: "", role: "employee" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (id) {
      getUserById(id)
        .then((data) => setForm({ name: data.name, email: data.email, password: "", role: data.role }))
        .catch(() => toast.error("Error al cargar el usuario"));
    }
  }, [id]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isEditing) {
        const payload = { id, name: form.name, email: form.email, role: form.role };
        if (form.password.trim()) payload.password = form.password;
        await updateUser(payload);
        toast.success("Usuario actualizado correctamente");
      } else {
        if (!form.password.trim()) { toast.error("La contraseña es obligatoria"); return; }
        await addUser(form);
        toast.success("Usuario creado correctamente");
      }
      navigate("/users");
    } catch {
      toast.error(isEditing ? "Error al actualizar el usuario" : "Error al crear el usuario");
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
          <h1 className="text-2xl font-bold text-gray-800">{isEditing ? "Editar Usuario" : "Nuevo Usuario"}</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {isEditing ? "Modifica los datos del usuario" : "Completa el formulario para registrar un nuevo usuario"}
          </p>
        </div>
      </div>

      <div className="max-w-md">
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <div className="bg-[#005187] px-5 py-3">
            <h2 className="text-sm font-semibold text-white uppercase tracking-wide">Datos del usuario</h2>
          </div>

          <form onSubmit={handleSubmit} className="p-5 space-y-4">
            <div>
              <label className={labelClass}>Nombre completo</label>
              <input type="text" name="name" value={form.name} onChange={handleChange}
                placeholder="Nombre completo" required className={inputClass} />
            </div>

            <div>
              <label className={labelClass}>Correo electrónico</label>
              <input type="email" name="email" value={form.email} onChange={handleChange}
                placeholder="correo@ejemplo.com" required className={inputClass} />
            </div>

            <div>
              <label className={labelClass}>
                Contraseña{" "}
                {isEditing && <span className="text-gray-400 font-normal">(dejar vacío para no cambiar)</span>}
              </label>
              <input type="password" name="password" value={form.password} onChange={handleChange}
                placeholder={isEditing ? "••••••••" : "Contraseña"} required={!isEditing} className={inputClass} />
            </div>

            <div>
              <label className={labelClass}>Rol</label>
              <select name="role" value={form.role} onChange={handleChange} className={inputClass}>
                <option value="employee">Empleado</option>
                <option value="admin">Administrador</option>
              </select>
            </div>

            <div className="flex gap-3 pt-2">
              <button type="button" onClick={() => navigate("/users")}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2.5 rounded-lg text-sm font-medium transition">
                Cancelar
              </button>
              <button type="submit" disabled={loading}
                className="flex-1 bg-[#005187] hover:bg-blue-900 disabled:opacity-50 text-white py-2.5 rounded-lg text-sm font-semibold transition">
                {loading ? "Guardando..." : isEditing ? "Actualizar" : "Crear Usuario"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default NuevoUsuario;
