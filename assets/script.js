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
sr.reveal('.main-btn', {delay:860, origin: 'left'});
sr.reveal('.share', {delay:950, origin: 'bottom'});
sr.reveal('.home-img', {delay:1000, origin: 'right'});

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
