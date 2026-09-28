//  FUNCIONES PARA CONSUMIR EL BACKEND

// Detecta el contexto de ejecución para construir la URL base:
//   · Electron (file://)  → llama directamente a localhost:3000
//   · Navegador/móvil     → usa el mismo origen desde donde cargó la página,
//                           así funciona sin importar la IP del servidor
function getApiUrl() {
  if (window.location.protocol === 'file:') {
    return 'http://localhost:3000/api';
  }
  return `${window.location.origin}/api`;
}

const API_URL = getApiUrl();

function getAuthHeader() {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// Wrapper que dispara "session:expired" ante cualquier 401
async function apiFetch(url, options = {}) {
  const res = await fetch(url, options);
  if (res.status === 401) {
    window.dispatchEvent(new Event("session:expired"));
    throw new Error("Sesión expirada");
  }
  return res;
}

//         -------LOGIN---------
export async function login(email, password) {
  const res = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);
  return res.json();
}

//         -------USUARIOS---------
export async function getUsers() {
  const res = await apiFetch(`${API_URL}/users`, {
    headers: { ...getAuthHeader() },
  });
  return res.json();
}

export async function getUserById(id) {
  const res = await apiFetch(`${API_URL}/users/${id}`, {
    headers: { "Content-Type": "application/json", ...getAuthHeader() },
  });
  if (!res.ok) throw new Error(`Error ${res.status}`);
  return res.json();
}

export async function addUser(user) {
  const res = await apiFetch(`${API_URL}/users`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...getAuthHeader() },
    body: JSON.stringify(user),
  });
  return res.json();
}

export async function updateUser(user) {
  const res = await apiFetch(`${API_URL}/users/${user.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", ...getAuthHeader() },
    body: JSON.stringify(user),
  });
  if (!res.ok) throw new Error(`Error ${res.status}`);
  return res.json();
}

export async function deleteUser(id) {
  const res = await apiFetch(`${API_URL}/users/${id}`, {
    method: "DELETE",
    headers: { ...getAuthHeader() },
  });
  if (!res.ok) throw new Error(`Error ${res.status}`);
  return res.json();
}

//         -------CLIENTES---------
export async function getClients() {
  const res = await apiFetch(`${API_URL}/customers`, {
    headers: { ...getAuthHeader() },
  });
  return res.json();
}

export async function getClientById(id) {
  const res = await apiFetch(`${API_URL}/customers/${id}`, {
    headers: { "Content-Type": "application/json", ...getAuthHeader() },
  });
  if (!res.ok) throw new Error(`Error ${res.status}`);
  return res.json();
}

export async function addClient(client) {
  const res = await apiFetch(`${API_URL}/customers`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...getAuthHeader() },
    body: JSON.stringify(client),
  });
  return res.json();
}

export async function updateClient(client) {
  const res = await apiFetch(`${API_URL}/customers/${client.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", ...getAuthHeader() },
    body: JSON.stringify(client),
  });
  if (!res.ok) throw new Error(`Error ${res.status}`);
  return res.json();
}

export async function deleteClient(id) {
  await apiFetch(`${API_URL}/customers/${id}`, {
    method: "DELETE",
    headers: { ...getAuthHeader() },
  });
}

//         -------PRODUCTOS---------
export async function getProducts() {
  const res = await apiFetch(`${API_URL}/products`, {
    headers: { ...getAuthHeader() },
  });
  return res.json();
}

export async function getProductById(id) {
  const res = await apiFetch(`${API_URL}/products/${id}`, {
    headers: { "Content-Type": "application/json", ...getAuthHeader() },
  });
  if (!res.ok) throw new Error(`Error ${res.status}`);
  return res.json();
}

export async function addProduct(product) {
  const res = await apiFetch(`${API_URL}/products`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...getAuthHeader() },
    body: JSON.stringify(product),
  });
  return res.json();
}

export async function updateProduct(product) {
  const res = await apiFetch(`${API_URL}/products/${product.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", ...getAuthHeader() },
    body: JSON.stringify(product),
  });
  if (!res.ok) throw new Error(`Error ${res.status}`);
  return res.json();
}

export async function deleteProducts(id) {
  await apiFetch(`${API_URL}/products/${id}`, {
    method: "DELETE",
    headers: { ...getAuthHeader() },
  });
}

//      -------VENTAS---------
export async function getSales(desde, hasta) {
  const params = new URLSearchParams();
  if (desde) params.append("desde", desde);
  if (hasta) params.append("hasta", hasta);
  const query = params.toString() ? `?${params.toString()}` : "";
  const res = await apiFetch(`${API_URL}/sales${query}`, {
    headers: { ...getAuthHeader() },
  });
  return res.json();
}

export async function getSaleById(id) {
  const res = await apiFetch(`${API_URL}/sales/${id}`, {
    headers: { "Content-Type": "application/json", ...getAuthHeader() },
  });
  if (!res.ok) throw new Error(`Error ${res.status}`);
  return res.json();
}

export async function addSale(sale) {
  const res = await apiFetch(`${API_URL}/sales`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...getAuthHeader() },
    body: JSON.stringify(sale),
  });
  return res.json();
}

export async function updateSale(sale) {
  const res = await apiFetch(`${API_URL}/sales/${sale.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", ...getAuthHeader() },
    body: JSON.stringify(sale),
  });
  if (!res.ok) throw new Error(`Error ${res.status}`);
  return res.json();
}

