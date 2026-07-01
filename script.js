const vehicles = [
  "340","567","アームロール","いすゞ25t","265","25tセルフ",
  "6ヒアロング","5t","3tワイド","576","440","青パッカー",
  "5ヒア","620","ヒノ8t","ツートン","3tパッカー","白パッカー",
  "3ヒア","640","950","2.9","ヒノ","10t①",
  "230","8t","セルフ","3t","10t②","三菱ワイド","軽トラ"
];

const TENKEN_YEAR = 2026;
const TENKEN_MONTH = 7;

function getTodayDay(){
  return new Date().getDate();
}

function makeKey(day){
  return "tenken_" + TENKEN_YEAR + "_" + TENKEN_MONTH + "_" + day; }

function loadDayData(day){
  const saved = localStorage.getItem(makeKey(day));
  if(!saved) return {};
  try{
    return JSON.parse(saved);
  }catch(e){
    return {};
  }
}

function saveDayData(day, data){
  localStorage.setItem(makeKey(day), JSON.stringify(data)); }

function showScreen(id){
  document.querySelectorAll(".screen").forEach(function(screen){
    screen.classList.remove("active");
  });

  const target = document.getElementById(id);
  if(target){
    target.classList.add("active");
  }

  renderAll();
}

function renderToday(){
  const todayList = document.getElementById("todayList");
  if(!todayList) return;

  const day = getTodayDay();
  const data = loadDayData(day);

  todayList.innerHTML = "";

  let morningCount = 0;
  let afternoonCount = 0;

  vehicles.forEach(function(vehicle){
    const record = data[vehicle] || {};

    if(record.morning) morningCount++;
    if(record.afternoon) afternoonCount++;

    const row = document.createElement("div");
    row.className = "checkRow";

    row.innerHTML =
      "<div class='vehicleName'>" + vehicle + "</div>" +
      "<input class='checkBox morningCheck' type='checkbox' data-vehicle='" + vehicle + "' " + (record.morning ? "checked" : "") + ">" +
      "<input class='checkBox afternoonCheck' type='checkbox' data-vehicle='" + vehicle + "' " + (record.afternoon ? "checked" : "") + ">";

    todayList.appendChild(row);
  });

  const morningEl = document.getElementById("morningCount");
  const afternoonEl = document.getElementById("afternoonCount");

  if(morningEl) morningEl.textContent = morningCount;
  if(afternoonEl) afternoonEl.textContent = afternoonCount; }

function saveToday(){
  const day = getTodayDay();
  const data = loadDayData(day);

  vehicles.forEach(function(vehicle){
    if(!data[vehicle]){
      data[vehicle] = {};
    }

    const morning = document.querySelector(".morningCheck[data-vehicle='" + vehicle + "']");
    const afternoon = document.querySelector(".afternoonCheck[data-vehicle='" + vehicle + "']");

    data[vehicle].morning = morning ? morning.checked : false;
    data[vehicle].afternoon = afternoon ? afternoon.checked : false;
  });

  saveDayData(day, data);
  renderAll();

  alert("点検を保存しました");
}

function renderMonth(){
  const monthList = document.getElementById("monthList");
  if(!monthList) return;

  monthList.innerHTML = "";

  for(let day = 1; day <= 31; day++){
    const data = loadDayData(day);

    let morningCount = 0;
    let afternoonCount = 0;

    vehicles.forEach(function(vehicle){
      const record = data[vehicle] || {};
      if(record.morning) morningCount++;
      if(record.afternoon) afternoonCount++;
    });

    const row = document.createElement("div");
    row.className = "monthRow";

    row.innerHTML =
      "<span>" + day + "日</span>" +
      "<span>" + morningCount + "/" + vehicles.length + "</span>" +
      "<span>" + afternoonCount + "/" + vehicles.length + "</span>";

    monthList.appendChild(row);
  }
}

function renderAll(){
  const today = getTodayDay();

  const todayText = document.getElementById("todayText");
  if(todayText){
    todayText.textContent = TENKEN_YEAR + "年" + TENKEN_MONTH + "月 点検表";
  }

  const dayTitle = document.getElementById("dayTitle");
  if(dayTitle){
    dayTitle.textContent = "☀ " + TENKEN_MONTH + "月" + today + "日の点検";
  }

  renderToday();
  renderMonth();
}

document.addEventListener("DOMContentLoaded", function(){
  renderAll();
});=
