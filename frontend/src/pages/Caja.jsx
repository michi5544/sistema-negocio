import { useState, useEffect } from "react";
import { getCajaActual, abrirCaja, cerrarCaja, getSales } from "../services/api";
import { toast } from "react-toastify";

function fmt(dt) {
  if (!dt) return "";
  return new Date(dt).toLocaleString("es-SV", {
    year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit"
  });
}

export default function Caja() {
  const [caja, setCaja] = useState(null);
  const [loading, setLoading] = useState(true);
  const [montoInicial, setMontoInicial] = useState("");
  const [montoFinal, setMontoFinal] = useState("");
  const [ventasTurno, setVentasTurno] = useState([]);
  const [confirmar, setConfirmar] = useState(false);

  const cargar = async () => {
    setLoading(true);
    try {
      const { caja: cajaActual } = await getCajaActual();
      setCaja(cajaActual || null);
      if (cajaActual) {
        const ventas = await getSales(cajaActual.fecha_apertura);
        setVentasTurno(Array.isArray(ventas) ? ventas : []);
      } else {
        setVentasTurno([]);
      }
    } catch {
      toast.error("Error al cargar el estado de la caja");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { cargar(); }, []);

  const handleAbrir = async (e) => {
    e.preventDefault();
    const monto = parseFloat(montoInicial);
    if (isNaN(monto) || monto < 0) { toast.error("Ingrese un monto inicial válido"); return; }
    try {
      await abrirCaja(monto);
      toast.success("Caja abierta");
      setMontoInicial("");
      cargar();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleCerrar = async () => {
    const monto = parseFloat(montoFinal);
    if (isNaN(monto) || monto < 0) { toast.error("Ingrese el monto contado en caja"); return; }
    if (Math.abs(monto - esperado) > 0.01) {
      toast.error(`El monto contado no coincide con el esperado (S/ ${esperado.toFixed(2)})`);
      setConfirmar(false);
      return;
    }
    try {
      await cerrarCaja(monto);
      toast.success("Caja cerrada exitosamente");
      setConfirmar(false);
      setMontoFinal("");
      cargar();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const totalVentas = ventasTurno.reduce((s, v) => s + parseFloat(v.total || 0), 0);
  const esperado = caja ? parseFloat(caja.monto_inicial) + totalVentas : 0;
  const diferencia = montoFinal !== "" ? parseFloat(montoFinal) - esperado : null;

  if (loading) return <p className="text-center mt-10 text-gray-500">Cargando estado de caja...</p>;

  return (
    <section className="space-y-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800">Caja</h1>

      {!caja ? (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center gap-3 mb-4">
            <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-semibold">
              Caja Cerrada
            </span>
          </div>
          <p className="text-gray-600 mb-5">
            No hay caja abierta. Registre el monto inicial para iniciar el turno.
          </p>
          <form onSubmit={handleAbrir} className="flex gap-3 items-end flex-wrap">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Monto inicial ($)</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={montoInicial}
                onChange={(e) => setMontoInicial(e.target.value)}
                placeholder="0.00"
                className="border rounded px-3 py-2 w-40"
                required
              />
            </div>
            <button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded font-medium"
            >
              Abrir Caja
            </button>
          </form>
        </div>
      ) : (
        <>
          {/* Estado y resumen */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
              <div className="flex items-center gap-3">
                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">
                  Caja Abierta
                </span>
                <span className="text-sm text-gray-500">Desde {fmt(caja.fecha_apertura)}</span>
              </div>
              <span className="text-sm text-gray-500">
                Apertura por: <strong>{caja.UsuarioApertura?.name ?? `Usuario #${caja.id_usuario_apertura}`}</strong>
              </span>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
                <p className="text-xs text-blue-600 uppercase font-semibold mb-1">Monto Inicial</p>
                <p className="text-2xl font-bold text-blue-800">${parseFloat(caja.monto_inicial).toFixed(2)}</p>
              </div>
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 text-center">
                <p className="text-xs text-orange-600 uppercase font-semibold mb-1">Ventas del turno</p>
                <p className="text-2xl font-bold text-orange-800">{ventasTurno.length}</p>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                <p className="text-xs text-green-600 uppercase font-semibold mb-1">Total vendido</p>
                <p className="text-2xl font-bold text-green-800">${totalVentas.toFixed(2)}</p>
              </div>
            </div>

            {ventasTurno.length > 0 ? (
              <div>
                <h3 className="text-sm font-semibold text-gray-600 uppercase mb-3">Detalle de ventas del turno</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm border rounded">
                    <thead>
                      <tr className="bg-gray-100 text-gray-700">
                        <th className="py-2 px-3 text-left">Venta #</th>
                        <th className="py-2 px-3 text-left">Fecha y hora</th>
                        <th className="py-2 px-3 text-left">Cliente</th>
                        <th className="py-2 px-3 text-right">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {ventasTurno.map((v) => (
                        <tr key={v.id} className="border-t hover:bg-gray-50">
                          <td className="py-2 px-3">#{v.id}</td>
                          <td className="py-2 px-3">{fmt(v.sale_date)}</td>
                          <td className="py-2 px-3">{v.Customer?.name ?? "N/A"}</td>
                          <td className="py-2 px-3 text-right font-medium">${parseFloat(v.total || 0).toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="bg-gray-50 font-semibold border-t-2">
                        <td colSpan={3} className="py-2 px-3 text-right text-gray-600">Total:</td>
                        <td className="py-2 px-3 text-right text-green-700">${totalVentas.toFixed(2)}</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            ) : (
              <p className="text-gray-400 text-sm text-center py-4">Sin ventas registradas en este turno.</p>
            )}
          </div>

          {/* Cierre de caja */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Cierre de Caja</h2>
            <div className="max-w-sm space-y-3">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Monto inicial:</span>
                <span className="font-medium">${parseFloat(caja.monto_inicial).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Total ventas del turno:</span>
                <span className="font-medium">${totalVentas.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm font-semibold border-t pt-2">
                <span>Esperado en caja:</span>
                <span>${esperado.toFixed(2)}</span>
              </div>
              <div className="pt-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Monto contado en caja ($)
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={montoFinal}
                  onChange={(e) => setMontoFinal(e.target.value)}
                  placeholder="0.00"
                  className="border rounded px-3 py-2 w-full"
                />
              </div>
              {diferencia !== null && (
                <div className={`flex justify-between text-sm font-bold border-t pt-2 ${diferencia >= 0 ? "text-green-700" : "text-red-700"}`}>
                  <span>Diferencia:</span>
                  <span>{diferencia >= 0 ? "+" : ""}{diferencia.toFixed(2)}</span>
                </div>
              )}
              <button
                onClick={() => {
                  if (!montoFinal) { toast.error("Ingrese el monto contado en caja"); return; }
                  const contado = parseFloat(montoFinal);
                  if (Math.abs(contado - esperado) > 0.01) {
                    toast.error(`El monto contado (S/ ${contado.toFixed(2)}) no coincide con el esperado (S/ ${esperado.toFixed(2)}). Corrija el monto antes de cerrar.`);
                    return;
                  }
                  setConfirmar(true);
                }}
                className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded font-medium mt-1"
              >
                Cerrar Caja
              </button>
            </div>
          </div>
        </>
      )}

      {/* Modal de confirmación de cierre */}
      {confirmar && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-80 shadow-xl">
            <h3 className="text-lg font-bold mb-3">¿Cerrar la caja?</h3>
            <div className="space-y-1 text-sm text-gray-600 mb-4">
              <div className="flex justify-between"><span>Monto inicial:</span><span>${parseFloat(caja.monto_inicial).toFixed(2)}</span></div>
              <div className="flex justify-between"><span>Total ventas:</span><span>${totalVentas.toFixed(2)}</span></div>
              <div className="flex justify-between"><span>Esperado:</span><span>${esperado.toFixed(2)}</span></div>
              <div className="flex justify-between"><span>Contado:</span><span>${parseFloat(montoFinal).toFixed(2)}</span></div>
              {diferencia !== null && (
                <div className={`flex justify-between font-bold pt-1 border-t ${diferencia >= 0 ? "text-green-700" : "text-red-700"}`}>
                  <span>Diferencia:</span>
                  <span>{diferencia >= 0 ? "+" : ""}{diferencia.toFixed(2)}</span>
                </div>
              )}
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleCerrar}
                className="flex-1 bg-red-600 text-white py-2 rounded hover:bg-red-700 font-medium"
              >
                Confirmar cierre
              </button>
              <button
                onClick={() => setConfirmar(false)}
                className="flex-1 bg-gray-200 text-gray-700 py-2 rounded hover:bg-gray-300"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
