document.addEventListener('DOMContentLoaded', () => {

/* ───────────── ① 고정 데이터 ───────────── */
const STAGES = [
  '1. Seated','2. Menu','3. Drinks','4. Order',
  '5. Served','6. Satisfied','7. Dessert/Bill',
  '8. Paid','9. Clean','10. Ready','11. Confirm'
];
const STAGE_BG = [
  '#e0e0e0','#b0e0ff','#8ac6ff','#7cd790',
  '#b8ffb8','#ffb970','#ffd8a0',
  '#ffe680','#e8c8ff','#c0fff0','#a8ffac'
];
const LIMIT = [5,5,5,5,20,7,30,5,5,5,5].map(m=>m*60_000);   // 6단계 7분, 7단계 30분
const COL_FROM=[0,0,0], COL_TO=[255,0,0];

/* ───────────── ② 유틸 ───────────── */
const $ = s=>document.querySelector(s);
const fmt=ms=>`${String(Math.floor(ms/3600000)).padStart(2,'0')}:`
              +`${String(Math.floor(ms/60000)%60).padStart(2,'0')}:`
              +`${String(Math.floor(ms/1000)%60).padStart(2,'0')}`;
const lerp=(a,b,t)=>a+(b-a)*t;
const lerpCol=t=>`rgb(${[0,1,2].map(i=>Math.round(lerp(COL_FROM[i],COL_TO[i],t))).join(',')})`;

/* ───────────── ③ 상태 & 저장 ───────────── */
let occupied = new Map();   // tableId → {row,td}

function saveState(){
  const data=[];
  document.querySelectorAll('#rightPanel .row').forEach(row=>{
    data.push(JSON.parse(row.dataset.meta));
  });
  localStorage.setItem('tableRows', JSON.stringify(data));
}
function loadState(){
  const saved=JSON.parse(localStorage.getItem('tableRows')||'[]');
  saved.forEach(meta=>{
    const td=[...document.querySelectorAll('#tableBody td')].find(e=>e.textContent.trim()===meta.tableId);
    if(td) restoreRow(meta,td);
  });
}

/* ───────────── ④ 행 생성 / 복원 ───────────── */
function restoreRow(meta,td){
  td.classList.add('occupied');
  const row=document.createElement('div'); row.className='row';
  row.dataset.meta=JSON.stringify(meta);
  row.innerHTML=`
    <span class="table-id">${meta.tableId}</span>
    <span class="table-timer">${fmt(Date.now()-meta.totalStart)}</span>
    <button class="action-btn" title="Back">&#9664;</button>
    <span class="service-box">${STAGES[meta.stage]}</span>
    <span class="service-timer">${fmt(Date.now()-meta.stageStart)}</span>
    <button class="check-btn" title="Done">&#10003;</button>
  `;
  bindRowEvents(row);
  $('#rightPanel').prepend(row);
  setBoxBg(row);
  occupied.set(meta.tableId,{row,td});
}
function addRow(id,td){
  if(occupied.has(id)) return;
  const meta={tableId:id,totalStart:Date.now(),stageStart:Date.now(),stage:0};
  restoreRow(meta,td);
  saveState();
}
function bindRowEvents(row){
  const back=row.querySelector('.action-btn');
  const box =row.querySelector('.service-box');
  const del =row.querySelector('.check-btn');
  back.onclick =()=> changeStage(row,-1);
  box .onclick =()=> changeStage(row, 1,true);
  del .onclick =()=>{ if(prompt('PIN?')==='0') removeRow(row); };
}
function removeRow(row){
  const meta=JSON.parse(row.dataset.meta);
  const rec =occupied.get(meta.tableId);
  if(rec){ rec.td.classList.remove('occupied'); occupied.delete(meta.tableId); }
  row.remove(); saveState();
}

/* ───────────── ⑤ 단계 변경 ───────────── */
function changeStage(row,dir,fromBox=false){
  const m=JSON.parse(row.dataset.meta);
  if(dir>0 && m.stage===STAGES.length-1){ if(fromBox) removeRow(row); return; }
  m.stage=Math.min(Math.max(m.stage+dir,0),STAGES.length-1);
  m.stageStart=Date.now(); row.dataset.meta=JSON.stringify(m);
  row.querySelector('.service-box').textContent=STAGES[m.stage];
  row.querySelector('.service-timer').textContent='00:00:00';
  setBoxBg(row); saveState();
}
const setBoxBg=row=>{
  const m=JSON.parse(row.dataset.meta);
  row.querySelector('.service-box').style.background=STAGE_BG[m.stage];
};

/* ───────────── ⑥ 타이머 루프 ───────────── */
setInterval(()=>{
  document.querySelectorAll('#rightPanel .row').forEach(row=>{
    const m=JSON.parse(row.dataset.meta); const now=Date.now();
    row.querySelector('.table-timer').textContent = fmt(now-m.totalStart);
    const stageMs=now-m.stageStart, r=Math.min(stageMs/LIMIT[m.stage],1);
    const tEl=row.querySelector('.service-timer');
    tEl.textContent=fmt(stageMs);
    tEl.style.color=lerpCol(r);
    tEl.style.fontWeight=400+Math.round(300*r);
    tEl.style.fontSize  =`${0.9+0.9*r}rem`;
  });
},1000);

/* ───────────── ⑦ 왼쪽 셀 바인딩 & 복원 ───────────── */
document.querySelectorAll('#tableBody td').forEach(td=>{
  const id=td.textContent.trim(); if(!id) return;
  td.onclick=()=> addRow(id,td);
});
loadState();   // 새로고침 시 상태 복원

});
