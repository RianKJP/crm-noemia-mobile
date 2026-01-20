function formatCurrency(input) {
  // Remove tudo que não for número
  let value = input.value.replace(/\D/g, '');

  // Evita erro se vazio
  if (!value) {
    input.value = '';
    return;
  }

  // Converte para centavos
  value = (Number(value) / 100).toFixed(2);

  // Formata para BRL
  input.value = Number(value).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  });
}
