// Importa os módulos necessários do Firebase
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js';
import { getAuth, signOut, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js';
import { getDatabase, ref, set, push, onValue, remove, update } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js';

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

let editKey = null;

window.onload = function () {
    document.getElementById('add-pergunta-resposta-btn').addEventListener('click', adicionarCampoPerguntaResposta);
    document.getElementById('salvar-btn').addEventListener('click', adicionarPerguntaResposta);
    document.getElementById('edit-add-pergunta-resposta-btn').addEventListener('click', adicionarCampoPerguntaRespostaEdicao);
    document.getElementById('edit-salvar-btn').addEventListener('click', salvarAlteracoes);
    document.getElementById('close-modal').addEventListener('click', function () {
        document.getElementById('edit-modal').style.display = "none";
    });
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

function adicionarCampoPerguntaRespostaEdicao() {
    const form = document.getElementById('edit-perguntas-respostas-form');
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
        btnPerguntasRespostas.addEventListener('click', function () {
            exibirPerguntasRespostas(card, registro);
        });
        cardHeader.appendChild(btnPerguntasRespostas);

        const btnEditar = document.createElement('button');
        btnEditar.textContent = 'Editar';
        btnEditar.addEventListener('click', function () {
            abrirFormularioEdicao(key, registro);
        });
        cardHeader.appendChild(btnEditar);

        const btnExcluir = document.createElement('button');
        btnExcluir.textContent = 'Excluir';
        btnExcluir.addEventListener('click', function () {
            excluirRegistro(key);
        });
        cardHeader.appendChild(btnExcluir);

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
            cardContent.innerHTML = `<p style="color: black; font-weight: bold;">Pergunta:</p> <p>${perguntaResposta.pergunta}</p>`;
            const btnMostrarResposta = document.createElement('button');
            btnMostrarResposta.textContent = 'Mostrar Resposta';
            btnMostrarResposta.addEventListener('click', function () {
                cardContent.innerHTML += `<p style="color: black; font-weight: bold;">Resposta:</p> <p>${perguntaResposta.resposta}</p>`;
                const btnProximaPergunta = document.createElement('button');
                btnProximaPergunta.textContent = 'Próxima Pergunta';
                btnProximaPergunta.addEventListener('click', function () {
                    index++;
                    mostrarProximaPergunta();
                });
                cardContent.appendChild(btnProximaPergunta);
            });
            cardContent.appendChild(btnMostrarResposta);
        } else {
            cardContent.innerHTML = '<p style="color: black; font-weight: bold;">Você completou todas as perguntas!</p>';
            const btnEstudarNovamente = document.createElement('button');
            btnEstudarNovamente.textContent = 'Estudar Novamente';
            btnEstudarNovamente.addEventListener('click', function () {
                index = 0;
                mostrarProximaPergunta();
            });
            cardContent.appendChild(btnEstudarNovamente);
        }
    }

    mostrarProximaPergunta();
    card.appendChild(cardContent);
}

function abrirFormularioEdicao(key, registro) {
    editKey = key;
    document.getElementById('edit-nome').value = registro.nome;
    const form = document.getElementById('edit-perguntas-respostas-form');
    form.innerHTML = ''; // Limpa o formulário antes de preenchê-lo
    registro.perguntasRespostas.forEach((pr) => {
        const div = document.createElement('div');
        div.classList.add('pergunta-resposta');
        div.innerHTML = `
             <div class="form-group">
                <label>Pergunta:</label>
                <input type="text" name="pergunta" placeholder="Digite a pergunta" value="${pr.pergunta}">
            </div>
            <div class="form-group">
                <label>Resposta:</label>
                <input type="text" name="resposta" placeholder="Digite a resposta" value="${pr.resposta}">
            </div>
        `;
        form.appendChild(div);
    });
    document.getElementById('edit-modal').style.display = "block";
}

function salvarAlteracoes() {
    const nome = document.getElementById('edit-nome').value;
    const perguntasRespostas = [];
    const form = document.getElementById('edit-perguntas-respostas-form');
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
    if (user && editKey) {
        const userId = user.uid;
        const registroRef = ref(db, 'users/' + userId + '/registros/' + editKey);
        set(registroRef, {
            nome,
            perguntasRespostas
        }).then(() => {
            alert('Alterações salvas com sucesso!');
            document.getElementById('edit-modal').style.display = "none";
        }).catch((error) => {
            console.error('Erro ao salvar alterações:', error);
            alert('Erro ao salvar alterações: ' + error.message);
        });
    } else {
        alert('Usuário não autenticado ou chave inválida.');
    }
}

function excluirRegistro(key) {
    const user = auth.currentUser;
    if (user) {
        const userId = user.uid;
        const registroRef = ref(db, 'users/' + userId + '/registros/' + key);
        if (confirm('Tem certeza que deseja excluir este registro?')) {
            set(registroRef, null).then(() => {
                alert('Registro excluído com sucesso!');
            }).catch((error) => {
                console.error('Erro ao excluir registro:', error);
                alert('Erro ao excluir registro: ' + error.message);
            });
        }
    } else {
        alert('Usuário não autenticado.');
    }
}
