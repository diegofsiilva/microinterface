const K = 4;

const state = {
  selectedVar: 't',
  selectedK: 0,
  vars: {
    n:   [120, 85, 200, 60],
    pi:  [0.92, 0.78, 0.95, 0.65],
    u:   [0.12, 0.12, 0.12, 0.12],
    t:   [1.0,  1.0,  1.0,  1.0],
    PD:  [0.03, 0.07, 0.02, 0.12],
    LGD: [0.45, 0.45, 0.45, 0.45],
    L:   [50000, 30000, 80000, 20000],
  }
};

const varMeta = {
  t:   { label: 't',   desc: 'prazo (anos)',        min: 0.25, max: 5.0,    step: 0.25,  global: true,  fmt: v => v.toFixed(2)+'a' },
  u:   { label: 'ū',   desc: 'taxa média de juros', min: 0.01, max: 0.40,   step: 0.005, global: true,  fmt: v => (v*100).toFixed(1)+'%' },
  LGD: { label: 'LGD', desc: 'perda dado default',  min: 0.01, max: 1.0,    step: 0.01,  global: true,  fmt: v => (v*100).toFixed(0)+'%' },
  L:   { label: 'L_k', desc: 'valor do empréstimo', min: 1000, max: 500000, step: 1000,  global: false, fmt: v => 'R$'+Math.round(v/1000)+'k' },
};

function ck(k) {
  return state.vars.pi[k] * (state.vars.u[0] * state.vars.t[0] - state.vars.PD[k] * state.vars.LGD[0]);
}
function contrib(k) { return state.vars.n[k] * ck(k) * state.vars.L[k]; }
function objective() {
  let s = 0;
  for (let k = 0; k < K; k++) s += contrib(k);
  return s;
}
function getVal(varName, k) {
  return varMeta[varName].global ? state.vars[varName][0] : state.vars[varName][k];
}
function setVal(varName, k, v) {
  if (varMeta[varName].global) {
    for (let i = 0; i < K; i++) state.vars[varName][i] = v;
  } else {
    state.vars[varName][k] = v;
  }
}

function fmtBRL(v) { return 'R$ ' + Math.round(v).toLocaleString('pt-BR'); }

function updateTable() {
  const tbody = document.getElementById('table-body');
  tbody.innerHTML = '';
  const vn   = state.selectedVar;
  const selK = state.selectedK;
  const meta = varMeta[vn];

  for (let k = 0; k < K; k++) {
    const isActive = (k === selK && vn === 'L') || meta.global;
    const c   = ck(k);
    const con = contrib(k);
    const tr  = document.createElement('tr');
    if (isActive) tr.className = 'active-row';

    function cell(content, highlight) {
      return `<td${highlight ? ' class="val-hl"' : ''}>${content}</td>`;
    }

    const cStr   = c   >= 0 ? c.toFixed(4) : `<span class="val-neg">${c.toFixed(4)}</span>`;
    const conStr = con >= 0 ? fmtBRL(con)  : `<span class="val-neg">${fmtBRL(con)}</span>`;

    tr.innerHTML =
      `<td><span class="badge">k=${k+1}</span></td>` +
      cell(state.vars.t[0].toFixed(2)+'a',        isActive && vn==='t') +
      cell((state.vars.u[0]*100).toFixed(1)+'%',   isActive && vn==='u') +
      cell((state.vars.LGD[0]*100).toFixed(0)+'%', isActive && vn==='LGD') +
      cell(varMeta.L.fmt(state.vars.L[k]),          isActive && vn==='L') +
      `<td>${cStr}</td>` +
      `<td>${conStr}</td>`;

    tbody.appendChild(tr);
  }

  const obj = objective();
  const objCell = document.getElementById('obj-val');
  objCell.className = 'obj-val ' + (obj >= 0 ? 'obj-pos' : 'obj-neg');
  objCell.textContent = fmtBRL(obj);
}

let p5inst;

