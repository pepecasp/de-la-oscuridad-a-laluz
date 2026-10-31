const fs = require('fs');
const path = require('path');

const contentDir = path.join(__dirname, 'content', 'reflexiones');
const dataFile = path.join(__dirname, 'data', 'reflexiones.json');

// Reflexiones auténticas extraídas del libro de Francisco Manuel Gordillo Borrego
let defaultReflections = [];
if (fs.existsSync(dataFile)) {
  try {
    defaultReflections = JSON.parse(fs.readFileSync(dataFile, 'utf8'));
  } catch (e) {}
}

let items = [];

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

// Sort items by date descending if available
items.sort((a, b) => {
  const dateA = a.date ? new Date(a.date).getTime() : 0;
  const dateB = b.date ? new Date(b.date).getTime() : 0;
  return dateB - dateA;
});

// Combine items with defaults (avoiding duplicates by title or id)
const combined = [...items];
const existingTitles = new Set(items.map(i => (i.title || '').trim().toLowerCase()));
const existingIds = new Set(items.map(i => i.id));

defaultReflections.forEach(def => {
  if (!existingTitles.has(def.title.trim().toLowerCase()) && !existingIds.has(def.id)) {
    combined.push(def);
  }
});

// Ensure data dir exists
const dataDir = path.dirname(dataFile);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

fs.writeFileSync(dataFile, JSON.stringify(combined, null, 2), 'utf8');
console.log(`[build.js] Generated data/reflexiones.json with ${combined.length} reflections (${items.length} from Decap CMS).`);
