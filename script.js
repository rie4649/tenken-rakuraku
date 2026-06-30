const vehicles = [
"340","567","アームロール","いすゞ25t","265","25tセルフ",
"6ヒアロング","5t","3tワイド","576","440","青パッカー",
"5ヒア","620","ヒノ8t","ツートン","3tパッカー","白パッカー",
"3ヒア","640","950","2.9","ヒノ","10t①","230","8t",
"セルフ","3t","10t②","三菱ワイド","軽トラ"
];

const baseYear = 2026;
const baseMonth = 7;
let selectedDay = 1;

const params = new URLSearchParams(location.search);
const qrVehicle = params.get("vehicle");

function key(day){
  return `tenken_${baseYear}_${baseMonth}_${day}`;
}

function getData(day){
  return JSON.parse(localStorage.getItem(key(day))) || {
    morning:{},
    afternoon:{}
  };
}

function saveData(day,data){
  localStorage.setItem(key(day), JSON.stringify(data));
}

document.addEventListener("DOMContentLoaded",()=>{
  document.getElementById("todayText").textContent =
  `${baseYear}年${baseMonth}月 点検表`;

  if(qrVehicle){
    showQrVehicle(qrVehicle);
  }else{
    renderToday();
    renderMonth();
    renderVehicleList();
  }
});

function showScreen(id){
  document.querySelectorAll(".screen").forEach(s=>s.classList.remove("active"));
  document.getElementById(id).classList.add("active");

  if(id==="today") renderToday();
  if(id==="month") renderMonth();
}

function renderToday(){
  document.querySelector("#today h2").textContent =
  `☀ ${baseMonth}月${selectedDay}日の点検`;

  createCheckList("morningList","morning");
  createCheckList("afternoonList","afternoon");
}

function createCheckList(targetId, period){
  const area = document.getElementById(targetId);
  area.innerHTML = "";

  const data = getData(selectedDay);
  const done = Object.values(data[period]).filter(Boolean).length;

  const count = document.createElement("div");
  count.className = "vehicle";
  count.innerHTML =
  `<strong>${period==="morning" ? "午前" : "午後"}：${done}/${vehicles.length}台 完了</strong>`;
  area.appendChild(count);

  vehicles.forEach(vehicle=>{
    const row = document.createElement("div");
    row.className = "vehicle";

    const name = document.createElement("span");
    name.textContent = vehicle;

    const btn = document.createElement("button");
    btn.className = "checkBtn";
    btn.textContent = data[period][vehicle] ? "✅" : "□";

    if(data[period][vehicle]) btn.classList.add("checked");

    btn.onclick = ()=>{
      const nowData = getData(selectedDay);
      nowData[period][vehicle] = !nowData[period][vehicle];
      saveData(selectedDay, nowData);
      renderToday();
      renderMonth();
    };

    row.appendChild(name);
    row.appendChild(btn);
    area.appendChild(row);
  });
}

function renderMonth(){
  const area = document.getElementById("monthList");
  area.innerHTML = "";

  const title = document.createElement("h3");
  title.style.textAlign = "center";
  title.textContent = `${baseYear}年${baseMonth}月 月間一覧`;
  area.appendChild(title);

  for(let day=1; day<=31; day++){
    const data = getData(day);
    const done =
      Object.values(data.morning).filter(Boolean).length +
      Object.values(data.afternoon).filter(Boolean).length;

    const total = vehicles.length * 2;

    const row = document.createElement("div");
    row.className = "vehicle";
    row.innerHTML = `
      <span>${baseMonth}/${day}</span>
      <strong>${done}/${total} 完了</strong>
    `;

    row.onclick = ()=>{
      selectedDay = day;
      showScreen("today");
    };

    area.appendChild(row);
  }
}

function renderVehicleList(){
  const list = document.getElementById("vehicleList");
  list.innerHTML = "";

  vehicles.forEach(vehicle=>{
    const div = document.createElement("div");
    div.className = "vehicle";
    div.textContent = vehicle;
    list.appendChild(div);
  });
}

function showQrVehicle(vehicle){
  document.querySelectorAll(".screen").forEach(s=>s.classList.remove("active"));
  document.getElementById("qr").classList.add("active");

  const qr = document.getElementById("qr");
  const data = getData(selectedDay);

  qr.innerHTML = `
    <h2>📷 QR点検</h2>
    <div class="vehicle"><span>🚛 ${vehicle}</span></div>

    <h3>☀ 午前</h3>
    <div class="vehicle">
      <span>${data.morning[vehicle] ? "✅ 午前点検済みです" : "□ 午前 未点検"}</span>
      ${data.morning[vehicle] ? "" : `<button class="checkBtn" onclick="qrCheck('${vehicle}','morning')">✅</button>`}
    </div>

    <h3>🌙 午後</h3>
    <div class="vehicle">
      <span>${data.afternoon[vehicle] ? "✅ 午後点検済みです" : "□ 午後 未点検"}</span>
      ${data.afternoon[vehicle] ? "" : `<button class="checkBtn" onclick="qrCheck('${vehicle}','afternoon')">✅</button>`}
    </div>

    <button class="backBtn" onclick="location.href='index.html'">🏠 ホームへ戻る</button>
  `;
}

function qrCheck(vehicle,period){
  const data = getData(selectedDay);
  data[period][vehicle] = true;
  saveData(selectedDay,data);
  showQrVehicle(vehicle);
}
