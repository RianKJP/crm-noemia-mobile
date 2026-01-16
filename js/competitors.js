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
   LISTAR CONCORRENTES
================================ */
async function loadCompetitors() {
  const user = await getUser();
  if (!user) return;

  const { data, error } = await window.supabaseClient
    .from("concorrentes")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    return;
  }

  const table = document.getElementById("competitorsTable");
  table.innerHTML = "";

  data.forEach(c => {
    table.innerHTML += `
      <tr>
        <td>${c.nome}</td>
        <td>${c.produto}</td>
        <td>R$ ${Number(c.preco).toFixed(2)}</td>
        <td>${c.observacoes ?? "-"}</td>
        <td>
          <button onclick="editCompetitor(
            '${c.id}',
            '${c.nome}',
            '${c.produto}',
            ${c.preco},
            '${c.observacoes ?? ""}'
          )">Editar</button>

          <button onclick="deleteCompetitor('${c.id}')">Excluir</button>
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
  document.getElementById("modalTitle").innerText = "Novo Concorrente";
  document.getElementById("nome").value = "";
  document.getElementById("produto").value = "";
  document.getElementById("preco").value = "";
  document.getElementById("observacoes").value = "";
  document.getElementById("modal").style.display = "flex";
}

function closeModal() {
  document.getElementById("modal").style.display = "none";
}

/* ===============================
   CREATE / UPDATE
================================ */
async function saveCompetitor() {
  const user = await getUser();
  if (!user) return;

  const competitor = {
    nome: document.getElementById("nome").value,
    produto: document.getElementById("produto").value,
    preco: Number(document.getElementById("preco").value),
    observacoes: document.getElementById("observacoes").value || null,
    user_id: user.id
  };

  let response;

  if (editingId) {
    response = await window.supabaseClient
      .from("concorrentes")
      .update(competitor)
      .eq("id", editingId);
  } else {
    response = await window.supabaseClient
      .from("concorrentes")
      .insert(competitor);
  }

  if (response.error) {
    alert(response.error.message);
    return;
  }

  closeModal();
  loadCompetitors();
}

/* ===============================
   EDITAR
================================ */
function editCompetitor(id, nome, produto, preco, observacoes) {
  editingId = id;

  document.getElementById("modalTitle").innerText = "Editar Concorrente";
  document.getElementById("nome").value = nome;
  document.getElementById("produto") = produto;
  document.getElementById("preco").value = preco;
  document.getElementById("observacoes").value = observacoes;

  document.getElementById("modal").style.display = "flex";
}

/* ===============================
   DELETE
================================ */
async function deleteCompetitor(id) {
  if (!confirm("Deseja excluir este concorrente?")) return;

  const { error } = await window.supabaseClient
    .from("concorrentes")
    .delete()
    .eq("id", id);

  if (error) {
    alert(error.message);
    return;
  }

  loadCompetitors();
}

/* ===============================
   LOGOUT
================================ */
async function logout() {
  await window.supabaseClient.auth.signOut();
  window.location.href = "index.html";
}

/* INIT */
loadCompetitors();
