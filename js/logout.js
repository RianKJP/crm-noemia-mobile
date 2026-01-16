async function checkAuth() {
  const { data } = await window.supabaseClient.auth.getSession();

  if (!data.session) {
    window.location.href = "index.html";
  }
}

async function logout() {
  const { error } = await window.supabaseClient.auth.signOut();

  if (error) {
    console.error(error);
    return;
  }

  window.location.href = "index.html";
}