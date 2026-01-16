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
   LISTAR VENDAS
================================ */
async function loadSales() {
  const user = await getUser();
  if (!user) return;

  const { data, error } = await window.supabaseClient
    .from("vendas")
    .select("*")
    .eq("user_id", user.id)
    .order("data", { ascending: false });

  if (error) {
    console.error(error);
    return;
  }

  const table = document.getElementById("salesTable");
  table.innerHTML = "";

  data.forEach(v => {
    table.innerHTML += `
      <tr>
        <td>${v.produto}</td>
        <td>${v.quantidade}</td>
        <td>R$ ${Number(v.total).toFixed(2)}</td>
        <td>${new Date(v.data).toLocaleDateString("pt-BR")}</td>
        <td>
          <button onclick="editSale(
            '${v.id}',
            '${v.produto}',
            ${v.quantidade},
            ${v.total},
            '${v.data}'
          )">Editar</button>

          <button onclick="deleteSale('${v.id}')">Excluir</button>
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
  document.getElementById("modalTitle").innerText = "Nova Venda";
  document.getElementById("produto").value = "";
  document.getElementById("quantidade").value = 1;
  document.getElementById("total").value = "";
  document.getElementById("data").value = "";
  document.getElementById("modal").style.display = "flex";
}

function closeModal() {
  document.getElementById("modal").style.display = "none";
}

/* ===============================
   CREATE / UPDATE
================================ */
async function saveSale() {
  const user = await getUser();
  if (!user) return;

  const sale = {
    produto: document.getElementById("produto").value,
    quantidade: Number(document.getElementById("quantidade").value),
    total: Number(document.getElementById("total").value),
    data: document.getElementById("data").value,
    user_id: user.id
  };

  let response;

  if (editingId) {
    response = await window.supabaseClient
      .from("vendas")
      .update(sale)
      .eq("id", editingId);
  } else {
    response = await window.supabaseClient
      .from("vendas")
      .insert(sale);
  }

  if (response.error) {
    alert(response.error.message);
    return;
  }

  closeModal();
  loadSales();
}

/* ===============================
   EDITAR
================================ */
function editSale(id, produto, quantidade, total, data) {
  editingId = id;

  document.getElementById("modalTitle").innerText = "Editar Venda";
  document.getElementById("produto").value = produto;
  document.getElementById("quantidade").value = quantidade;
  document.getElementById("total").value = total;
  document.getElementById("data").value = data;

  document.getElementById("modal").style.display = "flex";
}

/* ===============================
   DELETE
================================ */
async function deleteSale(id) {
  if (!confirm("Deseja excluir esta venda?")) return;

  const { error } = await window.supabaseClient
    .from("vendas")
    .delete()
    .eq("id", id);

  if (error) {
    alert(error.message);
    return;
  }

  loadSales();
}

/* ===============================
   LOGOUT
================================ */
async function logout() {
  await window.supabaseClient.auth.signOut();
  window.location.href = "../index.html";
}

/* INIT */
loadSales();
