import { useState, useEffect } from "react";


function NuevaVenta() {
    const [clientes, setClientes] = useState([]);
    const [clienteId, setClienteId] = useState("");
    const [productoId, setProductoId] = useState("");
    const [productos, setProductos] = useState([]);
    const [cantidad, setCantidad] = useState("");
    const [fecha, setFecha] = useState("");

    //  Cargar clientes y productos al montar el componente
    useEffect(() => {
        fetch("http://localhost:3000/api/customers")
        .then(res => res.json())
        .then(data => {
            setClientes(data);
        })
        .catch(err => console.error(err));

        fetch("http://localhost:3000/api/products")
        .then(res => res.json())
        .then(data => {
            setProductos(data);
        })
        .catch(err => console.error(err));
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if(id){
            const updated = await updateSale({ id, ...sale });
            toast.success("Venta actualizada con éxito ✅");
            navigate("/sales"); // redirige al listado
            if(onSaleSaved) onSaleSaved(updated);

        } else{ 
            const newSale = await addSale( sale );
            if (onSaleAdded) onSaleAdded(newSale);
            setSale({ customer_id: "", user_id: "", total: "", sale_date: "" })
            
            toast.success("Venta ingresada con éxito ✅");
            navigate("/sales"); // redirige al listado
        }
    };

    return(
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
            <div className="bg-white shadow rounded p-6 w-full max-w-md">
                <h2 className="text-2xl font-bold mb-4 text-purple-600">Registrar venta</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Select de clientes */}
                    <div>
                    <label className="block text-gray-700">Cliente</label>
                      <select
                    value={clienteId}
                    onChange={(e) => setClienteId(e.target.value)}
                    className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:ring-purple-300"
                    >
                    <option value="">Seleccione un cliente</option>
                    {Array.isArray(clientes) && clientes.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option> //lista los datos de la DB tbl customers
                    ))}
                     </select>
                    </div>

                    {/*Select de productos */}

                    <div>
                        <label className="block text-gray-700">Producto</label>
                        <select
                        value={productoId}
                        onChange={(e) => setProductoId(e.target.value)}
                        className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:ring-purple-300"
                        >
                            <option value="">Seleccione un producto</option>
                            {Array.isArray(productos) && productos.map(c => (
                                <option key={c.id} value={c.id}>{c.name}</option> //lista los datos de la DB tbl products
                            ))}
                        </select>
                    </div>
                            {/*Cantidad */}
                    <div>
                        <label className="block text-gray-700">Cantidad</label>
                        <input
                        type="number"
                        value={cantidad}
                        onChange={(e) => setCantidad(e.target.value)}
                        className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:ring-purple-300"
                        min={1}
                        />
                    </div>
                            {/*Fecha */}
                    <div>
                        <label className="block text-gray-700">Fecha</label>
                        <input
                        type="date"
                        value={fecha}
                        onChange={(e) => setFecha(e.target.value)}
                        className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:ring-purple-300"
                        />
                    </div>

                    <button
                    type="submit"
                    className="w-full bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
                    >
                        Guardar Venta
                    </button>
                </form>
            </div>
        </div>
    );
}

export default NuevaVenta;