const titleInput = document.getElementById('title');
const synopsisInput = document.getElementById('synopsis');
const contentInput = document.getElementById('content');
const btnPost = document.getElementById('btnPost');
const timeline = document.getElementById('timeline');

// Manejar la publicación
btnPost.addEventListener('click', () => {
    const title = titleInput.value.trim();
    const synopsis = synopsisInput.value.trim();
    const content = contentInput.value.trim();

    if (!title || !synopsis || !content) {
        alert('Por favor, completa todos los campos.');
        return;
    }

    const postDiv = document.createElement('div');
    postDiv.classList.add('post');

    postDiv.innerHTML = `
        <div class="post-title">${title}</div>
        <div class="post-synopsis">${synopsis}</div>
        <div class="post-content">${content}</div>
        <div class="toggle-btn">> Ver más</div>
    `;

    const toggleBtn = postDiv.querySelector('.toggle-btn');
    const contentDiv = postDiv.querySelector('.post-content');
    let isExpanded = false;

    toggleBtn.addEventListener('click', () => {
        isExpanded = !isExpanded;
        contentDiv.style.display = isExpanded ? 'block' : 'none';
        toggleBtn.textContent = isExpanded ? '< Ver menos' : '> Ver más';
    });

    timeline.prepend(postDiv);
    titleInput.value = '';
    synopsisInput.value = '';
    contentInput.value = '';
});
