async function loadOverview() {
  const { data: sales } = await supabase.from("sales").select("*");
  const { data: expenses } = await supabase.from("expenses").select("*");

  const revenue = sales.reduce((t, s) => t + s.total, 0);
  const totalExpenses = expenses.reduce((t, e) => t + e.amount, 0);

  document.getElementById("revenue").innerText = revenue;
  document.getElementById("expenses").innerText = totalExpenses;
  document.getElementById("profit").innerText = revenue - totalExpenses;
}
