const GITHUB_USER = "evelynlamarca";

async function initializeApp() {
    try {
        const [userRes, repoRes] = await Promise.all([
            fetch(`https://api.github.com/users/${GITHUB_USER}`),
            fetch(`https://api.github.com/users/${GITHUB_USER}/repos?sort=updated&per_page=6`)
        ]);

        const profile = await userRes.json();
        const repos = await repoRes.json();

        // 1. Renderizar Seção Sobre
        document.getElementById('about').innerHTML = `
            <div style="background: rgba(168, 85, 247, 0.03); padding: clamp(30px, 5vw, 60px); border-radius: 25px; border: 1px solid rgba(168, 85, 247, 0.1); width: 100%; display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 50px; align-items: center;">
                <div style="text-align: center;">
                    <img src="${profile.avatar_url}" style="width: 250px; border-radius: 50%; border: 4px solid var(--primary-lilas); box-shadow: 0 0 30px rgba(168, 85, 247, 0.2);">
                </div>
                <div>
                    <span class="badge">Especialista</span>
                    <h2 style="font-size: 2.5rem; margin: 15px 0;">Sobre <span style="color: var(--primary-lilas);">Mim</span></h2>
                    <p style="color: var(--text-dim); line-height: 1.8; font-size: 1.1rem;">${profile.bio || "Focada em construir o futuro da web através de interfaces intuitivas e back-ends robustos."}</p>
                    <div style="margin-top: 30px; display: flex; gap: 40px;">
                        <div><h3 style="color: var(--primary-lilas);">${profile.public_repos}</h3><p style="font-size: 0.8rem; color: var(--text-dim);">Repositórios</p></div>
                        <div><h3 style="color: var(--primary-lilas);">${profile.followers}</h3><p style="font-size: 0.8rem; color: var(--text-dim);">Seguidores</p></div>
                    </div>
                </div>
            </div>
        `;

        // 2. Renderizar Repositórios no Swiper
        const reposContainer = document.getElementById('github-projects');
        reposContainer.innerHTML = repos.map(repo => `
            <div class="swiper-slide">
                <div style="background: rgba(255,255,255,0.02); padding: 35px; border-radius: 20px; border: 1px solid rgba(255,255,255,0.05); height: 100%; transition: 0.3s; cursor: default;">
                    <i class="fas fa-folder-open" style="color: var(--primary-lilas); font-size: 1.5rem; margin-bottom: 20px;"></i>
                    <h3 style="margin-bottom: 15px; color: var(--text-main); font-size: 1.2rem;">${repo.name.replace(/-/g, ' ')}</h3>
                    <p style="font-size: 0.9rem; color: var(--text-dim); margin-bottom: 25px; min-height: 50px;">${repo.description || "Explorando novas tecnologias e soluções criativas."}</p>
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <span style="font-size: 0.75rem; color: var(--primary-lilas); font-weight: 600;">● ${repo.language || 'Tech'}</span>
                        <a href="${repo.html_url}" target="_blank" style="color: var(--text-main); font-size: 1.1rem;"><i class="fab fa-github"></i></a>
                    </div>
                </div>
            </div>
        `).join('');

        // 3. Inicializar Swiper
        new Swiper(".projects-swiper", {
            slidesPerView: 1,
            spaceBetween: 25,
            pagination: { el: ".swiper-pagination", clickable: true },
            breakpoints: {
                768: { slidesPerView: 2 },
                1100: { slidesPerView: 3 }
            }
        });

    } catch (err) {
        console.error("Erro na API do GitHub:", err);
    }
}

// 4. Scroll Reveal (Efeito de aparecimento)
function handleReveal() {
    const sections = document.querySelectorAll('.section-container');
    sections.forEach(s => {
        const top = s.getBoundingClientRect().top;
        if (top < window.innerHeight - 100) s.classList.add('active');
    });
}

document.addEventListener("DOMContentLoaded", () => {
    initializeApp();
    window.addEventListener('scroll', handleReveal);
    setTimeout(handleReveal, 500); // Trigger inicial
});