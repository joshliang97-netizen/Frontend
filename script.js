const API_URL = "https://backend-gail.onrender.com";
let token = localStorage.getItem("token");
let username = localStorage.getItem("username");

const loginSec = document.getElementById("loginSection");
const regSec = document.getElementById("registerSection");
const gameSec = document.getElementById("gameSection");
const usuarioSpan = document.getElementById("usuario");
const saldoSpan = document.getElementById("saldo");
const resultadoP = document.getElementById("resultado");

function mostrar(seccion) {
  [loginSec, regSec, gameSec].forEach(s => s.classList.add("hidden"));
  seccion.classList.remove("hidden");
}

async function obtenerSaldo() {
  const res = await fetch(`${API_URL}/saldo`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (res.ok) {
    const data = await res.json();
    saldoSpan.textContent = data.saldo;
  }
}

async function login() {
  const username = document.getElementById("loginUser").value;
  const password = document.getElementById("loginPass").value;
  const res = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password })
  });
  if (!res.ok) return alert(await res.text());
  const data = await res.json();
  token = data.token;
  localStorage.setItem("token", token);
  localStorage.setItem("username", data.username);
  usuarioSpan.textContent = data.username;
  mostrar(gameSec);
  obtenerSaldo();
}

async function registrar() {
  const username = document.getElementById("regUser").value;
  const password = document.getElementById("regPass").value;
  const res = await fetch(`${API_URL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password })
  });
  alert(await res.text());
  mostrar(loginSec);
}

async function girar() {
  const spinSound = document.getElementById("spinSound");
  const winSound = document.getElementById("winSound");
  const loseSound = document.getElementById("loseSound");

  spinSound.play();
  const apuesta = parseInt(document.getElementById("apuesta").value);
  const reels = ["🍒", "🍋", "🍉", "🍇", "⭐", "🔔", "7️⃣"];

  document.querySelectorAll(".reel").forEach(r => {
    r.style.transform = "rotate(720deg)";
    r.textContent = reels[Math.floor(Math.random() * reels.length)];
  });

  const res = await fetch(`${API_URL}/apostar`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({ apuesta })
  });

  if (res.ok) {
    const data = await res.json();
    resultadoP.textContent = data.resultado + (data.premio ? ` (+${data.premio})` : "");
    saldoSpan.textContent = data.saldo;
    data.premio > 0 ? winSound.play() : loseSound.play();
  } else {
    alert(await res.text());
  }
}

// Eventos
document.getElementById("loginBtn").onclick = login;
document.getElementById("regBtn").onclick = registrar;
document.getElementById("toRegister").onclick = () => mostrar(regSec);
document.getElementById("toLogin").onclick = () => mostrar(loginSec);
document.getElementById("spinBtn").onclick = girar;
document.getElementById("logoutBtn").onclick = () => {
  localStorage.clear();
  mostrar(loginSec);
};

// Autologin
if (token && username) {
  usuarioSpan.textContent = username;
  mostrar(gameSec);
  obtenerSaldo();
} else mostrar(loginSec);
