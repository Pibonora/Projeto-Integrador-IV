import firebaseConfig from './firebaseConfig.js';
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

document.getElementById('register-button').addEventListener('click', function() {
    console.log("Registrou")
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    if (email && password) {
        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Registro bem-sucedido
                console.log('Usuário registrado:', userCredential.user);
                alert('Usuário registrado com sucesso!');
                window.location.href = 'login.html';
            })
            .catch((error) => {
                console.error('Erro ao registrar usuário:', error);
                alert('Erro ao registrar usuário: ' + error.message);
            });
    } else {
        alert('Por favor, preencha todos os campos.');
    }
});