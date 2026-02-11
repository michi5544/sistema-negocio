import { useNavigate, useParams } from "react-router-dom"; // hook para direccionar
import { getProductById, updateProduct } from "../services/api.js"
import { useState, useEffect } from "react";
import { addProduct } from "../services/api";
import { toast } from "react-toastify";


function NuevoProducto({onProductAdded, onProductSaved}){
    const { id } = useParams(); // obtiene el id de la URL
    const navigate = useNavigate(); // hook para redireccion
    const [product, setProduct] = useState({ name: "", description: "", price: "", stock: ""});
    // const [nombre,setNombre] = useState("");
    // const [precio, setPrecio] = useState("");
    // const [stock, setStock] = useState("");
        const [successsMessage, setsuccesssMessage] = useState("");

    useEffect(() => {
        if (id) {
            // si hay id, significa que estamos editando
            getProductById(id).then(data => setProduct(data));
        }
    }, [id]);

        // Crear o actualizar cliente

    const handleSubmit = async (e) => {
        e.preventDefault();

        if(id){

            const updated = await updateProduct({ id, ...product });
            toast.success("Producto actualizado con éxito ✅");
            navigate("/products"); // redirige al listado
            if(onProductSaved) onProductSaved(updated);

        } else{ 

            const newProduct = await addProduct( product );
            if (onProductAdded) onProductAdded(newProduct);
            setProduct({ name: "", description: "", price: "", stock: "" })

         toast.success("Producto ingresado con éxito ✅");
           navigate("/products"); // redirige al listado
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
            <div className="bg-white shadow rounded p-6 w-full max-w-md">
                <h2 className="text-2xl font-bold mb-4 text-blue-600">Registrar Producto</h2>
                <form 
                onSubmit={handleSubmit} 
                className="space-y-4">
                    <div>
                        <label className="block text-gray-700">Nombre</label>
                        <input
                        type="text"
                        value={product.name}
                        onChange={(e) => setProduct({...product, name: e.target.value})}
                        className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
                        placeholder="Nombre del Producto"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700">Descripcion</label>
                        <input
                        type="text"
                        value={product.description}
                        onChange={(e) => setProduct({...product, description: e.target.value})}
                        className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
                        placeholder="Descripción del Producto"
                        />
                    </div>

                    <div>
                        <label>Precio</label>
                        <input
                        type="number"
                        value={product.price}
                        onChange={(e) => setProduct({...product, price: e.target.value})}
                        className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
                        placeholder="Precio en $"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700">Stock</label>
                        <input
                        type="number"
                        value={product.stock}
                        onChange={(e) => setProduct({...product, stock: e.target.value})}
                        className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
                        placeholder="Cantidad disponible"
                        />
                    </div>

                    <button
                    type="submit"
                    className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                        Guardar Producto
                    </button>
                </form>
            </div>
        </div>
    );
}


export default NuevoProducto;