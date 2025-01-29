const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Conectar con SQLite
const db = new sqlite3.Database('database.db', (err) => {
  if (err) {
    console.error('Error al conectar con SQLite:', err.message);
  } else {
    console.log('Conectado a la base de datos SQLite.');
  }
});

// Crear tabla si no existe
db.run(`CREATE TABLE IF NOT EXISTS posts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT,
  content TEXT,
  timestamp INTEGER
)`);

// Obtener los posts
app.get('/posts', (req, res) => {
  db.all('SELECT * FROM posts ORDER BY timestamp DESC', [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json(rows);
    }
  });
});

// Publicar un nuevo tweet
app.post('/post', (req, res) => {
  const { username, content } = req.body;
  if (!username || !content) {
    return res.status(400).json({ error: 'Faltan datos' });
  }

  const timestamp = Date.now();
  db.run(
    `INSERT INTO posts (username, content, timestamp) VALUES (?, ?, ?)`,
    [username, content, timestamp],
    function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.status(201).json({ id: this.lastID, username, content, timestamp });
      }
    }
  );
});

// Servir archivos estáticos (frontend)
app.use(express.static('public'));

// Iniciar servidor en el puerto asignado por Render
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor escuchando en http://0.0.0.0:${PORT}`);
});
