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
  document.querySelectorAll(".screen").forEach(function(screen){
    screen.classList.remove("active");
  });

  document.getElementById(id).classList.add("active");

  renderToday();
  renderMonth();
}

function mark(done){
  return done ? "済" : "未";
}

function renderToday(){
  const day = todayDay();
  const data = getData(day);
  const list = document.getElementById("todayList");

  if(!list) return;

  list.innerHTML = "";

  let morningCount = 0;
  let afternoonCount = 0;

  vehicles.forEach(function(vehicle){
    const record = data[vehicle] || {};

    if(record.morning) morningCount++;
    if(record.afternoon) afternoonCount++;

    const row = document.createElement("div");
    row.className = "monthRow";

    row.innerHTML =
      "<span>" + vehicle + "</span>" +
      "<span>" + mark(record.morning) + "</span>" +
      "<span>" + mark(record.afternoon) + "</span>";

    list.appendChild(row);
  });

  document.getElementById("morningCount").textContent = morningCount;
  document.getElementById("afternoonCount").textContent = afternoonCount;
  document.getElementById("dayTitle").textContent = "☀ " + MONTH + "月" + day + "日の点検";
}

function saveToday(){
  alert("管理画面では保存せず、各車両のQRコードから点検してください");
}

function renderMonth(){
  const list = document.getElementById("monthList");
  if(!list) return;

  list.innerHTML = "";

  for(let day = 1; day <= 31; day++){
    const data = getData(day);

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

    list.appendChild(row);
  }
}

document.addEventListener("DOMContentLoaded", function(){
  renderToday();
  renderMonth();
});
