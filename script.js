/* =============================================
   GS Tech – script.js
   - Alternância de tema (claro/escuro) com LocalStorage
   - Navbar com efeito de scroll
   - Animações fade-in via IntersectionObserver
   - Chatbot com respostas automáticas
   ============================================= */

/* ---- Número do WhatsApp (substitua depois) ---- */
const WA_NUMBER = 'SEUNUMERO';
const WA_URL    = `https://wa.me/${WA_NUMBER}`;

/* =============================================
   1. TEMA CLARO / ESCURO
   ============================================= */
const html        = document.documentElement;
const themeToggle = document.getElementById('themeToggle');
const themeIcon   = document.getElementById('themeIcon');

function applyTheme(theme) {
  html.setAttribute('data-theme', theme);
  themeIcon.className = theme === 'dark'
    ? 'fa-solid fa-sun'
    : 'fa-solid fa-moon';
}

// Carrega tema salvo ou usa escuro como padrão
const savedTheme = localStorage.getItem('gstech-theme') || 'dark';
applyTheme(savedTheme);

// Alterna ao clicar
themeToggle.addEventListener('click', () => {
  const current = html.getAttribute('data-theme');
  const next    = current === 'dark' ? 'light' : 'dark';
  applyTheme(next);
  localStorage.setItem('gstech-theme', next);
});

/* =============================================
   2. NAVBAR – Sombra ao rolar
   ============================================= */
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
  if (window.scrollY > 40) {
    navbar.style.boxShadow = '0 4px 24px rgba(0,0,0,0.3)';
  } else {
    navbar.style.boxShadow = 'none';
  }
}, { passive: true });

/* Fecha o menu mobile ao clicar em link */
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    const toggler  = document.querySelector('.navbar-toggler');
    const collapse = document.getElementById('navMenu');
    if (collapse.classList.contains('show')) toggler.click();
  });
});

/* =============================================
   3. FADE-IN VIA IntersectionObserver
   ============================================= */
const fadeEls = document.querySelectorAll('.fade-in');

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target); // anima só uma vez
      }
    });
  },
  { threshold: 0.12 }
);

fadeEls.forEach(el => observer.observe(el));

/* =============================================
   4. CHATBOT
   ============================================= */
const chatbotToggle = document.getElementById('chatbotToggle');
const chatbotWindow = document.getElementById('chatbotWindow');
const chatbotClose  = document.getElementById('chatbotClose');
const chatMessages  = document.getElementById('chatMessages');
const chatOptions   = document.getElementById('chatOptions');

// Opções do menu rápido
const QUICK_OPTIONS = [
  { label: '💰 Quero um orçamento',          key: 'orcamento' },
  { label: '🐢 Meu computador está lento',   key: 'lento'     },
  { label: '⚡ Meu notebook não liga',        key: 'naoliga'   },
  { label: '📱 Falar no WhatsApp',           key: 'whatsapp'  },
];

// Respostas automáticas
const RESPOSTAS = {
  orcamento: 'Claro! Para um orçamento, basta nos informar o problema e o modelo do aparelho. Você pode enviar uma mensagem pelo WhatsApp agora mesmo 😊',
  lento:     'Computador lento geralmente é sinal de vírus, falta de manutenção ou necessidade de upgrade (SSD ou RAM). Podemos fazer um diagnóstico rápido pra você!',
  naoliga:   'Notebook que não liga pode ter problema na bateria, no carregador ou na placa. Traga até nós ou descreva melhor o problema — vamos ajudar!',
  whatsapp:  null, // Abre WhatsApp direto
};

// Abre a janela do chat e exibe a saudação
function openChat() {
  chatbotWindow.classList.add('open');
  chatbotToggle.setAttribute('aria-expanded', 'true');
  if (chatMessages.children.length === 0) {
    // Mensagem de boas-vindas
    addMessage('bot', 'Olá! 👋 Como posso ajudar?');
    renderOptions();
  }
}

// Fecha o chat
function closeChat() {
  chatbotWindow.classList.remove('open');
  chatbotToggle.setAttribute('aria-expanded', 'false');
}

// Adiciona uma mensagem à janela
function addMessage(type, text) {
  const div = document.createElement('div');
  div.className = type === 'bot' ? 'msg-bot' : 'msg-user';
  div.textContent = text;
  chatMessages.appendChild(div);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Renderiza os botões de opção rápida
function renderOptions() {
  chatOptions.innerHTML = '';
  QUICK_OPTIONS.forEach(opt => {
    const btn = document.createElement('button');
    btn.className   = 'chat-opt-btn';
    btn.textContent = opt.label;
    btn.addEventListener('click', () => handleOption(opt));
    chatOptions.appendChild(btn);
  });
}

// Lida com a escolha do usuário
function handleOption(opt) {
  // Mostra a escolha do usuário
  addMessage('user', opt.label);
  // Remove os botões temporariamente
  chatOptions.innerHTML = '';

  if (opt.key === 'whatsapp') {
    // Redireciona para WhatsApp
    window.open(WA_URL, '_blank');
    setTimeout(() => {
      addMessage('bot', 'Abrindo o WhatsApp... até já! 👋');
      setTimeout(renderOptions, 1200);
    }, 400);
    return;
  }

  // Simula "digitando…"
  const typing = document.createElement('div');
  typing.className   = 'msg-bot';
  typing.textContent = '...';
  chatMessages.appendChild(typing);
  chatMessages.scrollTop = chatMessages.scrollHeight;

  setTimeout(() => {
    typing.remove();
    addMessage('bot', RESPOSTAS[opt.key]);
    // Mostra opção de WhatsApp após resposta
    setTimeout(() => {
      addMessage('bot', 'Quer falar direto com a gente? 👇');
      renderOptions();
    }, 800);
  }, 900);
}

// Eventos
chatbotToggle.addEventListener('click', () => {
  chatbotWindow.classList.contains('open') ? closeChat() : openChat();
});

chatbotClose.addEventListener('click', closeChat);

// Fecha ao clicar fora
document.addEventListener('click', (e) => {
  if (
    chatbotWindow.classList.contains('open') &&
    !chatbotWindow.contains(e.target) &&
    !chatbotToggle.contains(e.target)
  ) {
    closeChat();
  }
});
