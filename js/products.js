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
   LISTAR PRODUTOS
================================ */
async function loadProducts() {
  const user = await getUser();
  if (!user) return;

  const { data, error } = await window.supabaseClient
    .from("produtos")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    return;
  }

  const table = document.getElementById("productsTable");
  table.innerHTML = "";

  data.forEach(p => {
    table.innerHTML += `
      <tr>
        <td>${p.nome}</td>
        <td>${p.ticket ?? "-"}</td>
        <td>R$ ${Number(p.preco).toFixed(2)}</td>
        <td>
          <span class="status ${p.status === "ativo" ? "success" : "pending"}">
            ${p.status}
          </span>
        </td>
        <td>
          <button onclick="editProduct(
            '${p.id}',
            '${p.nome}',
            '${p.ticket ?? ""}',
            ${p.preco},
            '${p.status}'
          )">Editar</button>

          <button onclick="deleteProduct('${p.id}')">Excluir</button>
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
  document.getElementById("modalTitle").innerText = "Novo Produto";
  document.getElementById("nome").value = "";
  document.getElementById("ticket").value = "";
  document.getElementById("preco").value = "";
  document.getElementById("status").value = "ativo";
  document.getElementById("modal").style.display = "flex";
}

function closeModal() {
  document.getElementById("modal").style.display = "none";
}

/* ===============================
   CREATE / UPDATE
================================ */
async function saveProduct() {
  const user = await getUser();
  if (!user) return;

  const product = {
    nome: document.getElementById("nome").value,
    categoria: document.getElementById("categoria").value || null,
    preco: Number(document.getElementById("preco").value),
    status: document.getElementById("status").value,
    user_id: user.id
  };

  let response;

  if (editingId) {
    response = await window.supabaseClient
      .from("produtos")
      .update(product)
      .eq("id", editingId);
  } else {
    response = await window.supabaseClient
      .from("produtos")
      .insert(product);
  }

  if (response.error) {
    alert(response.error.message);
    return;
  }

  closeModal();
  loadProducts();
}

/* ===============================
   EDITAR
================================ */
function editProduct(id, nome, categoria, preco, status) {
  editingId = id;

  document.getElementById("modalTitle").innerText = "Editar Produto";
  document.getElementById("nome").value = nome;
  document.getElementById("categoria").value = categoria;
  document.getElementById("preco").value = preco;
  document.getElementById("status").value = status;

  document.getElementById("modal").style.display = "flex";
}

/* ===============================
   DELETE
================================ */
async function deleteProduct(id) {
  if (!confirm("Deseja excluir este produto?")) return;

  const { error } = await window.supabaseClient
    .from("produtos")
    .delete()
    .eq("id", id);

  if (error) {
    alert(error.message);
    return;
  }

  loadProducts();
}

/* ===============================
   LOGOUT
================================ */
async function logout() {
  await window.supabaseClient.auth.signOut();
  window.location.href = "../index.html";
}

/* INIT */
loadProducts();
