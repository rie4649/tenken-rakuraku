const vehicles=[
"340","567","アームロール","いすゞ25t","265","25tセルフ",
"6ヒアロング","5t","3tワイド","576","440","青パッカー",
"5ヒア","620","ヒノ8t","ツートン","3tパッカー","白パッカー",
"3ヒア","640","950","2.9","ヒノ","10t①",
"230","8t","セルフ","3t","10t②","三菱ワイド","軽トラ"
];

const TENKEN_YEAR=2026;
const TENKEN_MONTH=7;

function getTodayDay(){return new Date().getDate();} function makeKey(day){return "tenken_"+TENKEN_YEAR+"_"+TENKEN_MONTH+"_"+day;}

function loadDayData(day){
 const saved=localStorage.getItem(makeKey(day));
 if(!saved)return {};
 try{return JSON.parse(saved);}catch(e){return {};} }

function showScreen(id){
 document.querySelectorAll(".screen").forEach(s=>s.classList.remove("active"));
 document.getElementById(id).classList.add("active");
 renderAll();
}

function statusText(done){
 return done ? "済" : "未";
}

function makeRow(a,b,c){
 const row=document.createElement("div");
 row.style.cssText="display:grid;grid-template-columns:2fr 1fr 1fr;max-width:700px;margin:0 auto;padding:10px 12px;background:white;border-bottom:1px solid #ddd;font-size:18px;box-sizing:border-box;align-items:center;";
 row.innerHTML=
 `<div style="text-align:left;">${a}</div>
  <div style="text-align:center;">${b}</div>
  <div style="text-align:center;">${c}</div>`;
 return row;
}

function renderToday(){
 const todayList=document.getElementById("todayList");
 if(!todayList)return;

 const data=loadDayData(getTodayDay());
 todayList.innerHTML="";

 let morningCount=0;
 let afternoonCount=0;

 vehicles.forEach(vehicle=>{
   const r=data[vehicle]||{};
   if(r.morning)morningCount++;
   if(r.afternoon)afternoonCount++;

   todayList.appendChild(
     makeRow(vehicle,statusText(r.morning),statusText(r.afternoon))
   );
 });

 document.getElementById("morningCount").textContent=morningCount;
 document.getElementById("afternoonCount").textContent=afternoonCount;
}

function renderMonth(){
 const monthList=document.getElementById("monthList");
 if(!monthList)return;

 monthList.innerHTML="";

 for(let day=1;day<=31;day++){
   const data=loadDayData(day);
   let morningCount=0;
   let afternoonCount=0;

   vehicles.forEach(vehicle=>{
     const r=data[vehicle]||{};
     if(r.morning)morningCount++;
     if(r.afternoon)afternoonCount++;
   });

   monthList.appendChild(
     makeRow(day+"日",morningCount+"/"+vehicles.length,afternoonCount+"/"+vehicles.length)
   );
 }
}

function renderAll(){
 const todayText=document.getElementById("todayText");
 if(todayText){
   todayText.textContent=TENKEN_YEAR+"年"+TENKEN_MONTH+"月 点検表";
 }
 renderToday();
 renderMonth();
}

document.addEventListener("DOMContentLoaded",renderAll);=
