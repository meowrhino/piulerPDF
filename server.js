const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');

// Archivo donde guardaremos los posts
const POSTS_FILE = 'posts.json';

// 1. Función para leer posts desde posts.json
function loadPosts() {
  try {
    const data = fs.readFileSync(POSTS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    // Si no existe el archivo o no se puede leer, devolvemos un array vacío
    console.error('No se pudo leer posts.json. Se usará un array vacío.');
    return [];
  }
}

// 2. Función para guardar posts en posts.json
function savePosts(posts) {
  try {
    fs.writeFileSync(POSTS_FILE, JSON.stringify(posts, null, 2));
  } catch (error) {
    console.error('No se pudo escribir en posts.json:', error);
  }
}

// 3. Cargamos los posts al iniciar
let posts = loadPosts();

// 4. Creamos la app de Express
const app = express();
app.use(cors());
app.use(bodyParser.json());

// 5. Endpoint para obtener los posts
app.get('/posts', (req, res) => {
  // Ordenar los posts (más nuevo primero)
  const sortedPosts = [...posts].sort((a, b) => b.timestamp - a.timestamp);
  res.json(sortedPosts);
});

// 6. Endpoint para crear un nuevo post
app.post('/post', (req, res) => {
  const { username, content } = req.body;

  if (!username || !content) {
    return res.status(400).json({ error: 'Faltan datos' });
  }

  const newPost = {
    username,
    content,
    timestamp: Date.now()
  };

  // Añadimos el nuevo post al array
  posts.push(newPost);

  // Guardamos en el archivo JSON para persistir
  savePosts(posts);

  res.status(201).json(newPost);
});

// 7. Servir archivos estáticos (HTML, JS, CSS)
app.use(express.static('public'));

// 8. Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
