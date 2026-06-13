const fs = require('fs');
const path = require('path');

// Hook "afterPack" de electron-builder: se ejecuta automáticamente
// justo después de que electron-builder empaqueta la app (antes de
// crear el instalador final).
module.exports = async function (context) {
  // Ruta de origen: la carpeta "backend" del proyecto (un nivel arriba de "electron/")
  const src = path.join(__dirname, '../backend');

  // Ruta de destino: dentro de la app empaquetada, en "resources/backend"
  // context.appOutDir = carpeta donde electron-builder dejó la app (ej. release/win-unpacked)
  const dest = path.join(context.appOutDir, 'resources', 'backend');

  console.log(`Copiando backend de ${src} a ${dest}`);

  // Copia TODO el contenido de backend/ (incluyendo node_modules, .env, etc.)
  // de forma recursiva, sin aplicar los filtros/.gitignore que usa
  // electron-builder para "extraResources"
  await fs.promises.cp(src, dest, { recursive: true });

  console.log('Backend copiado correctamente');
};

/*Este archivo es un script que electron-builder ejecuta automáticamente al final del proceso de empaquetado. 
Su única función es copiar manualmente la carpeta backend/ completa (con todas sus dependencias instaladas en node_modules,
su archivo .env, modelos, rutas, etc.) hacia dentro de la app ya empaquetada, en resources/backend/. 
Se necesita porque electron-builder, al usar extraResources, respeta el .gitignore del backend y excluye node_modules 
y .env — archivos imprescindibles para que el servidor Express funcione dentro del ejecutable. Usar fs.promises.cp
con copia manual evita ese filtrado y garantiza que todo llegue intacto.*/