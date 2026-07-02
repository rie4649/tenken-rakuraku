const vehicles = ["340", "567", "265", "5t", "6ヒアロング", "25t"]; const staffList = ["細田典良", "田中", "佐藤", "小林", "川村"];

function todayKey(){
  const d = new Date();
  return `${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()}`;
}

function timeNow(){
  const d = new Date();
  return d.toLocaleTimeString("ja-JP",{hour:"2-digit",minute:"2-digit"});
}

function getParam(name){
  return new URLSearchParams(location.search).get(name);
}

function saveCheck(vehicle, type, staff){
  const key = `tenken_${todayKey()}_${vehicle}_${type}`;
  const data = {
    vehicle,
    type,
    staff,
    time: timeNow()
  };
  localStorage.setItem(key, JSON.stringify(data));
  return data;
}

function loadCheck(vehicle, type){
  const key = `tenken_${todayKey()}_${vehicle}_${type}`;
  const raw = localStorage.getItem(key);
  return raw ? JSON.parse(raw) : null;
}

document.addEventListener("DOMContentLoaded", () => {
  const app = document.getElementById("app") || document.body;
  const vehicle = getParam("vehicle") || "340";
  const type = getParam("type") || "午前点検";

  app.innerHTML = `
    <div class="card">
      <h1><span class="carNo">${vehicle}</span> ${type}</h1>

      <label class="label">担当者</label>
      <select id="staffSelect" class="select">
        ${staffList.map(name => `<option value="${name}">${name}</option>`).join("")}
      </select>

      <button id="saveBtn" class="saveBtn">🟢 保存</button>
      <button id="cancelBtn" class="cancelBtn">❌ キャンセル</button>

      <div id="result" class="result"></div>
    </div>
  `;

  const saved = loadCheck(vehicle, type);
  const result = document.getElementById("result");

  if(saved){
    result.innerHTML = `
      <div class="done">
        ✅ 保存済み<br>
        担当者：${saved.staff}<br>
        時間：${saved.time}
      </div>
    `;
  }

  document.getElementById("saveBtn").addEventListener("click", () => {
    const staff = document.getElementById("staffSelect").value;
    const data = saveCheck(vehicle, type, staff);

    result.innerHTML = `
      <div class="done">
        ✅ 保存しました！<br>
        担当者：${data.staff}<br>
        時間：${data.time}
      </div>
    `;
  });

  document.getElementById("cancelBtn").addEventListener("click", () => {
    location.href = "index.html";
  });
});
