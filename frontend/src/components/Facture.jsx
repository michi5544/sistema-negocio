import { useEffect, useState, useCallback, useRef } from "react";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { useAuth } from "../context/AuthContext";

// Datos de la empresa — editar aquí
const EMPRESA = {
    nombre: "NOMBRE DE LA EMPRESA",
    ruc: "80000000008",
    direccion: "Dirección de la empresa, Ciudad",
    email: "correo@empresa.com",
    telefono: "00000000",
};

export default function FactureModal({ sale, show, onClose, pagoInfo }) {
    const { user } = useAuth();
    const [vista, setVista] = useState("detalles"); // 'detalles' | 'ticket'
    const [ticketHTML, setTicketHTML] = useState("");
    const iframeRef = useRef(null);

    // Valores derivados — con optional chaining para ser seguros antes del early return
    const fechaMostrar = sale?.sale_date || sale?.fecha || "";
    const total = parseFloat(sale?.total ?? 0);
    const pagado = pagoInfo?.pagado ?? total;
    const vuelto = pagoInfo?.vuelto ?? Math.max(0, pagado - total);
    const cliente = sale?.Customer ?? null;
    const vendedor = user?.name || user?.email || "N/A";

    useEffect(() => {
        const handleEsc = (e) => { if (e.key === "Escape") onClose(); };
        if (show) document.addEventListener("keydown", handleEsc);
        return () => document.removeEventListener("keydown", handleEsc);
    }, [show, onClose]);

    useEffect(() => {
        if (!show) {
            setVista("detalles");
            setTicketHTML("");
        }
    }, [show]);

    // Genera HTML del ticket para la vista previa en iframe (srcdoc)
    const generarTicketHTML = useCallback(() => {
        if (!sale?.SaleDetails) return "";

        const now = new Date();
        const fechaEmision =
            fechaMostrar ||
            `${now.toLocaleDateString("es-SV")} / ${now.toLocaleTimeString("es-SV")}`;

        const filas = sale.SaleDetails.map((det) => `
            <tr>
                <td class="tc">${det.product_id ?? det.Product?.id ?? ""}</td>
                <td class="tc">${det.quantity}</td>
                <td class="tc">NIU</td>
                <td>${det.Product?.name ?? "N/A"}</td>
                <td class="tr">$${parseFloat(det.price).toFixed(2)}</td>
                <td class="tr">$${(parseFloat(det.price) * det.quantity).toFixed(2)}</td>
            </tr>`
        ).join("");

        return `<!DOCTYPE html><html><head><meta charset="UTF-8">
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:Arial,sans-serif;font-size:11px;background:#e5e7eb;padding:16px}
.page{background:#fff;max-width:580px;margin:0 auto;padding:28px 32px;box-shadow:0 2px 12px rgba(0,0,0,.15);min-height:calc(100vh - 32px)}
.head{text-align:center;margin-bottom:14px}
.nombre{font-size:15px;font-weight:bold;color:#111;margin-bottom:4px}
.info{font-size:10px;color:#555;line-height:1.7}
.divider{border:none;border-top:1px dashed #aaa;margin:12px 0}
.tipo{text-align:center;font-size:13px;font-weight:bold;margin-bottom:3px}
.num{text-align:center;font-size:11px;color:#444;margin-bottom:10px}
.datos{font-size:10.5px;line-height:2;margin-bottom:14px}
.datos .lbl{display:inline-block;width:78px;font-weight:600;color:#333}
table{width:100%;border-collapse:collapse;font-size:10px}
thead th{background:#005187;color:#fff;padding:6px 5px;font-weight:700}
tbody td{padding:5px 5px;border-bottom:1px solid #eee}
tbody tr:nth-child(even){background:#f8fafc}
.tc{text-align:center}.tr{text-align:right}
.totales{margin-top:14px}
.trow{display:flex;justify-content:flex-end;padding:2px 0}
.tlbl{font-size:11px;color:#555;margin-right:24px}
.tval{font-size:11px;min-width:72px;text-align:right}
.tbig{font-size:14px;font-weight:bold;color:#005187}
.gracias{text-align:center;margin-top:18px;font-size:10px;color:#888;font-style:italic}
</style></head><body>
<div class="page">
  <div class="head">
    <div class="nombre">${EMPRESA.nombre}</div>
    <div class="info">
      ${EMPRESA.ruc ? `RUC ${EMPRESA.ruc}<br>` : ""}
      ${EMPRESA.direccion ? `${EMPRESA.direccion}<br>` : ""}
      ${EMPRESA.email ? `${EMPRESA.email}<br>` : ""}
      ${EMPRESA.telefono || ""}
    </div>
  </div>
  <hr class="divider">
  <div class="tipo">NOTA DE VENTA</div>
  <div class="num">NV01-${String(sale.id).padStart(8, "0")}</div>
  <hr class="divider">
  <div class="datos">
    <div><span class="lbl">F. Emisión:</span>${fechaEmision}</div>
    <div><span class="lbl">Cliente:</span>${cliente?.name ?? "Consumidor Final"}</div>
    ${cliente?.email ? `<div><span class="lbl">DNI/Doc.:</span>${cliente.email}</div>` : ""}
    ${cliente?.address ? `<div><span class="lbl">Dirección:</span>${cliente.address}</div>` : ""}
    ${cliente?.phone ? `<div><span class="lbl">Teléfono:</span>${cliente.phone}</div>` : ""}
    <div><span class="lbl">Vendedor:</span>${vendedor}</div>
  </div>
  <table>
    <thead>
      <tr>
        <th>Cód.</th><th>Cant.</th><th>Unidad</th>
        <th>Descripción</th><th class="tr">P.Unit</th><th class="tr">Total</th>
      </tr>
    </thead>
    <tbody>${filas}</tbody>
  </table>
  <hr class="divider" style="margin-top:14px">
  <div class="totales">
    <div class="trow"><span class="tlbl tbig">TOTAL</span><span class="tval tbig">$${total.toFixed(2)}</span></div>
    <div class="trow"><span class="tlbl">Pagado</span><span class="tval">$${pagado.toFixed(2)}</span></div>
    <div class="trow"><span class="tlbl">Cambio</span>
      <span class="tval" style="color:${vuelto > 0 ? "#f97316" : "#555"}">$${vuelto.toFixed(2)}</span>
    </div>
  </div>
  <hr class="divider" style="margin-top:14px">
  <div class="gracias">¡Gracias por su compra!</div>
</div>
</body></html>`;
    }, [sale, cliente, vendedor, fechaMostrar, total, pagado, vuelto]);

    // Genera PDF A4 para descarga con jsPDF
    const generarPDFA4 = useCallback(() => {
        if (!sale?.SaleDetails) return;
        const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
        const pw = doc.internal.pageSize.getWidth();
        let y = 18;

        doc.setFontSize(13); doc.setFont(undefined, "bold");
        doc.text(EMPRESA.nombre, pw / 2, y, { align: "center" }); y += 6;
        doc.setFontSize(9); doc.setFont(undefined, "normal");
        if (EMPRESA.ruc)      { doc.text(`RUC ${EMPRESA.ruc}`,  pw / 2, y, { align: "center" }); y += 4.5; }
        if (EMPRESA.direccion){ doc.text(EMPRESA.direccion,      pw / 2, y, { align: "center" }); y += 4.5; }
        if (EMPRESA.email)    { doc.text(EMPRESA.email,          pw / 2, y, { align: "center" }); y += 4.5; }
        if (EMPRESA.telefono) { doc.text(EMPRESA.telefono,       pw / 2, y, { align: "center" }); y += 4.5; }
        y += 3;
        doc.setLineWidth(0.3); doc.line(14, y, pw - 14, y); y += 6;
        doc.setFontSize(12); doc.setFont(undefined, "bold");
        doc.text("NOTA DE VENTA", pw / 2, y, { align: "center" }); y += 6;
        doc.text(`NV01-${String(sale.id).padStart(8, "0")}`, pw / 2, y, { align: "center" }); y += 5;
        doc.line(14, y, pw - 14, y); y += 6;

        const now = new Date();
        const fechaEmision = fechaMostrar || `${now.toLocaleDateString("es-SV")} / ${now.toLocaleTimeString("es-SV")}`;
        doc.setFontSize(9); doc.setFont(undefined, "normal");
        doc.text(`F. Emisión: ${fechaEmision}`, 14, y); y += 5;
        doc.text(`Cliente:    ${cliente?.name ?? "Consumidor Final"}`, 14, y); y += 5;
        if (cliente?.email)   { doc.text(`DNI/Doc.:   ${cliente.email}`,   14, y); y += 5; }
        if (cliente?.address) { doc.text(`Dirección:  ${cliente.address}`, 14, y); y += 5; }
        if (cliente?.phone)   { doc.text(`Teléfono:   ${cliente.phone}`,   14, y); y += 5; }
        doc.text(`Vendedor:   ${vendedor}`, 14, y); y += 6;

        autoTable(doc, {
            startY: y,
            head: [["Cód.", "Cant.", "Unidad", "Descripción", "P.Unit", "Total"]],
            body: sale.SaleDetails.map((det) => [
                det.product_id ?? det.Product?.id ?? "",
                det.quantity, "NIU",
                det.Product?.name ?? "N/A",
                `$${parseFloat(det.price).toFixed(2)}`,
                `$${(parseFloat(det.price) * det.quantity).toFixed(2)}`,
            ]),
            headStyles: { fillColor: [0, 81, 135], fontSize: 8, fontStyle: "bold" },
            bodyStyles: { fontSize: 8 },
            columnStyles: {
                0: { cellWidth: 12, halign: "center" }, 1: { cellWidth: 12, halign: "center" },
                2: { cellWidth: 14, halign: "center" }, 3: { cellWidth: 90 },
                4: { cellWidth: 22, halign: "right" },  5: { cellWidth: 22, halign: "right" },
            },
            margin: { left: 14, right: 14 },
        });

        const fy = doc.lastAutoTable?.finalY ?? y + 30;
        doc.line(14, fy + 3, pw - 14, fy + 3);
        doc.setFont(undefined, "bold"); doc.setFontSize(11);
        doc.text(`TOTAL:   $${total.toFixed(2)}`, pw - 14, fy + 10, { align: "right" });
        doc.setFont(undefined, "normal"); doc.setFontSize(9);
        doc.text(`Pagado:  $${pagado.toFixed(2)}`, pw - 14, fy + 17, { align: "right" });
        doc.text(`Cambio:  $${vuelto.toFixed(2)}`, pw - 14, fy + 23, { align: "right" });
        doc.line(14, fy + 28, pw - 14, fy + 28);
        doc.setFontSize(9);
        doc.text("¡Gracias por su compra!", pw / 2, fy + 35, { align: "center" });
        doc.save(`recibo_${sale.id}.pdf`);
    }, [sale, cliente, vendedor, fechaMostrar, total, pagado, vuelto]);

    // Early return DESPUÉS de todos los hooks
    if (!show || !sale || !sale.SaleDetails) return null;

    // ── Handlers ─────────────────────────────────────────────────────────────

    const handleVerTicket = () => {
        setTicketHTML(generarTicketHTML());
        setVista("ticket");
    };

    const handleImprimir = () => {
        if (iframeRef.current?.contentWindow) {
            iframeRef.current.contentWindow.print();
        } else {
            handleVerTicket();
        }
    };

    const handleWhatsApp = () => {
        const detalles = sale.SaleDetails.map(
            (d) => `• ${d.Product?.name ?? "N/A"} x${d.quantity} = $${(d.quantity * parseFloat(d.price)).toFixed(2)}`
        ).join("\n");
        const msg = [
            `*Recibo de Venta #${sale.id}*`,
            `Cliente: ${cliente?.name ?? "Consumidor Final"}`,
            fechaMostrar ? `Fecha: ${fechaMostrar}` : "",
            "", detalles, "",
            `*Total: $${total.toFixed(2)}*`,
            `Pagado: $${pagado.toFixed(2)}`,
            `Cambio: $${vuelto.toFixed(2)}`,
        ].filter(Boolean).join("\n");
        window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, "_blank");
    };

    // ── Render ────────────────────────────────────────────────────────────────

    return (
        <div
            className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
            onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
            <div
                className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl flex flex-col overflow-hidden"
                style={{ height: "90vh" }}
            >
                {/* Header */}
                <div className="bg-[#005187] text-white px-6 py-4 flex items-center justify-between flex-shrink-0">
                    <div className="flex items-center gap-3">
                        <span className="text-2xl">📄</span>
                        <div>
                            <h2 className="text-lg font-bold leading-tight">Recibo de Venta</h2>
                            <p className="text-blue-200 text-xs">Comprobante generado exitosamente</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-white hover:text-blue-200 text-2xl leading-none w-9 h-9 flex items-center justify-center rounded-full hover:bg-blue-900 transition"
                    >
                        ✕
                    </button>
                </div>

                {/* Body */}
                <div className="flex flex-1 overflow-hidden">

                    {/* Panel izquierdo */}
                    <div className="w-56 flex-shrink-0 border-r bg-gray-50 p-5 flex flex-col gap-5 overflow-y-auto">

                        {/* Resumen de Pago */}
                        <div>
                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                                💲 Resumen de Pago
                            </p>
                            <div className="bg-white rounded-xl border p-4 space-y-2">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm font-bold text-gray-800">Total</span>
                                    <span className="text-green-600 font-bold text-lg">${total.toFixed(2)}</span>
                                </div>
                                <div className="border-t pt-2 flex justify-between text-sm text-gray-500">
                                    <span>Pagado</span>
                                    <span className="font-medium text-gray-700">${pagado.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Vuelto</span>
                                    <span className={`font-semibold ${vuelto > 0 ? "text-orange-500" : "text-gray-600"}`}>
                                        ${vuelto.toFixed(2)}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Acciones */}
                        <div>
                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                                🎛 Acciones
                            </p>

                            {vista === "detalles" ? (
                                <div className="space-y-2">
                                    <button onClick={handleImprimir}
                                        className="w-full py-2.5 px-3 rounded-lg border border-gray-300 bg-white hover:bg-gray-100 text-sm font-medium text-gray-700 flex items-center gap-2 transition">
                                        🖨 Volver a imprimir
                                    </button>
                                    <button onClick={handleVerTicket}
                                        className="w-full py-2.5 px-3 rounded-lg bg-[#005187] hover:bg-blue-900 text-white text-sm font-semibold flex items-center gap-2 transition">
                                        🧾 Ver Ticket - POS
                                    </button>
                                    <button onClick={generarPDFA4}
                                        className="w-full py-2.5 px-3 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm font-semibold flex items-center gap-2 transition">
                                        📄 Ver PDF - A4
                                    </button>
                                    <button onClick={handleWhatsApp}
                                        className="w-full py-2.5 px-3 rounded-lg bg-green-500 hover:bg-green-600 text-white text-sm font-semibold flex items-center gap-2 transition">
                                        💬 Enviar por WhatsApp
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    <button onClick={() => setVista("detalles")}
                                        className="w-full py-2.5 px-3 rounded-lg border border-gray-300 bg-white hover:bg-gray-100 text-sm font-medium text-gray-700 flex items-center gap-2 transition">
                                        ‹ Ver Detalles
                                    </button>
                                    <button onClick={handleImprimir}
                                        className="w-full py-2.5 px-3 rounded-lg bg-[#005187] hover:bg-blue-900 text-white text-sm font-semibold flex items-center gap-2 transition">
                                        🖨 Imprimir Ticket
                                    </button>
                                    <button onClick={generarPDFA4}
                                        className="w-full py-2.5 px-3 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm font-semibold flex items-center gap-2 transition">
                                        📄 Guardar PDF
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Panel derecho */}
                    {vista === "detalles" ? (
                        <div className="flex-1 overflow-y-auto p-5">
                            {/* Datos del cliente */}
                            <div className="border rounded-xl p-4 mb-4">
                                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                                    👤 Datos del Cliente
                                </p>
                                <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
                                    <div>
                                        <p className="text-xs text-gray-400 mb-0.5">Nombre:</p>
                                        <p className="text-gray-800 font-medium">{cliente?.name ?? "Consumidor Final"}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-400 mb-0.5">Documento:</p>
                                        <p className="text-gray-800">{cliente?.email ?? "—"}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-400 mb-0.5">Dirección:</p>
                                        <p className="text-gray-800">{cliente?.address ?? "—"}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-400 mb-0.5">Teléfono:</p>
                                        <p className="text-gray-800">{cliente?.phone ?? "—"}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Tabla productos */}
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="bg-[#005187] text-white">
                                        <th className="px-4 py-3 text-left font-semibold rounded-tl-lg">Producto</th>
                                        <th className="px-4 py-3 text-center font-semibold">Cant.</th>
                                        <th className="px-4 py-3 text-right font-semibold rounded-tr-lg">Subtotal</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {sale.SaleDetails.map((det, i) => (
                                        <tr key={det.id ?? i} className="border-b hover:bg-gray-50 transition-colors">
                                            <td className="px-4 py-3 text-gray-800">{det.Product?.name ?? "N/A"}</td>
                                            <td className="px-4 py-3 text-center">
                                                <span className="inline-block bg-green-100 text-green-800 text-xs font-bold px-2 py-0.5 rounded-full min-w-[24px] text-center">
                                                    {det.quantity}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-right font-semibold text-gray-800">
                                                ${(parseFloat(det.price) * det.quantity).toFixed(2)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        /* Vista previa del ticket como HTML en iframe con srcdoc */
                        <div className="flex-1 bg-gray-300 overflow-hidden">
                            <iframe
                                ref={iframeRef}
                                srcdoc={ticketHTML}
                                title="Vista previa Ticket POS"
                                sandbox="allow-same-origin allow-scripts allow-modals"
                                style={{ width: "100%", height: "100%", border: "none", display: "block" }}
                            />
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="border-t bg-gray-50 px-6 py-3 flex items-center justify-between flex-shrink-0">
                    <span className="text-green-600 flex items-center gap-1 text-xs">
                        ✅ Venta registrada exitosamente
                    </span>
                    <div className="flex items-center gap-3 text-gray-500 text-xs">
                        <span>
                            Presiona{" "}
                            <kbd className="bg-gray-200 text-gray-600 px-1.5 py-0.5 rounded font-mono">ESC</kbd>{" "}
                            para cerrar
                        </span>
                        <button onClick={onClose} className="text-gray-700 hover:text-gray-900 font-semibold transition">
                            Cerrar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
