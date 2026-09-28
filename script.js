const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => [...document.querySelectorAll(sel)];

const toast = (message) => {
  const el = $("#toast");
  el.textContent = message;
  el.classList.add("show");
  clearTimeout(window.__toast);
  window.__toast = setTimeout(() => el.classList.remove("show"), 2200);
};

const openModal = () => {
  $("#loginModal").classList.add("open");
  $("#loginModal").setAttribute("aria-hidden","false");
  setTimeout(() => $("#mobileInput").focus(), 60);
};

const closeModal = () => {
  $("#loginModal").classList.remove("open");
  $("#loginModal").setAttribute("aria-hidden","true");
};

$("#loginBtn")?.addEventListener("click", openModal);
$("#startBtn")?.addEventListener("click", openModal);
$("#ctaBtn")?.addEventListener("click", openModal);
$("#investBtn")?.addEventListener("click", () => toast("Mutual Funds section opened — demo UI"));
$("#stockBtn")?.addEventListener("click", () => toast("Stocks explorer — demo UI"));
$("#watchDemo")?.addEventListener("click", () => toast("Interactive product tour coming next"));
$("#calculatorBtn")?.addEventListener("click", () => toast("SIP calculator opened — demo mode"));

$$("[data-close]").forEach(btn => btn.addEventListener("click", closeModal));
$("#loginModal")?.addEventListener("click", e => {
  if (e.target.id === "loginModal") closeModal();
});
document.addEventListener("keydown", e => {
  if (e.key === "Escape") closeModal();
  if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
    e.preventDefault();
    $("#searchInput")?.focus();
  }
});

$("#continueBtn")?.addEventListener("click", () => {
  const value = $("#mobileInput").value.replace(/\D/g,"");
  if (value.length !== 10) {
    toast("Enter a valid 10-digit mobile number");
    return;
  }
  closeModal();
  toast("Demo login submitted");
});

const searchData = [
  ["Reliance Industries","RELIANCE • NSE","₹1,953.00"],
  ["Tata Motors","TATAMOTORS • NSE","₹1,076.20"],
  ["HDFC Bank","HDFCBANK • NSE","₹1,012.70"],
  ["Nifty 50","INDEX • NSE","25,301.90"],
  ["SBI Small Cap Fund","MUTUAL FUND","₹178.42"]
];

$("#searchInput")?.addEventListener("input", e => {
  const q = e.target.value.trim().toLowerCase();
  const box = $("#searchResults");
  if (!q) { box.classList.remove("show"); box.innerHTML = ""; return; }
  const matches = searchData.filter(([name,meta]) => (name+" "+meta).toLowerCase().includes(q)).slice(0,4);
  box.innerHTML = matches.length
    ? matches.map(([name,meta,price]) => `<div class="result-item" data-result="${name}"><div><strong>${name}</strong><small>${meta}</small></div><b>${price}</b></div>`).join("")
    : '<div class="result-item"><div><strong>No matches</strong><small>Try stocks, funds or indices</small></div></div>';
  box.classList.add("show");
  $$(".result-item[data-result]").forEach(item => item.addEventListener("click", () => {
    $("#searchInput").value = item.dataset.result;
    box.classList.remove("show");
    toast(item.dataset.result + " selected");
  }));
});

document.addEventListener("click", e => {
  if (!e.target.closest(".nav-search")) $("#searchResults")?.classList.remove("show");
});

$$("[data-product]").forEach(card => {
  card.addEventListener("click", () => toast(card.dataset.product + " selected"));
});

$$("[data-scroll]").forEach(btn => {
  btn.addEventListener("click", () => document.querySelector(btn.dataset.scroll)?.scrollIntoView({behavior:"smooth"}));
});

$("#mobileMenu")?.addEventListener("click", () => {
  const nav = $(".desktop-nav");
  if (!nav) return;
  const open = nav.style.display === "flex";
  nav.style.display = open ? "" : "flex";
  nav.style.position = open ? "" : "absolute";
  nav.style.top = "64px";
  nav.style.left = "10px";
  nav.style.right = "10px";
  nav.style.background = "#fff";
  nav.style.padding = "14px";
  nav.style.border = "1px solid #e9edef";
  nav.style.borderRadius = "14px";
  nav.style.boxShadow = "0 12px 30px rgba(0,0,0,.08)";
  nav.style.flexDirection = "column";
});
