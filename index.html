document.addEventListener('DOMContentLoaded', () => {

  /* ── 단계 이름 & 배경색 ───────────────────────── */
  const STAGES = [
    '1. Seated',  '2. Menu',   '3. Drinks',      '4. Order',
    '5. Served',  '6. Satisfied', '7. Dessert/Bill',
    '8. Paid',    '9. Clean',  '10. Ready',      '11. Confirm'
  ];

  const STAGE_BG = [
    '#e0e0e0', '#b0e0ff', '#8ac6ff', '#7cd790',
    '#b8ffb8', '#ffb970', '#ffd8a0',
    '#ffe680', '#e8c8ff', '#c0fff0', '#a8ffac'
  ];

  /* ── 한계시간(ms) ─────────────────────────── */
  const LIMIT = [
    2, 2, 2, 3,     // 1~4단계
    15,             // 5. Served
    5,              // 6. Satisfied
    20,             // 7. Dessert/Bill
    2,              // 8. Paid
    10,             // 9. Clean
    2, 2            // 10~11단계
  ].map(m => m * 60_000);

  /* ── 우선순위(작을수록 위) ────────────────────
       4번(Order)       → 0
       8번(Paid)        → 1
       6번(Satisfied)   → 2
       5번(Served)      → 3
       기타             → 4
  */
  const STAGE_PRIORITY = { 3:0, 7:1, 5:2, 4:3 };
  const getPriority = idx => STAGE_PRIORITY[idx] ?? 4;

  /* ── 설정 ──────────────────────────────── */
  const FREEZE_MS = 5_000;
  let   freezeUntil = 0;

  const COL_FROM=[0,0,0], COL_TO=[255,0,0];

  /* ── 유틸 ───────────────────────── */
  const $ = s => document.querySelector(s);
  const fmt = ms => {
    const s = Math.floor(ms/1e3)%60,
          m = Math.floor(ms/6e4)%60,
          h = Math.floor(ms/3.6e6);
    return `${h.toString().padStart(2,'0')}:${m.toString().padStart(2,'0')}:${s.toString().padStart(2,'0')}`;
  };
  const lerp=(a,b,t)=>a+(b-a)*t;
  const lerpCol=t=>{
    const [r,g,b]=[0,1,2].map(i=>Math.round(lerp(COL_FROM[i],COL_TO[i],t)));
    return `rgb(${r},${g},${b})`;
  };
  const touch = () => { freezeUntil = Date.now() + FREEZE_MS; };

  /* ── 점유 상태 ───────────────────── */
  const occupied=new Map();

  /* ── 행 생성 ────────────────────── */
  function addRow(id,td){
    if(occupied.has(id))return;
    td.classList.add('occupied');

    const row=document.createElement('div');
    row.className='row';

    const now=Date.now();
    const meta={tableId:id,totalStart:now,stageStart:now,stage:0};
    row.dataset.meta=JSON.stringify(meta);

    row.innerHTML=`
      <span class="table-id">${id}</span>
      <span class="table-timer">00:00:00</span>
      <button class="action-btn" title="Back">&#9664;</button>
      <span class="service-box">${STAGES[0]}</span>
      <span class="service-timer">00:00:00</span>
      <button class="check-btn" title="Done">&#10003;</button>
    `;

    row.querySelector('.action-btn').addEventListener('click',()=>changeStage(row,-1));
    row.querySelector('.service-box').addEventListener('click',()=>changeStage(row,1,true));
    row.querySelector('.check-btn').addEventListener('click',()=>{if(prompt('PIN?')==='0')removeRow(row);});

    $('#rightPanel').prepend(row);
    occupied.set(id,{row,td});
    setBoxBg(row);
    touch();
  }

  /* ── 행 삭제 ─────────────────────── */
  function removeRow(row){
    const meta=JSON.parse(row.dataset.meta);
    const rec=occupied.get(meta.tableId);
    if(rec){rec.td.classList.remove('occupied');occupied.delete(meta.tableId);}
    row.remove();
    touch();
  }

  /* ── 단계 변경 ──────────────────── */
  function changeStage(row,dir,fromBox=false){
    const data=JSON.parse(row.dataset.meta);

    if(dir>0 && data.stage===STAGES.length-1){
      if(fromBox)removeRow(row);
      return;
    }

    data.stage=Math.max(0,Math.min(data.stage+dir,STAGES.length-1));
    data.stageStart=Date.now();
    row.dataset.meta=JSON.stringify(data);

    row.querySelector('.table-id').classList.remove('blink');
    row.querySelector('.service-box').textContent=STAGES[data.stage];
    row.querySelector('.service-timer').textContent='00:00:00';
    setBoxBg(row);
    touch();
  }

  const setBoxBg=row=>{
    const {stage}=JSON.parse(row.dataset.meta);
    row.querySelector('.service-box').style.background=STAGE_BG[stage];
  };

  /* ── 메인 루프 ───────────────────── */
  setInterval(()=>{
    const panel=$('#rightPanel');
    const rows=[...panel.querySelectorAll('.row')];
    const now=Date.now();
    const frozen=now<freezeUntil;

    rows.forEach(row=>{
      const data=JSON.parse(row.dataset.meta);

      row.querySelector('.table-timer').textContent=fmt(now-data.totalStart);

      const stageMs=now-data.stageStart;
      const ratio=Math.min(stageMs/LIMIT[data.stage],1);

      const timerEl=row.querySelector('.service-timer');
      timerEl.textContent=fmt(stageMs);
      timerEl.style.color=lerpCol(ratio);
      timerEl.style.fontWeight=400+Math.round(300*ratio);
      timerEl.style.fontSize=`${0.9+0.9*ratio}rem`;

      const idEl=row.querySelector('.table-id');
      if(!frozen && ratio>=1) idEl.classList.add('blink'); else idEl.classList.remove('blink');

      row.dataset.priority=getPriority(data.stage);
      row.dataset.ratio=ratio;
    });

    if(!frozen){
      rows.sort((a,b)=>{
        const pa=+a.dataset.priority,pb=+b.dataset.priority;
        if(pa!==pb)return pa-pb;
        const ra=+a.dataset.ratio,rb=+b.dataset.ratio;
        if(ra!==rb)return rb-ra;
        return 0;
      });
      rows.forEach(r=>panel.appendChild(r));
    }

  },1000);

  /* ── 왼쪽 셀 클릭 ────────────────── */
  document.querySelectorAll('#tableBody td').forEach(td=>{
    const id=td.textContent.trim();
    if(id)td.addEventListener('click',()=>addRow(id,td));
  });

});
