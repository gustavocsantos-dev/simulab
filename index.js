const prompt = require("prompt-sync")({ sigint: true });

let gabarito = ["A", "C", "D", "D"];
let pontos = 0;
let respostas = [];

const questoes = [
  {
    enunciado: "1) Ao software de um computador são atribuídas duas ações distintas: primeiro, fazer o computador funcionar e segundo, permitir que o usuário faça o que desejar. Assinale a alternativa que estabelece uma definição para o software de sistema:",
    alternativas: {
      A: "Programas de sistema, que gerenciam a operação do computador em si.",
      B: "Realizam o trabalho real desejado pelo usuário.",
      C: "Consiste em hardware: processadores, memória, discos, etc.",
      D: "Pode ser entendido como um programa em execução."
    },
    correta: "A"
  },
  {
    enunciado: "2) O SO funciona como uma interface entre usuário e computador. Assinale as assertivas corretas:",
    alternativas: {
      A: "I e II",
      B: "I e IV",
      C: "Somente a III",
      D: "Somente a I"
    },
    correta: "C"
  },
  {
    enunciado: "3) Um SO pode permitir que um computador execute vários programas na memória sem interferência entre si. Essa função refere-se a:",
    alternativas: {
      A: "Monitorar o desempenho.",
      B: "Formatar dispositivos como pen drives.",
      C: "Inicializar o computador.",
      D: "Gerenciar a alocação de memória."
    },
    correta: "D"
  },
  {
    enunciado: "4) Qual alternativa NÃO representa uma função do SO?",
    alternativas: {
      A: "Permitir que aplicações usem a memória.",
      B: "Gerenciar o tráfego de dados entre periféricos.",
      C: "Fornecer informações relevantes ao usuário em caso de erro.",
      D: "Realizar buscas em bases de dados de softwares aplicativos."
    },
    correta: "D"
  }
];

// LOOP CONTROLADO
for (let i = 0; i < questoes.length; i++) {
  console.clear();
  let q = questoes[i];
  console.log(q.enunciado);

  for (let letra in q.alternativas) {
    console.log(letra + ") " + q.alternativas[letra]);
  }

  let resposta = "";
  while (!["A", "B", "C", "D"].includes(resposta)) {
    resposta = prompt("\nQual é a resposta correta? (A, B, C ou D): ").toUpperCase();
  }

  respostas.push(resposta);
  if (resposta === q.correta) pontos += 2.5;
}

// RESULTADO
console.clear();
console.log("============ GABARITO ============");
console.log(gabarito.join(" "));

console.log("============ SUA PROVA ============");
console.log(respostas.join(" "));

console.log("Sua pontuação foi de: " + pontos);
