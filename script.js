const defaultVehicles = [
  "340","567","アームロール","いすゞ25t","265","25tセルフ",
  "6ヒアロング","5t","3tワイド","576","440","青パッカー",
  "5ヒア","620","ヒノ8t","ツートン","3tパッカー","白パッカー",
  "3ヒア","640","950","2.9","ヒノ","10t①",
  "230","8t","セルフ","3t","新10ｔ","三菱ワイド","軽トラ"
];

function getVehicles(){
  return JSON.parse(localStorage.getItem("tenken_vehicles") || JSON.stringify(defaultVehicles));
}

function getCurrentYear(){
  return new Date().getFullYear();
}

function getCurrentMonth(){
  return new Date().getMonth() + 1;
}

function getViewYear(){
  return Number(localStorage.getItem("tenken_view_year") || getCurrentYear());
}

function getViewMonth(){
  return Number(localStorage.getItem("tenken_view_month") || getCurrentMonth());
}

function todayDay(){
  return new Date().getDate();
}

function daysInMonth(year, month){
  return new Date(year, month, 0).getDate();
}

function key(year, month, day){
  return "tenken_" + year + "_" + month + "_" + day;
}

function getData(day){
  return JSON.parse(localStorage.getItem(key(getViewYear(), getViewMonth(), day)) || "{}");
}

function saveData(day, data){
  localStorage.setItem(key(getViewYear(), getViewMonth(), day), JSON.stringify(data));
}

function isCurrentMonth(){
  return getViewYear() === getCurrentYear() && getViewMonth() === getCurrentMonth();
}

function showScreen(id){
  document.querySelectorAll(".screen").forEach(function(s){
    s.classList.remove("active");
  });

  const screen = document.getElementById(id);
  if(screen) screen.classList.add("active");

  renderToday();
  renderMonth();
}

