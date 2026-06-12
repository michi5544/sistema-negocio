import { useEffect, useState } from "react";

function Reports(){
  const [getSales, setSales] = useState([]);
  const [getProduct, setProduct] = useState(0);
  const [getTotalClientes, setgetTotalClientes] = useState(0);

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetch(`${API_URL}/sales/`)
      .then(res => res.json())
      .then(data => setSales(data));
    fetch(`${API_URL}/products/`)
      .then(res => res.json())
      .then(data => setProduct(data.length));
    fetch(`${API_URL}/customers/`)
      .then(res => res.json())
      .then(data => setgetTotalClientes(data.length))
      .catch(err => console.error(err));
  }, []);

  const getTotalVentas = () => {
    return getSales.reduce((total, v) => total + v.total, 0);
  } 

    
    return (
<section>
      <h1 className="text-2xl font-bold text-center">REPORTES</h1>

      {/* Cards resumen */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-[#FF692A] p-6 rounded-lg shadow-md text-center">
          <h3 className="text-white">VENTAS</h3>
          <p className="text-2xl font-bold">{getSales.length}</p>
        </div>
        <div className="bg-[#2D9966] p-6 rounded-lg shadow-md text-center">
          <h3 className="text-white">CLIENTES</h3>
          <p className="text-2xl font-bold">{getTotalClientes}</p>
        </div>
        <div className="bg-[#155DFC] p-6 rounded-lg shadow-md text-center">
          <h3 className="text-white">PRODUCTOS</h3>
          <p className="text-2xl font-bold">{getProduct}</p>
        </div>
      </div>

      {/* Tabla detalle ventas */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">Detalle de Ventas</h2>
        <table className="min-w-full border">
          <thead>
            <tr className="bg-gray-200 text-gray-700">
              <th className="py-2 px-4">Cliente</th>
              <th className="py-2 px-4">Producto</th>
              <th className="py-2 px-4">Cantidad</th>
              <th className="py-2 px-4">Total</th>
            </tr>
          </thead>
            <tbody>
            {getSales.map((v, i) => (
              <tr key={i} className="border-t hover:bg-gray-50">
                <td className="py-2 px-4">{v.cliente}</td>
                <td className="py-2 px-4">{v.producto}</td>
                <td className="py-2 px-4">{v.cantidad}</td>
                <td className="py-2 px-4">{v.total}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
</section>
  );

}

export default Reports;