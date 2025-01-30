
const API_URL = 'https://piuler.onrender.com';

const usernameInput = document.getElementById('username');
const contentInput = document.getElementById('content');
const btnPost = document.getElementById('btnPost');
const timeline = document.getElementById('timeline');

// 🎨 Estilos para cada usuario
const userStyles = {
    "test": "color: #aaa; background-color: #000; padding: 10px; border-radius: 5px;",
    "manu": "color: #FFD700; background-color: #000; padding: 10px; border-radius: 5px;"
};

// 📅 Función para formatear la fecha en encabezados
function formatDate(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
}

// ⏳ Función para formatear la hora
function formatTimestamp(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
}

// 🔄 Función para mostrar los posts agrupados por día
function renderPosts(posts) {
    timeline.innerHTML = '';

    // 🆕 Ordenar posts del más reciente al más antiguo
    posts.sort((a, b) => b.timestamp - a.timestamp);

    let lastDate = null;

    posts.forEach(post => {
        const postDate = formatDate(post.timestamp);

        // 📌 Si el día es diferente al anterior, agregar un encabezado de fecha
        if (postDate !== lastDate) {
            const dateHeader = document.createElement('h2');
            dateHeader.textContent = postDate;
            dateHeader.style.textAlign = "center";
            dateHeader.style.color = "#FFF";
            dateHeader.style.marginTop = "20px";
            timeline.appendChild(dateHeader);
            lastDate = postDate;
        }

        // 🖌️ Crear div de post con estilos según usuario
        const divPost = document.createElement('div');
        divPost.className = 'post';
        divPost.style = userStyles[post.username] || "color: white; background-color: black; padding: 10px; border-radius: 5px;";

        // Obtener los últimos dígitos del timestamp para que sea más corto
        const shortId = post.timestamp.toString().slice(-6);

        divPost.innerHTML = `
            <p class="post-meta"><strong>${post.username}</strong> <small>${shortId} - ${formatTimestamp(post.timestamp)}</small></p>
            <p class="post-content">${post.content}</p>
        `;

        timeline.appendChild(divPost);
    });
}

// 🔄 Cargar posts desde el servidor
async function loadPosts() {
    try {
        const res = await fetch(`${API_URL}/posts`);
        const data = await res.json();
        renderPosts(data);
    } catch (error) {
        console.error('Error al cargar posts:', error);
    }
}

// ✍️ Publicar un nuevo tweet
btnPost.addEventListener('click', async () => {
    const username = usernameInput.value.trim();
    const content = contentInput.value.trim();

    if (!username || !content) {
        alert('Por favor, completa usuario y mensaje.');
        return;
    }

    try {
        await fetch(`${API_URL}/post`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, content })
        });

        contentInput.value = '';
        loadPosts();
    } catch (error) {
        console.error('Error al publicar:', error);
    }
});

// 🔄 Cargar los posts al inicio
loadPosts();
