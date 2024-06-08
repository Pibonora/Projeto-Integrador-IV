// redirecionamento

function irLogin() {
    window.location.href = "login.html";
}

document.getElementById('btn-redirecionar2').addEventListener('click', function() {
    history.go(-1); // Redireciona para duas páginas anteriores
  });

// Adiciona as funções de validação para campos de email e senha
document.getElementById('email').addEventListener('input', onChangeEmail);
document.getElementById('password').addEventListener('input', onChangePassword);
