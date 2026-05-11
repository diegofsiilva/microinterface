const K = 4;

const state = {
  selectedVar: 't',
  selectedK: 0,
  vars: {
    n:   [120, 85, 200, 60],
    pi:  [0.92, 0.78, 0.95, 0.65],
    u:   [0.12, 0.12, 0.12, 0.12],
    t:   [1.0, 1.0, 1.0, 1.0],
    PD:  [0.03, 0.07, 0.02, 0.12],
    LGD: [0.45, 0.45, 0.45, 0.45],
    L:   [50000, 30000, 80000, 20000],
  }
};

const varMeta = {
  t: {
    label:'t',
    desc:'prazo',
    min:0.25,
    max:5,
    step:0.25,
    global:true,
    fmt:v=>v.toFixed(2)
  },

  u: {
    label:'ū',
    desc:'juros',
    min:0.01,
    max:0.40,
    step:0.005,
    global:true,
    fmt:v=>(v*100).toFixed(1)+'%'
  },

  LGD: {
    label:'LGD',
    desc:'perda',
    min:0.01,
    max:1,
    step:0.01,
    global:true,
    fmt:v=>(v*100).toFixed(0)+'%'
  },

  L: {
    label:'L_k',
    desc:'empréstimo',
    min:1000,
    max:500000,
    step:1000,
    global:false,
    fmt:v=>'R$'+Math.round(v/1000)+'k'
  }
};

function ck(k){
  const u = state.vars.u[0];
  const t = state.vars.t[0];
  const PD = state.vars.PD[k];
  const LGD = state.vars.LGD[0];

  return state.vars.pi[k] * (u * t - PD * LGD);
}

function contrib(k){
  return state.vars.n[k] * ck(k) * state.vars.L[k];
}

function objective(){
  let s = 0;

  for(let k=0;k<K;k++){
    s += contrib(k);
  }

  return s;
}

function getVal(name,k){
  return varMeta[name].global
    ? state.vars[name][0]
    : state.vars[name][k];
}

function setVal(name,k,v){

  if(varMeta[name].global){

    for(let i=0;i<K;i++){
      state.vars[name][i] = v;
    }

  }else{
    state.vars[name][k] = v;
  }
}

function fmtBRL(v){
  return 'R$ ' + Math.round(v).toLocaleString('pt-BR');
}

function updateTable(){

  const tbody = document.getElementById('table-body');

  tbody.innerHTML = '';

  const vn = state.selectedVar;
  const selK = state.selectedK;
  const meta = varMeta[vn];

  for(let k=0;k<K;k++){

    const active =
      (k === selK && vn === 'L') || meta.global;

    const c = ck(k);
    const con = contrib(k);

    const tr = document.createElement('tr');

    if(active){
      tr.className = 'active-row';
    }

    const cStr =
      c >= 0
      ? c.toFixed(4)
      : `<span class="val-neg">${c.toFixed(4)}</span>`;

    const conStr =
      con >= 0
      ? fmtBRL(con)
      : `<span class="val-neg">${fmtBRL(con)}</span>`;

    tr.innerHTML =
      `<td>k=${k+1}</td>` +
      `<td>${state.vars.t[0].toFixed(2)}</td>` +
      `<td>${(state.vars.u[0]*100).toFixed(1)}%</td>` +
      `<td>${(state.vars.LGD[0]*100).toFixed(0)}%</td>` +
      `<td>${varMeta.L.fmt(state.vars.L[k])}</td>` +
      `<td>${cStr}</td>` +
      `<td>${conStr}</td>`;

    tbody.appendChild(tr);
  }

  const obj = objective();

  const objCell = document.getElementById('obj-val');

  objCell.textContent = fmtBRL(obj);
}

let p5inst;

function buildSketch(){

  if(p5inst){
    p5inst.remove();
  }

  const container = document.getElementById('p5-container');

  const W = container.offsetWidth ;
  const H = 230;

  p5inst = new p5(function(p){

    let dragging = false;

    const PAD = 48;
    const SY = H/2 + 10;

    const TL = PAD + 8;
    const TR = W - PAD - 8;

    const TLen = TR - TL;

    function valToX(v){

      const meta = varMeta[state.selectedVar];

      return TL + ((v - meta.min) / (meta.max - meta.min)) * TLen;
    }

    function xToVal(x){

      const meta = varMeta[state.selectedVar];

      let t =
        Math.max(0, Math.min(1, (x - TL) / TLen));

      let v =
        meta.min + t * (meta.max - meta.min);

      const steps =
        Math.round((v - meta.min) / meta.step);

      return +(meta.min + steps * meta.step).toFixed(8);
    }

    p.setup = function(){

      p.createCanvas(W,H).parent(container);

      p.noLoop();

      p.redraw();
    };

    p.draw = function(){

      p.clear();

      p.background(255);

      const vn = state.selectedVar;
      const k = state.selectedK;

      const meta = varMeta[vn];

      const cur = getVal(vn,k);

      const sx = valToX(cur);

      p.noStroke();

      p.fill(0);

      p.textFont('monospace');

      p.textSize(12);

      p.text(
        `${meta.label} — ${meta.desc}`,
        PAD,
        16
      );

      p.stroke(0);

      p.strokeWeight(4);

      p.line(TL,SY,TR,SY);

      p.line(TL,SY,sx,SY);

      const nTicks = 6;

      for(let i=0;i<=nTicks;i++){

        const tt = i / nTicks;

        const tx = TL + tt * TLen;

        const tv =
          meta.min + tt * (meta.max - meta.min);

        p.strokeWeight(1);

        p.line(tx,SY+9,tx,SY+15);

        p.noStroke();

        p.textSize(10);

        p.textAlign(p.CENTER,p.TOP);

        p.text(meta.fmt(tv),tx,SY+17);
      }

      p.fill(0);

      p.circle(sx,SY,26);

      p.fill(255);

      p.circle(sx,SY,10);

      p.fill(0);

      p.textSize(32);

      p.textAlign(p.CENTER,p.CENTER);

      p.text(
        meta.fmt(cur),
        W/2,
        SY-58
      );

      p.textSize(13);

      p.textAlign(p.RIGHT,p.BOTTOM);

      p.text(
        'Objetivo: ' + fmtBRL(objective()),
        W-PAD,
        H-10
      );
    };

    function sliderX(){
      return valToX(
        getVal(
          state.selectedVar,
          state.selectedK
        )
      );
    }

    p.mousePressed = function(){

      const sx = sliderX();

      if(
        Math.abs(p.mouseX - sx) < 20 &&
        Math.abs(p.mouseY - SY) < 20
      ){
        dragging = true;
      }
    };

    p.mouseDragged = function(){

      if(!dragging){
        return;
      }

      setVal(
        state.selectedVar,
        state.selectedK,
        xToVal(p.mouseX)
      );

      p.redraw();

      updateTable();
    };

    p.mouseReleased = function(){
      dragging = false;
    };
  });
}

document
  .getElementById('var-select')
  .addEventListener('change',function(){

    state.selectedVar = this.value;

    buildSketch();

    updateTable();
});

window.addEventListener('resize',function(){
  buildSketch();
});

buildSketch();

updateTable();