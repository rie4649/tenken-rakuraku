const defaultVehicles=[
"340","567","アームロール","いすゞ25t","265","25tセルフ",
"6ヒアロング","5t","3tワイド","576","440","青パッカー",
"5ヒア","620","ヒノ8t","ツートン","3tパッカー","白パッカー",
"3ヒア","640","950","2.9","ヒノ","10t①",
"230","8t","セルフ","3t","新10t","三菱ワイド","軽トラ"
];

const defaultStaff=[
"未選択","社長","常務","細田典良","春原誠","高橋良幸","西澤文彦",
"五十嵐雅文","赤池秀幸","金子政司","大日方広義","金井正美",
"清水広之","桑野恵","上野雅宏","中村雅志","深澤卓也",
"仙石寛崇","上野雅也","塩川公明","松下伊織","水野浩",
"伊部豊","山田由一","池田袈裟人","菊池茂義"
];

const firebaseConfig={
 apiKey:"AIzaSyA1GSV7KX6qMbIFIFz2ZhPNBVksiGxanKA",
 authDomain:"tenken-rakuraku.firebaseapp.com",
 databaseURL:"https://tenken-rakuraku-default-rtdb.firebaseio.com",
 projectId:"tenken-rakuraku",
 storageBucket:"tenken-rakuraku.firebasestorage.app",
 messagingSenderId:"546571524606",
 appId:"1:546571524606:web:dbe38f12c4b6ab4ad148af"
};

if(!firebase.apps.length){
 firebase.initializeApp(firebaseConfig);
}

const tenkenDB=firebase.database();

let pendingVehicle="";
let pendingType="";

function getVehicles(){
 return JSON.parse(localStorage.getItem("tenken_vehicles")||JSON.stringify(defaultVehicles));
}

function getStaff(){
 return JSON.parse(localStorage.getItem("tenken_staff")||JSON.stringify(defaultStaff));
}

function getCurrentYear(){return new Date().getFullYear();} function getCurrentMonth(){return new Date().getMonth()+1;} function todayDay(){return new Date().getDate();}

function getViewYear(){
 return Number(localStorage.getItem("tenken_view_year")||getCurrentYear());
}

function getViewMonth(){
 return Number(localStorage.getItem("tenken_view_month")||getCurrentMonth());
}

function daysInMonth(year,month){
 return new Date(year,month,0).getDate(); }

function makeKey(year,month,day){
 return "tenken_"+year+"_"+month+"_"+day; }

function getData(day){
 return JSON.parse(localStorage.getItem(makeKey(getViewYear(),getViewMonth(),day))||"{}");
}

function saveData(day,data){
 const k=makeKey(getViewYear(),getViewMonth(),day);
 localStorage.setItem(k,JSON.stringify(data));
 return tenkenDB.ref("tenkenData/"+k).set(data);
}
function loadSettings(){
 return Promise.all([
  tenkenDB.ref("settings/vehicles").once("value"),
  tenkenDB.ref("settings/staff").once("value")
 ]).then(function(results){

  const vehicles = results[0].val() || defaultVehicles;
  const staff = results[1].val() || defaultStaff;

  localStorage.setItem("tenken_vehicles", JSON.stringify(vehicles));
  localStorage.setItem("tenken_staff", JSON.stringify(staff));

  if(!results[0].val()){
   tenkenDB.ref("settings/vehicles").set(defaultVehicles);
  }

  if(!results[1].val()){
   tenkenDB.ref("settings/staff").set(defaultStaff);
  }
 });
}
function loadFirebase(){
 return tenkenDB.ref("tenkenData").once("value").then(function(snapshot){
  const all=snapshot.val()||{};
  Object.keys(all).forEach(function(k){
   localStorage.setItem(k,JSON.stringify(all[k]));
  });
  renderToday();
  renderMonth();
 });
}

function nowTime(){
 const d=new Date();
 return String(d.getHours()).padStart(2,"0")+":"+String(d.getMinutes()).padStart(2,"0");
}

function isCurrentMonth(){
 return getViewYear()===getCurrentYear()&&getViewMonth()===getCurrentMonth();
}

function showScreen(id){
 document.querySelectorAll(".screen").forEach(function(s){
  s.classList.remove("active");
 });
 const screen=document.getElementById(id);
 if(screen)screen.classList.add("active");
 renderToday();
 renderMonth();
}

function statusColor(done){
 return done ? "#2e9d45" : "#1976d2";
}

