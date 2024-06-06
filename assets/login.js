import firebaseConfig from './firebaseConfig.js';

// Configuração do Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

document.getElementById('btn-login').addEventListener('click', function(e) {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    auth.signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            alert("Login bem-sucedido!");
            window.location.href = "main.html"; // Redirecionar para a página principal após o login
        })
        .catch((error) => {
            console.error("Erro ao fazer login:", error.message);
            alert("Erro ao fazer login: " + error.message);
        });
});
