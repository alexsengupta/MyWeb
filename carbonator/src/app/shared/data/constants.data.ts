export const DATA_CONSTANTS = {

  // -- ENERGY BALANCE

  DT: {
    // needs to be small otherwise ocean chanistry calculations become unstable
    value: 1 / 12,
    label: 'DT',
    symbol: 'DT',
    description: 'Model time steps',
    units: 'Years'
  },
  L: {
    // 1.13 from GEOFFROY, but 1 matches more closely to CMIP5 multi-model mean
    value: 1,
    label: 'L',
    symbol: 'λ',
    description: 'Radiative feedback parameter (see O\'Geoffery et al, 2013)',
    units: ''
  },
  g: {
    // heat exchange parameter W/m2/K
    value: 0.73,
    label: 'g',
    symbol: 'γ',
    description: 'Heat exchange coefficient (see o\'Geoffery et al, 2013)',
    units: 'W/m<sup>2</sup>/K'
  },
  Cs: {
    // *60*60*24*365, //W yr/m2/K (Geoffroy uses 7.3 - 9 gives a better volcanic response
    value: 9,
    label: 'Cs',
    symbol: 'C',
    description: 'Surface heat capacity (see o\'Geoffery et al, 2013)',
    units: 'W yr/m<sup>2</sup>/K'
  },
  Co: {
    // *60*60*24*365, //W yr/m2/K
    value: 106,
    label: 'Co',
    symbol: 'Co',
    description: 'Deep ocean heat capacity (see O\'Geoffery et al, 2013)',
    units: 'W yr/m<sup>2</sup>/K'
  },
  // epsilon: {
  //   // Internal variavility magnitude
  //   value: 0.6,
  //   label: 'eps',
  //   symbol: 'ε',
  //   description: 'Strength of random internal climate variability',
  //   units: ''
  // },
  alb0: {
    // initial albedo
    value: 0.31,
    label: 'alb0',
    symbol: 'alb0',
    description: 'Albedo (reflectivity of the Earth)',
    units: ''
  },

  // --- VOLCANICS & HUMAN AEROSOL

  VF: {
    // conversion from optical thickness of volcanic aerosols to RF
    value: -20,
    label: 'VF',
    symbol: 'C<sub>volc</sub>',
    description: 'Optical thickness to radiative forcing conversion parameter',
    units: ''
  },
  vtau: {
    // yr Volcanic aerosol decay timescale
    value: 1.2,
    label: 'vtau',
    symbol: 'T<sub>volc</sub>',
    description: 'Decay timescale of volcanic aerosols in upper atmosphere',
    units: 'yr-1'
  },
  AF: {
    // conversion from SO2 emissions to RF W/m2/TgSO2/yr
    value: -0.0052,
    label: 'AF',
    symbol: 'C<sub>so2</sub>',
    description: 'Conversion from SO<sub>2</sub> emissions to radiative forcing',
    units: 'W/m<sup>2</sup>/Tg<sub>SO2</sub>/yr'
  },

  // --- OCEAN CARBON MODEL

  ka: {
    // Glotter paper suggests 1/5
    value: 1 / 5,
    label: 'ka',
    symbol: 'ka',
    description: 'Inverse exchange timescale between atmosphere and upper ocean',
    units: ''
  },
  kd: {
    // Glotter paper suggests 1/20
    value: 1 / 20,
    label: 'kd',
    symbol: 'kd',
    description: 'Inverse exchange timescale between upper and deep ocean',
    units: ''
  },
  d: {
    // ratio of upper to deep ocean volume
    value: 50,
    label: 'd',
    symbol: 'd',
    description: 'Ratio of deep to surface ocean volume',
    units: ''
  },
  // AB: {
  //   // ??????????????
  //   label: 'AB',
  //   symbol: 'A.B',
  //   description: 'Equilibrium ratio of atmosphere to upper and deep ocean',
  //   units: ''
  // },
  kh: {
    // at 15oC, ratio of the molar concentrations of CO2 in atmosphere and ocean (Henry's Law)
    value: 1.0548e+03,
    label: 'kh',
    symbol: 'kh',
    description: 'Ratio of the molar concentrations of CO<sub>2</sub> in atmosphere and ocean',
    units: ''
  },
  k1: {
    // at 15oC, dissociation constant
    value: 8.7184e-07,
    label: 'k1',
    symbol: 'k1',
    description: 'Dissociation constant',
    units: ''
  },
  k2: {
    // at 15oC, dissociation constant
    value: 5.4426e-10,
    label: 'k2',
    symbol: 'k2',
    description: 'Dissociation constant',
    units: ''
  },
  Alk: {
    // Alkalinity, assumed constant here but buffered on long timescales O[10ka] from the dissolution of CaCO3
    value: 767,
    label: 'Alk',
    symbol: 'Alk',
    description: 'Alkalinity (assumed constant)',
    units: ''
  },
  OM: {
    // moles of water in ocean
    value: 7.8e22,
    label: 'OM',
    symbol: 'OM',
    description: 'Moles of water in ocean',
    units: ''
  },
  AM: {
    // moles of air in atmosphere
    value: 1.77e20,
    label: 'AM',
    symbol: 'AM',
    description: 'Moles of air in atmosphere',
    units: ''
  },
  A: {
    // Slightly different to above in order to have equilibrium at 1850
    value: 132.216074,
    label: 'A',
    symbol: 'A',
    description: 'Ratio of atmospheric to upper ocean CO<sub>2</sub> mass',
    units: ''
  },
  Ksp: {
    // constant for Aragonite calculation
    // 6.4565e-7 (aragonite dissolution constant at 25degC)
    value: Math.pow(10, -6.19),
    label: 'Ksp',
    symbol: 'Ksp',
    description: 'Aragonite dissolution constant at 25°C',
    units: ''
  },

  // --- TERRESTRIAL CARBON MODEL

  m: {
    // /yr  1/residence time of carbon in v	// switches for forcing
    value: 8.7e-2,
    label: 'm',
    symbol: 'm',
    description: 'Inverse residence time of carbon in vegetation',
    units: 'yr-1'
  },
  a2: {
    // /GtC //strength of CO2 fertilisation
    value: 4.7e-4,
    label: 'a2',
    symbol: 'a2',
    description: 'Strength of CO<sub>2</sub> fertilisation',
    units: 'GtC-1'
  },
  dr0: {
    //0.025,  percentage/yr decomposition rate of soil
    value: 0.024625,
    label: 'dr0',
    symbol: 'dr0',
    description: 'Decomposition rate of soil',
    units: 'yr-1'
  },
  e: {
    // proportion of vegetation that forms soil (remainder goes to atmosphere)
    value: 0.5,
    label: 'e',
    symbol: 'e',
    description: 'Proportion of vegetation that forms soil (remainder goes to atmosphere)',
    units: ''
  },

  // --- METHANE

  tau_ch4_pi: {
    // pre industrial methane decay
    value: 8,
    label: 'tau_ch4_pi',
    symbol: 'T<sub>CH4</sub>',
    description: 'Preindustrial methane decay timescale',
    units: 'yr-1'
  },
  alpha_ch4: {
    value: -0.12,
    label: 'alpha_ch4',
    symbol: 'α<sub>CH4</sub>',
    description: 'Methane decay timescale concentration dependence factor',
    units: ''
  },

  // --- INTERNAL VARIABILITY

  iv_autocorr: {
    // 1 month autocorrelation of observed global surface (land + ocean) temperature
    value: 0.5,
    label: 'iv_autocorr',
    symbol: 'iv_autocorr',
    description: '1 month autocorrelation of observed surface temperature',
    units: ''
  },
  iv_var: {
    // variance of observed global surface (land + ocean) temperature
    value: 0.012,
    label: 'iv_var',
    symbol: 'iv_var',
    description: 'Variance of observed surface temperature',
    units: ''
  },
  iv_alpha: {
    value: null,
    label: 'iv_alpha',
    symbol: 'iv_alpha',
    description: 'Autoregressive model parameter',
    units: ''
  },
  iv_beta: {
    value: null,
    label: 'iv_beta',
    symbol: 'iv_beta',
    description: 'Autoregressive model parameter',
    units: ''
  },
  eps: {
    value: 0.6,
    label: 'eps',
    symbol: 'eps',
    description: 'Variability parameter',
    units: ''
  },

  // --- SEA LEVEL MODEL
  // Constants for semi-empirical sea level model
  // NB these values are different to those given by Rahmstorf et al 2011. Given that initial time is considered to be equilbrium conditions
  // si_To is set to 0 (in Rahmstorf the only way they can fit to observations is to have SLR already in progress at 1850)
  // Parameter values dives SLR of ~20cm (as observed) to 2000 and a 20th
  // century SLR of ~100cm under RCP85. Also gives ~6m SLR at 2500 under RCP85

  si_a: {
    value: 1,
    label: 'si_a',
    symbol: 'si_a',
    description: 'Sea level model parameter',
    units: 'mm/yr/oC'
  },
  si_b: {
    value: 200,
    label: 'si_b',
    symbol: 'si_b',
    description: 'Sea level model parameter',
    units: ''
  },
  si_To: {
    value: 0,
    label: 'si_To',
    symbol: 'si_To',
    description: 'Sea level model parameter',
    units: 'oC'
  },


  nobulbs: {
    // 100*50/60, // no of bulbs/(W/m2)
    value: 1,
    label: 'nobulbs',
    symbol: 'nobulbs',
    description: 'Radiative forcing to bulb conversion',
    units: 'W/m<sup>2</sup>'
  }
};

// self-referencing assignments can't be done inside the curly braces above
// autoregressive model parameter (autocorrelation for one model timestep)
DATA_CONSTANTS.iv_alpha.value = Math.pow(DATA_CONSTANTS.iv_autocorr.value, 12 * DATA_CONSTANTS.DT.value);
// autoregressive model parameter
DATA_CONSTANTS.iv_beta.value = Math.sqrt(DATA_CONSTANTS.iv_var.value) * Math.sqrt(1 - Math.pow(DATA_CONSTANTS.iv_alpha.value, 2));
