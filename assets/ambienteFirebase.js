// Importa os módulos necessários do Firebase
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js';
import { getAuth, signOut, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js';
import { getDatabase, ref, set, push, onValue } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js';

// Configuração do Firebase
const firebaseConfig = {
    apiKey: "AIzaSyBLonRu4hj6dBIJqgJdc5G-udCcVpHF3qU",
    authDomain: "pi04-d0ced.firebaseapp.com",
    databaseURL: "https://pi04-d0ced-default-rtdb.firebaseio.com",
    projectId: "pi04-d0ced",
    storageBucket: "pi04-d0ced.appspot.com",
    messagingSenderId: "308368487306",
    appId: "1:308368487306:web:3240947efc7d0e7a984e73"
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

window.onload = function() {
    // Função para adicionar pergunta e resposta
    document.getElementById('add-pergunta-resposta-btn').addEventListener('click', adicionarPerguntaResposta);

    // Função para sair
    document.getElementById('logout-btn').addEventListener('click', logout);

    // Verifica se o usuário está autenticado e carrega os registros
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

function adicionarPerguntaResposta() {
    const nome = document.getElementById('nome').value;
    const perguntasRespostas = [];

    let continuar = true;
    while (continuar) {
        const pergunta = prompt("Digite a pergunta (ou clique em Cancelar para parar):");
        if (pergunta === null) {
            continuar = false;
            break;
        }
        const resposta = prompt("Digite a resposta:");
        perguntasRespostas.push({ pergunta, resposta });
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
        });
    } else {
        alert('Usuário não autenticado.');
    }
}

function logout() {
    signOut(auth).then(() => {
        alert('Logout realizado com sucesso.');
        window.location.href = 'login.html';
    }).catch((error) => {
        console.error('Erro ao sair:', error);
        alert('Erro ao sair: ' + error.message);
    });
}

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
    // Verifica se o conteúdo já foi exibido
    if (card.querySelector('.card-content')) {
        return; // Se já existe conteúdo, sai da função
    }

    const cardContent = document.createElement('div');
    cardContent.classList.add('card-content');
    let index = 0;

    function mostrarProximaPergunta() {
        cardContent.innerHTML = ''; // Limpa o conteúdo para exibir a próxima pergunta
        if (index < registro.perguntasRespostas.length) {
            const perguntaResposta = registro.perguntasRespostas[index];
            cardContent.innerHTML = `<p>Pergunta: ${perguntaResposta.pergunta}</p>`;
            const btnMostrarResposta = document.createElement('button');
            btnMostrarResposta.textContent = 'Mostrar Resposta';
            btnMostrarResposta.addEventListener('click', function() {
                cardContent.innerHTML += `<p>Resposta: ${perguntaResposta.resposta}</p>`;
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
                index = 0; // Reinicia o índice
                mostrarProximaPergunta(); // Recomeça a exibição das perguntas
            });
            cardContent.appendChild(btnEstudarNovamente);
        }
    }

    mostrarProximaPergunta();
    card.appendChild(cardContent);
}