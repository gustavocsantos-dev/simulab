// ===================== INDEX =====================
if (document.getElementById("novoSimuladoBtn")) {
  const container = document.getElementById("simuladosContainer");
  const btnNovo = document.getElementById("novoSimuladoBtn");

  btnNovo.addEventListener("click", () => {
    window.location.href = "novo-simulado.html";
  });

  const simulados = JSON.parse(localStorage.getItem("simulados") || "[]");
  container.innerHTML = "";

  simulados.forEach((simulado, index) => {
    const card = document.createElement("div");
    card.id="simulado-card";
    card.innerHTML = `
      <h3>${simulado.materia}</h3>
      <p><strong>Tópico:</strong> ${simulado.topico}</p>
      <p><strong>Perguntas:</strong> ${simulado.perguntas.length}</p>
      <button class="executar-btn" onclick="executarSimulado(${index})">Executar Simulado</button>
      <button onclick="deletarSimulado(${index})" style="background:#b33;">Excluir</button>
    `;
    container.appendChild(card);
  });
}

function executarSimulado(id) {
  window.location.href = `executar-simulado.html?id=${id}`;
}

// ===================== NOVO SIMULADO =====================
if (document.getElementById("formSimulado")) {
  const form = document.getElementById("formSimulado");
  const perguntasContainer = document.getElementById("perguntasContainer");
  const qtdPerguntasInput = document.getElementById("qtdPerguntas");

  qtdPerguntasInput.addEventListener("change", gerarPerguntas);

  function gerarPerguntas() {
    perguntasContainer.innerHTML = "";
    const qtd = parseInt(qtdPerguntasInput.value);
    const qtdAlternativas = document.querySelector('input[name="alternativas"]:checked').value;

    for (let i = 1; i <= qtd; i++) {
      const div = document.createElement("div");
      div.classList.add("pergunta");

      let inputs = `
        <h3>Pergunta ${i}</h3>
        <label>Enunciado:</label>
        <textarea name="enunciado${i}" required></textarea>
      `;

      const letras = ["A", "B", "C", "D", "E"];
      for (let j = 0; j < qtdAlternativas; j++) {
        inputs += `
          <label>Alternativa ${letras[j]}:</label>
          <input type="text" name="alt${i}${letras[j]}" required>
        `;
      }

      inputs += `
        <label>Alternativa correta:</label>
        <select name="correta${i}">
          ${letras
            .slice(0, qtdAlternativas)
            .map((l) => `<option value="${l}">${l}</option>`)
            .join("")}
        </select>
      `;

      div.innerHTML = inputs;
      perguntasContainer.appendChild(div);
    }
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const materia = document.getElementById("materia").value;
    const topico = document.getElementById("topico").value;
    const qtd = parseInt(qtdPerguntasInput.value);
    const qtdAlternativas = document.querySelector('input[name="alternativas"]:checked').value;

    const perguntas = [];

    for (let i = 1; i <= qtd; i++) {
      const enunciado = form[`enunciado${i}`].value;
      const letras = ["A", "B", "C", "D", "E"].slice(0, qtdAlternativas);
      const alternativas = letras.map((l) => form[`alt${i}${l}`].value);
      const correta = form[`correta${i}`].value;
      perguntas.push({ enunciado, alternativas, correta });
    }

    const simulados = JSON.parse(localStorage.getItem("simulados") || "[]");
    simulados.push({ materia, topico, perguntas });
    localStorage.setItem("simulados", JSON.stringify(simulados));

    alert("Simulado salvo com sucesso!");
    window.location.href = "index.html";
  });
}

