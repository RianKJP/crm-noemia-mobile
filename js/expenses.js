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

/* LISTAR */
async function loadDespesas() {
  const user = await getUser();
  if (!user) return;

  const { data, error } = await supabase
    .from("despesas")
    .select("*")
    .eq("user_id", user.id)
    .order("data", { ascending: false });

  if (error) {
    console.error(error);
    return;
  }

  const table = document.getElementById("despesasTable");
  table.innerHTML = "";

  data.forEach(d => {
    table.innerHTML += `
      <tr>
        <td>${d.nome}</td>
        <td>R$ ${Number(d.valor).toFixed(2)}</td>
        <td>${new Date(d.data).toLocaleDateString("pt-BR")}</td>
        <td>
          <button onclick="editDespesa(
            '${d.id}',
            '${d.nome}',
            ${d.valor},
            '${d.data}'
          )">Editar</button>
          <button onclick="deleteDespesa('${d.id}')">Excluir</button>
        </td>
      </tr>
    `;
  });
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

/* CREATE + UPDATE */
async function saveDespesa() {
  const user = await getUser();
  if (!user) return;

  const despesa = {
    nome: document.getElementById("name").value,
    valor: Number(document.getElementById("value").value),
    data: document.getElementById("date").value,
    user_id: user.id
  };

  let result;

  if (editingId) {
    result = await supabase
      .from("despesas")
      .update(despesa)
      .eq("id", editingId);
  } else {
    result = await supabase
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

  const { error } = await supabase
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
