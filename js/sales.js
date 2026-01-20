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

async function loadProductsSelect(selectedProduct = "") {
  const user = await getUser();
  if (!user) return;

  const { data, error } = await window.supabaseClient
    .from("produtos")
    .select("produto_id,nome")
    .eq("user_id", user.id)
    .order("nome", { ascending: true });

  if (error) {
    console.error(error);
    return;
  }
  console.log("salesTable:", document.getElementById("salesTable"));


  const select = document.getElementById("produto");
  console.log("SELECT:", data);
  select.innerHTML = `<option value="">Selecione um produto</option>`;

  data.forEach(p => {
    select.innerHTML += `
      <option value="${p.nome}" ${p.nome === selectedProduct ? "selected" : ""}>
        ${p.nome}
      </option>
    `;
  });
}


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
    .order("data_venda", { ascending: false });

  if (error) {
    console.error(error);
    return;
  }

  const table = document.getElementById("salesTable");
  table.innerHTML = "";

  data.forEach(v => {
   table.innerHTML += `
<tr class="hover:bg-slate-50 transition">

  <td class="px-4 py-3 font-medium text-slate-900">
    ${v.produto}
  </td>

  <td class="px-4 py-3 text-slate-700 capitalize">
    ${v.quantidade ?? "-"}
  </td>
  
  <td class="px-4 py-3 text-slate-700">
    R$ ${Number(v.total).toFixed(2)}
  </td>

  <td class="px-4 py-3 text-slate-700">
    ${new Date(v.data).toLocaleDateString("pt-BR")}
  </td>

  <td class="px-4 py-3">
    <span class="
      inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-medium
      ${p.status === ""
        ? "bg-green-100 text-green-700"
        : "bg-yellow-100 text-yellow-700"}
    ">
      ${v.status}
    </span>
  </td>

  <td class="px-4 py-3">
    <div class="flex justify-end gap-2">

      <button
        onclick="editProduct(
          '${p.id}',
          '${p.nome}',
          '${p.ticket ?? ""}',
          ${p.preco},
          ${p.custo},
          '${p.link ?? ""}',
          '${p.status}'
        )"
        class="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 hover:bg-slate-100 transition"
        title="Editar"
      >
        <i data-lucide="pencil" class="w-4 h-4"></i>
      </button>

      <button
        onclick="deleteProduct('${p.id}')"
        class="w-8 h-8 flex items-center justify-center rounded-lg bg-red-500 text-white hover:bg-red-600 transition"
        title="Excluir"
      >
        <i data-lucide="trash-2" class="w-4 h-4"></i>
      </button>

    </div>
  </td>

</tr>
`;

  });
}

/* ===============================
   MODAL
================================ */
function openModal() {
  loadProductsSelect();
  editingId = null;
  document.getElementById("modalTitle").innerText = "Nova Venda";
  document.getElementById("produto").value = "";
  document.getElementById("quantidade").value = 1;
  document.getElementById("total").value = "";
  document.getElementById("data").value = "";
  document.getElementById("status").value = "";
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
function editSale(id, produto, quantidade, total) {
  editingId = id;

  document.getElementById("modalTitle").innerText = "Editar Venda";
  document.getElementById("produto").value = produto;
  document.getElementById("quantidade").value = quantidade;
  document.getElementById("total").value = total;

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

document.addEventListener("DOMContentLoaded", () => {
  loadSales();
});

