let editingId = null;

/* AUTH */
async function getUser() {
  const { data, error } = await window.supabaseClient.auth.getUser();

  if (!data.user) {
    window.location.href = "../index.html";
    return null;
  }

  return data.user;
}
function toggleSidebar() {
  document.querySelector(".sidebar").classList.toggle("collapsed");
}
lucide.createIcons();
/* LISTAR */
async function loadDespesas() {
  const user = await getUser();
  if (!user) return;

  const { data, error } = await window.supabaseClient
    .from("despesas")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    return;
  }

  const table = document.getElementById("despesasTable");
  table.innerHTML = "";

  data.forEach(d => {
    table.innerHTML += `
      <tr class="hover:bg-slate-50 transition">
        <td class="px-6 py-4 text-slate-900 font-medium">
          ${d.nome_despesa}
        </td>

        <td class="px-6 py-4 text-slate-700">
          R$ ${Number(d.valor).toFixed(2)}
        </td>

        <td class="px-6 py-4 text-slate-700">
          ${new Date(d.data_despesa).toLocaleDateString("pt-BR")}
        </td>

        <td class="px-6 py-4">
          <div class="flex justify-end gap-2">

            <!-- EDITAR -->
            <button
              onclick="editDespesa(
                '${d.id}',
                '${d.nome_despesa}',
                ${d.valor},
                '${d.data_despesa}'
              )"
              class="w-9 h-9 flex items-center justify-center rounded-lg border border-slate-200 hover:bg-slate-100 transition"
              title="Editar"
            >
              <i data-lucide="pencil" class="w-4 h-4"></i>
            </button>

            <!-- EXCLUIR -->
            <button
              onclick="deleteDespesa('${d.id}')"
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

/* MODAL */
function openModal() {
  editingId = null;
  document.getElementById("modalTitle").innerText = "Nova Despesa";
  document.getElementById("name").value = "";
  document.getElementById("value").value = "";
  document.getElementById("date").value = "";
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

/* CREATE + UPDATE */
async function saveDespesa() {
  const user = await getUser();
  if (!user) return;
  
  const valorConvertido = getCurrencyValue("value");
  const despesa = {
    nome_despesa: document.getElementById("name").value,
    valor: valorConvertido,
    data_despesa: document.getElementById("date").value,
    user_id: user.id
  };

  let result;

  if (editingId) {
    result = await window.supabaseClient
      .from("despesas")
      .update(despesa)
      .eq("id", editingId);
  } else {
    result = await window.supabaseClient
      .from("despesas")
      .insert(despesa);
  }

  if (result.error) {
    console.error(result.error);
    alert("Erro ao salvar despesa");
    return;
  }

  closeModal();
  loadDespesas();
}

/* EDITAR */
function editDespesa(id, nome, valor, data) {
  editingId = id;
  document.getElementById("modalTitle").innerText = "Editar Despesa";
  document.getElementById("name").value = nome;
  document.getElementById("value").value = valor;
  document.getElementById("date").value = data;
  document.getElementById("modal").style.display = "flex";
}

/* DELETE */
async function deleteDespesa(id) {
  if (!confirm("Deseja excluir esta despesa?")) return;

  const { error } = await window.supabaseClient
    .from("despesas")
    .delete()
    .eq("id", id);

  if (error) {
    console.error(error);
    alert("Erro ao excluir despesa");
    return;
  }

  loadDespesas();
}

/* LOGOUT */
async function logout() {
  await supabase.auth.signOut();
  window.location.href = "../index.html";
}

loadDespesas();
