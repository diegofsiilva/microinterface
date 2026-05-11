
    // =========================
    // Variáveis do modelo
    // =========================

    let vars = {
      nk: 10,
      pi_k: 0.8,
      u_bar: 100,
      t: 12,
      PD_k: 0.05,
      LGD: 0.4,
      L_k: 2
    };

    // Configuração dos sliders
    let config = {
      nk:    { min: 0, max: 100, step: 1 },
      pi_k:  { min: 0, max: 1, step: 0.01 },
      u_bar: { min: 0, max: 500, step: 1 },
      t:     { min: 0, max: 60, step: 1 },
      PD_k:  { min: 0, max: 1, step: 0.01 },
      LGD:   { min: 0, max: 1, step: 0.01 },
      L_k:   { min: 0, max: 20, step: 1 }
    };

    let sliders = {};

    // =========================
    // p5.js
    // =========================

    function setup() {

      createCanvas(windowWidth, windowHeight);

      // Criação dos sliders
      createDynamicSliders();

      updateTable();
    }

    function draw() {

      background(245);

      // Atualiza valores
      for (let key in sliders) {
        vars[key] = parseFloat(sliders[key].value());
      }

      // =========================
      // Cálculo do modelo
      // =========================

      let ck =
        vars.pi_k *
        ((vars.u_bar * vars.t) - (vars.PD_k * vars.LGD));

      let resultado =
        vars.nk *
        ck *
        vars.L_k;

      // =========================
      // Interface visual
      // =========================

      fill(30);
      textSize(28);

      text("Visualização da Função Objetivo", 380, 60);

      textSize(22);

      text(
        "Resultado: " + resultado.toFixed(2),
        380,
        110
      );

      // =========================
      // Gráfico simples
      // =========================

      drawBar(resultado);

      // Atualiza tabela HTML
      updateTable(resultado);
    }

    // =========================
    // Criação dinâmica sliders
    // =========================

    function createDynamicSliders() {

      let container = document.getElementById("sliders");

      for (let key in vars) {

        let div = document.createElement("div");
        div.className = "slider-container";

        let label = document.createElement("label");
        label.innerHTML = key;

        let slider = document.createElement("input");

        slider.type = "range";

        slider.min = config[key].min;
        slider.max = config[key].max;
        slider.step = config[key].step;
        slider.value = vars[key];

        sliders[key] = slider;

        div.appendChild(label);
        div.appendChild(slider);

        container.appendChild(div);
      }
    }

    // =========================
    // Atualização tabela
    // =========================

    function updateTable(resultado = 0) {

      let body = document.getElementById("tableBody");

      body.innerHTML = "";

      for (let key in vars) {

        let row = `
          <tr>
            <td>${key}</td>
            <td>${Number(vars[key]).toFixed(2)}</td>
          </tr>
        `;

        body.innerHTML += row;
      }

      document.getElementById("resultado").innerHTML =
        "Função Objetivo = " + resultado.toFixed(2);
    }

    // =========================
    // Barra visual
    // =========================

    function drawBar(value) {

      let maxBar = 600;

      let normalized = constrain(value / 1000, 0, 1);

      let widthBar = normalized * maxBar;

      fill(220);

      rect(380, 180, maxBar, 50, 10);

      fill(30, 136, 229);

      rect(380, 180, widthBar, 50, 10);

      fill(0);

      textSize(18);

      text(
        value.toFixed(2),
        390,
        212
      );
    }

    // =========================
    // Responsividade
    // =========================

    function windowResized() {
      resizeCanvas(windowWidth, windowHeight);
    }