function openCheckModal(vehicle,type){
 if(!isCurrentMonth()){
  alert("過去の点検は変更できません。設定から今日に戻ってください。");
  return;
 }

 pendingVehicle=vehicle;
 pendingType=type;

 let modal=document.getElementById("checkModal");

 if(!modal){
  modal=document.createElement("div");
  modal.id="checkModal";
  modal.style.cssText="display:none;position:fixed;inset:0;background:rgba(0,0,0,.55);z-index:9999;align-items:center;justify-content:center;padding:18px;";

  modal.innerHTML=`
  <div style="background:white;width:100%;max-width:520px;border-radius:18px;padding:24px;text-align:center;">
   <h2 id="modalTitle" style="font-size:28px;margin:0 0 18px;">確認</h2>
   <label style="font-size:22px;font-weight:bold;">担当者</label>
   <select id="modalStaffSelect" style="width:100%;padding:16px;font-size:22px;border-radius:12px;margin:14px 0;border:2px solid #1976d2;"></select>
   <button onclick="saveModalCheck()" style="width:100%;padding:18px;border:none;border-radius:14px;background:#2e9d45;color:white;font-size:24px;font-weight:bold;margin-top:10px;">🟢 保存</button>
   <button onclick="closeCheckModal()" style="width:100%;padding:16px;border:none;border-radius:14px;background:#555;color:white;font-size:20px;font-weight:bold;margin-top:12px;">❌ キャンセル</button>
   <div id="saveMessage" style="display:none;margin-top:14px;font-size:22px;font-weight:bold;color:#2e9d45;">✅ 保存しました</div>
  </div>`;
  document.body.appendChild(modal);
 }

 document.getElementById("modalTitle").textContent=
  vehicle+"　"+(type==="morning"?"午前点検":"午後点検");

 const select=document.getElementById("modalStaffSelect");
 select.innerHTML="";

 getStaff().forEach(function(name){
  const option=document.createElement("option");
  option.value=name;
  option.textContent=name;
  select.appendChild(option);
 });

 document.getElementById("saveMessage").style.display="none";
 modal.style.display="flex";
}

function closeCheckModal(){
 const modal=document.getElementById("checkModal");
 if(modal)modal.style.display="none";
}

function saveModalCheck(){
 const staff=document.getElementById("modalStaffSelect").value;

 if(!staff||staff==="未選択"){
  alert("担当者を選んでください");
  return;
 }

 const day=todayDay();
 const data=getData(day);

 if(!data[pendingVehicle]){
  data[pendingVehicle]={};
 }

 data[pendingVehicle][pendingType]=true;
 data[pendingVehicle][pendingType+"Time"]=nowTime();
 data[pendingVehicle][pendingType+"Staff"]=staff;

 saveData(day,data).then(function(){
  document.getElementById("saveMessage").style.display="block";
  closeCheckModal();
  renderToday();
  renderMonth();
 }).catch(function(){
  alert("保存に失敗しました。通信を確認してください。");
 });
}

function toggleCheck(vehicle,type){
 const day=todayDay();
 const data=getData(day);
 const record=data[vehicle]||{};

 if(record[type]){
  const label=type==="morning"?"午前":"午後";
  if(!confirm(vehicle+" の"+label+"確認を取り消しますか？"))return;

  record[type]=false;
  delete record[type+"Time"];
  delete record[type+"Staff"];
  data[vehicle]=record;

  saveData(day,data).then(function(){
   renderToday();
   renderMonth();
  });
  return;
 }

 openCheckModal(vehicle,type);
}

