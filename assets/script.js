let menu = document.querySelector('#menu-icon');
let navbar = document.querySelector('.navbar');

menu.onclick = () => {
    menu.classList.toggle('bx-x');
    navbar.classList.toggle('open')
};
function constraste(){
document.body.style.setProperty("--bg-color", "#bababa");
document.body.style.setProperty("--text-color", "#000");
}

const sr = ScrollReveal ({
    distance: '40px',
    duration: 2500,
    reset: true
});
sr.reveal('.logo', {delay:200, origin: 'left'});
sr.reveal('.navbar', {delay:400, origin: 'top'});
sr.reveal('.menu-btn', {delay:520, origin: 'right'});
sr.reveal('.home-text span', {delay:600, origin: 'top'});
sr.reveal('.home-text h1', {delay:680, origin: 'left'});
sr.reveal('.home-text p', {delay:750, origin: 'right'});
sr.reveal('.main-btn', {delay:860, origin: 'bottom'});
sr.reveal('.social', {delay:950, origin: 'bottom'});
sr.reveal('.home-img', {delay:1000, origin: 'right'});
sr.reveal('.container-card', {delay:500, origin: 'right'});
sr.reveal('.menu-btn-constraste', {delay:600, origin: 'right'});
sr.reveal('.VLibras', {delay:700, origin: 'right'});

// ambiente

let perguntasRespostas = [];
let nome = '';

function adicionarPerguntaResposta() {
    const nome = prompt("Digite o nome do ambiente:");
    const pergunta = prompt("Digite a pergunta:");
    const resposta = prompt("Digite a resposta:");
    
    perguntasRespostas.push({ pergunta, resposta });
    
    exibirPerguntasRespostas();
}

function salvar() {
    nome = document.getElementById('nome').value;
    
    // Aqui você poderia enviar os dados para o backend ou armazená-los em um banco de dados.
    // Por enquanto, vou apenas exibir os dados no console.
    console.log({ nome, perguntasRespostas });
}

function exibirPerguntasRespostas() {
    const container = document.getElementById('container2');
    container.innerHTML = `<h2>${nome}</h2>`;
    
    perguntasRespostas.forEach(item => {
        i=i+1
        container.innerHTML += '<div id="wrapper"><div id="pricing-tables"><div class="pricing-table"><div class="header"><div class="title">${nome}</div></div><div class="features"><ul><div class="price">${i} <span>perguntas</span></div></ul></div><div class="link"><a href="#"><span>Estudar</span></a></div></div>'
        container.innerHTML += `<p><strong>${i}</strong> ${item.resposta}</p>`;
        container.innerHTML += `<p><strong>Pergunta:</strong> ${item.pergunta}</p>`;
        container.innerHTML += `<p><strong>Resposta:</strong> ${item.resposta}</p>`;
    });
}


// Banco de dados
import firebaseConfig from './firebaseConfig.js';

// Configuração do Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

document.getElementById('adicionar').addEventListener('click', function() {
    const nome = document.getElementById('nome').value;
    if (nome) {
        const novoRegistro = {
            nome: nome,
            perguntasRespostas: []
        };
        const newKey = db.ref().child('registros').push().key;
        db.ref('registros/' + newKey).set(novoRegistro);
        criarCard(novoRegistro, newKey);
        document.getElementById('nome').value = '';
    }
});

function criarCard(registro, key) {
    const cardContainer = document.getElementById('card-container');
    const card = document.createElement('div');
    card.classList.add('card');

    const cardContent = document.createElement('div');
    cardContent.classList.add('card-content');

    const h3 = document.createElement('h3');
    h3.textContent = registro.nome;

    const showButton = document.createElement('button');
    showButton.classList.add('card-content');
    showButton.textContent = 'Perguntas/Respostas';
    showButton.addEventListener('click', function() {
        exibirPerguntasRespostas(registro, key, cardContent);
    });

    cardContent.appendChild(h3);
    cardContent.appendChild(showButton);
    card.appendChild(cardContent);
    cardContainer.appendChild(card);
}

function exibirPerguntasRespostas(registro, key, cardContent) {
    cardContent.innerHTML = '';

    const h3 = document.createElement('h3');
    h3.textContent = registro.nome;
    cardContent.appendChild(h3);

    let indexPerguntaAtual = 0;
    let indexRespostaAtual = 0;

    function mostrarPergunta() {
        if (indexPerguntaAtual < registro.perguntasRespostas.length) {
            const perguntaElement = document.createElement('p');
            perguntaElement.textContent = `Pergunta: ${registro.perguntasRespostas[indexPerguntaAtual].pergunta}`;
            cardContent.appendChild(perguntaElement);

            const mostrarRespostaButton = document.createElement('button');
            mostrarRespostaButton.textContent = 'Mostrar Resposta';
            mostrarRespostaButton.classList.add('card-content');
            mostrarRespostaButton.addEventListener('click', function() {
                mostrarResposta(perguntaElement);
            });

            const proximaPerguntaButton = document.createElement('button');
            proximaPerguntaButton.textContent = 'Próxima Pergunta';
            proximaPerguntaButton.classList.add('card-content');
            proximaPerguntaButton.addEventListener('click', function() {
                proximaPergunta(perguntaElement);
            });

            cardContent.appendChild(mostrarRespostaButton);
            cardContent.appendChild(proximaPerguntaButton);
        }
    }

    function mostrarResposta(perguntaElement) {
        if (indexRespostaAtual < registro.perguntasRespostas.length) {
            const respostaElement = document.createElement('p');
            respostaElement.textContent = `Resposta: ${registro.perguntasRespostas[indexRespostaAtual].resposta}`;
            perguntaElement.insertAdjacentElement('afterend', respostaElement);
            indexRespostaAtual++;
        }
    }

    function proximaPergunta(perguntaElement) {
        const respostaElement = perguntaElement.nextElementSibling;
        if (respostaElement) {
            respostaElement.remove();
        }
        perguntaElement.remove();
        indexPerguntaAtual++;
        mostrarPergunta();
    }

    mostrarPergunta();
}
