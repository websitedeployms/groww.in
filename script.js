const toast = (message) => {
  const el = document.getElementById("toast");
  el.textContent = message;
  el.classList.add("show");
  clearTimeout(window.__toastTimer);
  window.__toastTimer = setTimeout(() => el.classList.remove("show"), 2200);
};

const modal = document.getElementById("demoModal");
const openModal = () => {
  modal.classList.add("open");
  modal.setAttribute("aria-hidden","false");
  setTimeout(() => document.getElementById("mobileNumber")?.focus(), 60);
};
const closeModal = () => {
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden","true");
};

document.getElementById("setupBtn")?.addEventListener("click", openModal);
document.getElementById("startInvestBtn")?.addEventListener("click", () => toast("Investment flow opened"));
document.getElementById("terminalBtn")?.addEventListener("click", () => toast("Terminal opened in demo mode"));
document.getElementById("notificationBtn")?.addEventListener("click", () => toast("You are all caught up"));
document.getElementById("profileBtn")?.addEventListener("click", () => toast("Profile menu opened"));
document.getElementById("seeMoreStocks")?.addEventListener("click", () => toast("Showing more stocks in demo mode"));
document.querySelectorAll("[data-close]").forEach((btn) => btn.addEventListener("click", closeModal));
modal?.addEventListener("click", (event) => { if (event.target === modal) closeModal(); });
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeModal();
  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
    event.preventDefault();
    const input = document.getElementById("globalSearch");
    if (input) input.focus();
  }
});

document.getElementById("modalSubmit")?.addEventListener("click", () => {
  const value = document.getElementById("mobileNumber").value.replace(/\D/g, "");
  if (value.length !== 10) {
    toast("Enter a valid 10-digit mobile number");
    return;
  }
  closeModal();
  toast("Demo setup submitted");
});

document.querySelectorAll(".filter-pill").forEach((pill) => {
  pill.addEventListener("click", () => {
    document.querySelectorAll(".filter-pill").forEach((item) => item.classList.remove("active"));
    pill.classList.add("active");
    toast(pill.textContent.trim() + " selected");
  });
});

document.querySelectorAll("[data-stock]").forEach((card) => {
  card.addEventListener("click", () => toast(card.dataset.stock + " selected"));
});

const searchData = [
  ["TATAGOLD","TATAGOLD • NSE","₹14.26"],
  ["SS Retail","SS RETAIL • NSE","₹716.95"],
  ["NSE","NSE • NSE","₹1,762.70"],
  ["Hero Motors","HERO MOTORS • NSE","₹135.06"],
  ["Dr. Reddy's Labs.","DRREDDY • NSE","₹1,221.00"],
  ["Infosys","INFY • NSE","₹1,495.40"],
  ["ITC","ITC • NSE","₹443.80"]
];

const searchInput = document.getElementById("globalSearch");
const searchDropdown = document.getElementById("searchDropdown");

searchInput?.addEventListener("input", () => {
  const query = searchInput.value.trim().toLowerCase();
  if (!query) {
    searchDropdown.classList.remove("show");
    searchDropdown.innerHTML = "";
    return;
  }
  const matches = searchData.filter(([name, meta]) => (name + " " + meta).toLowerCase().includes(query)).slice(0,5);
  searchDropdown.innerHTML = matches.length
    ? matches.map(([name, meta, price]) => `<div class="search-result" data-name="${name}"><div><strong>${name}</strong><small>${meta}</small></div><b>${price}</b></div>`).join("")
    : '<div class="search-result"><div><strong>No result</strong><small>Try a stock or index name</small></div></div>';
  searchDropdown.classList.add("show");
  searchDropdown.querySelectorAll("[data-name]").forEach((item) => {
    item.addEventListener("click", () => {
      searchInput.value = item.dataset.name;
      searchDropdown.classList.remove("show");
      toast(item.dataset.name + " selected");
    });
  });
});
document.addEventListener("click", (event) => {
  if (!event.target.closest(".search-box")) searchDropdown?.classList.remove("show");
});