function renderToday(){
 const vehicles=getVehicles();
 const year=getViewYear();
 const month=getViewMonth();
 const day=todayDay();
 const data=getData(day);

 const list=document.getElementById("todayList");
 if(!list)return;

 list.innerHTML="";

 let morningCount=0;
 let afternoonCount=0;

 vehicles.forEach(function(vehicle){
  const r=data[vehicle]||{};
  if(r.morning)morningCount++;
  if(r.afternoon)afternoonCount++;

  const row=document.createElement("div");
  row.style.cssText="display:grid;grid-template-columns:2fr 1fr 1fr;gap:10px;align-items:center;background:white;margin:12px auto;padding:16px;border-radius:14px;max-width:760px;box-shadow:0 2px 8px rgba(0,0,0,.12);box-sizing:border-box;";

  const name=document.createElement("div");
  name.textContent=vehicle;
  name.style.cssText="text-align:left;font-size:24px;font-weight:bold;";

  const morningBtn=document.createElement("button");
  morningBtn.innerHTML=r.morning
?"確認済<br><span style='font-size:14px;'>🕒"+(r.morningTime||"-")+"<br>👤"+(r.morningStaff||"-")+"</span>"+(r.dailyDone?"<br><span style='font-size:13px;'>📋日常点検済</span>":"")
:"確認";
  morningBtn.style.cssText="padding:12px 6px;border:none;border-radius:14px;font-size:18px;font-weight:bold;color:white;background:"+statusColor(r.morning)+";";
  morningBtn.onclick=function(){toggleCheck(vehicle,"morning");};

  const afternoonBtn=document.createElement("button");
  afternoonBtn.innerHTML=r.afternoon
   ?"確認済<br><span style='font-size:14px;'>🕒"+(r.afternoonTime||"-")+"<br>👤"+(r.afternoonStaff||"-")+"</span>"
   :"確認";
  afternoonBtn.style.cssText="padding:12px 6px;border:none;border-radius:14px;font-size:18px;font-weight:bold;color:white;background:"+statusColor(r.afternoon)+";";
  afternoonBtn.onclick=function(){toggleCheck(vehicle,"afternoon");};

  row.appendChild(name);
  row.appendChild(morningBtn);
  row.appendChild(afternoonBtn);
  list.appendChild(row);
 });

 const mc=document.getElementById("morningCount");
 const ac=document.getElementById("afternoonCount");
 if(mc)mc.textContent=morningCount;
 if(ac)ac.textContent=afternoonCount;

 const dayTitle=document.getElementById("dayTitle");
 if(dayTitle)dayTitle.textContent="☀ "+month+"月"+day+"日の点検";

 const headerText=document.querySelector("header p");
 if(headerText)headerText.textContent=year+"年"+month+"月 点検表";
}

function renderMonth(){
 const vehicles=getVehicles();
 const year=getViewYear();
 const month=getViewMonth();
 const totalDays=daysInMonth(year,month);
 const list=document.getElementById("monthList");
 if(!list)return;

 list.innerHTML="";

 for(let day=1;day<=totalDays;day++){
  const data=getData(day);
  let morningCount=0;
  let afternoonCount=0;

  vehicles.forEach(function(vehicle){
   const r=data[vehicle]||{};
   if(r.morning)morningCount++;
   if(r.afternoon)afternoonCount++;
  });

  const box=document.createElement("div");
  box.style.cssText="background:white;margin:14px auto;padding:16px;border-radius:16px;max-width:760px;box-shadow:0 2px 8px rgba(0,0,0,.12);text-align:left;";

  box.innerHTML=
   "<div style='font-size:24px;font-weight:bold;margin-bottom:8px;'>📅 "+month+"月"+day+"日</div>"+
   "<div style='font-size:18px;margin-bottom:12px;line-height:1.7;'>"+
   "🟢 午前 "+morningCount+"/"+vehicles.length+"台　🔴 残り "+(vehicles.length-morningCount)+"台<br>"+
   "🟢 午後 "+afternoonCount+"/"+vehicles.length+"台　🔴 残り "+(vehicles.length-afternoonCount)+"台"+
   "</div>"+
   "<button onclick='showMonthDetail("+day+")' style='width:100%;padding:14px;border:none;border-radius:12px;background:#1976d2;color:white;font-size:20px;font-weight:bold;'>この日の車両一覧を見る</button>"+
   "<button onclick=\"location.href='print-day.html?year="+year+"&month="+month+"&day="+day+"'\" style='width:100%;padding:12px;border:none;border-radius:12px;background:#555;color:white;font-size:17px;font-weight:bold;margin-top:8px;'>📄 この日をPDF保存</button>"+
   "<div id='detail-"+day+"' style='display:none;margin-top:14px;'></div>";

  list.appendChild(box);
 }
}

function statusDetail(done,time,staff){
 if(!done){
  return "<span style='color:#d60000;font-weight:bold;'>🔴未確認</span>";
 }
 return "🟢確認済<br><span style='font-size:14px;'>🕒"+(time||"-")+"<br>👤"+(staff||"-")+"</span>";
}

