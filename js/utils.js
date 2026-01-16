let editingId = null;

/* ===============================
   AUTH
================================ */
async function getUser() {
  const { data } = await window.supabaseClient.auth.getUser();

  if (!data.user) {
    window.location.href = "../index.html";
    return;
  }

  return data.user;
}
function toggleSidebar() {
  document.querySelector(".sidebar").classList.toggle("collapsed");
}
lucide.createIcons();
/* ===============================
   LISTAR UTIL
================================ */
async function loadUtils() {
  const user = await getUser();
  if (!user) return;

  const { data, error } = await window.supabaseClient
    .from("util")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    return;
  }

  const table = document.getElementById("utilsTable");
  table.innerHTML = "";

  data.forEach(u => {
    table.innerHTML += `
      <tr>
        <td>${u.nome}</td>
        <td>${u.tipo}</td>
        <td>${u.valor ? `R$ ${Number(u.valor).toFixed(2)}` : "-"}</td>
        <td>${u.observacoes ?? "-"}</td>
        <td>
          <button onclick="editUtil(
            '${u.id}',
            '${u.nome}',
            '${u.tipo}',
            ${u.valor ?? "null"},
            '${u.observacoes ?? ""}'
          )">Editar</button>

          <button onclick="deleteUtil('${u.id}')">Excluir</button>
        </td>
      </tr>
    `;
  });
}

/* ===============================
   MODAL
================================ */
function openModal() {
  editingId = null;
  document.getElementById("modalTitle").innerText = "Novo Item";
  document.getElementById("nome").value = "";
  document.getElementById("tipo").value = "";
  document.getElementById("valor").value = "";
  document.getElementById("observacoes").value = "";
  document.getElementById("modal").style.display = "flex";
}

function closeModal() {
  document.getElementById("modal").style.display = "none";
}

/* ===============================
   CREATE / UPDATE
================================ */
async function saveUtil() {
  const user = await getUser();
  if (!user) return;

  const util = {
    nome: document.getElementById("nome").value,
    tipo: document.getElementById("tipo").value,
    valor: document.getElementById("valor").value
      ? Number(document.getElementById("valor").value)
      : null,
    observacoes: document.getElementById("observacoes").value || null,
    user_id: user.id
  };

  let response;

  if (editingId) {
    response = await window.supabaseClient
      .from("util")
      .update(util)
      .eq("id", editingId);
  } else {
    response = await window.supabaseClient
      .from("util")
      .insert(util);
  }

  if (response.error) {
    alert(response.error.message);
    return;
  }

  closeModal();
  loadUtils();
}

/* ===============================
   EDITAR
================================ */
function editUtil(id, nome, tipo, valor, observacoes) {
  editingId = id;

  document.getElementById("modalTitle").innerText = "Editar Item";
  document.getElementById("nome").value = nome;
  document.getElementById("tipo").value = tipo;
  document.getElementById("valor").value = valor ?? "";
  document.getElementById("observacoes").value = observacoes;

  document.getElementById("modal").style.display = "flex";
}

/* ===============================
   DELETE
================================ */
async function deleteUtil(id) {
  if (!confirm("Deseja excluir este item?")) return;

  const { error } = await window.supabaseClient
    .from("util")
    .delete()
    .eq("id", id);

  if (error) {
    alert(error.message);
    return;
  }

  loadUtils();
}

/* ===============================
   LOGOUT
================================ */
async function logout() {
  await window.supabaseClient.auth.signOut();
  window.location.href = "../index.html";
}

/* INIT */
loadUtils();
