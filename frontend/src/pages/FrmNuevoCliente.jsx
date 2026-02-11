import { useNavigate, useParams } from "react-router-dom"; // hook para direccionar
import { getClientById, updateClient } from "../services/api.js"
import { useState, useEffect } from "react";
import { addClient } from "../services/api";
import { toast } from "react-toastify";


function NuevoCliente({onClientAdded, onClientSaved}){
    const { id } = useParams(); // obtiene el id de la URL
    const navigate = useNavigate(); // hook para redireccion
    const [client, setClient] = useState({ name: "", email: "", phone: "", address: ""});
    // const [name, setName] = useState("");
    // const [email, setEmail] = useState("");
    // const [phone, setPhone] = useState(""); 
    // const [address, setAddress] = useState("");
    const [successsMessage, setsuccesssMessage] = useState("");

    useEffect(() => {
        if (id) {
            // si hay id, significa que estamos editando
            getClientById(id).then(data => setClient(data));
        }
    }, [id]);

        // Crear o actualizar cliente
    const handleSubmit = async (e) => {
         e.preventDefault();

        if(id){

            const updated = await updateClient({ id, ...client });
            //alert("Cliente actualizado con exito!", {autoClose: 3000});
            toast.success("Cliente actualizado con éxito ✅");
            navigate("/clients"); // redirige al listado
            if(onClientSaved) onClientSaved(updated);

        } else{ 

            const newClient = await addClient( client );
            if (onClientAdded) onClientAdded(newClient);
            setClient({ name: "", email: "", phone: "", address: "" })

         toast.success("Cliente ingresado con éxito ✅");
           navigate("/clients"); // redirige al listado
        }
    };

    return(
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
            <div className="bg-white shadow rounded p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4 text-green-600"> Registrar Cliente </h2>
            <form 
            onSubmit={handleSubmit}
            className="space-y-4">
                <div>
                    <label className="block text-gray-700">Nombre</label>
                    <input
                    type="text"
                    className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:ring-green-300"
                    placeholder="Nombre del cliente"
                    value={client.name}
                    onChange={(e) => setClient( {...client, name: e.target.value})}
                    required
                    />
                </div>

                <div>
                    <label className="block text-gray-700">Correo</label>
                    <input
                    type="email"
                    className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:ring-green-300"
                    placeholder="correo@ejemplo.com"
                    value={client.email}
                    onChange={(e) => setClient( {...client, email: e.target.value})}
                    required
                    />
                </div>

                <div>
                    <label className="block text-gray-700">Teléfono</label>
                    <input
                    type="tel"
                    className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:ring-green-300"
                    placeholder="0000-0000"
                    value={client.phone}
                    onChange={(e) => setClient( {...client, phone: e.target.value})}
                    required
                    />
                </div>

                    <div>
                    <label className="block text-gray-700">Dirección</label>
                    <input
                    type="text"
                    className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:ring-green-300"
                    placeholder="Lugar de residencia"
                    value={client.address}
                    onChange={(e) => setClient( {...client, address: e.target.value})}
                    required
                    />
                </div>

                <button
                type="submit"
                className="w-full bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                >
                    Guardar Cliente
                </button>

                {successsMessage && (
                    <div className="mt-4 p-3 bg-green-100 text-green-800 rounded">
                        {successsMessage}
                    </div>
                )}

            </form>
            </div>
        </div>
    );
}

export default NuevoCliente;