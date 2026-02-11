//  FUNCIONES PARA CONSUMIR EL BACKEND
const API_URL = "http://localhost:3000/api";

//  Obtener todos los clientes
export async function getClients() {
    const res = await fetch(`${API_URL}/customers`);
    return res.json();
}

//  Obtener cliente por ID
export async function getClientById(id) {
    const res = await fetch(`${API_URL}/customers/${id}`,{
        method: "GET",
        headers: {"Content-Type": "application/json"},
    });
    if (!res.ok){
        throw new Error(`Error ${res.status}: ${res.statusText}`);
    }
    return res.json();
}

//  Crear cliente
export async function addClient(client) {
    const res = await fetch(`${API_URL}/customers`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(client),
    });
    return res.json();
}

//  Actualizar cliente
export async function updateClient(client) {
    const res = await fetch(`${API_URL}/customers/${client.id}`,{
        method: "PUT",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(client),
    });
    if(!res.ok){
        throw new Error(`Error ${res.status}: ${res.statusText}`);
    }
    return res.json();
}

//  Eliminar cliente
export async function deleteClient(id) {
    await fetch(`${API_URL}/customers/${id}`, {method: "DELETE"});    
}


//          -------PRODUCTOS---------
export async function getProducts() {
    const res = await fetch(`${API_URL}/products`);
    return res.json();
}

// Obtener producto por ID
export async function getProductById(id) {
    const res = await fetch(`${API_URL}/products/${id}`,{
        method: "GET",
        headers: {"Content-Type": "application/json"},
    });
    if (!res.ok){
        throw new Error(`Error ${res.status}: ${res.statusText}`);
    }
    return res.json();
}

// Crear producto
export async function addProduct(product) {
    const res = await fetch(`${API_URL}/products`, {
    method: "POST",
    headers: { "Content-Type": "application/json"},
    body: JSON.stringify(product),
});
    return res.json();
}

// Actualizar producto
export async function updateProduct(product) {
    const res = await fetch(`${API_URL}/products/${product.id}`,{
        method: "PUT",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(product),
    });
    if(!res.ok){
        throw new Error(`Error ${res.status}: ${res.statusText}`);
    }
    return res.json();
}

// Eliminar producto
export async function deleteProducts(id) {
    await fetch(`${API_URL}/products/${id}`, {method: "DELETE"});
}


//      ------ VENTAS --------
export async function getSales() {
    const res = await fetch(`${API_URL}/sales`);
    return res.json();
}

// obtener venta por ID
export async function getSaleById(id) {
    const res = await fetch(`${API_URL}/sales/${id}`,{
        method: "GET",
        headers: {"Content-Type": "application/json"},
    });
    if (!res.ok){
        throw new Error(`Error ${res.status}: ${res.statusText}`);
    }
    return res.json();
}

export async function addSale(sale) {
    const res = await fetch(`${API_URL}/sales`, {
        method: "POST",
        headers: { "Content-Type" : "application/json"},
        body: JSON.stringify(sale),
    });
    return res.json();
}

export async function deleteSale(id) {
    await fetch(`${API_URL}/sales/${id}`, { method: "DELETE "});
}


//     -------- Ventas con detalles------- (varios productos por cada venta)
// export async function getSales() {
//     const res = await fetch(`${API_URL}/sales`);
//     return res.json();
// }

// export async function addSale(sale) {
//     const res = await fetch(`${API_URL}/sales`, {
//         method: "POST",
//         headers: {"Content-Type": "application/json"},
//         body: JSON.stringify(sale),
//     });
//     return res.json();
// }

// export async function deleteSale(params) {
    
// }