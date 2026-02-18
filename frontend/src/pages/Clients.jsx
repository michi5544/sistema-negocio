//  PAGINA CRUD DE CLIENTES
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {getClients, addClient, updateClient, deleteClient} from "../services/api.js";
import FrmNuevoCliente from "./FrmNuevoCliente.jsx";
import NuevoCliente from "./FrmNuevoCliente.jsx";

function Clients(){
    const API_URL = import.meta.env.VITE_API_URL;
    const navigate = useNavigate();
    const [clients, setClients] = useState([]);
    const [name, setName] = useState("");
    const [editingClient, setEditingClient] = useState(null);
    const [successsMessage, setsuccesssMessage] = useState("");

    const handleEdit = (id) => {
        navigate(`/clientes/editar/${id}`); //redirige al formulario con el id
    }

    //Cargar clientes al inicio
    useEffect(() => {
        fetch(`${API_URL}/customers`)
        .then(res => res.json())
        .then(data => {
            console.log("clientes", data);
            setClients(data.customers || data);
        })
        .catch(err => console.error(err));
    }, []);

    //Editar cliente
    // const handleEdit = (client) => {
    //     setEditingId(client); //pasa cliente al form
    // };

    // Crear o actualizar cliente
     const handleSaved = (savedClient) => {

         if(editingClient){
            //actualizacion
             setClients(clients.map(c => c.id === savedClient.id ? savedClient : c));
             setEditingClient(null);
         }else{
            //nuevo
             setClients(([...clients, savedClient]));
         }
     };



    // Eliminar cliente
    const handleDelete = async (id) => {
        try {
        await deleteClient(id); //llamada al backend
        setClients(clients.filter(c => c.id !== id)); // actualiza estado
        toast.info("Cliente eliminado con éxito ✅")
        setTimeout(() => setsuccesssMessage(""), 3000); // borra mensajeen 3s
        }catch(error){
            toast.error("A ocurrido un error al eliminar el cliente!", error)
        }
    };

    return(
        <div className="ml-64 p-6"> {/* margen izquierdo para el navbar */}

        <section className="bg-white shadow rounded p-4">
            {/* Título arriba */}
            <h2 className="text-2xl font-bold text-center">
                CLIENTES
            </h2>


        <div className="flex justify-center mt-17">
            <table className="w-8/10 max-w-2xl border border-gray-300 rounded-lg shadow-md">
                <thead>
                    <tr className="bg-[#005187] text-white">
                        <th className="px-6 py-3 text-left text-sm font-semibold">ID</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold">Nombre</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold">Email</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold">Telefono</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold">Dirección</th>
                        <th className="px-8 py-5 text-left text-sm font-semibold">Fecha creado</th>
                        <th className="w-48 px-6 py-3 text-center text-sm font-semibold">Acciones</th>
                    </tr>
                </thead>
                <tbody className="bg-white">
                    {clients.map((p,index) =>(
                        <tr
                        key={p.id}
                        className={`bg-[#F1F5F9] hover:bg-[#CAD5E2] transition-colors`}
                        >
                            <td className="px-6 py-4 text-sm text-gray-700">{p.id}</td>
                            <td className="px-6 py-4 text-sm font-medium text-gray-900">{p.name}</td>
                            <td className="px-6 py-4 text-sm font-medium text-gray-900">{p.email}</td>
                            <td className="px-6 py-4 text-sm text-gray-700">{p.phone}</td>
                            <td className="px-6 py-4 text-sm text-gray-700">{p.address}</td>
                            <td className="px-6 py-4 text-sm text-gray-700">{p.created_at}</td>
                             <td className="w-48 px-6 py-4 text-center">
                                <button
                                onClick={() => handleEdit(p.id)} 
                                className="px-7 py-3 text-sm font-semibold text-white bg-blue-600 rounded hover:bg-blue-700 transition">
                                    Editar
                                </button>
                                <button 
                                onClick={() => handleDelete(p.id)}
                                className="px-7 py-3 ml-3 text-sm font-semibold text-white bg-red-600 rounded hover:bg-red-700 transition">
                                    Eliminar
                                </button>

                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* {successsMessage && (
                <div className="mt-4 p-3 bg-green-100 text-green-800 rounded">
                    {successsMessage}
                </div>
            )} */}
        </div>
        </section>
        </div>
    );
}


export default Clients;