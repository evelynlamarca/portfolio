// @ts-nocheck
"use strict";

/* ============================================================
   CONFIGURAÇÕES
============================================================ */
const GITHUB_USERNAME = "evelynlamarca";
const REPOS_COUNT     = 9;

/* ============================================================
   ELEMENTOS DO DOM
============================================================ */
const swiperWrapper   = document.querySelector("#swiper-wrapper");
const projectsLoading = document.querySelector("#projects-loading");
const projectsSwiper  = document.querySelector("#projects-swiper");
const formulario      = document.querySelector("#formulario");

/* ============================================================
   VALIDAÇÃO DE E-MAIL
============================================================ */
const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

/* ============================================================
   ÍCONES DE LINGUAGEM — via devicons CDN (coloridos)
============================================================ */
const LINGUAGENS_ICONES = {
  JavaScript: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg",
  TypeScript: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg",
  Python:     "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg",
  Java:       "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg",
  HTML:       "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg",
  CSS:        "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg",
  PHP:        "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/php/php-original.svg",
  "C#":       "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/csharp/csharp-original.svg",
  Go:         "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/go/go-original.svg",
  Kotlin:     "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kotlin/kotlin-original.svg",
  Swift:      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/swift/swift-original.svg",
  C:          "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/c/c-original.svg",
  "C++":      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg",
  Vue:        "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vuejs/vuejs-original.svg",
  React:      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",
  Rust:       "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/rust/rust-plain.svg",
  Ruby:       "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/ruby/ruby-original.svg",
  Dart:       "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/dart/dart-original.svg",
  Shell:      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/bash/bash-original.svg",
  // Fallback para repos sem linguagem detectada
  GitHub:     "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg",
};

/* ============================================================
   EFEITO DE DIGITAÇÃO — HERO
============================================================ */
const textos = [
  "Olá, eu sou Evelyn Lamarca",
  "Dev Full Stack",
  "Criando experiências digitais",
];

let textoIndex = 0;
let charIndex  = 0;
let apagando   = false;
const typingEl = document.querySelector("#typing-text");

function typeLoop() {
  if (!typingEl) return;

  const textoAtual = textos[textoIndex];

  if (!apagando) {
    typingEl.textContent = textoAtual.substring(0, charIndex + 1);
    charIndex++;
    if (charIndex === textoAtual.length) {
      apagando = true;
      setTimeout(typeLoop, 2200);
      return;
    }
    setTimeout(typeLoop, 60);
  } else {
    typingEl.textContent = textoAtual.substring(0, charIndex - 1);
    charIndex--;
    if (charIndex === 0) {
      apagando = false;
      textoIndex = (textoIndex + 1) % textos.length;
      setTimeout(typeLoop, 400);
      return;
    }
    setTimeout(typeLoop, 35);
  }
}

/* ============================================================
   HEADER — STICKY SCROLL + NAV ATIVO
============================================================ */
const header = document.querySelector("#header");

window.addEventListener("scroll", () => {
  if (window.scrollY > 40) {
    header?.classList.add("scrolled");
  } else {
    header?.classList.remove("scrolled");
  }
  highlightNav();
}, { passive: true });

function highlightNav() {
  const sections = document.querySelectorAll("section[id]");
  const scrollY  = window.scrollY + 120;

  sections.forEach(section => {
    const top    = section.offsetTop;
    const height = section.offsetHeight;
    const id     = section.getAttribute("id");
    const link   = document.querySelector(`.nav-link[href="#${id}"]`);

    if (scrollY >= top && scrollY < top + height) {
      document.querySelectorAll(".nav-link").forEach(l => l.classList.remove("active"));
      link?.classList.add("active");
    }
  });
}

/* ============================================================
   HAMBURGER MENU
============================================================ */
const hamburger = document.querySelector("#hamburger");
const navMobile = document.querySelector("#nav-mobile");

hamburger?.addEventListener("click", () => {
  const isOpen = navMobile?.classList.toggle("open");
  hamburger.classList.toggle("open", isOpen);
  hamburger.setAttribute("aria-expanded", String(isOpen));
});

document.querySelectorAll(".nav-link-mobile").forEach(link => {
  link.addEventListener("click", () => {
    navMobile?.classList.remove("open");
    hamburger?.classList.remove("open");
    hamburger?.setAttribute("aria-expanded", "false");
  });
});

/* ============================================================
   INTERSECTION OBSERVER — FADE-IN
============================================================ */
function initFadeIn() {
  const elements = document.querySelectorAll(
    ".section-label, .section-title, .section-sub, " +
    ".about-content, .about-stats, " +
    ".contact-info, .contact-form, " +
    ".hero-content, .hero-figure"
  );

  elements.forEach(el => el.classList.add("fade-in"));

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add("visible"), i * 80);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  elements.forEach(el => observer.observe(el));
}