function showMonthDetail(day){
 const vehicles=getVehicles();
 const year=getViewYear();
 const month=getViewMonth();
 const detail=document.getElementById("detail-"+day);
 if(!detail)return;

 if(detail.style.display==="block"){
  detail.style.display="none";
  return;
 }

 const data=getData(day);

 detail.innerHTML=
  "<div style='background:#fff;border-radius:16px;padding:16px;margin-top:14px;border:2px solid #ddd;'>"+
  "<div style='font-size:22px;font-weight:bold;margin-bottom:14px;'>📅 "+year+"年"+month+"月"+day+"日</div>"+
  "<div style='display:grid;grid-template-columns:2fr 1.3fr 1.3fr;font-weight:bold;font-size:18px;margin:12px 0;'>"+
  "<span>車両</span><span style='text-align:center;'>午前</span><span style='text-align:center;'>午後</span>"+
  "</div>"+
  "<div id='detailList-"+day+"'></div>"+
  "</div>";

 const detailList=document.getElementById("detailList-"+day);

 vehicles.forEach(function(vehicle){
  const r=data[vehicle]||{};
  const row=document.createElement("div");
  row.style.cssText="display:grid;grid-template-columns:2fr 1.3fr 1.3fr;padding:9px 0;border-bottom:1px solid #eee;font-size:17px;align-items:center;";

 let dailyText = "";

if(r.dailyDone || r.dailyCheck){
  dailyText += "<br><span style='color:#ff9800;font-weight:bold;'>📋日常点検済</span>";
}

if(r.dailyCheck && r.dailyCheck.badItems && r.dailyCheck.badItems.length > 0){
dailyText += "<br><span onclick='showBadItems(\""+vehicle+"\","+day+")' style='color:#d60000;font-weight:bold;cursor:pointer;text-decoration:underline;'>⚠️否 " + r.dailyCheck.badItems.length + "件</span>";
}

row.innerHTML =
  "<span style='color:#0645d9;font-weight:bold;'>" + vehicle + "</span>" +
  "<span style='text-align:center;'>" + statusDetail(r.morning, r.morningTime, r.morningStaff) + dailyText + "</span>" +
  "<span style='text-align:center;'>" + statusDetail(r.afternoon, r.afternoonTime, r.afternoonStaff) + "</span>";
  
  detailList.appendChild(row);
 });

 detail.style.display="block";
}
function showBadItems(vehicle,day){
  const data = getData(day);
  const r = data[vehicle] || {};

  if(!r.dailyCheck || !r.dailyCheck.badItems || r.dailyCheck.badItems.length === 0){
    alert("否の項目はありません");
    return;
  }

  const text = r.dailyCheck.badItems
    .map(function(item){
      return item.no + "　" + item.name;
    })
    .join("\n");

  alert(vehicle + " の否の項目\n\n" + text);
}
function saveToday(){
 alert("保存済みです");
}

function exportMonthCSV(){
 const vehicles=getVehicles();
 const year=getViewYear();
 const month=getViewMonth();
 const totalDays=daysInMonth(year,month);

 let rows=[["日付","車両","午前","午前時刻","午前担当","午後","午後時刻","午後担当","日常点検","否件数"]];

 for(let day=1;day<=totalDays;day++){
  const data=getData(day);
  vehicles.forEach(function(vehicle){
   const r=data[vehicle]||{};
   const badCount=(r.dailyCheck&&r.dailyCheck.badItems)?r.dailyCheck.badItems.length:0;
   rows.push([
    year+"/"+month+"/"+day,
    vehicle,
    r.morning?"確認済":"未確認",
    r.morningTime||"",
    r.morningStaff||"",
    r.afternoon?"確認済":"未確認",
    r.afternoonTime||"",
    r.afternoonStaff||"",
    (r.dailyDone||r.dailyCheck)?"実施済":"",
    badCount
   ]);
  });
 }

 const csv=rows.map(function(row){
  return row.map(function(cell){
   return "\""+String(cell).replace(/"/g,'""')+"\"";
  }).join(",");
 }).join("\r\n");

 const blob=new Blob(["\uFEFF"+csv],{type:"text/csv;charset=utf-8;"});
 const url=URL.createObjectURL(blob);
 const a=document.createElement("a");
 a.href=url;
 a.download="点検データ_"+year+"年"+month+"月.csv";
 document.body.appendChild(a);
 a.click();
 document.body.removeChild(a);
 URL.revokeObjectURL(url);
}

document.addEventListener("DOMContentLoaded",function(){
 loadSettings().then(function(){
  return loadFirebase();
 });
});
