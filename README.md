<img src="docs/img/terrabyte-logo.png" alt="Logo TerraByte" width="300"/><img src="docs/img/logo.png" alt="Nome TerraByte" width="400"/> 

![Licenças](https://img.shields.io/github/license/Slyyd/site-meio-ambiente.svg)

Este site interativo com foco na conscientização ambiental busca educar os usuários por meio de um quiz interativo que aborda questões ambientais, como poluição, conservação de recursos naturais e biodiversidade, e sugere boas práticas para a preservação do meio ambiente através de informações educativas e interativas. O objetivo é estimular o conhecimento e incentivar ações sustentáveis, promovendo um engajamento ativo do público na causa ambiental.

## 🛠 Funcionalidades 🛠

- *Realizar Quizzes* : Responda à perguntas sobre o meio ambiente e receba sugestões de como conservá-lo!
- *Faça parte de ONGS ou Doações* : Realize ações para ajudar na preservação ambiental.
- *Notícias* : Descubra notícias acerca da preservação ambiental e meio-ambiente.
- *Mapa Interativo de Queimadas* : Use um mapa interativo para obter informações sobre queimadas ao redor do globo!

## 🚀 Como utilizar no GIT 🚀

```bash
1 cd /caminho/para/seu/diretorio
2 git clone https://github.com/Slyyd/site-meio-ambiente.git
3 cd site-meio-ambiente
```


## Pré-requisitos:

- Um navegador moderno (Google Chrome, Firefox, Edge, etc.).
- Conhecimentos básicos de HTML, CSS e JavaScript (opcional, para personalização).
- [Ter o Git instalado](https://git-scm.com)
- Ter uma IDE ou editor de código (como VS Code)

## 📂 Estrutura do Projeto 📂
```bash
├── LICENSE                # Licença do Projeto
├── README.md              # Readme com as informações do projeto
└── docs/                  # Pasta principal do projeto
    ├─── index.html        # Página com as questões do projeto
    ├─── home.html         # Página Home
    ├─── sobre.html        # Página com Informações e Notícias
    ├─── mapa.html         # Página do Mapa de Queimadas
    ├─── quiz.html         # Página do quiz   
    ├── css/               # Arquivos de Folhas de Estilo
    │   ├── home.css     
    │   ├── quiz.css             
    │   ├── sobre.css      
    │   └── mapa.css       
    ├── img/               # Imagens e ícones usados no projeto
    │   ├── angelica-team.jpg
    │   ├── bianca-team.jpg  
    │   ├── botanical-leaves.jpg 
    │   ├── ChicoMendes.jpg
    │   ├── Constituição-Federal.jpg
    │   ├── eolica.jpg
    │   ├── Jane-Goodall.jpg
    │   ├── jessica-equipe.jpg
    │   ├── johann-equipe.jpg
    │   ├── jose-team.jpg
    │   ├── kaue-team.jpg       
    │   ├── logo.jpg
    │   ├── pexels-alexandrep-junior-12027856.jpg    
    │   ├── pexels-mali-142497.jpg
    │   ├── plantio.jpg
    │   ├── plantio2.jpg
    │   └── terrabyte-logo.png 
    └── js/                # Arquivos JavaScript
        ├──  Model/
        │    ├── QuestionHandler.js    
        │    └── Question.js                  
        ├──  home.js
        ├──  questions.js
        ├──  quiz.js
        ├──  mapa.js
        ├──  noticias.js
        └──  sobre.js   
```

## 💻 Tecnologias Utilizadas 💻

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](    https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![Javascript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

[![Visual Studio Code](https://img.shields.io/badge/Visual%20Studio%20Code-0078d7.svg?style=plastic&logo=visual-studio-code&logoColor=white)](https://img.shields.io/badge/Visual%20Studio%20Code-0078d7.svg?style=plastic&logo=visual-studio-code&logoColor=white)
[![Git](https://img.shields.io/badge/git-%23F05033.svg?style=plastic&logo=git&logoColor=white)](https://img.shields.io/badge/git-%23F05033.svg?style=plastic&logo=git&logoColor=white)
[![GitHub](https://img.shields.io/badge/github-%23121011.svg?style=plastic&logo=github&logoColor=white)](https://img.shields.io/badge/github-%23121011.svg?style=plastic&logo=github&logoColor=white)

[NASA MODIS API](https://earthdata.nasa.gov/firms)

[GNews API](https://gnews.io/)

[Leaflet](https://leafletjs.com/)

[OpenStreetMap](https://www.openstreetmap.org)

[ArcGIS Online](https://www.arcgis.com/index.html)

## 📄 Licença
Este projeto está sob a licença APACHE 2.0. Veja o arquivo LICENSE para mais detalhes.

## 💻 APIs Utilizadas

* **[NASA FIRMS (MODIS) Active Fire Data API](https://earthdata.nasa.gov/firms)**

🌍 A NASA fornece dados atualizados sobre focos de incêndio através do sistema FIRMS (Fire Information for Resource Management System), coletados pelo satélites **MODIS**.

**Principais dados retornados:**

* `Latitude` / `Longitude`
* `Intensidade do foco`
* `Tipo de queimada`
* `Localização`
* `Data/hora da detecção`
* `Fonte`
* `Nível de confiança`

Esses dados são processados e exibidos em tempo real no site.

* **[GNews API](https://gnews.io/)**

📰 Utilizamos a **GNews API** para exibir um carrossel com as últimas notícias relacionadas ao meio ambiente.

**Principais dados retornados:**

* `Título`
* `Imagem`
* `Link para leitura completa`
* `Fonte e data de publicação`

### **Configure as chaves da API**

Gere uma chave API e adicione no arquivo `js/noticias.js` ou `js/mapa.js` :

```env
const API_KEY = {insira sua chave};
```
### Notas Importantes

* As APIs exigem **registro gratuito** e **token de acesso**.
* Há limites de uso gratuito para ambas as APIs. Consulte a documentação oficial.

## 🎉 Agradecimentos 

- [Fontes Google Fonts](https://fonts.google.com/)
- [Imagens: Pexels Free Stock Photos](https://www.pexels.com/)
- APIs: NASA Open API'S e GNews
- OpenStreetMap
- Leaflet
- ArcGIS
