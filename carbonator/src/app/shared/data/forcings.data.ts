export const DATA_FORCINGS = {
  ch4: {
    name: 'CH<sub>4</sub> Emissions',
    summary: 'Human emissions of methane (millions of tons of methane per year)',
    description: '<p>Human emissions of methane (millions of tons of methane per year)</p>',
    axisLabel: 'Methane emissions (TgCH<sub>4</sub>/yr)',
    can: {
      updateEnabled: true,
      updateNodesCount: true,
      updateNodeValue: true
    },
    default: {
      isEnabled: true,
      value: 0
    }
  },
  co2: {
    name: 'CO<sub>2</sub> Emissions',
    summary: 'Human emissions of Carbon Dioxide (billions of tons of carbon per year)',
    description: '<p>Human emissions of Carbon Dioxide (billions of tons of carbon per year)</p>',
    axisLabel: 'CO<sub>2</sub> emissions (GtC/yr)',
    can: {
      updateEnabled: true,
      updateNodesCount: true,
      updateNodeValue: true
    },
    default: {
      isEnabled: true,
      value: 0
    }
  },
  so2: {
    name: 'SO<sub>2</sub> Emissions',
    summary: 'Human emissions of sulphates (millions of tons of sulphur dioxide per year) into the lower atmosphere.',
    description: '<p>Human emissions of sulphates (millions of tons of sulphur dioxide per year) into the lower atmosphere.</p>',
    axisLabel: 'Aerosol emissions (TgSO<sub>2</sub>/yr)',
    can: {
      updateEnabled: true,
      updateNodesCount: true,
      updateNodeValue: true
    },
    default: {
      isEnabled: true,
      value: 0
    }
  },
  volcanics: {
    name: 'Volcanic Emissions',
    summary: 'Emission of volcanic sulphates into the upper atmosphere.',
    description: '<p>Emission of volcanic sulphates into the upper atmosphere.</p>',
    axisLabel: 'Volcanic emissions',
    can: {
      updateEnabled: true,
      updateNodesCount: false,
      updateNodeValue: true
    },
    default: {
      isEnabled: true,
      value: 0
    }
  },
  tsi: {
    name: 'Insolation',
    summary: 'Energy from the sun at the top of the atmosphere (Watts per square meter).',
    description: '<p>Energy from the sun at the top of the atmosphere (Watts per square meter).</p>',
    axisLabel: 'Solar energy (W/m<sup>2</sup>)',
    can: {
      updateEnabled: true,
      updateNodesCount: true,
      updateNodeValue: true
    },
    default: {
      isEnabled: true,
      value: 1366
    }
  },
  albedo: {
    name: 'Albedo',
    summary: 'Reflectivity of earth (1 all insolation is reflected to space; 0 all insolation is absorbed at the surface).',
    description: '<p>Reflectivity of earth (1 all insolation is reflected to space; 0 all insolation is absorbed at the surface).</p>',
    axisLabel: 'Albedo',
    can: {
      updateEnabled: false,
      updateNodesCount: true,
      updateNodeValue: true
    },
    default: {
      isEnabled: true,
      value: 0.31
    }
  },
  internalVariability: {
    name: 'Internal Variability',
    summary: 'Includes random climate variability that exists in the system naturally (e.g. fluctuations like El Nino and La Nina).',
    description: '<p>Includes random climate variability that exists in the system naturally (e.g., fluctuations like El Nino and La Nina).</p>',
    default: {
      isEnabled: false
    }
  }
};
