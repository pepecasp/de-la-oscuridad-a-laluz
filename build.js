const fs = require('fs');
const path = require('path');

const contentDir = path.join(__dirname, 'content', 'reflexiones');
const dataFile = path.join(__dirname, 'data', 'reflexiones.json');

// Default initial reflections
const defaultReflections = [
  {
    id: "default-1",
    title: "¿Quién habla cuando no puedes parar de pensar?",
    category: "El Ego",
    read_time: "3 min",
    date: "2026-09-05",
    excerpt: "Nos acostumbramos a creer que somos cada pensamiento que cruza la cabeza. Pero si tú puedes escuchar la voz, ¿quién es el que escucha?",
    body: "<p class=\"first-letter:text-5xl first-letter:font-serif first-letter:float-left first-letter:mr-3 first-letter:text-sage-500\">D</p><p>urante años hemos caído en la trampa de identificarnos con la voz que no cesa en nuestra cabeza. Ese «locutor farsante» opina sobre el clima, se angustia por el futuro y revive disputas pasadas.</p><p>Pero fíjate bien en este instante: si tú puedes observar el pensamiento... ¿quién es el que está observando?</p><p>No eres el ruido, eres el espacio silencioso en el que el ruido sucede. Cuando dejas de discutir con la mente y simplemente la miras como olas en la orilla, pierde su tiranía.</p><p class=\"font-serif italic text-xl border-l-2 border-sage-500 pl-4 my-6 text-warmgray-900 dark:text-white\">«La verdadera paz no consiste en lograr que la mente se calle por la fuerza, sino en no tomarse en serio sus mentiras.»</p>"
  },
  {
    id: "default-2",
    title: "El aire que entra y sale: el único templo vivo",
    category: "Presencia",
    read_time: "4 min",
    date: "2026-09-12",
    excerpt: "No necesitas viajar a un monasterio remoto para encontrar paz. En cada inhalación involuntaria reside el latido de la vida misma.",
    body: "<p class=\"first-letter:text-5xl first-letter:font-serif first-letter:float-left first-letter:mr-3 first-letter:text-sage-500\">C</p><p>uando leemos sobre espiritualidad, a menudo imaginamos templos distantes o posturas imposibles. Sin embargo, el milagro más divino y accesible está ocurriendo ahora mismo en tu respiración.</p><p>¿Quién respira por ti mientras duermes? ¿Quién mantiene latiendo tu corazón sin que tengas que intervenir?</p><p>Esa fuerza viva es la presencia misma operando en ti. Cada vez que llevas tu atención consciente al aire que entra y sale, desconectas automáticamente el tren del estrés.</p>"
  },
  {
    id: "default-3",
    title: "El lápiz es lápiz: la ilusión de la dualidad",
    category: "Diálogos",
    read_time: "2 min",
    date: "2026-08-27",
    excerpt: "«El mundo no es bueno o malo, el mundo conlleva implícito en todo su programa a la dualidad. Con un simple lápiz puedes escribir el poema de Amor incondicional más puro o la carta más destructiva... el lápiz es lápiz. Solo eso.»",
    body: "<p class=\"first-letter:text-5xl first-letter:font-serif first-letter:float-left first-letter:mr-3 first-letter:text-sage-500\">E</p><p>l mundo no es bueno o malo, el mundo conlleva implícito en todo su programa a la dualidad.</p><p>Con un simple lápiz puedes escribir el poema de Amor incondicional más puro o la carta más destructiva que nadie pueda imaginar. El lápiz es lápiz. Solo eso.</p><p class=\"font-serif italic text-xl border-l-2 border-sage-500 pl-4 my-6 text-warmgray-900 dark:text-white\">«Las cosas y los sucesos son neutros en sí mismos. Es la mente la que los viste de juicio, drama o condena.»</p><p>Cuando dejamos de etiquetar cada instante como un triunfo o una tragedia, recuperamos la libertad de ser el testigo sereno, permitiendo que la vida simplemente sea lo que es.</p>"
  }
];

let items = [];

if (fs.existsSync(contentDir)) {
  const files = fs.readdirSync(contentDir).filter(f => f.endsWith('.json'));
  files.forEach((file, index) => {
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

// Combine items with defaults (avoiding duplicates by title)
const combined = [...items];
const existingTitles = new Set(items.map(i => (i.title || '').trim().toLowerCase()));

defaultReflections.forEach(def => {
  if (!existingTitles.has(def.title.trim().toLowerCase())) {
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
