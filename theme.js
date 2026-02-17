// === THEME.JS CORRIGIDO ===

function gerenciarTema() {
  const body = document.body;
  const toggleTheme = document.getElementById("toggleTheme");
  
  // 1. Ao carregar a página: Verifica o que está salvo ou usa o padrão "claro"
  const temaSalvo = localStorage.getItem("tema") || "claro";
  
  // Aplica o tema imediatamente ao carregar
  body.classList.add(temaSalvo);
  
  // Atualiza o ícone do botão logo de cara
  if (toggleTheme) {
    toggleTheme.textContent = temaSalvo === "escuro" ? "☀️" : "🌙";

    // 2. Lógica do Clique: O que acontece quando o usuário aperta o botão
    toggleTheme.addEventListener("click", () => {
      // Inverte as classes
      if (body.classList.contains("escuro")) {
        body.classList.replace("escuro", "claro");
        localStorage.setItem("tema", "claro");
        toggleTheme.textContent = "🌙";
      } else {
        body.classList.replace("claro", "escuro");
        localStorage.setItem("tema", "escuro");
        toggleTheme.textContent = "☀️";
      }
      
      // Caso exista o card de simulado na página, força a atualização dele também
      const simuladoCard = document.getElementById("simulado-card");
      simuladoCard?.classList.toggle("escuro", body.classList.contains("escuro"));
    });
  }
}

// Executa a função assim que o script é lido
gerenciarTema();