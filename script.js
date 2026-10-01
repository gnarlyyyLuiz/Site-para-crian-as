// --- NAVEGAÇÃO DE ABAS ---
function mostrarAba(abaId, elementoBtn) {
  document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));

  document.getElementById(`aba-${abaId}`).classList.add('active');
  elementoBtn.classList.add('active');
}

// --- SINTETIZADOR WEB AUDIO API ---
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function tocarFrequencia(freq, duracao = 0.5, tipo = 'sine') {
  if (audioCtx.state === 'suspended') audioCtx.resume();

  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();

  osc.type = tipo;
  osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

  gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duracao);

  osc.connect(gain);
  gain.connect(audioCtx.destination);

  osc.start();
  osc.stop(audioCtx.currentTime + duracao);
}

// --- PIANO COM EFEITO DE TECLA ---
function tocarNotaGlow(freq, nota, btn) {
  tocarFrequencia(freq, 0.6, 'triangle');
  btn.classList.add('active');
  setTimeout(() => btn.classList.remove('active'), 200);
}

// --- SONS DOS BICHINHOS ---
function tocarSomBicho(bicho, card) {
  // Animação no card
  card.style.transform = "scale(0.95)";
  setTimeout(() => card.style.transform = "", 150);

  if (bicho === 'cachorro') {
    tocarFrequencia(180, 0.15, 'sawtooth');
    setTimeout(() => tocarFrequencia(140, 0.25, 'sawtooth'), 150);
  } else if (bicho === 'gato') {
    tocarFrequencia(600, 0.4, 'sine');
  } else if (bicho === 'passaro') {
    tocarFrequencia(1200, 0.1, 'sine');
    setTimeout(() => tocarFrequencia(1500, 0.15, 'sine'), 100);
  }
}

// --- TROCA DE COR COM CONFETTI ---
function mudarCorMagica() {
  const gradientes = [
    'linear-gradient(135deg, #a8edd9 0%, #fed6e3 100%)',
    'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
    'linear-gradient(135deg, #ffdede 0%, #ffcda5 100%)',
    'linear-gradient(135deg, #d4fc79 0%, #96e6a1 100%)',
    'linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)'
  ];
  
  const sorteado = gradientes[Math.floor(Math.random() * gradientes.length)];
  document.body.style.background = sorteado;

  // Efeito de Confetti se a biblioteca estiver carregada
  if (typeof confetti === 'function') {
    confetti({ particleCount: 40, spread: 60, origin: { y: 0.8 } });
  }
}

// --- JOGO 1: GALINHA RADICAL ---
let pontosGalinha = 0;
function pularGalinha() {
  const galinha = document.getElementById('galinha-hero');
  if (galinha.style.bottom === "100px") return;

  galinha.style.bottom = "100px";
  pontosGalinha++;
  document.getElementById('score-galinha').innerText = `Pontos: ${pontosGalinha}`;
  tocarFrequencia(400, 0.2, 'sine');

  setTimeout(() => {
    galinha.style.bottom = "20px";
  }, 350);
}

document.addEventListener('keydown', (e) => {
  if (e.code === 'Space' && document.getElementById('aba-jogos').classList.contains('active')) {
    e.preventDefault();
    pularGalinha();
  }
});

// --- JOGO 2: CAÇA AOS BALÕES ---
let pontosBaloes = 0;
function gerarBalao() {
  const stage = document.getElementById('stage-baloes');
  const balao = document.createElement('div');
  const cores = ['🎈', '🎨', '🌟', '💖', '🎁'];
  
  balao.className = 'floating-balloon';
  balao.innerText = cores[Math.floor(Math.random() * cores.length)];
  balao.style.left = `${Math.random() * 80 + 5}%`;

  balao.onclick = () => {
    pontosBaloes++;
    document.getElementById('score-baloes').innerText = `Pop: ${pontosBaloes}`;
    tocarFrequencia(800, 0.1, 'triangle');
    balao.remove();
  };

  stage.appendChild(balao);
  setTimeout(() => { if (balao.parentNode) balao.remove(); }, 3000);
}

// --- JOGO 3: JOGO DA MEMÓRIA ---
const iconesMemoria = ['🚀', '🚀', '🦄', '🦄', '👾', '👾', '🍦', '🍦'];
let cartasAbertas = [];
let paresEncontrados = 0;

function iniciarMemoria() {
  const grid = document.getElementById('grid-memoria');
  grid.innerHTML = '';
  cartasAbertas = [];
  paresEncontrados = 0;
  document.getElementById('score-memoria').innerText = `Pares: 0/4`;

  const embaralhado = [...iconesMemoria].sort(() => Math.random() - 0.5);

  embaralhado.forEach((emoji) => {
    const cell = document.createElement('div');
    cell.className = 'cell';
    cell.dataset.emoji = emoji;
    cell.innerText = '❓';

    cell.onclick = () => {
      if (cartasAbertas.length < 2 && cell.innerText === '❓') {
        cell.innerText = emoji;
        cartasAbertas.push(cell);

        if (cartasAbertas.length === 2) {
          if (cartasAbertas[0].dataset.emoji === cartasAbertas[1].dataset.emoji) {
            paresEncontrados++;
            document.getElementById('score-memoria').innerText = `Pares: ${paresEncontrados}/4`;
            cartasAbertas = [];
            tocarFrequencia(523, 0.3, 'sine');
            
            if (paresEncontrados === 4 && typeof confetti === 'function') {
              confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
            }
          } else {
            setTimeout(() => {
              cartasAbertas[0].innerText = '❓';
              cartasAbertas[1].innerText = '❓';
              cartasAbertas = [];
            }, 700);
          }
        }
      }
    };
    grid.appendChild(cell);
  });
}

// --- JOGO 4: JOGO DA VELHA NEON ---
let turno = '❌';
let estadoVelha = Array(9).fill('');

function iniciarVelha() {
  const grid = document.getElementById('grid-velha');
  grid.innerHTML = '';
  estadoVelha.fill('');
  turno = '❌';
  document.getElementById('turn-velha').innerText = `Vez: ${turno}`;

  for (let i = 0; i < 9; i++) {
    const cell = document.createElement('div');
    cell.className = 'cell';
    cell.onclick = () => {
      if (estadoVelha[i] === '') {
        estadoVelha[i] = turno;
        cell.innerText = turno;
        tocarFrequencia(300, 0.1, 'sine');
        turno = turno === '❌' ? '⭕' : '❌';
        document.getElementById('turn-velha').innerText = `Vez: ${turno}`;
      }
    };
    grid.appendChild(cell);
  }
}

// Inicializações automáticas
iniciarMemoria();
iniciarVelha();
setInterval(gerarBalao, 2000);
