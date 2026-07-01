const vehicles = [
  "340","567","アームロール","いすゞ25t","265","25tセルフ",
  "6ヒアロング","5t","3tワイド","576","440","青パッカー",
  "5ヒア","620","ヒノ8t","ツートン","3tパッカー","白パッカー",
  "3ヒア","640","950","2.9","ヒノ","10t①",
  "230","8t","セルフ","3t","10t②","三菱ワイド","軽トラ"
];

const year = 2026;
const month = 7;

function getVehicleFromUrl(){
  const params = new URLSearchParams(window.location.search);
  return params.get("vehicle") || "車両";
}

function storageKey(day){
  return "tenken_" + year + "_" + month + "_" + day; }

function getData(day){
  return JSON.parse(localStorage.getItem(storageKey(day))) || {}; }

function saveData(day, data){
  localStorage.setItem(storageKey(day), JSON.stringify(data)); }

function todayDay(){
  return new Date().getDate();
}

function setTodayText(){
  const todayText = document.getElementById("todayText");
  if(todayText){
    todayText.textContent = year + "年" + month + "月 点検表";
  }
}

function showScreen(id){
  document.querySelectorAll(".screen").forEach(function(screen){
    screen.classList.remove("active");
  });

  const target = document.getElementById(id);
  if(target){
    target.classList.add("active");
  }
}

function renderToday(){
  const todayList = document.getElementById("todayList");
  if(!todayList) return;

  const day = todayDay();
  const data = getData(day);

  let morningCount = 0;
  let afternoonCount = 0;

  todayList.innerHTML = "";

  vehicles.forEach(function(vehicle){
    const item = data[vehicle] || {};

    if(item.morning) morningCount++;
    if(item.afternoon) afternoonCount++;

    const row = document.createElement("div");
    row.className = "tableRow";

    row.innerHTML =
      "<span>" + vehicle + "</span>" +
      "<span>" + (item.morning ? "済" : "未") + "</span>" +
      "<span>" + (item.afternoon ? "済" : "未") + "</span>";

    todayList.appendChild(row);
  });

  const morningCountEl = document.getElementById("morningCount");
  const afternoonCountEl = document.getElementById("afternoonCount");

  if(morningCountEl) morningCountEl.textContent = morningCount;
  if(afternoonCountEl) afternoonCountEl.textContent = afternoonCount; }

function renderMonth(){
  const monthList = document.getElementById("monthList");
  if(!monthList) return;

  monthList.innerHTML = "";

  for(let day = 1; day <= 31; day++){
    const data = getData(day);

    let morningCount = 0;
    let afternoonCount = 0;

    vehicles.forEach(function(vehicle){
      const item = data[vehicle] || {};
      if(item.morning) morningCount++;
      if(item.afternoon) afternoonCount++;
    });

    const row = document.createElement("div");
    row.className = "tableRow";

    row.innerHTML =
      "<span>" + day + "日</span>" +
      "<span>午前 " + morningCount + "/" + vehicles.length + "</span>" +
      "<span>午後 " + afternoonCount + "/" + vehicles.length + "</span>";

    monthList.appendChild(row);
  }
}

function checkVehicle(type){
  const vehicle = getVehicleFromUrl();
  const day = todayDay();
  const data = getData(day);

  if(!data[vehicle]){
    data[vehicle] = {};
  }

  data[vehicle][type] = true;
  saveData(day, data);

  const message = document.getElementById("message");
  if(message){
    if(type === "morning"){
      message.textContent = "午前点検を保存しました";
    }else{
      message.textContent = "午後点検を保存しました";
    }
    message.classList.add("done");
  }

  updateQrStatus();
}

function updateQrStatus(){
  const vehicleTitle = document.getElementById("vehicleTitle");
  if(!vehicleTitle) return;

  const vehicle = getVehicleFromUrl();
  vehicleTitle.textContent = vehicle;

  const day = todayDay();
  const data = getData(day);
  const item = data[vehicle] || {};

  const message = document.getElementById("message");
  if(message){
    if(item.morning && item.afternoon){
      message.textContent = "午前・午後 点検済みです";
    }else if(item.morning){
      message.textContent = "午前 点検済みです";
    }else if(item.afternoon){
      message.textContent = "午後 点検済みです";
    }else{
      message.textContent = "点検する項目を選んでください";
    }
  }
}

document.addEventListener("DOMContentLoaded", function(){
  setTodayText();
  renderToday();
  renderMonth();
  updateQrStatus();
});=
