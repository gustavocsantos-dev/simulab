// === THEME.JS ===

// Função que aplica o tema salvo em qualquer página
function aplicarTemaSalvo() {
  const temaSalvo = localStorage.getItem("tema") || "claro";
  document.body.classList.remove("claro", "escuro");
  document.body.classList.add(temaSalvo);

  const toggleTheme = document.getElementById("toggleTheme");
  const simuladoCard = document.getElementById("simulado-card");

  // Atualiza o ícone, se o botão existir
  if (toggleTheme) {
    toggleTheme.textContent = temaSalvo === "escuro" ? "☀️" : "🌙";

    toggleTheme.addEventListener("click", () => {
      document.body.classList.toggle("escuro");
      simuladoCard?.classList.toggle("escuro");

      const estaEscuro = document.body.classList.contains("escuro");
      const modoAtual = estaEscuro ? "escuro" : "claro";

      toggleTheme.textContent = estaEscuro ? "☀️" : "🌙";
      localStorage.setItem("tema", modoAtual);
    });
  }
}

// Executa imediatamente ao carregar
aplicarTemaSalvo();