// ===================== EXECUTAR SIMULADO =====================
if (document.getElementById("execucaoContainer")) {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");
  const simulados = JSON.parse(localStorage.getItem("simulados") || "[]");
  const simulado = simulados[id];
  const container = document.getElementById("execucaoContainer");

  if (!simulado) {
    container.innerHTML = "<p>Simulado não encontrado.</p>";
  } else {
    container.innerHTML = `<h2>${simulado.materia} - ${simulado.topico}</h2>`;

    simulado.perguntas.forEach((p, i) => {
      const div = document.createElement("div");
      div.classList.add("pergunta");

      div.innerHTML = `
        <p><strong>${i + 1}.</strong> ${p.enunciado}</p>
        <div class="resposta">
          ${p.alternativas
            .map(
              (alt, idx) => `
            <label>
              <input type="radio" name="q${i}" value="${String.fromCharCode(65 + idx)}">
              ${String.fromCharCode(65 + idx)}) ${alt}
            </label>
          `
            )
            .join("")}
        </div>
      `;

      container.appendChild(div);
    });

    const btnFinalizar = document.createElement("button");
    btnFinalizar.textContent = "Finalizar Simulado";
    btnFinalizar.className = "btnFinalizar"
    btnFinalizar.addEventListener("click", () => finalizarSimulado(simulado));
    container.appendChild(btnFinalizar);
  }

  function finalizarSimulado(simulado) {
    const respostas = [];
    const perguntas = simulado.perguntas;
    let acertos = 0;

    perguntas.forEach((_, i) => {
      const marcada = document.querySelector(`input[name="q${i}"]:checked`);
      if (marcada) respostas.push(marcada.value);
      else respostas.push(null);
    });

    perguntas.forEach((p, i) => {
      const divPergunta = document.getElementsByClassName("pergunta")[i];
      if (respostas[i] === p.correta) {
        divPergunta.classList.add("correta");
        acertos++;
      } else {
        divPergunta.classList.add("errada");
      }
    });

    const resultado = document.createElement("div");
    resultado.classList.add("resultado");
    resultado.innerHTML = `
      <h3>Resultado:</h3>
      <p>Você acertou <strong>${acertos}</strong> de <strong>${perguntas.length}</strong> perguntas.</p>
      <button onclick="window.location.href='index.html'">Voltar à Home</button>
    `;
    container.appendChild(resultado);
  }
}

// ===================== FUNÇÕES DELETAR E GERENCIAR =====================
function carregarSimulados() {
  const dados = localStorage.getItem("simulados");
  return dados ? JSON.parse(dados) : [];
}

function salvarSimulados(simulados) {
  localStorage.setItem("simulados", JSON.stringify(simulados));
}

function renderizarSimulados() {
  const container = document.getElementById("simuladosContainer");
  if (!container) return;

  const simulados = carregarSimulados();
  container.innerHTML = "";

  simulados.forEach((simulado, index) => {
    const card = document.createElement("div");
    card.id="simulado-card";
    card.innerHTML = `
      <h3>${simulado.materia}</h3>
      <p><strong>Tópico:</strong> ${simulado.topico}</p>
      <p><strong>Perguntas:</strong> ${simulado.perguntas.length}</p>
      <button class="executar-btn" onclick="executarSimulado(${index})">Executar Simulado</button>
      <button onclick="deletarSimulado(${index})" style="background:#b33;">Excluir</button>
    `;
    container.appendChild(card);
  });
}

function deletarSimulado(index) {
  const simulados = carregarSimulados();
  if (confirm("Tem certeza que deseja excluir este simulado?")) {
    simulados.splice(index, 1);
    salvarSimulados(simulados);
    renderizarSimulados();
  }
}

// ===================== SIMULADO PADRÃO =====================
const simuladoPadrao = {
  materia: "Gerenciamento de Projetos",
  topico: "PMBOK",
  perguntas: [
    {
      enunciado: "Sobre grupos de processos é correto afirmar que:",
      alternativas: [
        "Se ligam pelos resultados que produzem.",
        "Se sobrepõem uns aos outros.",
        "O encerramento de uma fase é subsídio para outra.",
        "Todas as anteriores."
      ],
      correta: "D"
    },
    {
      enunciado: "A diferença entre programa e projeto é:",
      alternativas: [
        "Um programa é feito de múltiplos projetos.",
        "Programas são projetos de longa duração.",
        "Os programas são empreendimentos permanentes.",
        "Todas acima."
      ],
      correta: "A"
    },
    {
      enunciado:
        "O propósito do PMBOK é identificar e descrever o conhecimento e práticas que devem ser aplicadas uniformemente aos projetos:",
      alternativas: [
        "Pequenos.",
        "Grandes.",
        "Que possuem o escopo bem definidos.",
        "A afirmação acima é falsa."
      ],
      correta: "C"
    },
    {
      enunciado: "Quem determina os requisitos de um novo projeto?",
      alternativas: [
        "O cliente.",
        "Os stakeholders.",
        "O gerente do projeto.",
        "O gerente funcional."
      ],
      correta: "A"
    },
    {
      enunciado:
        "_______________ asseguram que os objetivos do projeto estão sendo atingidos, por meio de monitoração regular do seu progresso para identificar variações do plano e, portanto, ações corretivas podem ser tomadas quando necessárias.",
      alternativas: [
        "Controles do projeto.",
        "Processos de controle.",
        "Controles de qualidade.",
        "Garantias da qualidade."
      ],
      correta: "B"
    }
  ]
};


// Cria o simulado padrão na primeira execução
if (!localStorage.getItem("simulados")) {
  localStorage.setItem("simulados", JSON.stringify([simuladoPadrao]));
}




