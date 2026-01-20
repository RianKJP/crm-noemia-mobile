function toggleSidebar() {
  document.getElementById("sidebar").classList.toggle("collapsed");
}
const ctx = document.getElementById("line-chart-widget");

let chart;

// 🔹 Dados MOCK (depois você liga com Supabase)
const dataSets = {
  day: {
    labels: ["21/12", "22/12", "23/12", "24/12", "25/12"],
    data: [120, 90, 150, 80, 200],
  },
  month: {
    labels: ["Jan", "Fev", "Mar", "Abr", "Mai"],
    data: [1200, 1800, 1500, 2200, 1900],
  },
  quarter: {
    labels: ["Q1", "Q2", "Q3", "Q4"],
    data: [5200, 6800, 7400, 8100],
  },
};

function renderChart(type = "day") {
  if (chart) chart.destroy();

  chart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: dataSets[type].labels,
      datasets: [
        {
          label: "Receita (R$)",
          data: dataSets[type].data,
          backgroundColor: "#C5A46D",
          borderRadius: 8,
          barThickness: 26,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (ctx) => `R$ ${ctx.raw.toLocaleString("pt-BR")}`,
          },
        },
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: { color: "#64748b" },
        },
        y: {
          grid: {
            borderDash: [4, 4],
            color: "#e2e8f0",
          },
          ticks: {
            color: "#64748b",
            callback: (value) => `R$ ${value}`,
          },
        },
      },
    },
  });
}
// Inicial
renderChart("day");

document.querySelectorAll(".filter-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    const type = btn.dataset.filter;

    document.querySelectorAll(".filter-btn").forEach(b => {
      b.classList.remove("bg-[#C5A46D]", "text-white");
      b.classList.add("bg-slate-100", "text-slate-600");
    });

    btn.classList.remove("bg-slate-100", "text-slate-600");
    btn.classList.add("bg-[#C5A46D]", "text-white");

    renderChart(type);
  });
});


let cash = {
  rian: 0,
  kaio: 0
};

function toggleCashMenu() {
  document.getElementById("cashMenu").classList.toggle("hidden");
}

function openCashModal() {
  document.getElementById("cashMenu").classList.add("hidden");
  document.getElementById("cashModal").classList.remove("hidden");
  document.getElementById("cashModal").classList.add("flex");

  document.getElementById("inputRian").value = cash.rian;
  document.getElementById("inputKaio").value = cash.kaio;
}

function closeCashModal() {
  document.getElementById("cashModal").classList.add("hidden");
  document.getElementById("cashModal").classList.remove("flex");
}

function saveCashValues() {
  cash.rian = Number(document.getElementById("inputRian").value) || 0;
  cash.kaio = Number(document.getElementById("inputKaio").value) || 0;

  updateCashUI();
  closeCashModal();
}

function updateCashUI() {
  const total = cash.rian + cash.kaio;

  document.getElementById("cashRian").innerText =
    `R$ ${cash.rian.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`;

  document.getElementById("cashKaio").innerText =
    `R$ ${cash.kaio.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`;

  document.getElementById("cashTotal").innerText =
    `R$ ${total.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`;
}


function updateQuickStats({ sales = 0, bestRevenue = 0, margin = 0 }) {
  document.getElementById("statSales").innerText = sales;

  document.getElementById("statBestRevenue").innerText =
    `R$ ${bestRevenue.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`;

  document.getElementById("statProfitMargin").innerText = `${margin}%`;
}

lucide.createIcons();
checkAuth();
