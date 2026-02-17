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

// ===================== SIMULADOS PADRÃO =====================
const simuladosIniciais = [
  {
    materia: "História",
    topico: "Grécia Antiga",
    perguntas: [
      {
        enunciado: "O período da história grega caracterizado pela formação das Pólis (cidades-estado) e pela expansão colonial é o:",
        alternativas: ["Período Micênico", "Período Arcaico", "Período Helênico", "Período Homérico"],
        correta: "B"
      },
      {
        enunciado: "Em Atenas, a 'Eclésia' era a assembleia popular onde os cidadãos votavam as leis. Quem era considerado cidadão?",
        alternativas: ["Todos os moradores da cidade", "Homens e mulheres nascidos em Atenas", "Homens livres, filhos de pais atenienses e maiores de idade", "Apenas os guerreiros que possuíam terras"],
        correta: "C"
      },
      {
        enunciado: "A educação espartana era rigidamente voltada para a formação militar. Qual era o nome desse sistema?",
        alternativas: ["Paidêia", "Ágora", "Agogê", "Ostracismo"],
        correta: "C"
      },
      {
        enunciado: "As Guerras Médicas foram o conflito entre as cidades gregas e qual império?",
        alternativas: ["Império Romano", "Império Egípcio", "Império Persa", "Império Cartaginês"],
        correta: "C"
      },
      {
        enunciado: "Qual filósofo grego foi mestre de Alexandre, o Grande, e fundou o Liceu?",
        alternativas: ["Sócrates", "Platão", "Aristóteles", "Pitágoras"],
        correta: "C"
      }
    ]
  },
  {
    materia: "Filosofia",
    topico: "Contratualismo",
    perguntas: [
      {
        enunciado: "Para Thomas Hobbes, o 'Estado de Natureza' é caracterizado como:",
        alternativas: ["Um período de paz", "Uma guerra de todos contra todos", "Um estágio de evolução espiritual", "Uma organização baseada na cooperação"],
        correta: "B"
      },
      {
        enunciado: "Qual filósofo afirmou que o homem nasce bom, mas a sociedade o corrompe?",
        alternativas: ["John Locke", "Immanuel Kant", "Jean-Jacques Rousseau", "Maquiavel"],
        correta: "C"
      },
      {
        enunciado: "Segundo John Locke, os direitos naturais inalienáveis do ser humano são:",
        alternativas: ["Vida, liberdade e propriedade privada", "Poder, riqueza e exército", "Educação, saúde e moradia", "Trabalho, lazer e religião"],
        correta: "A"
      },
      {
        enunciado: "O conceito de 'Leviatã', de Hobbes, refere-se a:",
        alternativas: ["Um monstro mitológico", "O Estado como um poder absoluto", "A liberdade individual plena", "O sistema democrático moderno"],
        correta: "B"
      },
      {
        enunciado: "Para Rousseau, a 'Vontade Geral' representa:",
        alternativas: ["A soma da vontade de todos", "A vontade do rei", "O interesse comum em prol do bem coletivo", "A opinião da maioria absoluta"],
        correta: "C"
      }
    ]
  },
  {
    materia: "Geografia",
    topico: "Geologia e Relevo",
    perguntas: [
      {
        enunciado: "As camadas internas da Terra, da mais externa para a mais interna, são:",
        alternativas: ["Manto, Crosta e Núcleo", "Crosta, Núcleo e Manto", "Crosta, Manto e Núcleo", "Núcleo, Manto e Crosta"],
        correta: "C"
      },
      {
        enunciado: "O movimento das placas tectônicas que ocorre quando elas se afastam é chamado de:",
        alternativas: ["Convergente", "Divergente", "Transformante", "Estático"],
        correta: "B"
      },
      {
        enunciado: "Qual dessas formas de relevo é caracterizada por áreas planas e elevadas?",
        alternativas: ["Planície", "Depressão", "Planalto", "Montanha"],
        correta: "C"
      },
      {
        enunciado: "O processo de desgaste das rochas pela ação da água, vento e temperatura é o:",
        alternativas: ["Intemperismo", "Vulcanismo", "Tectonismo", "Sedimentação"],
        correta: "A"
      },
      {
        enunciado: "A Teoria da Deriva Continental afirma que todos os continentes eram um só bloco chamado:",
        alternativas: ["Pantalassa", "Eurásia", "Gondwana", "Pangeia"],
        correta: "D"
      }
    ]
  }
];

// Cria os simulados padrão na primeira execução
if (!localStorage.getItem("simulados")) {
  localStorage.setItem("simulados", JSON.stringify(simuladosIniciais));
}