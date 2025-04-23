import  {retornarQuestaoAtual, carregarQuestoes } from "./views/QuestionHandler.js";

let questionArray = await carregarQuestoes();
let questaoAtual = retornarQuestaoAtual(questionArray);

let spn_num_questao = document.querySelector("#spn_num_questao");
let spn_txt_questao = document.querySelector("#spn_txt_questao");

let div_questoes = document.querySelector(".questionDiv")



function atualizarFrontEnd() {
    spn_num_questao.textContent = "1";
    spn_txt_questao.textContent = questaoAtual.pergunta;

    let textFinal = "";

    for (const resposta in questaoAtual.opcoes) {
        let newButton = document.createElement("button");
        newButton.textContent = questaoAtual.opcoes[resposta];

        newButton.addEventListener("click", () => {
            console.log(questaoAtual.resposta)
            if (resposta == parseInt(questaoAtual.resposta)) {console.log("Parabéns!")}
        });


        div_questoes.appendChild(newButton);

    }


    

}

atualizarFrontEnd();