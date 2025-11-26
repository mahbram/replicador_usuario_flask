// Timeline principal do GSAP
const tl = gsap.timeline({ defaults: { duration: 0.6, ease: "power2.out" } });

// 1️⃣ Entrada do card principal e do cabeçalho
tl.from("#loginCard", { opacity: 0, y: 50 });
tl.from("#brandHeader", { opacity: 0, y: -30 }, "-=0.3");

// 2️⃣ Animação dos inputs em sequência
tl.from(["#inputUser", "#inputPass"], {
  opacity: 0,
  y: 20,
  stagger: 0.2
}, "-=0.2");

// 3️⃣ Botão de login
tl.from("#loginBtn", {
  opacity: 0,
  scale: 0.8,
  ease: "back.out(1.7)"
}, "-=0.1");

// 4️⃣ Caso haja mensagem de alerta, animar suavemente
const alertMsg = document.getElementById("alertMessage");
if (alertMsg) {
  gsap.from(alertMsg, { opacity: 0, y: -20, duration: 0.5 });
}

// 👁️ Toggle de visualização de senha
const togglePassword = document.querySelector("#togglePassword");
const password = document.querySelector("#password");

togglePassword.addEventListener("click", () => {
  const type = password.getAttribute("type") === "password" ? "text" : "password";
  password.setAttribute("type", type);
  togglePassword.classList.toggle("fa-eye-slash");

  // microanimação no ícone ao alternar
  gsap.fromTo(togglePassword,
    { scale: 0.8 },
    { scale: 1, duration: 0.2, ease: "power1.out" }
  );
});

// 🎯 Efeito de clique no botão
const loginBtn = document.getElementById("loginBtn");

loginBtn.addEventListener("mousedown", () => {
  gsap.to(loginBtn, { scale: 0.95, duration: 0.1 });
});

loginBtn.addEventListener("mouseup", () => {
  gsap.to(loginBtn, { scale: 1, duration: 0.1 });
});

gsap.from(".app-footer", {
  y: 40,
  opacity: 0,
  duration: 1,
  ease: "power2.out",
  delay: 0.6
});
