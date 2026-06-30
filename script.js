const vehicles = [
  "340",
  "567",
  "アームロール",
  "いすゞ25t",
  "265",
  "25tセルフ",
  "6ヒアロング",
  "5t",
  "3tワイド",
  "576",
  "440",
  "青パッカー",
  "5ヒア",
  "620",
  "ヒノ8t",
  "ツートン",
  "3tパッカー",
  "白パッカー",
  "3ヒア",
  "640",
  "950",
  "2.9",
  "ヒノ",
  "10t①",
  "230",
  "8t",
  "セルフ",
  "3t",
  "10t②",
  "三菱ワイド",
  "軽トラ"
];

const today = new Date();
const year = today.getFullYear();
const month = today.getMonth() + 1;
const date = today.getDate();

const todayKey = `${year}-${month}-${date}`;
const storageKey = `tenken_${todayKey}`;

let data = JSON.parse(localStorage.getItem(storageKey)) || {
  morning: {},
  afternoon: {}
};

document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("todayText").textContent =
    `${year}年${month}月${date}日`;

  renderToday();
  renderMonth();
  renderVehicleList();
});

function saveData() {
  localStorage.setItem(storageKey, JSON.stringify(data));
}

function showScreen(id) {
  document.querySelectorAll(".screen").forEach(function (screen) {
    screen.classList.remove("active");
  });

  document.getElementById(id).classList.add("active");

  if (id === "month") {
    renderMonth();
  }
}

function renderToday() {
  createCheckList("morningList", "morning");
  createCheckList("afternoonList", "afternoon");
}

function createCheckList(targetId, period) {
  const area = document.getElementById(targetId);
  area.innerHTML = "";

  vehicles.forEach(function (vehicle) {
    const row = document.createElement("div");
    row.className = "vehicle";

    const name = document.createElement("span");
    name.textContent = vehicle;

    const btn = document.createElement("button");
    btn.className = "checkBtn";

    if (data[period][vehicle]) {
      btn.classList.add("checked");
      btn.textContent = "✅";
    } else {
      btn.textContent = "□";
    }

    btn.onclick = function () {
      data[period][vehicle] = !data[period][vehicle];
      saveData();
      renderToday();
      renderMonth();
    };

    row.appendChild(name);
    row.appendChild(btn);
    area.appendChild(row);
  });
}

function renderMonth() {
  const monthList = document.getElementById("monthList");
  monthList.innerHTML = "";

  const total = vehicles.length * 2;
  const done =
    Object.values(data.morning).filter(Boolean).length +
    Object.values(data.afternoon).filter(Boolean).length;

  const box = document.createElement("div");
  box.className = "vehicle";
  box.innerHTML = `
    <span>${month}月${date}日</span>
    <strong>${done} / ${total} 完了</strong>
  `;

  monthList.appendChild(box);
}

function renderVehicleList() {
  const list = document.getElementById("vehicleList");
  list.innerHTML = "";

  vehicles.forEach(function (vehicle) {
    const div = document.createElement("div");
    div.className = "vehicle";
    div.textContent = vehicle;
    list.appendChild(div);
  });
}
