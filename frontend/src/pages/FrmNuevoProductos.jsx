import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { getProductById, addProduct, updateProduct } from "../services/api";

function NuevoProducto({ onProductAdded, onProductSaved }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [product, setProduct] = useState({ name: "", description: "", price: "", stock: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (id) {
      getProductById(id)
        .then((data) => setProduct(data))
        .catch(() => toast.error("Error al cargar el producto"));
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isEditing) {
        const updated = await updateProduct({ id, ...product });
        toast.success("Producto actualizado correctamente");
        if (onProductSaved) onProductSaved(updated);
        navigate("/products");
      } else {
        const newProduct = await addProduct(product);
        if (onProductAdded) onProductAdded(newProduct);
        setProduct({ name: "", description: "", price: "", stock: "" });
        toast.success("Producto registrado correctamente");
        navigate("/products");
      }
    } catch {
      toast.error(isEditing ? "Error al actualizar el producto" : "Error al registrar el producto");
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
          <h1 className="text-2xl font-bold text-gray-800">{isEditing ? "Editar Producto" : "Registrar Producto"}</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {isEditing ? "Modifica los datos del producto" : "Completa el formulario para registrar un nuevo producto"}
          </p>
        </div>
      </div>

      <div className="max-w-md">
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <div className="bg-[#005187] px-5 py-3">
            <h2 className="text-sm font-semibold text-white uppercase tracking-wide">Datos del producto</h2>
          </div>

          <form onSubmit={handleSubmit} className="p-5 space-y-4">
            <div>
              <label className={labelClass}>Nombre</label>
              <input type="text" value={product.name}
                onChange={(e) => setProduct({ ...product, name: e.target.value })}
                placeholder="Nombre del producto" required className={inputClass} />
            </div>

            <div>
              <label className={labelClass}>Descripción</label>
              <input type="text" value={product.description}
                onChange={(e) => setProduct({ ...product, description: e.target.value })}
                placeholder="Descripción del producto" className={inputClass} />
            </div>

            <div>
              <label className={labelClass}>Precio (S/)</label>
              <input type="number" value={product.price} min={0} step="0.01"
                onChange={(e) => setProduct({ ...product, price: e.target.value })}
                placeholder="0.00" required className={inputClass} />
            </div>

            <div>
              <label className={labelClass}>Stock disponible</label>
              <input type="number" value={product.stock} min={0}
                onChange={(e) => setProduct({ ...product, stock: e.target.value })}
                placeholder="Cantidad en stock" required className={inputClass} />
            </div>

            <div className="flex gap-3 pt-2">
              <button type="button" onClick={() => navigate("/products")}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2.5 rounded-lg text-sm font-medium transition">
                Cancelar
              </button>
              <button type="submit" disabled={loading}
                className="flex-1 bg-[#005187] hover:bg-blue-900 disabled:opacity-50 text-white py-2.5 rounded-lg text-sm font-semibold transition">
                {loading ? "Guardando..." : isEditing ? "Actualizar" : "Guardar Producto"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default NuevoProducto;