function buildSketch() {
  if (p5inst) p5inst.remove();
  const container = document.getElementById('p5-container');
  const W = container.offsetWidth || 700;
  const H = 230;

  p5inst = new p5(function(p) {
    let dragging = false;
    const PAD  = 48;
    const SY   = H / 2 + 10;
    const TL   = PAD + 8;
    const TR   = W - PAD - 8;
    const TLen = TR - TL;

    function valToX(v) {
      const meta = varMeta[state.selectedVar];
      return TL + ((v - meta.min) / (meta.max - meta.min)) * TLen;
    }
    function xToVal(x) {
      const meta = varMeta[state.selectedVar];
      const t = Math.max(0, Math.min(1, (x - TL) / TLen));
      const v = meta.min + t * (meta.max - meta.min);
      const steps = Math.round((v - meta.min) / meta.step);
      return +(meta.min + steps * meta.step).toFixed(8);
    }
    function isDark() { return window.matchMedia('(prefers-color-scheme: dark)').matches; }

    p.setup = function() {
      p.createCanvas(W, H).parent(container);
      p.noLoop();
      p.redraw();
    };

    p.draw = function() {
      p.clear();
      const dark = isDark();
      const C = {
        bg:      dark ? '#1e1e1c' : '#ffffff',
        track:   dark ? '#f0f0f0' : '#D3D1C7',
        fill:    '#534AB7',
        thumbIn: dark ? '#1e1e1c' : '#ffffff',
        text:    dark ? '#f1efe8' : '#1a1a18',
        text2:   dark ? '#ffffff' : '#dadada',
        green:   dark ? '#ffffff' : '#ffffff',
        red:     dark ? '#F09595' : '#A32D2D',
      };

      p.background(C.bg);

      const vn   = state.selectedVar;
      const k    = state.selectedK;
      const meta = varMeta[vn];
      const cur  = getVal(vn, k);
      const sx   = valToX(cur);

      const titleStr = `${meta.label}  —  ${meta.desc}` +
        (meta.global ? '   (global: afeta todos os k)' : `   (k = ${k+1})`);
      p.noStroke();
      p.fill(C.text2);
      p.textSize(12);
      p.textAlign(p.LEFT, p.TOP);
      p.text(titleStr, PAD, 16);

      p.strokeWeight(5);
      p.stroke(C.track);
      p.line(TL, SY, TR, SY);
      p.strokeWeight(5);
      p.stroke(C.fill);
      p.line(TL, SY, sx, SY);

      const nTicks = 6;
      for (let i = 0; i <= nTicks; i++) {
        const tt = i / nTicks;
        const tx = TL + tt * TLen;
        const tv = meta.min + tt * (meta.max - meta.min);
        p.stroke(C.text2);
        p.strokeWeight(1);
        p.line(tx, SY + 9, tx, SY + 15);
        p.noStroke();
        p.fill(C.text2);
        p.textFont('monospace');
        p.textSize(10);
        p.textAlign(p.CENTER, p.TOP);
        p.text(meta.fmt(tv), tx, SY + 17);
      }

      p.noStroke();
      p.fill(C.fill);
      p.circle(sx, SY, 26);
      p.fill(C.thumbIn);
      p.circle(sx, SY, 10);

      p.fill(C.text);
      p.textFont('monospace');
      p.textSize(32);
      p.textAlign(p.CENTER, p.CENTER);
      p.text(meta.fmt(cur), W / 2, SY - 58);

      const obj = objective();
      p.fill(obj >= 0 ? C.green : C.red);
      p.textFont('monospace');
      p.textSize(13);
      p.textAlign(p.RIGHT, p.BOTTOM);
      p.text('Objetivo: ' + fmtBRL(obj), W - PAD, H - 10);
    };

    function sliderX() { return valToX(getVal(state.selectedVar, state.selectedK)); }

    p.mousePressed  = function() { if (Math.abs(p.mouseX - sliderX()) < 20 && Math.abs(p.mouseY - SY) < 20) dragging = true; };
    p.mouseDragged  = function() { if (!dragging) return; setVal(state.selectedVar, state.selectedK, xToVal(p.mouseX)); p.redraw(); updateTable(); };
    p.mouseReleased = function() { dragging = false; };
    p.touchStarted  = function() { p.mousePressed();  return false; };
    p.touchMoved    = function() { p.mouseDragged();   return false; };
    p.touchEnded    = function() { p.mouseReleased();  return false; };
  });
}

document.getElementById('var-select').addEventListener('change', function() {
  state.selectedVar = this.value;
  buildSketch();
  updateTable();
});

window.addEventListener('resize', buildSketch);

buildSketch();
updateTable();