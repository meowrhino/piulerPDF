const API_URL = 'https://piuler.onrender.com';

const usernameInput = document.getElementById('username');
const contentInput = document.getElementById('content');
const btnPost = document.getElementById('btnPost');
const timeline = document.getElementById('timeline');

function formatTimestamp(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleString();
}

function renderPosts(posts) {
    timeline.innerHTML = '';

    posts.forEach(post => {
        const divPost = document.createElement('div');
        divPost.className = 'post';

        divPost.innerHTML = `
            <p><strong>${post.username}</strong> <small>${formatTimestamp(post.timestamp)}</small></p>
            <p>${post.content}</p>
        `;

        timeline.appendChild(divPost);
    });
}

// Cargar posts desde GitHub
async function loadPosts() {
    try {
        const res = await fetch(`${API_URL}/posts`);
        const data = await res.json();
        renderPosts(data);
    } catch (error) {
        console.error('Error al cargar posts:', error);
    }
}

// Publicar un nuevo post y actualizar GitHub
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

loadPosts();
