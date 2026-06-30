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

document.getElementById("todayText").innerHTML =
today.getFullYear()+"年"+
(today.getMonth()+1)+"月"+
today.getDate()+"日";

function showScreen(id){

document.querySelectorAll(".screen").forEach(screen=>{
screen.classList.remove("active");
});

document.getElementById(id).classList.add("active");

}

function createList(target){

const area=document.getElementById(target);

vehicles.forEach(name=>{

const row=document.createElement("div");
row.className="vehicle";

const title=document.createElement("span");
title.textContent=name;

const btn=document.createElement("button");
btn.className="checkBtn";
btn.textContent="□";

btn.onclick=function(){

if(btn.classList.contains("checked")){
btn.classList.remove("checked");
btn.textContent="□";
}else{
btn.classList.add("checked");
btn.textContent="✅";
}

};

row.appendChild(title);
row.appendChild(btn);

area.appendChild(row);

});

}

createList("morningList");
createList("afternoonList");

document.getElementById("monthList").innerHTML=
"<h3 style='text-align:center;'>🚧 月間点検表はVer2で追加予定</h3>";

document.getElementById("vehicleList").innerHTML=
vehicles.join("<br>");
