export const DATA_OUTPUTS = {
  baseTemperatures: {
    name: 'Temperature',
    legend: {
      'red': 'Surface',
      'blue': 'Ocean'
    },
    lines: 2,
    axisLabel: 'Temperature change (°C)',
    summary: 'Changes in surface temperature and deep ocean temperature relative to first year of the simulation.'
  },
  co2Concentration: {
    name: 'CO<sub>2</sub> Concentration',
    legend: {},
    lines: 1,
    axisLabel: 'Atmospheric CO<sub>2</sub> (ppm)',
    summary: 'Atmospheric concentration of CO<sub>2</sub> - increases due to human emissions (primarily from the burning of fossil fuels), decreases by the absorption of CO<sub>2</sub> by plants and the ocean.'
  },
  ch4Concentration: {
    name: 'CH<sub>4</sub> Concentration',
    legend: {},
    lines: 1,
    axisLabel: 'Atmospheric methane (ppb)',
    summary: 'concentration of methane - increases are mainly due to waste and agricultural practices, decreases by decay of methane in the atmosphere.'
  },
  gg: {
    name: 'CO<sub>2</sub>/CH<sub>4</sub> radiative forcing',
    legend: {
      'red': 'CO<sub>2</sub>',
      'blue': 'CH<sub>4</sub>'
    },
    lines: 2,
    axisLabel: 'CO<sub>2</sub>/CH<sub>4</sub> radiative forcing (W/m²)',
    summary: 'Change in the energy entering the climate system due to greenhouse gases.'
  },
  aerosols: {
    name: 'Aerosol radiative forcing',
    legend: {
      'red': 'SO<sub>2</sub>',
      'blue': 'Volcanic emissions'
    },
    lines: 2,
    axisLabel: 'Aerosol radiative forcing (W/m²)',
    summary: 'Change in the energy entering the climate system due to increased reflection by human and volcanic aerosols.'
  },
  atUpLo: {
    name: 'Ocean carbon inventories',
    legend: {
      'red': 'Atmosphere',
      'blue': 'Upper Ocean',
      'green': 'Deep Ocean'
    },
    lines: 3,
    axisLabel: 'Carbon inventories (GtC)',
    summary: 'Amount of carbon (billions of tons) stored in the atmosphere (in the form of CO<sub>2</sub>), the surface ocean and the deep ocean.'
  },
  vegSoilNPP: {
    name: 'Land carbon inventories',
    legend: {
      'red': 'Vegetation Carbon',
      'blue': 'Soil Carbon',
      'green': 'Net Primary Productions'
    },
    lines: 2,
    axisLabel: 'Carbon inventories (GtC)',
    summary: 'Amount of carbon (billions of tons) taken up by photosynthesis, stored in vegetation and stored in soil.'
  },
  ph: {
    name: 'pH',
    legend: {},
    lines: 1,
    axisLabel: '',
    summary: 'Acidity of ocean - ocean becomes more acidic (i.e. lower pH) as the ocean absorbs additional CO<sub>2</sub> from the atmosphere.'
  },
  seaLevel: {
    name: 'Sea Level Change',
    legend: {},
    lines: 1,
    axisLabel: 'Sea level change (m)',
    summary: 'Changes in sea level due to thermal expansion of ocean water and melting of land ice, relative to first year of the simulation.'
  }
};
