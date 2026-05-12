import { useState, useEffect } from "react";
import { getSales, addSale, deleteSale } from "../services/api";
import { getClients, getProducts, getSaleById } from "../services/api";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { Result } from "postcss";
import {jsPDF} from "jspdf";
import autoTable from "jspdf-autotable";
import FactureModal from "../components/Facture";

function Sales(){
    const navigate = useNavigate();
    const [sales, setSales] = useState([]);
    const [clients, setClients] = useState([]);
    const [products, setProducts] = useState([]);
    const [clientId, setClientId] = useState("");
    const [productId, setProductId] = useState("");
    const [quantity, setQuantity] = useState("");
    const [ details, setDetails ] = useState([]);
    const [data, setData] = useState([]);
    const [invoice, setInvoice] = useState(null); // estado para almacenar datos de la factura
    const [showModal, setShowModal] = useState(false); // estado para mostrar modal de factura
    const [pdfUrl, setPdfUrl] = useState(null); // estado para almacenar URL del PDF generado
    const [selectedSale, setSelectedSale] = useState(null);
    //const [showModal, setShowModal] = useState(false);
    const API_URL = import.meta.env.VITE_API_URL;

    const generatePDF = (sale) => {
        const doc = new jsPDF();
        doc.text(`Factura #${sale.id}`, 10, 10);
        doc.autoTable({
            head: [['Producto', 'Cantidad', 'Precio']],
            body: sale.SaleDetails.map(det => [det.Product?.name || "N/A", det.quantity, det.price]),
        });

        const blob = doc.output("blob");
        const url = URL.createObjectURL(blob);
        setPdfUrl(url);
    } 
 

    const handleEdit = (id) => {
        navigate(`/ventas/editar/${id}`); //redirige al formulario con el id
    }  
        // CARGAR STORED PROCEDURE
        useEffect(()  => { // hace peticion al backend
            fetchSales();
        }, []);
  
const handleFacture = async (id) => {
    try {
        const data = await getSaleById(id);
        setSelectedSale(data);
        setShowModal(true);
    } catch (error) {
        console.error(error);
        toast.error("Error al obtener los detalles de la venta");
    }
  }

        {/*
            // ARMANDO PDF VISTA PREVIA 
    const handleFacture = async (id) => {
      try{
    const data = await getSaleById(id);
    setInvoice(data);

    const doc = new jsPDF();

    // Texto arriba
    doc.setFontSize(14);
    doc.text(`Factura #${data.id}`, 10, 10);
    doc.text(`Cliente: ${data.Customer?.name || "N/A"}`, 10, 20);
    doc.text(`Fecha: ${data.fecha}`, 10, 30);

    

    // Tabla más abajo
    autoTable(doc, {
      startY: 50, // asegura que la tabla arranque debajo del texto
      head: [["Producto", "Cantidad", "Precio"]],
      body: data.SaleDetails.map(det => [
        det.Product?.name || "N/A",
        det.quantity,
        det.price,
      ]),
    });

    // Total debajo de la tabla
    const finalY = doc.lastAutoTable.finalY || 60;
    doc.text(`Total: ${data.total}`, 10, finalY + 10);

    // Generar blob para vista previa
    const blob = doc.output("blob");
    const url = URL.createObjectURL(blob);
    setPdfUrl(url);

    setShowModal(true);

       // doc.save(`factura_${data.id}.pdf`);
  } catch (error) {
    console.error(error);
    toast.error("Error al obtener los detalles de la venta");
  }
};
  */}


    // Cargar datos al inicio
    useEffect(() => {
        getSales().then(data => setSales(data));
        getClients().then(data => setClients(data));
        getProducts().then(data => setProducts(data));
    }, []);

const fetchSales = async () => {
  try {
    const res = await fetch(`${API_URL}/sales/sp`);
    const result = await res.json();
    setData(result);
  } catch (err) {
    console.error("Error al cargar ventas:", err);
  }
};

    //  Agregar producto al detalle
    const addDetail = () => {
        setDetails([...details, { productId: "", quantity: 1 }]);
    };


    //  Eliminar venta
    const handleDelete = async (id) => {
        try{
            await deleteSale(id);
            setSales(sales.filter(s => s.id !== id));
            toast.info("Venta eliminada con éxito ✅");
            fetchSales(); // recarga la lista de ventas después de eliminar
        } catch (error) {
            console.error("Error al eliminar la venta:", error);
        }

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
                                <button 
                                onClick={() => handleEdit(item.ventaId)}
                                className="px-7 py-3 text-sm font-semibold text-white bg-blue-600 rounded hover:bg-blue-700 transition">
                                    Editar
                                </button>
                                <button 
                                onClick={() => handleDelete(item.ventaId)}
                                className="px-7 py-3 ml-3 text-sm font-semibold text-white bg-red-600 rounded hover:bg-red-700 transition">
                                    Eliminar
                                </button>
                                <button 
                                onClick={() => handleFacture(item.ventaId)}
                                className="px-7 py-3 ml-3 text-sm font-semibold text-white bg-yellow-400 rounded hover:bg-yellow-500 transition">
                                    Generar factura
                                </button>

                                <FactureModal 
                                    sale={selectedSale} 
                                    show={showModal} 
                                    onClose={() => setShowModal(false)} 
                                  />

                            </td>
                </tr>
            ))}
            </tbody>

        </table>

    </div>
    </section>
        

    </div>);

}


export default Sales;