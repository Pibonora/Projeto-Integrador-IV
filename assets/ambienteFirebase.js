// Importa os módulos necessários do Firebase
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js';
import { getAuth, signOut, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js';
import { getDatabase, ref, set, push, onValue } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js';

// Configuração do Firebase
const firebaseConfig = {
    
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

window.onload = function() {
    document.getElementById('add-pergunta-resposta-btn').addEventListener('click', adicionarCampoPerguntaResposta);
    document.getElementById('salvar-btn').addEventListener('click', adicionarPerguntaResposta);
    onAuthStateChanged(auth, (user) => {
        if (user) {
            const userId = user.uid;
            const userRef = ref(db, 'users/' + userId + '/registros');
            onValue(userRef, (snapshot) => {
                if (snapshot.exists()) {
                    const data = snapshot.val();
                    exibirRegistros(data);
                } else {
                    console.log('Nenhum dado disponível');
                }
            });
        } else {
            window.location.href = 'login.html';
        }
    });
};

function adicionarCampoPerguntaResposta() {
    const form = document.getElementById('perguntas-respostas-form');
    const div = document.createElement('div');
    div.classList.add('pergunta-resposta');
    div.innerHTML = `
        <input type="text" name="pergunta" placeholder="Digite a pergunta">
        <input type="text" name="resposta" placeholder="Digite a resposta">
    `;
    form.appendChild(div);
}

function adicionarPerguntaResposta() {
    const nome = document.getElementById('nome').value;
    const perguntasRespostas = [];
    const form = document.getElementById('perguntas-respostas-form');
    const campos = form.getElementsByClassName('pergunta-resposta');

    for (const campo of campos) {
        const pergunta = campo.querySelector('input[name="pergunta"]').value;
        const resposta = campo.querySelector('input[name="resposta"]').value;
        if (pergunta && resposta) {
            perguntasRespostas.push({ pergunta, resposta });
        }
    }

    if (perguntasRespostas.length === 0) {
        alert("Por favor, adicione pelo menos uma pergunta.");
        return;
    }

    const user = auth.currentUser;
    if (user) {
        const userId = user.uid;
        const userRef = ref(db, 'users/' + userId + '/registros');
        const newRegistroRef = push(userRef);
        set(newRegistroRef, {
            nome,
            perguntasRespostas
        }).then(() => {
            alert('Perguntas e respostas salvas com sucesso!');
            form.innerHTML = ''; // Limpa o formulário após o salvamento
            const div = document.createElement('div');
            div.classList.add('pergunta-resposta');
            div.innerHTML = `
                <input type="text" name="pergunta" placeholder="Digite a pergunta">
                <input type="text" name="resposta" placeholder="Digite a resposta">
            `;
            form.appendChild(div);
        });
    } else {
        alert('Usuário não autenticado.');
    }
}

document.getElementById("logout-btn").addEventListener('click', function (e) {
    e.preventDefault()
    signOut(auth).then(() => {
        alert('Logout realizado com sucesso.');
        window.location.href = 'login.html';
    }).catch((error) => {
        console.error('Erro ao sair:', error);
        alert('Erro ao sair: ' + error.message);
    });
})


function exibirRegistros(data) {
    const container = document.getElementById('container');
    container.innerHTML = '';
    for (const key in data) {
        const registro = data[key];
        const card = document.createElement('div');
        card.classList.add('card');
        const cardHeader = document.createElement('div');
        cardHeader.classList.add('card-header');
        const nomeTitulo = document.createElement('h2');
        nomeTitulo.textContent = registro.nome;
        cardHeader.appendChild(nomeTitulo);
        const btnPerguntasRespostas = document.createElement('button');
        btnPerguntasRespostas.textContent = 'Estudar';
        btnPerguntasRespostas.addEventListener('click', function() {
            exibirPerguntasRespostas(card, registro);
        });
        cardHeader.appendChild(btnPerguntasRespostas);
        card.appendChild(cardHeader);
        container.appendChild(card);
    }
}

function exibirPerguntasRespostas(card, registro) {
    if (card.querySelector('.card-content')) {
        return;
    }

    const cardContent = document.createElement('div');
    cardContent.classList.add('card-content');
    let index = 0;

    function mostrarProximaPergunta() {
        cardContent.innerHTML = '';
        if (index < registro.perguntasRespostas.length) {
            const perguntaResposta = registro.perguntasRespostas[index];
            cardContent.innerHTML = `<p style="color: black">Pergunta:</p> <p>${perguntaResposta.pergunta}</p>`;
            const btnMostrarResposta = document.createElement('button');
            btnMostrarResposta.textContent = 'Mostrar Resposta';
            btnMostrarResposta.addEventListener('click', function() {
                cardContent.innerHTML += `<p style="color: black">Resposta:</p> <p>${perguntaResposta.resposta}</p>`;
                const btnProximaPergunta = document.createElement('button');
                btnProximaPergunta.textContent = 'Próxima Pergunta';
                btnProximaPergunta.addEventListener('click', function() {
                    index++;
                    mostrarProximaPergunta();
                });
                cardContent.appendChild(btnProximaPergunta);
            });
            cardContent.appendChild(btnMostrarResposta);
        } else {
            cardContent.innerHTML = '<p>Você completou todas as perguntas!</p>';
            const btnEstudarNovamente = document.createElement('button');
            btnEstudarNovamente.textContent = 'Estudar Novamente';
            btnEstudarNovamente.addEventListener('click', function() {
                index = 0;
                mostrarProximaPergunta();
            });
            cardContent.appendChild(btnEstudarNovamente);
        }
    }

    mostrarProximaPergunta();
    card.appendChild(cardContent);
}

