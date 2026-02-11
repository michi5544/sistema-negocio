import { useEffect, useState } from "react";

function Reports(){
      const [ventas, setVentas] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3000/api/reportes/ventas")
      .then(res => res.json())
      .then(data => setVentas(data));
    fetch("http://localhost:3000/api/reportes/clientes")
      .then(res => res.json())
      .then(data => setClientes(data));
    fetch("http://localhost:3000/api/reportes/productos")
      .then(res => res.json())
      .then(data => setProductos(data));
  }, []);

    
    return (
      
    <div className="p-6 space-y-6 ml-64"> {/* margen izquierdo para el navbar */}
      <h1 className="text-2xl font-bold text-center">REPORTES</h1>

      {/* Cards resumen */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-[#FF692A] p-6 rounded-lg shadow-md text-center">
          <h3 className="text-white">VENTAS</h3>
          <p className="text-2xl font-bold">{ventas.length}</p>
        </div>
        <div className="bg-[#2D9966] p-6 rounded-lg shadow-md text-center">
          <h3 className="text-white">CLIENTES</h3>
          <p className="text-2xl font-bold">{clientes.length}</p>
        </div>
        <div className="bg-[#155DFC] p-6 rounded-lg shadow-md text-center">
          <h3 className="text-white">PRODUCTOS</h3>
          <p className="text-2xl font-bold">{productos.length}</p>
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
            {ventas.map((v, i) => (
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
    </div>
  );

}

export default Reports;