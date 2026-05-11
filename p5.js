
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

  