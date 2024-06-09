function onChangeEmail() {
  toggleButtonsDisable();
  toggleEmailErrors();
}

function onChangePassword() {
  toggleButtonsDisable();
  togglePasswordErrors();
}


function register() {
  window.location.href = "register.html";
}

function toggleEmailErrors() {
  const email = form.email().value;
  form.emailRequiredError().style.display = email ? "none" : "block";

  form.emailInvalidError().style.display = validateEmail(email) ? "none" : "block";
}

function togglePasswordErrors() {
  const password = form.password().value;
  form.passwordRequiredError().style.display = password ? "none" : "block";
}

function toggleButtonsDisable() {
  const emailValid = isEmailValid();
  form.recoverPasswordButton().disabled = !emailValid;

  const passwordValid = isPasswordValid();
  form.registerButton().disabled = !emailValid || !passwordValid;
}

function isEmailValid() {
  const email = form.email().value;
  if (!email) {
      return false;
  }
  return validateEmail(email);
}

function isPasswordValid() {
  return form.password().value ? true : false;
}

const form = {
  email: () => document.getElementById("email"),
  emailInvalidError: () => document.getElementById("email-invalid-error"),
  emailRequiredError: () => document.getElementById("email-required-error"),
  registerButton: () => document.getElementById("register-button"),
  password: () => document.getElementById("password"),
  passwordRequiredError: () => document.getElementById("password-required-error"),
  recoverPasswordButton: () => document.getElementById("recover-password-button"),
}

document.getElementById('btn-redirecionar').addEventListener('click', function() {
  history.go(-1); // Redireciona para duas páginas anteriores
});



// redirecionamento

function irLogin() {
    window.location.href = "login.html";
}

document.getElementById('btn-redirecionar2').addEventListener('click', function() {
    history.go(-1); // Redireciona para duas páginas anteriores
  });

// Adiciona as funções de validação para campos de email e senha
// document.getElementById('email').addEventListener('input', onChangeEmail);
// document.getElementById('password').addEventListener('input', onChangePassword);
