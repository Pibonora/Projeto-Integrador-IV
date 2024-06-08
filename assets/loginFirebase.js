// loginFirebase.js
import firebaseConfig from './firebaseConfig.js';
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);

// Acessa a autenticação do Firebase
const auth = getAuth(app);

document.getElementById('login-button').addEventListener('click', function (e) {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            alert("Login bem-sucedido!");
            window.location.href = "./ambiente.html"; // Redirecionar para a página principal após o login
        })
        .catch((error) => {
            console.error("Erro ao fazer login:", error.message);
            alert("Erro ao fazer login: " + error.message);
        });
});
