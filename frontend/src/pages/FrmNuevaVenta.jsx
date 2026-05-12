import { useState, useEffect, use } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { getSaleById, updateSale, addSale } from "../services/api";
import FactureModal from "../components/Facture";

function NuevaVenta() {
    const { id } = useParams(); // para obtener el ID de la venta a editar (si existe)
    const [clientes, setClientes] = useState([]);
    const [clienteId, setClienteId] = useState("");
    const [productoId, setProductoId] = useState("");
    const [productos, setProductos] = useState([]);
    const [cantidad, setCantidad] = useState(1);
    const [saleId, setSaleId] = useState(null); // para guardar el ID de la venta creada
   // const [sale, setSale] = useState(null);
    const [items, setItems] = useState([]); // lista de productos en la venta
    const [showConfirm, setShowConfirm] = useState(false); // estado para mostrar confirmación
    const [showModal, setShowModal] = useState(false); // estado para mostrar modal de factura
    const [saleGuardada, setSaleGuardada] = useState(null);
    const [showFactura, setShowFactura] = useState(false);
    const API_URL = import.meta.env.VITE_API_URL; // URL base del backend desde variables de entorno
    const navigate = useNavigate();
        const [selectedSale, setSelectedSale] = useState(null);
    // Función para obtener la fecha actual en formato YYYY-MM-DD
    const getToday = () => new Date().toISOString().split("T")[0];// formato YYYY-MM-DD
    const [fecha, setFecha] = useState(getToday()); // inicializa con la fecha actual
    const [sale, setSale] = useState({
      customer_id: "",
      user_id: 1,
      total: "",
      fecha: getToday(),
      SaleDetails: [] // lista de productos en la venta
    });
useEffect(() => {
  console.log("Venta cargada:", sale);
}, [sale]);



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

      useEffect(() => { // si hay ID, cargar datos de la venta para edición
        if (id) {
          getSaleById(id).then(data => {
            setSale(data); // guardas toda la venta
            setClienteId(data.customer_id); // precargas cliente
            setItems(data.SaleDetails.map(detail => ({
              productId: detail.product_id,
              quantity: detail.quantity
            }))); // precargas productos
            setFecha(data.sale_date); // si tu backend devuelve fecha
          });
        }
      }, [id]);

 

        // obtener venta por ID (para mostrar detalles después de registrar)

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
  if (id) {
    // modo edición
    try {
      const data = await updateSale({ ...sale, id });
      toast.success("Venta actualizada exitosamente ✅");
      navigate("/sales");
    } catch (error) {
      console.error(error);
      toast.error("Error al actualizar la venta");
    }
  } else {
    // modo creación
    try {
      const data = await addSale(sale);
      setSaleId(data.sale.id);
      setSaleGuardada(data.sale);
      toast.success("Venta registrada exitosamente ✅");
      setShowConfirm(true);
    } catch (error) {
      console.error(error);
      toast.error("Error al registrar la venta");
    }
  }

       
    };

    // Mostrar el modal de factura
    const handleShowInvoice = async (id) =>{
          try {
        const data = await getSaleById(id);
        setSelectedSale(data);
        setShowModal(true);
    } catch (error) {
        console.error(error);
        toast.error("Error al obtener los detalles de la venta");
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
              className="w-full border rounded px-3 py-2"
              required
            >
              <option value="">Seleccione un cliente</option>
              {clientes.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

                    {/* Fecha */}
          <div>
            <label className="block text-gray-700">Fecha Venta</label>
            <input
              type="date"
              value={fecha}
              readOnly
              className="w-full border rounded px-3 py-2"
            />
          </div>

{/* Agregar producto */}
          <div className="flex gap-2 items-center">
            <select
              value={productoId}
              onChange={(e) => setProductoId(e.target.value)}
              className="border rounded px-3 py-2 flex-1"
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
              onClick={() => handleShowInvoice(saleGuardada.id)}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              Sí
            </button>

            <FactureModal 
  sale={saleGuardada} 
  show={showModal} 
  onClose={() => setShowModal(false)} 
/>

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