// 1. URL del servidor (si estuviera en otro lado, ajusta la IP o dominio)
const API_URL = 'https://piuler.onrender.com'; // ✅ Esto funcionará desde cualquier lugar


// 2. Capturamos los elementos del DOM
const usernameInput = document.getElementById('username');
const contentInput = document.getElementById('content');
const btnPost = document.getElementById('btnPost');
const timeline = document.getElementById('timeline');

// 3. Función para formatear fecha/hora
function formatTimestamp(timestamp) {
  const date = new Date(timestamp);
  return date.toLocaleString(); // Ej: '29/1/2025, 13:45'
}

// 4. Función para mostrar los posts en la pantalla
function renderPosts(posts) {
  // Limpiamos la sección timeline
  timeline.innerHTML = '';

  // Recorremos el array de posts y creamos elementos HTML
  posts.forEach(post => {
    const divPost = document.createElement('div');
    divPost.className = 'post';

    // Añadimos texto HTML con username, fecha y contenido
    divPost.innerHTML = `
      <p><strong>${post.username}</strong> <small>${formatTimestamp(post.timestamp)}</small></p>
      <p>${post.content}</p>
    `;

    // Añadimos este post al contenedor
    timeline.appendChild(divPost);
  });
}

// 5. Función para cargar posts del servidor
async function loadPosts() {
  try {
    const res = await fetch(`${API_URL}/posts`);
    const data = await res.json();
    renderPosts(data);
  } catch (error) {
    console.error('Error al cargar posts:', error);
  }
}

// 6. Evento para publicar un nuevo post
btnPost.addEventListener('click', async () => {
  const username = usernameInput.value.trim();
  const content = contentInput.value.trim();

  // Validamos que no estén vacíos
  if (!username || !content) {
    alert('Por favor, completa usuario y mensaje.');
    return;
  }

  try {
    // Petición POST al servidor
    await fetch(`${API_URL}/post`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, content })
    });

    // Limpiamos el contenido escrito
    contentInput.value = '';

    // Recargamos la lista de posts
    loadPosts();
  } catch (error) {
    console.error('Error al publicar:', error);
  }
});

// 7. Cuando cargue la página, ejecutamos loadPosts() para ver posts existentes
loadPosts();

// (Opcional) Si quieres refrescar cada X tiempo, puedes hacer:
// setInterval(loadPosts, 5000); // cada 5 segundos
