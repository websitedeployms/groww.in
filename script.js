const toast=(msg)=>{
  const el=document.getElementById("toast");el.textContent=msg;el.classList.add("show");
  clearTimeout(window.__t);window.__t=setTimeout(()=>el.classList.remove("show"),2000);
};

const terminalBtn=document.getElementById("terminalBtn");
const terminalMenu=document.getElementById("terminalMenu");
terminalBtn?.addEventListener("click",e=>{e.stopPropagation();terminalMenu.classList.toggle("open")});
document.addEventListener("click",e=>{if(!e.target.closest(".terminal-wrap")) terminalMenu?.classList.remove("open")});
document.getElementById("optionChain")?.addEventListener("click",()=>toast("Option chain opened"));
document.getElementById("terminalMenuItem")?.addEventListener("click",()=>toast("Terminal opened"));

document.getElementById("bell")?.addEventListener("click",()=>toast("No new notifications"));
document.getElementById("avatar")?.addEventListener("click",()=>toast("Profile menu"));

document.querySelectorAll(".stock-card,.mover-row").forEach(el=>{
  el.addEventListener("click",()=>toast(el.dataset.stock+" selected"));
});

document.getElementById("seeMore")?.addEventListener("click",()=>toast("More stocks loaded"));
document.querySelectorAll(".chip").forEach(chip=>{
  chip.addEventListener("click",()=>{
    if(chip.classList.contains("nifty")){toast("NIFTY 100 selected");return}
    document.querySelectorAll(".chip").forEach(x=>x.classList.remove("active"));
    chip.classList.add("active");toast(chip.textContent.trim()+" selected");
  });
});
document.querySelectorAll(".tool-row").forEach(row=>row.addEventListener("click",()=>toast(row.dataset.tool+" selected")));

const data=[
 ["TATAGOLD","TATAGOLD • NSE","₹14.26"],
 ["SS Retail","SS RETAIL • NSE","₹716.95"],
 ["NSE","NSE • NSE","₹1,762.70"],
 ["Hero Motors","HERO MOTORS • NSE","₹135.06"],
 ["Dr. Reddy's Labs.","DRREDDY • NSE","₹1,221.00"],
 ["Infosys","INFY • NSE","₹1,495.40"]
];
const input=document.getElementById("search"),box=document.getElementById("searchResults");
input?.addEventListener("input",()=>{
  const q=input.value.trim().toLowerCase();
  if(!q){box.classList.remove("show");box.innerHTML="";return}
  const hits=data.filter(x=>(x[0]+" "+x[1]).toLowerCase().includes(q)).slice(0,5);
  box.innerHTML=hits.length?hits.map(x=>`<div class="result" data-result="${x[0]}"><div><strong>${x[0]}</strong><small>${x[1]}</small></div><b>${x[2]}</b></div>`).join(""):'<div class="result"><strong>No result</strong></div>';
  box.classList.add("show");
  box.querySelectorAll("[data-result]").forEach(item=>item.addEventListener("click",()=>{input.value=item.dataset.result;box.classList.remove("show");toast(item.dataset.result+" selected")}));
});
document.addEventListener("keydown",e=>{
  if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==="k"){e.preventDefault();input?.focus()}
});
document.addEventListener("click",e=>{if(!e.target.closest(".search"))box?.classList.remove("show")});
