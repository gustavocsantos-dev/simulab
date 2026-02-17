document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("formSimulado");
  const gerarBtn = document.getElementById("gerarPerguntas");
  const perguntasContainer = document.getElementById("perguntasContainer");

  let numAlternativas = 4;

  document.querySelectorAll('input[name="alternativas"]').forEach(radio => {
    radio.addEventListener("change", e => {
      numAlternativas = parseInt(e.target.value);
    });
  });

  gerarBtn.addEventListener("click", () => {
    perguntasContainer.innerHTML = "";

    const qtd = parseInt(document.getElementById("quantidade").value);
    if (!qtd || qtd < 1) {
      alert("Digite uma quantidade válida de perguntas.");
      return;
    }

    for (let i = 1; i <= qtd; i++) {
      const bloco = document.createElement("div");
      bloco.classList.add("pergunta");
      bloco.innerHTML = `
        <h3>Pergunta ${i}</h3>
        <label>Enunciado:</label>
        <textarea rows="3" required placeholder="Digite o enunciado"></textarea>
        ${Array.from({ length: numAlternativas }, (_, idx) => {
          const letra = String.fromCharCode(65 + idx);
          return `
            <label>Alternativa ${letra}:</label>
            <input type="text" placeholder="Opção ${letra}" required />
          `;
        }).join("")}
        <label>Alternativa correta:</label>
        <select required>
          ${Array.from({ length: numAlternativas }, (_, idx) => {
            const letra = String.fromCharCode(65 + idx);
            return `<option value="${letra}">${letra}</option>`;
          }).join("")}
        </select>
      `;
      perguntasContainer.appendChild(bloco);
    }
  });

  form.addEventListener("submit", e => {
    e.preventDefault();

    const materia = document.getElementById("materia").value.trim();
    const topico = document.getElementById("topico").value.trim();
    const blocos = document.querySelectorAll(".pergunta");

    const perguntas = Array.from(blocos).map(bloco => {
      const enunciado = bloco.querySelector("textarea").value;
      const alternativas = Array.from(bloco.querySelectorAll('input[type="text"]')).map(i => i.value);
      const correta = bloco.querySelector("select").value;
      return { enunciado, alternativas, correta };
    });

    const novoSimulado = { materia, topico, perguntas };
    const simulados = JSON.parse(localStorage.getItem("simulados")) || [];
    simulados.push(novoSimulado);
    localStorage.setItem("simulados", JSON.stringify(simulados));

    alert("Simulado salvo com sucesso!");
    window.location.href = "index.html";
  });
});
