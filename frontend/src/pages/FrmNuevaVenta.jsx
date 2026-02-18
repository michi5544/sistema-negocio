import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";


function NuevaVenta() {
    const [clientes, setClientes] = useState([]);
    const [clienteId, setClienteId] = useState("");
    const [productoId, setProductoId] = useState("");
    const [productos, setProductos] = useState([]);
    const [cantidad, setCantidad] = useState(1);
    //const [fecha, setFecha] = useState("");
    const [items, setItems] = useState([]); // lista de productos en la venta
    const [showConfirm, setShowConfirm] = useState(false); // estado para mostrar confirmación

    const API_URL = import.meta.env.VITE_API_URL; // URL base del backend desde variables de entorno

        // Función para obtener la fecha actual en formato YYYY-MM-DD
    const getToday = () => {
        const today = new Date();
        return today.toISOString().split("T")[0]; // formato YYYY-MM-DD
    };

    const [fecha, setFecha] = useState(getToday()); // inicializa con la fecha actual

    const navigate = useNavigate();

    //  Cargar clientes y productos al montar el componente
    useEffect(() => {
        fetch(`${API_URL}/customers`)
        .then(res => res.json())
        .then(data => {setClientes(data);})
        .catch(err => console.error(err));

        fetch(`${API_URL}/products`)
        .then(res => res.json())
        .then(data => {setProductos(data);})
        .catch(err => console.error(err));
    }, []);

    const handleAddItem = () => {

        if (!productoId || cantidad <= 0) return;
        const newItem = { productId: parseInt(productoId), quantity: parseInt(cantidad) };
        setItems([...items, newItem]);
        setProductoId("");
        setCantidad(1);
    }; 

    // eliminar un producto de la lista de items
    const handleRemoveItem = (index) => {
        const newItems = [...items];
        newItems.splice(index, 1);
        setItems(newItems);
    };


    const handleSubmit = async (e) => {

        e.preventDefault();
        
        if (!clienteId || items.length === 0) {
            toast.error("Debe seleccionar un cliente y agregar al menos un producto");
            return;
        }

        const sale = {
            customer_id: parseInt(clienteId),
            user_id: 1, // ID del usuario que registra la venta (puede ser dinámico si hay autenticación)
            products: items,
        };

        try {
            const response = await fetch(`${API_URL}/sales`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(sale),
            });

            if (!response.ok) throw new Error("Error al registrar la venta");

            toast.success("Venta registrada exitosamente");
            setShowConfirm(true); // mostrar confirmación en lugar de navegar directo

        } catch (error) {
            console.error(error);
            toast.error("Error al registrar la venta");
        }
    };

    return( 
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
            <div className="bg-white shadow rounded p-6 w-full max-w-md">
                <h2 className="text-2xl font-bold mb-4 text-purple-600">Registrar venta</h2>
                {!showConfirm ? (
                <form onSubmit={handleSubmit} className="space-y-4">
           {/* Select de clientes */}
                    <div>
                    <label className="block text-gray-700">Cliente</label>
                <select
                    value={clienteId}
                    onChange={(e) => setClienteId(e.target.value)}
                    className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:ring-purple-300"
                    required
                    >

                    <option value="">Seleccione un cliente</option>
                    {clientes.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option> //lista los datos de la DB tbl customers
                    ))}
                     </select>
                    </div>
         {/*Fecha */}
                    <div>
                        <label className="block text-gray-700">Fecha Venta</label>
                        <input
                        type="date"
                        value={fecha}
                        onChange={(e) => setFecha(e.target.value)}
                        readOnly // la fecha se establece automáticamente, no se puede editar
                        className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:ring-purple-300"
                        />
                    </div>

          {/* Agregar producto */}
          <div className="flex gap-2 items-center">
            <select
              value={productoId}
              onChange={(e) => setProductoId(e.target.value)}
              className="border rounded px-3 py-2 flex-1"
              required
            >
              <option value="">Seleccione un producto</option>
              {productos.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
            <input
              type="number"
              min={1}
              value={cantidad}
              onChange={(e) => setCantidad(e.target.value)}
              className="border rounded px-3 py-2 w-24"
            />
            <button
              type="button"
              onClick={handleAddItem}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Agregar
            </button>
          </div>

          {/* Tabla de ítems */}
          <table className="w-full border-collapse border border-gray-300 mt-4">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2">Producto</th>
                <th className="border p-2">Cantidad</th>
                <th className="border p-2">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => {
                const producto = productos.find(p => p.id === item.productId);
                return (
                  <tr key={index}>
                    <td className="border p-2">{producto?.name}</td>
                    <td className="border p-2">{item.quantity}</td>
                    <td className="border p-2">
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(index)}
                        className="text-red-600 hover:underline"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

                    {/* Guardar */}
                    <button
                        type="submit"
                        className="w-full bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
                    >
                        Guardar Venta
                    </button>

                </form>
        ) : (
          <div className="space-y-4 text-center">
            <p className="text-lg font-bold text-gray-700">¿Desea generar factura?</p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => navigate("/sales")}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                Sí
              </button>
              <button
                onClick={() => navigate("/sales")}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                No
              </button>
            </div>
          </div>
        )}

            </div>
        </div>
    );
}

export default NuevaVenta;