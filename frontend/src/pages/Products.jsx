//      CRUD PRODUCTOS|
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getProducts, addProduct, updateProduct, deleteProducts } from "../services/api";

function Products(){
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [editingProduct, setEditingProduct] = useState(null);
    const [successsMessage, setsuccesssMessage] = useState("");

    const handleEdit = (id) => {
        navigate(`/productos/editar/${id}`); //redirige al formulario con el id
    }

    // Cargar productos al inicio
    useEffect(() => {
        fetch("http://localhost:3000/api/products")
        .then(res => res.json())
        .then(data => {
            console.log("productos", data);
            setProducts(data.product || data);
        })
        .catch(err => console.error(err));
    }, []);


    // Eliminar producto
    const handleDelete = async (id) => {
        try {
        await deleteProducts(id); //llamada al backend
        setProducts(products.filter(p => p.id !== id));
        toast.info("Producto eliminado con éxito ✅");
        setTimeout(() => setsuccesssMessage(""), 3000); // borra mensajeen 3s
    } catch (error) {
        toast.error("A ocurrido un error al eliminar el producto!", error);
    }
};

    return(
         <div className="ml-64 p-6"> {/* margen izquierdo para el navbar */}

         <section className="bg-white shadow rounded p-4">
            {/* Título arriba */}
            <h2 className="text-2xl font-bold text-center">
                PRODUCTOS
            </h2>


        <div className="flex justify-center mt-12">
            <table className="w-3/4 max-w-2xl border border-gray-300 rounded-lg shadow-md">
                <thead>
                <tr className="bg-[#005187] text-white">
                    <th className="px-6 py-3 text-left text-sm font-semibold">ID</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Nombre</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Precio</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Descripcion</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Stock</th>
                    <th className="px-6 py-3 text-center text-sm font-semibold">Acciones</th>
                </tr>
                </thead>
                <tbody className="bg-white">
                    {products.map((p, index) => (
                        <tr
                        key={p.id}
                        className={`bg-[#F1F5F9] hover:bg-[#CAD5E2] transition-colors`}
                        >
                            <td className="px-6 py-4 text-sm text-gray-700">{p.id}</td>
                            <td className="px-6 py-4 text-sm font-medium text-gray-900">{p.name}</td>
                            <td className="px-6 py-4 text-sm text-green-500 font-semibold">{p.description}</td>
                            <td className="px-6 py-4 text-sm text-green-500 font-semibold">{p.price}</td>
                            <td className="px-6 py-4 text-sm text-gray-700">{p.stock}</td>
                            <td className="px-6 py-4 text-center">
                                <button 
                                onClick={() => handleEdit(p.id)}
                                className="px-7 py-3 text-sm font-semibold text-white bg-blue-600 rounded hover:bg-blue-700 transition">
                                    Editar
                                </button>
                                <button 
                                onClick={() => handleDelete(p.id)}
                                className="px-7 py-3 ml-3 text-sm font-semibold text-white bg-red-600 rounded hover:bg-red-700 transition">
                                    Eliminar
                                </button>

                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
                </section>
        </div>
    );
}

export default Products;