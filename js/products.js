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
<tr class="hover:bg-slate-50 transition">

  <!-- NOME -->
  <td class="px-6 py-4 font-medium text-slate-900">
    ${p.nome}
  </td>

  <!-- TICKET -->
  <td class="px-6 py-4 text-center text-slate-700 capitalize">
    ${p.ticket ?? "-"}
  </td>

  <!-- PREÇO -->
  <td class="px-6 py-4 text-right text-slate-700">
    R$ ${Number(p.preco).toFixed(2)}
  </td>

  <!-- CUSTO -->
  <td class="px-6 py-4 text-right text-slate-700">
    R$ ${Number(p.custo).toFixed(2)}
  </td>

  <!-- LINK -->
  <td class="px-6 py-4 text-center">
    ${
      p.link
        ? `<a href="${p.link}" target="_blank"
             class="inline-flex items-center gap-1 text-blue-600 hover:underline text-sm">
             <i data-lucide="link" class="w-4 h-4"></i> Abrir
           </a>`
        : "-"
    }
  </td>

  <!-- STATUS -->
  <td class="px-6 py-4 text-center">
    <span class="
      inline-flex items-center px-3 py-1 rounded-full text-xs font-medium
      ${p.status === "ativo"
        ? "bg-green-100 text-green-700"
        : "bg-yellow-100 text-yellow-700"}
    ">
      ${p.status}
    </span>
  </td>

  <!-- AÇÕES -->
  <td class="px-6 py-4">
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
        class="w-9 h-9 flex items-center justify-center rounded-lg border border-slate-200 hover:bg-slate-100 transition"
        title="Editar"
      >
        <i data-lucide="pencil" class="w-4 h-4"></i>
      </button>

      <button
        onclick="deleteProduct('${p.id}')"
        class="w-9 h-9 flex items-center justify-center rounded-lg bg-red-500 text-white hover:bg-red-600 transition"
        title="Excluir"
      >
        <i data-lucide="trash-2" class="w-4 h-4"></i>
      </button>

    </div>
  </td>

</tr>
`;


  });
  lucide.createIcons();

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
function getCurrencyValue(id) {
  const raw = document.getElementById(id).value;

  if (!raw) return 0;

  return Number(
    raw
      .replace('R$', '')
      .replace(/\./g, '')
      .replace(',', '.')
      .trim()
  );
}


/* ===============================
   CREATE / UPDATE
================================ */
async function saveProduct() {
  const user = await getUser();
  if (!user) return;

  const valorConvertidoPreco = getCurrencyValue("preco");
  const valorConvertidoCusto = getCurrencyValue("custo");
  const product = {
    nome: document.getElementById("nome").value,
    preco: valorConvertidoPreco,
    custo: valorConvertidoCusto,
    link: document.getElementById("link").value,
    ticket: document.getElementById("ticket").value,
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
function editProduct(id, nome, ticket, preco,custo,link, status) {
  editingId = id;

  document.getElementById("modalTitle").innerText = "Editar Produto";
  document.getElementById("nome").value = nome;
  document.getElementById("ticket").value = ticket;
  document.getElementById("preco").value = preco;
  document.getElementById("custo").value = custo;
  document.getElementById("link").value = link;
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
