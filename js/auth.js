async function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const { error } = await window.supabaseClient.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    alert(error.message);
  } else {
    window.location.href = "dashboard.html";
  }
}

async function register() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const { error } = await window.supabaseClient.auth.signUp({
    email,
    password
  });

  if (error) {
    alert(error.message);
  } else {
    alert("Conta criada com sucesso!");
  }
}
