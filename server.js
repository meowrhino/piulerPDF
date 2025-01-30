const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const REPO_OWNER = "TU_USUARIO";  // 🔹 Cambia esto por tu usuario de GitHub
const REPO_NAME = "TU_REPO";  // 🔹 Cambia esto por el nombre de tu repositorio
const FILE_PATH = "posts.json";

// Obtener los posts desde GitHub
app.get('/posts', async (req, res) => {
    try {
        const response = await fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}`, {
            headers: {
                "Authorization": `token ${GITHUB_TOKEN}`,
                "Accept": "application/vnd.github.v3+json"
            }
        });

        if (!response.ok) {
            throw new Error(`GitHub API error: ${response.status}`);
        }

        const fileData = await response.json();
        const content = JSON.parse(Buffer.from(fileData.content, 'base64').toString());

        res.json(content);
    } catch (error) {
        console.error('Error al obtener posts:', error);
        res.status(500).json({ error: 'No se pudieron obtener los posts' });
    }
});

// Publicar un nuevo tweet y actualizar GitHub
app.post('/post', async (req, res) => {
    const { username, content } = req.body;
    if (!username || !content) {
        return res.status(400).json({ error: 'Faltan datos' });
    }

    try {
        // Obtener el contenido actual de posts.json
        const response = await fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}`, {
            headers: {
                "Authorization": `token ${GITHUB_TOKEN}`,
                "Accept": "application/vnd.github.v3+json"
            }
        });

        if (!response.ok) {
            throw new Error(`GitHub API error: ${response.status}`);
        }

        const fileData = await response.json();
        const existingContent = JSON.parse(Buffer.from(fileData.content, 'base64').toString());

        // Agregar el nuevo tweet
        const newTweet = { username, content, timestamp: Date.now() };
        existingContent.push(newTweet);

        // Convertir a base64
        const updatedContent = Buffer.from(JSON.stringify(existingContent, null, 2)).toString('base64');

        // Hacer commit con los cambios en GitHub
        const updateResponse = await fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}`, {
            method: "PUT",
            headers: {
                "Authorization": `token ${GITHUB_TOKEN}`,
                "Accept": "application/vnd.github.v3+json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                message: "Nuevo tweet publicado",
                content: updatedContent,
                sha: fileData.sha // Se necesita para actualizar el archivo en GitHub
            })
        });

        if (!updateResponse.ok) {
            throw new Error(`Error al actualizar GitHub: ${updateResponse.status}`);
        }

        res.status(201).json(newTweet);
    } catch (error) {
        console.error('Error al publicar tweet:', error);
        res.status(500).json({ error: 'No se pudo publicar el tweet' });
    }
});

// Iniciar el servidor en Render
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Servidor escuchando en http://0.0.0.0:${PORT}`);
});
