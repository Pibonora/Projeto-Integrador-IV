import firebaseConfig from './firebaseConfig.js';

// Configuração do Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

document.getElementById('btn-register').addEventListener('click', function() {
    console.log("Registrou")
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    if (email && password) {
        auth.createUserWithEmailAndPassword(email, password)
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
