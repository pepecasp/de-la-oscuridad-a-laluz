const fs = require('fs');
const path = require('path');

const contentDir = path.join(__dirname, 'content', 'reflexiones');
const dataFile = path.join(__dirname, 'data', 'reflexiones.json');

let items = [];

// Leer únicamente los archivos activos en content/reflexiones (fuente de la verdad)
if (fs.existsSync(contentDir)) {
  const files = fs.readdirSync(contentDir).filter(f => f.endsWith('.json'));
  files.forEach((file) => {
    try {
      const filePath = path.join(contentDir, file);
      const raw = fs.readFileSync(filePath, 'utf8');
      const parsed = JSON.parse(raw);
      parsed.id = parsed.id || file.replace('.json', '');
      items.push(parsed);
    } catch (err) {
      console.error('Error reading ' + file, err);
    }
  });
}

// Ordenar por fecha descendente
items.sort((a, b) => {
  const dateA = a.date ? new Date(a.date).getTime() : 0;
  const dateB = b.date ? new Date(b.date).getTime() : 0;
  return dateB - dateA;
});

// La carpeta content/reflexiones es la única fuente de la verdad para Decap CMS.
// Si el autor borra una reflexión en Decap, NO debe resucitarse.
let finalItems = items;
if (items.length === 0 && fs.existsSync(dataFile)) {
  try {
    finalItems = JSON.parse(fs.readFileSync(dataFile, 'utf8'));
  } catch (e) {}
}

// Asegurar directorio data y escribir
const dataDir = path.dirname(dataFile);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

fs.writeFileSync(dataFile, JSON.stringify(finalItems, null, 2), 'utf8');
console.log(`[build.js] Generated data/reflexiones.json with ${finalItems.length} reflections from Decap CMS.`);