export async function deleteSale(id) {
  await apiFetch(`${API_URL}/sales/${id}`, {
    method: "DELETE",
    headers: { ...getAuthHeader() },
  });
}

//     -------MESAS---------
export async function getMesa() {
  const res = await apiFetch(`${API_URL}/mesa`, {
    headers: { ...getAuthHeader() },
  });
  return res.json();
}

export async function getMesaById(id) {
  const res = await apiFetch(`${API_URL}/mesa/${id}`, {
    headers: { "Content-Type": "application/json", ...getAuthHeader() },
  });
  if (!res.ok) throw new Error(`Error ${res.status}`);
  return res.json();
}

export async function addMesa(mesa) {
  const res = await apiFetch(`${API_URL}/mesa`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...getAuthHeader() },
    body: JSON.stringify(mesa),
  });
  return res.json();
}

export async function deleteMesa(id) {
  await apiFetch(`${API_URL}/mesa/${id}`, {
    method: "DELETE",
    headers: { ...getAuthHeader() },
  });
}

export async function updateMesa(mesa) {
  const res = await apiFetch(`${API_URL}/mesa/${mesa.id_mesa}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", ...getAuthHeader() },
    body: JSON.stringify(mesa),
  });
  if (!res.ok) throw new Error(`Error ${res.status}`);
  return res.json();
}

//     -------AMBIENTE---------
export async function getAmbiente() {
  const res = await apiFetch(`${API_URL}/ambiente`, {
    headers: { ...getAuthHeader() },
  });
  return res.json();
}

export async function deleteAmbiente(id) {
  await apiFetch(`${API_URL}/ambiente/${id}`, {
    method: "DELETE",
    headers: { ...getAuthHeader() },
  });
}

export async function addAmbiente(ambiente) {
  const res = await apiFetch(`${API_URL}/ambiente`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...getAuthHeader() },
    body: JSON.stringify(ambiente),
  });
  return res.json();
}

//     -------COMANDAS---------
export async function getComandas(desde, hasta, id_mesa) {
  const params = new URLSearchParams();
  if (desde) params.append("desde", desde);
  if (hasta) params.append("hasta", hasta);
  if (id_mesa) params.append("id_mesa", id_mesa);
  const query = params.toString() ? `?${params.toString()}` : "";
  const res = await apiFetch(`${API_URL}/comandas${query}`, {
    headers: { ...getAuthHeader() },
  });
  if (!res.ok) return [];
  return res.json();
}

export async function getComandaById(id) {
  const res = await apiFetch(`${API_URL}/comandas/${id}`, {
    headers: { ...getAuthHeader() },
  });
  if (!res.ok) throw new Error(`Error ${res.status}`);
  return res.json();
}

export async function addComanda(comanda) {
  const res = await apiFetch(`${API_URL}/comandas`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...getAuthHeader() },
    body: JSON.stringify(comanda),
  });
  if (!res.ok) throw new Error(`Error ${res.status}`);
  return res.json();
}

export async function updateComandaEstado(id, estado) {
  const res = await apiFetch(`${API_URL}/comandas/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", ...getAuthHeader() },
    body: JSON.stringify({ estado }),
  });
  if (!res.ok) throw new Error(`Error ${res.status}`);
  return res.json();
}

export async function deleteComanda(id) {
  const res = await apiFetch(`${API_URL}/comandas/${id}`, {
    method: "DELETE",
    headers: { ...getAuthHeader() },
  });
  if (!res.ok) throw new Error(`Error ${res.status}`);
  return res.json();
}

//     -------CAJA---------
export async function getCajaActual() {
  const res = await apiFetch(`${API_URL}/caja/actual`, {
    headers: { ...getAuthHeader() },
  });
  if (!res.ok) return { caja: null };
  return res.json();
}

export async function abrirCaja(monto_inicial) {
  const res = await apiFetch(`${API_URL}/caja/abrir`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...getAuthHeader() },
    body: JSON.stringify({ monto_inicial }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || `Error ${res.status}`);
  return data;
}

export async function cerrarCaja(monto_final) {
  const res = await apiFetch(`${API_URL}/caja/cerrar`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...getAuthHeader() },
    body: JSON.stringify({ monto_final }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || `Error ${res.status}`);
  return data;
}

export async function getCajas() {
  const res = await apiFetch(`${API_URL}/caja`, {
    headers: { ...getAuthHeader() },
  });
  if (!res.ok) return [];
  return res.json();
}
