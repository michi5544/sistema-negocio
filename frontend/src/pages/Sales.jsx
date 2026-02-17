import { useState, useEffect } from "react";
import { getSales, addSale, deleteSale } from "../services/api";
import { getClients, getProducts } from "../services/api";
import { Result } from "postcss";

function Sales(){
    const [sales, setSales] = useState([]);
    const [clients, setClients] = useState([]);
    const [products, setProducts] = useState([]);
    const [clientId, setClientId] = useState("");
    const [productId, setProductId] = useState("");
    const [quantity, setQuantity] = useState("");
    const [ details, setDetails ] = useState([]);
    const [data, setData] = useState([]);

        // CARGAR STORED PROCEDURE
        useEffect(()  => { // hace peticion al backend
            fetch("http://localhost:3000/api/sales/sp")
            .then((res) => res.json())
            .then((result) => setData(result)) //guarda la respuesta
            .catch((err) => console.error(err));
        }, []);


    // Cargar datos al inicio
    useEffect(() => {
        getSales().then(data => setSales(data));
        getClients().then(data => setClients(data));
        getProducts().then(data => setProducts(data));
    }, []);


    //  Agregar producto al detalle
    const addDetail = () => {
        setDetails([...details, { productId: "", quantity: 1 }]);
    };

    //  Actualizar detalle
    const updateDetail = (index, field, value) => {
        const newDetails = [...details];
        newDetails[index][field] = value;
        setDetails(newDetails);
    };

    //  Registrar venta
    const handleSubmit = async (e) => {
        e.preventDefault();
        const newSale = await addSale({
            clientId,
            details
        });
        setSales([...sales, newSale]);
        setClientId("");
        setDetails([]);
    };

    //  Eliminar venta
    const handleDelete = async (id) => {
        await deleteSale(id);
        setSales(sales.filter(s => s.id !== id));
    };


    return(
        <div className="ml-64 p-6"> {/* margen izquierdo para el navbar */}
    <section className="bg-white shadow rounded p-4">
    {/* Título arriba */}
    <h2 className="text-2xl font-bold text-center">
       DETALLE DE VENTAS
    </h2>
    <div className="flex justify-center mt-17">
        <table className="w-8/10 max-w-2xl border border-gray-300 rounded-lg shadow-md">
            <thead>
            <tr className="bg-[#005187] text-white">
                <th className="py-2 px-4 text-left">VentaId</th>
                <th className="py-2 px-4 text-left">Fecha venta</th>
                <th className="py-2 px-4 text-left">Total Venta</th>
                <th className="py-2 px-4 text-left">Cliente</th>
                <th className="py-2 px-4 text-left">Product_id</th>
                <th className="py-2 px-4 text-left">Producto</th>
                <th className="py-2 px-4 text-left">Cantidad</th>
                <th className="py-2 px-4 text-left">Precio Unidad</th>
                <th className="px-6 py-3 text-center text-sm font-semibold">Acciones</th>
            </tr>
            </thead>
            <tbody>
            {data.map((item, index) => (
                <tr key={index} className="border-t hover:bg-gray-50">
                <td className="py-2 px-4">{item.ventaId}</td>
                <td className="py-2 px-4">{item.sale_date}</td>
                <td className="py-2 px-4">{item.total}</td>
                <td className="py-2 px-4">{item.cliente}</td>
                <td className="py-2 px-4">{item.product_id}</td>
                <td className="py-2 px-4">{item.producto}</td>
                <td className="py-2 px-4">{item.quantity}</td>
                <td className="py-2 px-4">{item.price}</td>
                                             <td className="w-48 px-6 py-4 text-center">
                                <button className="px-7 py-3 text-sm font-semibold text-white bg-blue-600 rounded hover:bg-blue-700 transition">
                                    Editar
                                </button>
                                <button className="px-7 py-3 ml-3 text-sm font-semibold text-white bg-red-600 rounded hover:bg-red-700 transition">
                                    Eliminar
                                </button>
                                <button className="px-7 py-3 ml-3 text-sm font-semibold text-white bg-yellow-400 rounded hover:bg-yellow-500 transition">
                                    Generar factura
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


export default Sales;