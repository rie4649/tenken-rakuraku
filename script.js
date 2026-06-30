const vehicles = [
  "340","567","アームロール","いすゞ25t","265","25tセルフ",
  "6ヒアロング","5t","3tワイド","576","440","青パッカー",
  "5ヒア","620","ヒノ8t","ツートン","3tパッカー","白パッカー",
  "3ヒア","640","950","2.9","ヒノ","10t①","230","8t",
  "セルフ","3t","10t②","三菱ワイド","軽トラ"
];

const year = 2026;
const month = 7;
let selectedDay = 1;

const params = new URLSearchParams(location.search);
const qrVehicle = params.get("vehicle");

function storageKey(day){
  return `tenken_${year}_${month}_${day}`;
}

function getData(day){
  return JSON.parse(localStorage.getItem(storageKey(day))) || {};
}

function saveData(day, data){
  localStorage.setItem(storageKey(day), JSON.stringify(data));
}

document.addEventListener("DOMContentLoaded", function(){
  document.getElementById("todayText").textContent = `${year}年${month}月 点検表`;

  if(qrVehicle){
    showQrCheck(qrVehicle);
  }else{
    renderToday();
    renderMonth();
  }
});

function showScreen(id){
  document.querySelectorAll(".screen").forEach(function(screen){
    screen.classList.remove("active");
  });

  document.getElementById(id).classList.add("active");

  if(id === "today") renderToday();
  if(id === "month") renderMonth();
}

function renderToday(){
  const data = getData(selectedDay);
  const todayList = document.getElementById("todayList");
  todayList.innerHTML = "";

  document.getElementById("dayTitle").textContent = `☀ ${month}月${selectedDay}日の点検`;

  let morningDone = 0;
  let afternoonDone = 0;

  vehicles.forEach(function(vehicle){
    if(data[vehicle]?.morning) morningDone++;
    if(data[vehicle]?.afternoon) afternoonDone++;
  });

  document.getElementById("morningCount").textContent = morningDone;
  document.getElementById("afternoonCount").textContent = afternoonDone;

  vehicles.forEach(function(vehicle){
    const row = document.createElement("div");
    row.className = "checkRow";

    const name = document.createElement("div");
    name.className = "carName";
    name.textContent = vehicle;

    const morningBtn = document.createElement("button");
    morningBtn.className = "miniCheck";
    morningBtn.textContent = data[vehicle]?.morning ? "✅" : "□";
    if(data[vehicle]?.morning) morningBtn.classList.add("done");
    morningBtn.onclick = function(){
      toggleCheck(vehicle, "morning");
    };

    const afternoonBtn = document.createElement("button");
    afternoonBtn.className = "miniCheck";
    afternoonBtn.textContent = data[vehicle]?.afternoon ? "✅" : "□";
    if(data[vehicle]?.afternoon) afternoonBtn.classList.add("done");
    afternoonBtn.onclick = function(){
      toggleCheck(vehicle, "afternoon");
    };

    row.appendChild(name);
    row.appendChild(morningBtn);
    row.appendChild(afternoonBtn);
    todayList.appendChild(row);
  });
}

function toggleCheck(vehicle, period){
  const data = getData(selectedDay);

  if(!data[vehicle]){
    data[vehicle] = {};
  }

  data[vehicle][period] = !data[vehicle][period];

  saveData(selectedDay, data);
  renderToday();
  renderMonth();
}

function renderMonth(){
  const monthList = document.getElementById("monthList");
  monthList.innerHTML = "";

  for(let day = 1; day <= 31; day++){
    const data = getData(day);
    let done = 0;
    const total = vehicles.length * 2;

    vehicles.forEach(function(vehicle){
      if(data[vehicle]?.morning) done++;
      if(data[vehicle]?.afternoon) done++;
    });

    const row = document.createElement("div");
    row.className = "vehicle";
    row.innerHTML = `<span>${month}/${day}</span><strong>${done}/${total} 完了</strong>`;

    row.onclick = function(){
      selectedDay = day;
      showScreen("today");
    };

    monthList.appendChild(row);
  }
}

function showQrCheck(vehicle){
  showScreen("today");

  const data = getData(selectedDay);

  document.getElementById("dayTitle").textContent = `📷 QR点検：${vehicle}`;

  const todayList = document.getElementById("todayList");
  todayList.innerHTML = "";

  document.getElementById("morningCount").textContent = data[vehicle]?.morning ? 1 : 0;
  document.getElementById("afternoonCount").textContent = data[vehicle]?.afternoon ? 1 : 0;

  const row = document.createElement("div");
  row.className = "checkRow";

  const name = document.createElement("div");
  name.className = "carName";
  name.textContent = vehicle;

  const morningBtn = document.createElement("button");
  morningBtn.className = "miniCheck";
  morningBtn.textContent = data[vehicle]?.morning ? "✅" : "□";
  if(data[vehicle]?.morning) morningBtn.classList.add("done");
  morningBtn.onclick = function(){
    qrComplete(vehicle, "morning");
  };

  const afternoonBtn = document.createElement("button");
  afternoonBtn.className = "miniCheck";
  afternoonBtn.textContent = data[vehicle]?.afternoon ? "✅" : "□";
  if(data[vehicle]?.afternoon) afternoonBtn.classList.add("done");
  afternoonBtn.onclick = function(){
    qrComplete(vehicle, "afternoon");
  };

  row.appendChild(name);
  row.appendChild(morningBtn);
  row.appendChild(afternoonBtn);
  todayList.appendChild(row);
}

function qrComplete(vehicle, period){
  const data = getData(selectedDay);

  if(!data[vehicle]){
    data[vehicle] = {};
  }

  data[vehicle][period] = true;

  saveData(selectedDay, data);
  showQrCheck(vehicle);
}