/* ============================================================
   GITHUB API — SEÇÃO ABOUT
============================================================ */
async function getAboutGitHub() {
  try {
    const res    = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}`);
    if (!res.ok) throw new Error("Falha ao buscar perfil");
    const perfil = await res.json();

    // Bio
    const bioEl = document.querySelector("#about-bio");
    if (bioEl) {
      bioEl.textContent = perfil.bio ||
        "Desenvolvedora Fullstack especializada em criar aplicações web escaláveis, " +
        "performáticas e orientadas a resultado. Atuo com JavaScript/TypeScript, " +
        "React, Vue e Node.js — entregando sistemas bem estruturados, APIs robustas " +
        "e interfaces modernas.";
    }

    // Stats com animação de contagem
    const followersEl = document.querySelector("#stat-followers");
    const reposEl     = document.querySelector("#stat-repos");
    if (followersEl) animateCount(followersEl, perfil.followers    ?? 0);
    if (reposEl)     animateCount(reposEl,     perfil.public_repos ?? 0);

    // Link GitHub
    const githubLink = document.querySelector("#about-github-link");
    if (githubLink) githubLink.href = perfil.html_url;

  } catch (err) {
    console.error("[About] Erro ao buscar dados do GitHub:", err);
    const bioEl = document.querySelector("#about-bio");
    if (bioEl) {
      bioEl.textContent =
        "Desenvolvedora Fullstack especializada em criar aplicações web modernas e escaláveis.";
    }
  }
}

/* Animação de contagem numérica */
function animateCount(el, target) {
  const duration = 1200;
  const start    = performance.now();

  function step(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased    = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(eased * target).toString();
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = target.toString();
  }

  requestAnimationFrame(step);
}

/* ============================================================
   GITHUB API — PROJETOS
============================================================ */
async function getProjectsGitHub() {
  try {
    const res = await fetch(
      `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=${REPOS_COUNT}`
    );
    if (!res.ok) throw new Error("Falha ao buscar repositórios");

    const repositorios = await res.json();

    if (!Array.isArray(repositorios) || repositorios.length === 0) {
      showProjectsError("Nenhum repositório encontrado.");
      return;
    }

    swiperWrapper.innerHTML = "";

    repositorios.forEach(repo => {
      // Linguagem detectada pelo GitHub, ou "GitHub" como fallback
      const linguagem = repo.language || "GitHub";

      // URL do ícone via devicons CDN — colorido, sem precisar de arquivos locais
      const urlIcone = LINGUAGENS_ICONES[linguagem] ?? LINGUAGENS_ICONES["GitHub"];

      // Formata o nome do repositório
      const nomeFormatado = repo.name
        .replace(/[-_]/g, " ")
        .replace(/[^a-zA-Z0-9\s]/g, "")
        .replace(/\s+t[a-z0-9]+$/i, "")
        .toUpperCase();

      // Trunca descrição longa
      const truncar = (texto, limite) =>
        texto && texto.length > limite
          ? texto.substring(0, limite) + "..."
          : texto;

      const descricao = repo.description
        ? truncar(repo.description, 100)
        : "Projeto desenvolvido no GitHub.";

      // Tags: tópicos do repo ou a linguagem
      const tags =
        repo.topics?.length > 0
          ? repo.topics.slice(0, 3).map(t => `<span class="tag">${t}</span>`).join("")
          : `<span class="tag">${linguagem}</span>`;

      // Botão deploy só aparece se houver homepage
      const botaoDeploy = repo.homepage
        ? `<a href="${repo.homepage}" target="_blank" rel="noopener" class="btn btn-ghost btn-sm">Deploy ↗</a>`
        : "";

      // Monta o slide
      const slide = document.createElement("div");
      slide.className = "swiper-slide";
      slide.innerHTML = `
        <article class="project-card">
          <figure class="project-image">
            <img
              src="${urlIcone}"
              alt="Ícone ${linguagem}"
              loading="lazy"
              onerror="this.src='https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg'"
            />
          </figure>
          <div class="project-content">
            <h3>${nomeFormatado}</h3>
            <p>${descricao}</p>
            <div class="project-tags">${tags}</div>
            <div class="project-buttons">
              <a href="${repo.html_url}" target="_blank" rel="noopener" class="btn btn-primary btn-sm">GitHub</a>
              ${botaoDeploy}
            </div>
          </div>
        </article>
      `;

      swiperWrapper.appendChild(slide);
    });

    // Esconde loading e exibe o swiper
    if (projectsLoading) projectsLoading.style.display = "none";
    if (projectsSwiper)  projectsSwiper.style.opacity  = "1";

    iniciarSwiper();

  } catch (err) {
    console.error("[Projects] Erro ao buscar repositórios:", err);
    showProjectsError("Erro ao carregar projetos. Tente novamente.");
  }
}

function showProjectsError(msg) {
  if (projectsLoading) {
    projectsLoading.innerHTML = `
      <span style="color: var(--neon); font-family: var(--font-mono); font-size: 0.8rem;">
        ✗ ${msg}
      </span>`;
  }
}

/* ============================================================
   INICIAR SWIPER
============================================================ */
function iniciarSwiper() {
  new Swiper(".projects-swiper", {
    slidesPerView: 1,
    spaceBetween:  24,
    loop:          true,
    grabCursor:    true,
    watchOverflow: true,

    breakpoints: {
      640: {
        slidesPerView: 1,
        spaceBetween:  24,
      },
      768: {
        slidesPerView:  2,
        slidesPerGroup: 2,
        spaceBetween:   24,
      },
      1024: {
        slidesPerView:  3,
        slidesPerGroup: 3,
        spaceBetween:   28,
      },
    },

    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },

    pagination: {
      el:             ".swiper-pagination",
      clickable:      true,
      dynamicBullets: true,
    },

    autoplay: {
      delay:                 4500,
      pauseOnMouseEnter:     true,
      disableOnInteraction:  false,
    },

    a11y: {
      prevSlideMessage: "Slide anterior",
      nextSlideMessage: "Próximo slide",
    },
  });
}

/* ============================================================
   FORMULÁRIO DE CONTATO
============================================================ */
formulario?.addEventListener("submit", function (e) {
  e.preventDefault();

  // Limpa erros anteriores
  document.querySelectorAll(".form-error").forEach(el => (el.textContent = ""));
  document.querySelectorAll(".form-field input, .form-field textarea")
    .forEach(el => el.classList.remove("error"));

  let isValid = true;

  function setError(inputId, errorId, msg) {
    const input = document.querySelector(`#${inputId}`);
    const error = document.querySelector(`#${errorId}`);
    if (error) error.textContent = msg;
    if (input) input.classList.add("error");
    if (isValid && input) input.focus();
    isValid = false;
  }

  const nome     = document.querySelector("#nome");
  const email    = document.querySelector("#email");
  const assunto  = document.querySelector("#assunto");
  const mensagem = document.querySelector("#mensagem");

  if (!nome    || nome.value.trim().length    < 3) setError("nome",     "erro-nome",     "▸ Nome deve ter pelo menos 3 caracteres.");
  if (!email   || !email.value.trim().match(emailRegex)) setError("email",    "erro-email",    "▸ Digite um endereço de e-mail válido.");
  if (!assunto || assunto.value.trim().length < 5) setError("assunto",  "erro-assunto",  "▸ Assunto deve ter pelo menos 5 caracteres.");
  if (!mensagem|| mensagem.value.trim().length=== 0) setError("mensagem","erro-mensagem","▸ A mensagem não pode estar vazia.");

  if (!isValid) return;

  const submitBtn  = document.querySelector("#submit-btn");
  const submitText = document.querySelector("#submit-text");
  if (submitBtn)  submitBtn.disabled    = true;
  if (submitText) submitText.textContent = "Enviando...";

  
  const assuntoVal = encodeURIComponent(assunto.value.trim());
  const msgVal     = encodeURIComponent(
    `De: ${nome.value.trim()} <${email.value.trim()}>\n\n${mensagem.value.trim()}`
  );

  
  window.location.href = `mailto:evelynlamarca@icloud.com?subject=${assuntoVal}&body=${msgVal}`;

  setTimeout(() => {
    formulario.reset();
    const successEl = document.querySelector("#form-success");
    if (successEl) {
      successEl.removeAttribute("hidden");
      successEl.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
    if (submitBtn)  submitBtn.disabled    = false;
    if (submitText) submitText.textContent = "Enviar Mensagem";
    setTimeout(() => successEl?.setAttribute("hidden", ""), 5000);
  }, 800);
});

/* ============================================================
   FOOTER — ANO ATUAL
============================================================ */
const footerYear = document.querySelector("#footer-year");
if (footerYear) footerYear.textContent = new Date().getFullYear().toString();

/* ============================================================
   INIT
============================================================ */
document.addEventListener("DOMContentLoaded", () => {
  initFadeIn();
  setTimeout(typeLoop, 600);
  getAboutGitHub();
  getProjectsGitHub();
});
