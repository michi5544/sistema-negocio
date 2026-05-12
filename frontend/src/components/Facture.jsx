import { jsPDF } from "jspdf";
import "jspdf-autotable";
import React from "react";
import autoTable from "jspdf-autotable";


export default function FactureModal({ sale, show, onClose }) {
    
 
    if (!show || !sale) return null;

  const handleDownload = () => {
    const doc = new jsPDF();

    doc.text(`Factura #${sale.id}`, 10, 10);
    doc.text(`Cliente: ${sale.Customer?.name}`, 10, 20);
    doc.text(`Fecha: ${sale.fecha}`, 10, 30);

    autoTable(doc, {
      startY: 40,
      head: [["Producto", "Cantidad", "Precio"]],
      body: sale.SaleDetails.map(det => [
        det.Product?.name,
        det.quantity,
        det.price,
      ]),
    });

    const finalY = doc.lastAutoTable.finalY || 50;
    doc.text(`Total: ${sale.total}`, 10, finalY + 10);

    doc.save(`factura_${sale.id}.pdf`);
    }

    return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-11/12 max-w-5xl">
        <h2 className="text-xl font-bold mb-4">Factura #{sale.id}</h2>

        <table className="w-full border mb-4">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2">Producto</th>
              <th className="p-2">Cantidad</th>
              <th className="p-2">Precio</th>
              <th className="p-2">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {sale.SaleDetails.map(det => (
              <tr key={det.id}>
                <td className="p-2">{det.Product?.name}</td>
                <td className="p-2">{det.quantity}</td>
                <td className="p-2">${det.price}</td>
                <td className="p-2">
                  ${parseFloat(det.price) * det.quantity}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <p className="font-semibold">Total: ${sale.total}</p>

        <div className="mt-6 flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Cerrar
          </button>
          <button
            onClick={handleDownload}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Descargar PDF
          </button>
         <button
                onClick={() => {
                  setShowModal(false);
                  navigate("/sales");
                }}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                Ir al listado
        </button>
        </div>
      </div>
    </div>
  );
}
