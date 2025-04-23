import Question from "../models/Question.js";

const QuestionFile = "../questions.json";
let QuestionJSON = {};
let questionCounter = 1;




export async function carregarQuestoes() {
    // Carrega todas as questões
    try {

        const dados = await fetch(QuestionFile);
        if (!dados.ok) {throw new Error("Falha no Fetch")}
        QuestionJSON = await dados.json();
        let questionList = criarClasses(QuestionJSON);
        return questionList;
        
    } catch (err) {
        console.error(err);
    }

}

export function retornarQuestaoAtual(currentJSON) {
    return currentJSON[questionCounter];
}

export default function proximaQuestao() {
    // Passa pra próxima questão
    questionCounter ++;
}

function criarClasses(questions) {
    let newQuestionArray = []

    for (const question in questions) {
        newQuestionArray[question] = new Question(
            questions[question].questao,
            questions[question].opcoes,
            questions[question].resposta,
            questions[question].nivel
        )
    }

    return newQuestionArray;
}

