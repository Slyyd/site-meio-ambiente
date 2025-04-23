
export default class Question {

    respCoded;

    constructor(pergunta, opcoes, resposta, nivel) {

        this.pergunta = pergunta;
        this.opcoes = opcoes;
        /*
        respCoded = atob(resposta); // Resposta vai vir pelo .json em Base64. Esse atob é pra decodificar ela
        this.resposta = this.respCoded.replace("resposta:", ""); // Remove o "resposta:" que é usado pra antes de codificar a string
        */
        this.resposta = resposta.replace("resposta:", ""); // Temporário enquanto as repostas não estiverem em Base64
        this.nivel = nivel;

    }

    


}