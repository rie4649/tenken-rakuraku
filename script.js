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
  return "tenken_" + YEAR + "_" + MONTH + "_" + day;
}

function getData(day){
  return JSON.parse(localStorage.getItem(key(day)) || "{}");
}

function saveData(day, data){
  localStorage.setItem(key(day), JSON.stringify(data));
}

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
        padding:16px 8px;border:none;border-radius:14px;font-size:20px;
        font-weight:bold;color:white;background:${r.morning ? '#2e9d45' : '#1976d2'};
      ">${r.morning ? '確認済' : '確認'}</button>
      <button onclick="toggleCheck('${vehicle}','afternoon')" style="
        padding:16px 8px;border:none;border-radius:14px;font-size:20px;
        font-weight:bold;color:white;background:${r.afternoon ? '#2e9d45' : '#1976d2'};
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

function mark(done){
  return done ? "🟢" : "🔵";
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

    const box = document.createElement("div");
    box.style.cssText =
      "background:white;margin:14px auto;padding:16px;border-radius:16px;" +
      "max-width:760px;box-shadow:0 2px 8px rgba(0,0,0,.12);text-align:left;";

    box.innerHTML = `
      <div style="font-size:24px;font-weight:bold;margin-bottom:10px;">
        ${MONTH}月${day}日
      </div>
      <div style="font-size:18px;margin-bottom:12px;">
        午前 ${morningCount}/${vehicles.length}台　
        午後 ${afternoonCount}/${vehicles.length}台
      </div>
      <button onclick="showMonthDetail(${day})" style="
        width:100%;padding:14px;border:none;border-radius:12px;
        background:#1976d2;color:white;font-size:20px;font-weight:bold;
      ">この日の車両一覧を見る</button>
      <div id="detail-${day}" style="display:none;margin-top:14px;"></div>
    `;

    list.appendChild(box);
  }
}

function showMonthDetail(day){
  const detail = document.getElementById("detail-" + day);
  if(!detail) return;

  if(detail.style.display === "block"){
    detail.style.display = "none";
    return;
  }

  const data = getData(day);

  detail.innerHTML = `
    <div style="display:grid;grid-template-columns:2fr 1fr 1fr;font-weight:bold;font-size:18px;margin-bottom:8px;">
      <span>車両名</span><span>午前</span><span>午後</span>
    </div>
  `;

  vehicles.forEach(vehicle => {
    const r = data[vehicle] || {};
    detail.innerHTML += `
      <div style="display:grid;grid-template-columns:2fr 1fr 1fr;padding:8px 0;border-bottom:1px solid #ddd;font-size:18px;">
        <span>${vehicle}</span>
        <span style="text-align:center;">${mark(r.morning)}</span>
        <span style="text-align:center;">${mark(r.afternoon)}</span>
      </div>
    `;
  });

  detail.style.display = "block";
}

document.addEventListener("DOMContentLoaded", function(){
  renderToday();
  renderMonth();
});
