const vehicles = [
  "340","567","アームロール","いすゞ25t","265","25tセルフ",
  "6ヒアロング","5t","3tワイド","576","440","青パッカー",
  "5ヒア","620","ヒノ8t","ツートン","3tパッカー","白パッカー",
  "3ヒア","640","950","2.9","ヒノ","10t①",
  "230","8t","セルフ","3t","10t②","三菱ワイド","軽トラ"
];

const YEAR = 2026;
const MONTH = 7;

function todayDay(){
  return new Date().getDate();
}

function key(day){
  return "tenken_" + YEAR + "_" + MONTH + "_" + day; }

function getData(day){
  return JSON.parse(localStorage.getItem(key(day)) || "{}"); }

function saveData(day, data){
  localStorage.setItem(key(day), JSON.stringify(data)); }

function showScreen(id){
  document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
  document.getElementById(id).classList.add("active");
  renderToday();
  renderMonth();
}

function toggleCheck(vehicle, type){
  const day = todayDay();
  const data = getData(day);

  if(!data[vehicle]){
    data[vehicle] = {};
  }

  data[vehicle][type] = !data[vehicle][type];

  saveData(day, data);
  renderToday();
  renderMonth();
}

function renderToday(){
  const day = todayDay();
  const data = getData(day);
  const list = document.getElementById("todayList");
  if(!list) return;

  list.innerHTML = "";

  let morningCount = 0;
  let afternoonCount = 0;

  vehicles.forEach(vehicle => {
    const r = data[vehicle] || {};
    if(r.morning) morningCount++;
    if(r.afternoon) afternoonCount++;

    const row = document.createElement("div");
    row.style.cssText =
      "display:grid;grid-template-columns:2fr 1fr 1fr;gap:10px;align-items:center;" +
      "background:white;margin:12px auto;padding:16px;border-radius:14px;" +
      "max-width:760px;box-shadow:0 2px 8px rgba(0,0,0,.12);box-sizing:border-box;";

    row.innerHTML = `
      <div style="text-align:left;font-size:24px;font-weight:bold;">${vehicle}</div>
      <button onclick="toggleCheck('${vehicle}','morning')" style="
        padding:16px 8px;
        border:none;
        border-radius:14px;
        font-size:20px;
        font-weight:bold;
        color:white;
        background:${r.morning ? '#2e9d45' : '#1976d2'};
      ">${r.morning ? '確認済' : '確認'}</button>
      <button onclick="toggleCheck('${vehicle}','afternoon')" style="
        padding:16px 8px;
        border:none;
        border-radius:14px;
        font-size:20px;
        font-weight:bold;
        color:white;
        background:${r.afternoon ? '#2e9d45' : '#1979d2'};
      ">${r.afternoon ? '確認済' : '確認'}</button>
    `;

    list.appendChild(row);
  });

  document.getElementById("morningCount").textContent = morningCount;
  document.getElementById("afternoonCount").textContent = afternoonCount;

  const dayTitle = document.getElementById("dayTitle");
  if(dayTitle){
    dayTitle.textContent = "☀ " + MONTH + "月" + day + "日の点検";
  }
}

function saveToday(){
  alert("保存しました");
}

function renderMonth(){
  const list = document.getElementById("monthList");
  if(!list) return;

  list.innerHTML = "";

  for(let day = 1; day <= 31; day++){
    const data = getData(day);
    let morningCount = 0;
    let afternoonCount = 0;

    vehicles.forEach(vehicle => {
      const r = data[vehicle] || {};
      if(r.morning) morningCount++;
      if(r.afternoon) afternoonCount++;
    });

    const row = document.createElement("div");
    row.className = "monthRow";
    row.innerHTML =
      "<span>" + day + "日</span>" +
      "<span>" + morningCount + "/" + vehicles.length + "</span>" +
      "<span>" + afternoonCount + "/" + vehicles.length + "</span>";

    list.appendChild(row);
  }
}

document.addEventListener("DOMContentLoaded", function(){
  renderToday();
  renderMonth();
});
