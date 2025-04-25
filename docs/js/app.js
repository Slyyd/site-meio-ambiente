import  {getCurrentQuestion, passCurrentQuestion } from "./views/QuestionHandler.js";

let spn_num_questao = document.querySelector("#spn_num_questao");   // Span para o número da questão
let spn_txt_questao = document.querySelector("#spn_txt_questao");   // Span para a pergunta da questão

let div_questoes = document.querySelector(".questionDiv")           // Div para as opções das questões

let h1_pontos = document.querySelector("#h1_pontos");               // H1 para os pontos
let h1_dificuldade = document.querySelector("#h1_dificuldade");     // H1 para a dificuldade

let questaoAtual;                                                   // Inicialização da váriavel para poder usar fora da função atualizarPagina

atualizarPagina();                                                // Chama a função pela primeira vez ao iniciar a página

async function atualizarPagina() {
    let valoresAtualizados = await getCurrentQuestion();

    questaoAtual = valoresAtualizados.currentQuestion;

    if (valoresAtualizados.hasEnded) {
        console.log("AAAAAAAAAAAAA");
        
        // Se retornar verdadeiro, é porque as perguntas acabaram
        spn_num_questao.textContent = "???"
        spn_txt_questao.textContent = `Você fez ${valoresAtualizados.pointsCounter} ponto(s)!`;
        h1_pontos.textContent = "Pontos: " + valoresAtualizados.pointsCounter;
        h1_dificuldade.textContent = "Dificuldade: ???";
        div_questoes.innerHTML = "";
        return;
    }

    spn_num_questao.textContent = valoresAtualizados.questionCounter + 1;
    spn_txt_questao.textContent = questaoAtual.pergunta;
    h1_pontos.textContent = "Pontos: " + valoresAtualizados.pointsCounter;
    h1_dificuldade.textContent = "Dificuldade: " + questaoAtual.nivel;
    div_questoes.innerHTML = ""; // Limpa a div de questões para acomodar a próxima

    for (const resposta in questaoAtual.opcoes) { // Itera sobre todas as opções, criando um botão para cada e setando um id com o número de cada.
        let newButton = document.createElement("button");
        newButton.textContent = questaoAtual.opcoes[resposta];
        newButton.id = resposta;

        newButton.addEventListener("click", botaoQuestao);

        if (resposta == parseInt(questaoAtual.resposta)) {newButton.style.backgroundColor = "green";}

        div_questoes.appendChild(newButton);

    }

}

function botaoQuestao(e) {
    // Função para os botões do quiz

    let hasScored;
    if (parseInt(e.currentTarget.id) == questaoAtual.resposta) {hasScored = true;}

    passCurrentQuestion(hasScored)

    atualizarPagina();

}