function toggleCheck(vehicle, type){
  if(!isCurrentMonth()){
    alert("過去の点検表示中は変更できません。設定から『今日に戻る』を押してください。");
    return;
  }

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

function markText(done){
  return done ? "確認済" : "確認";
}

function markColor(done){
  return done ? "#2e9d45" : "#1976d2";
}

function statusLabel(done){
  return done
    ? "<span style='color:#0a9f20;font-weight:bold;'>🟢確認済</span>"
    : "<span style='color:#d60000;font-weight:bold;'>🔴未確認</span>";
}

function renderToday(){
  const vehicles = getVehicles();
  const year = getViewYear();
  const month = getViewMonth();
  const day = todayDay();
  const data = getData(day);

  const list = document.getElementById("todayList");
  if(!list) return;

  list.innerHTML = "";

  let morningCount = 0;
  let afternoonCount = 0;

  vehicles.forEach(function(vehicle){
    const r = data[vehicle] || {};
    if(r.morning) morningCount++;
    if(r.afternoon) afternoonCount++;

    const row = document.createElement("div");
    row.style.cssText =
      "display:grid;grid-template-columns:2fr 1fr 1fr;gap:10px;align-items:center;" +
      "background:white;margin:12px auto;padding:16px;border-radius:14px;" +
      "max-width:760px;box-shadow:0 2px 8px rgba(0,0,0,.12);box-sizing:border-box;";

    const nameDiv = document.createElement("div");
    nameDiv.textContent = vehicle;
    nameDiv.style.cssText = "text-align:left;font-size:24px;font-weight:bold;";

    const morningBtn = document.createElement("button");
    morningBtn.textContent = markText(r.morning);
    morningBtn.style.cssText =
      "padding:16px 8px;border:none;border-radius:14px;font-size:20px;" +
      "font-weight:bold;color:white;background:" + markColor(r.morning) + ";";
    morningBtn.onclick = function(){
      toggleCheck(vehicle, "morning");
    };

    const afternoonBtn = document.createElement("button");
    afternoonBtn.textContent = markText(r.afternoon);
    afternoonBtn.style.cssText =
      "padding:16px 8px;border:none;border-radius:14px;font-size:20px;" +
      "font-weight:bold;color:white;background:" + markColor(r.afternoon) + ";";
    afternoonBtn.onclick = function(){
      toggleCheck(vehicle, "afternoon");
    };

    row.appendChild(nameDiv);
    row.appendChild(morningBtn);
    row.appendChild(afternoonBtn);
    list.appendChild(row);
  });

  document.getElementById("morningCount").textContent = morningCount;
  document.getElementById("afternoonCount").textContent = afternoonCount;

  const dayTitle = document.getElementById("dayTitle");
  if(dayTitle){
    dayTitle.textContent = "☀ " + month + "月" + day + "日の点検";
  }

  const headerText = document.querySelector("header p");
  if(headerText){
    headerText.textContent = year + "年" + month + "月 点検表";
  }
}

function saveToday(){
  alert("保存しました");
}

function renderMonth(){
  const vehicles = getVehicles();
  const year = getViewYear();
  const month = getViewMonth();
  const totalDays = daysInMonth(year, month);
  const list = document.getElementById("monthList");
  if(!list) return;

  list.innerHTML = "";

  for(let day = 1; day <= totalDays; day++){
    const data = getData(day);

    let morningCount = 0;
    let afternoonCount = 0;

    vehicles.forEach(function(vehicle){
      const r = data[vehicle] || {};
      if(r.morning) morningCount++;
      if(r.afternoon) afternoonCount++;
    });

    const box = document.createElement("div");
    box.style.cssText =
      "background:white;margin:14px auto;padding:16px;border-radius:16px;" +
      "max-width:760px;box-shadow:0 2px 8px rgba(0,0,0,.12);text-align:left;";

    box.innerHTML =
      "<div style='font-size:24px;font-weight:bold;margin-bottom:8px;'>📅 " + month + "月" + day + "日</div>" +
      "<div style='font-size:18px;margin-bottom:12px;line-height:1.7;'>" +
      "🟢 午前 " + morningCount + "/" + vehicles.length + "台　🔴 残り " + (vehicles.length - morningCount) + "台<br>" +
      "🟢 午後 " + afternoonCount + "/" + vehicles.length + "台　🔴 残り " + (vehicles.length - afternoonCount) + "台" +
      "</div>" +
      "<button onclick='showMonthDetail(" + day + ")' style='width:100%;padding:14px;border:none;border-radius:12px;background:#1976d2;color:white;font-size:20px;font-weight:bold;'>この日の車両一覧を見る</button>" +
      "<div id='detail-" + day + "' style='display:none;margin-top:14px;'></div>";

    list.appendChild(box);
  }
}

function showMonthDetail(day){
  const vehicles = getVehicles();
  const year = getViewYear();
  const month = getViewMonth();
  const detail = document.getElementById("detail-" + day);
  if(!detail) return;

  if(detail.style.display === "block"){
    detail.style.display = "none";
    return;
  }

  const data = getData(day);

  let morningCount = 0;
  let afternoonCount = 0;

  vehicles.forEach(function(vehicle){
    const r = data[vehicle] || {};
    if(r.morning) morningCount++;
    if(r.afternoon) afternoonCount++;
  });

  detail.innerHTML =
    "<div style='background:#fff;border-radius:16px;padding:16px;margin-top:14px;border:2px solid #ddd;'>" +
    "<div style='font-size:22px;font-weight:bold;margin-bottom:14px;'>📅 " + year + "年" + month + "月" + day + "日</div>" +
    "<div style='font-size:18px;line-height:1.8;margin-bottom:16px;'>" +
    "🟢 午前確認済 " + morningCount + "台 / 🔴 未確認 " + (vehicles.length - morningCount) + "台<br>" +
    "🟢 午後確認済 " + afternoonCount + "台 / 🔴 未確認 " + (vehicles.length - afternoonCount) + "台" +
    "</div><hr>" +
    "<div style='display:grid;grid-template-columns:2fr 1fr 1fr;font-weight:bold;font-size:18px;margin:12px 0;'>" +
    "<span>車両</span><span style='text-align:center;'>午前</span><span style='text-align:center;'>午後</span>" +
    "</div>" +
    "<div id='detailList-" + day + "'></div>" +
    "</div>";

  const detailList = document.getElementById("detailList-" + day);

  vehicles.forEach(function(vehicle){
    const r = data[vehicle] || {};

    const row = document.createElement("div");
    row.style.cssText =
      "display:grid;grid-template-columns:2fr 1fr 1fr;padding:9px 0;" +
      "border-bottom:1px solid #eee;font-size:18px;align-items:center;";

    row.innerHTML =
      "<span style='color:#0645d9;'>" + vehicle + "</span>" +
      "<span style='text-align:center;'>" + statusLabel(r.morning) + "</span>" +
      "<span style='text-align:center;'>" + statusLabel(r.afternoon) + "</span>";

    detailList.appendChild(row);
  });

  const pdfBtn = document.createElement("button");
  pdfBtn.textContent = "📄 この日をPDF保存";
  pdfBtn.onclick = function(){
    location.href = "print-day.html?year=" + year + "&month=" + month + "&day=" + day;
  };
  pdfBtn.style.cssText =
    "width:100%;margin-top:20px;padding:16px;background:#1976d2;color:white;border:none;border-radius:12px;font-size:20px;font-weight:bold;";

  detailList.appendChild(pdfBtn);

  detail.style.display = "block";
}

document.addEventListener("DOMContentLoaded", function(){
  renderToday();
  renderMonth();
});
