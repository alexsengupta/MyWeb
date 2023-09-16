import { Injectable } from '@angular/core';
import { Simulation } from '../model/simulation.model';
import { ScenariosService } from './scenarios.service';
import { DATA_FORCINGS } from '../data/forcings.data';
import { Scenario } from '../model/scenario.model';
import { BehaviorSubject } from 'rxjs/index';
import { Papa } from 'ngx-papaparse';
import { FileSaverService } from 'ngx-filesaver';

@Injectable({
  providedIn: 'root'
})
export class SimulationsService {
  private simulations: Simulation[];

  private _runningSimulation: BehaviorSubject<{}>;

  constructor(
    private scenariosService: ScenariosService,
    private papa: Papa,
    private fileSaverService: FileSaverService
  ) {
    this.simulations = [];
  }

  load(scenarioID: number) {

    let simulation = this.simulations.find(
      simulation => simulation.scenario.id === scenarioID
    );
    if (simulation === undefined) {
      simulation = this.create(scenarioID);
    }
    return simulation;
  }

  create(scenarioID: number) {
    const scenario = this.scenariosService.load(scenarioID);
    this.simulations.push(new Simulation(scenario));
    return this.load(scenarioID);
  }

  delete(scenarioID: number) {
    this.simulations = this.simulations.filter(
      simulation => simulation.scenario.id !== scenarioID
    );
  }

  deleteAll() {
    this.simulations = [];
  }

  updateRunningSimulation(value) {
    this._runningSimulation.next(value);
  }

  get runningSimulation() {
    return this._runningSimulation.asObservable();
  }

  exportToCSV(simulation: Simulation) {

    let output = [];

    const identifier = Math.floor(new Date().getTime() / 1000);

    let metaRow = [];
    metaRow.push('meta');
    metaRow.push('Custom ' + identifier);
    metaRow.push(identifier);
    metaRow.push('Custom scenario');

    output.push(metaRow);

    let rangeRow = [];
    rangeRow.push('range');
    rangeRow.push(simulation.scenario.range.type);
    rangeRow.push(simulation.scenario.range.start);
    rangeRow.push(simulation.scenario.range.end);

    output.push(rangeRow);

    if (typeof simulation.scenario.nodes !== 'undefined') {

      let nodesRow = [];
      nodesRow.push('nodes');
      simulation.scenario.nodes.forEach(function(value) {
        nodesRow.push(value);
      });

      output.push(nodesRow);
    }

    const forcingConfigs = simulation.forcingConfigs;

    for (let key in forcingConfigs) {

      let forcing = JSON.parse(JSON.stringify(forcingConfigs[key]));
      let forcingMetaRow = [];

      forcingMetaRow.push('forcing');
      forcingMetaRow.push(key);
      forcingMetaRow.push('meta');

      if (key === 'internalVariability') {

        let isEnabled = (forcing.isEnabled) ? 1 : 0;
        forcingMetaRow.push(isEnabled);

        output.push(forcingMetaRow);

      } else {

        let isEnabled = (forcing.isEnabled || typeof forcing.isEnabled === 'undefined') ? 1 : 0;
        forcingMetaRow.push(isEnabled);
        forcingMetaRow.push(forcing.nodesCount);

        output.push(forcingMetaRow);

        let forcingYearsRow = [];
        forcingYearsRow.push('forcing');
        forcingYearsRow.push(key);
        forcingYearsRow.push('years');

        let forcingValuesRow = [];
        forcingValuesRow.push('forcing');
        forcingValuesRow.push(key);
        forcingValuesRow.push('values');

        if (typeof forcing.data !== 'undefined' && forcing.data) {

          forcing.data.x.forEach(function (value) {
            forcingYearsRow.push(value);
          });

          forcing.data.y.forEach(function (value) {
            forcingValuesRow.push(value);
          });

        } else {

          if (typeof forcing.values === 'undefined' || forcing.isEnabled === false) {
            forcing.values = DATA_FORCINGS[key].default.value;
          }

          if (typeof forcing.values === 'number') {
            forcing.years = [simulation.scenario.range.start, simulation.scenario.range.end];
            forcing.values = [forcing.values, forcing.values];
          }

          forcing.years.forEach(function (value) {
            forcingYearsRow.push(value);
          });

          forcing.values.forEach(function (value) {
            forcingValuesRow.push(value);
          })
        }

        output.push(forcingYearsRow);
        output.push(forcingValuesRow);
      }
    }

    const constants = simulation.constants;
    for (let constantKey in constants) {

      let constantRow = [];
      constantRow.push('constant');
      constantRow.push(constantKey);
      constantRow.push(constants[constantKey].value);

      output.push(constantRow);
    }

    const fileName = 'carbonator_scenario.csv';
    const fileType = this.fileSaverService.genType('csv');
    const txtBlob = new Blob([this.papa.unparse(output)], { type: fileType });
    this.fileSaverService.save(txtBlob, fileName);
  }

  exportOutputsToCSV(simulation: Simulation) {

    if (typeof simulation.runOutput === 'undefined' || !simulation.runOutput || simulation.runOutput.type !== 'finish') {
      alert('Outputs unavailable for download until scenario has been fully run.');
      return;
    }

    let output = [];

    let headerRow = [];
    headerRow.push('chart');
    headerRow.push('dataset');

    simulation.runOutput.years.forEach(function(value) {
      headerRow.push(value);
    });

    output.push(headerRow);

    for (let chartKey in simulation.runOutput.charts) {

      simulation.runOutput.charts[chartKey].forEach(function(value) {

        let datasetRow = [];
        datasetRow.push(chartKey);
        datasetRow.push(value.name);

        value.data.forEach(function(value) {
          datasetRow.push(value);
        });

        output.push(datasetRow);
      });
    }

    const fileName = 'carbonator_outputs.csv';
    const fileType = this.fileSaverService.genType('csv');
    const txtBlob = new Blob([this.papa.unparse(output)], { type: fileType });
    this.fileSaverService.save(txtBlob, fileName);
  }

  run(simulation: Simulation) {

    this._runningSimulation = <BehaviorSubject<{}>> new BehaviorSubject(true);

    const constants = simulation.constants;
    const forcings = {};

    const scenarioYearStart = simulation.scenario.range.start;
    const scenarioYearEnd = simulation.scenario.range.end;

    const totalYears = scenarioYearEnd - scenarioYearStart;
    const totalYearsInclusive = totalYears + 1;

    const annualYearNodes = simulation.interpC(scenarioYearStart, 1, scenarioYearEnd);
    const yearNodes = simulation.interpC(scenarioYearStart, constants.DT.value, scenarioYearEnd);

    let F1, F2, F3, F4, F5, F6;

    const forcingConfigs = simulation.forcingConfigs;

    for (let key in forcingConfigs) {
      let forcing = JSON.parse(JSON.stringify(forcingConfigs[key]));

      if (key === 'internalVariability') {

        F6 = (forcing.isEnabled) ? 1 : 0;

      } else {

        if (typeof forcing.data !== 'undefined' && forcing.data) {
          forcing.years = forcing.data.x;
          forcing.values = forcing.data.y;

        } else if (typeof forcing.nodesCount === 'number' && forcing.nodesCount !== 0) {

          const stepCount = forcing.nodesCount - 1;
          const stepValue = totalYears / stepCount;

          const yearNodes = simulation.generateYears(scenarioYearStart, scenarioYearEnd, stepValue);
          const interpolatedData = simulation.interpolate(forcing.years, forcing.values, yearNodes);

          forcing.years = yearNodes;
          forcing.values = interpolatedData;
        }

        if (typeof forcing.values === 'undefined' || forcing.isEnabled === false) {
          forcing.values = DATA_FORCINGS[key].default.value;
        }

        if (typeof forcing.values === 'number') {
          forcing.years = [scenarioYearStart, scenarioYearEnd];
          forcing.values = [forcing.values, forcing.values];
        }

        if (key === 'co2') {
          F1 = (forcing.isEnabled || typeof forcing.isEnabled === 'undefined') ? 1 : 0;
        } else if (key === 'ch4') {
          F2 = (forcing.isEnabled || typeof forcing.isEnabled === 'undefined') ? 1 : 0;
        } else if (key === 'so2') {
          F3 = (forcing.isEnabled || typeof forcing.isEnabled === 'undefined') ? 1 : 0;
        } else if (key === 'volcanics') {
          F4 = (forcing.isEnabled || typeof forcing.isEnabled === 'undefined') ? 1 : 0;
        } else if (key === 'tsi') {
          F5 = (forcing.isEnabled || typeof forcing.isEnabled === 'undefined') ? 1 : 0;
        }

        forcings[key] = forcing;
      }
    }

    console.log('--- collected from input scenario/edits: ----');
    console.log('Scenario Year Range', scenarioYearStart, scenarioYearEnd);
    console.log('DT value', constants.DT.value);
    console.log('Simulation Year Nodes using DT', yearNodes);
    console.log('Annual Year Nodes', annualYearNodes);
    console.log('Forcings', forcings);
    console.log('Constants', constants);
    console.log('F1 / CO2', F1);
    console.log('F2 / CH4', F2);
    console.log('F3 / SO2', F3);
    console.log('F4 / Volcanics', F4);
    console.log('F5 / TSI', F5);
    console.log('F6 / Int Variability', F6);

    const emissions = {
      CO2: simulation.interpolate(forcings['co2'].years, forcings['co2'].values, yearNodes),
      CH4: simulation.interpolate(forcings['ch4'].years, forcings['ch4'].values, yearNodes),
      SO2: simulation.interpolate(forcings['so2'].years, forcings['so2'].values, yearNodes),
      volc: simulation.interpolate(forcings['volcanics'].years, forcings['volcanics'].values, yearNodes)
    };


    const annualTSI = simulation.interpolate(forcings['tsi'].years, forcings['tsi'].values, annualYearNodes);

    let annualTSICycle = [];
    annualYearNodes.forEach(
      function(year) {
        const tsiSin = 0.3 * Math.sin(2 * 3.14 * year / 11);
        annualTSICycle.push(tsiSin);
      }
    );

    let i = 0;
    let tsiValues = [];
    annualTSI.forEach(
      function(tsiValue) {
        tsiValues[i] = tsiValue + annualTSICycle[i];
        i++;
      }
    );

    // const TSI = tsiValues;
    const TSI = simulation.interpolate(simulation.interpC(scenarioYearStart, 1, scenarioYearEnd), tsiValues, yearNodes);
    const alb = simulation.interpolate(forcings['albedo'].years, forcings['albedo'].values, yearNodes);

    let mTSI = simulation.nonZeroMean(forcings['tsi'].values);

    console.log('--- interpolated: ----');
    console.log('emissions', emissions);
    console.log('TSI', TSI);
    console.log('alb', alb);
    console.log('mTSI', mTSI);

    simulation.runInput = {
      forcings: {
        ch4: emissions.CH4,
        co2: emissions.CO2,
        so2: emissions.SO2,
        volcanics: emissions.volc,
        tsi: TSI,
        albedo: alb,
        internalVariability: F6
      },
      mtsi: mTSI,
      constants: constants,
      years: yearNodes
    };

    // Ocean (Glotter)
    let Cat = [ 596 ];
    let Cup = [ 713 ];
    let Clo = [ Cup[0] * constants.d.value ];
    // Terrestrial (Svirezhev)
    let P = [ 60 ]; // Gt/yr; NPP P=P(CO2,T,N); here we assume that P only changes due to CO2 fertilisation
    let N = [ 689.6552 ]; // original value 700; %Gt; Carbon in vegetation
    let So = [ 1218.3 ]; // original value 1200; %Gt  Carbon in Soil
    // Temperature (Geoffroy)
    let Ts = [ 0 ];
    let To = [ 0 ];
    let deltaT = [ 0 ];
    let Tsurf = [ 0 ];
    let C_CO2 = [ Cat[0] / 2.13 ];
    let R_CO2 = [ 0 ];
    let C_CH4 = [ 0 ];
    let R_CH4 = [ 0 ];
    let R_SO2 = [ 0 ];
    let OpTkhkV = [ 0 ];
    let SL = [ 0 ];
    let C_CO2pi = Cat[0] / 2.13; // % PI concentration; NB glotter used 285 (but need this value for equilibrium)
    let C_CH4pi = 791; // PI concentration

    // aragonite saturation - appears to be calculated but not used
    let aragonite_saturation = [ 0 ];

    // for use with solar
    let R_sol = [ 0 ];
    // for use with temperature model
    let RF_ = [ 0 ];
    // for use with volcanic aerosols - same question as RF_
    let R_volc = [ 0 ];
    // ocean pH
    let pH = [ 0 ];

    // bulbs
    let bulbs_in_lw = [ 0 ];
    let bulbs_out_lw = [ 0 ]; // change in black body radiation
    let bulbs_in_sw = [ 0 ];
    let bulbs_out_sw = [ 0 ];

    // step through model simulation
    for (let y = 1; y < yearNodes.length; y++) {

      // carbon cycle
      // ocean from glotter
      let a = Cup[y - 1] / constants.Alk.value;
      let H = (-(constants.k1.value) * (1 - a) + simulation.sqrt(simulation.square(constants.k1.value) * simulation.square(1 - a) - 4 * constants.k1.value * constants.k2.value * (1 - 2 * a))) / 2; // hydrogen concentration
      pH[y] = simulation.log10(H) * -1;
      // following line is to prevent the cliff right at the beginning of the pH chart because index 0 has value 0 incorrectly
      if (y == 1) pH[0] = pH[y];
      let B = 1 / (1 + constants.k1.value / H + constants.k1.value * constants.k2.value / simulation.square(H)); // ratio of dissolved CO2 to total oceanic carbon (B=B(pH))

      // terrestrial from Svirezhev
      P[y] = P[0] * (1 + constants.a2.value * (Cat[y - 1] - Cat[0])); // NPP with fertilisation effects
      So[y] = So[y - 1] + F1 * constants.DT.value * (constants.e.value * constants.m.value * N[y - 1] - constants.dr0.value * So[y - 1]); // soil carbon
      N[y] = N[y - 1] + F1 * constants.DT.value * (P[y - 1] - constants.m.value * N[y - 1]); // vegetation carbon

      // aragonite saturation - not used?
      let h1 = simulation.pow(10, -pH[y]);
      let s = 2400e-6 / (1.2023e-6 / h1);
      let co3 = s * (1 + 1.2023e-6 / h1) / (1 + h1 / 8.0206e-10);
      aragonite_saturation[y] = 1e-2 * co3 / constants.Ksp.value;

      // carbon budget
      Cat[y] = Cat[y - 1] + F1 * constants.DT.value * emissions.CO2[y - 1] + F1 * constants.DT.value * ((constants.ka.value * -1) * (Cat[y - 1] - constants.A.value * B * Cup[y - 1]))
        + F1 * constants.DT.value * (-P[y - 1] + (1 - constants.e.value) * constants.m.value * N[y - 1] + constants.dr0.value * So[y - 1]); // svirezhev
      Cup[y] = Cup[y - 1] + F1 * constants.DT.value * (constants.ka.value * (Cat[y - 1] - constants.A.value * B * Cup[y - 1]) - constants.kd.value * (Cup[y - 1] - Clo[y - 1] / constants.d.value));
      Clo[y] = Clo[y - 1] + F1 * constants.DT.value *	(constants.kd.value * (Cup[y - 1] - Clo[y - 1] / constants.d.value));

      // convert CO2 emissions to RF
      C_CO2[y] = Cat[y] / 2.13;
      R_CO2[y] = 5.35 * simulation.log(C_CO2[y] / C_CO2pi);

      // convert CH4 emissions to RF
      let T = constants.tau_ch4_pi.value * simulation.pow((C_CH4pi / (C_CH4[y - 1] + C_CH4pi)), constants.alpha_ch4.value);
      C_CH4[y] = C_CH4[y - 1] + constants.DT.value * (F2 * emissions.CH4[y - 1] / 2.78 - (1 / T) * C_CH4[y - 1]);
      R_CH4[y] = 0.66 * simulation.log((C_CH4pi + C_CH4[y]) / C_CH4pi);

      // anthropogenic aerosols
      R_SO2[y] = constants.AF.value * (emissions.SO2[y - 1] - emissions.SO2[0]);

      // volcanic aerosols
      OpTkhkV[y] = OpTkhkV[y - 1] + constants.DT.value * (emissions.volc[y] - OpTkhkV[y - 1] / constants.vtau.value);
      R_volc[y] = constants.VF.value * OpTkhkV[y];

      // internal variability
      deltaT[y] = constants.iv_alpha.value * deltaT[y - 1] + constants.iv_beta.value * simulation.randn();

      // solar
      R_sol[y] = ((TSI[y] - mTSI) / 4) * (1 - alb[y]) - TSI[y] / 4 * (alb[y] - constants.alb0.value);
      // if (isNaN(R_sol[y])) throw new Error('y = ' + y + ', R_sol[y] = ' + R_sol[y] + ', TSI[y] = ' + TSI[y] + ', mTSI = ' + mTSI + ', alb[y] = ' + alb[y] + ', alb0 = ' + alb0);
//console.log('R_sol[y]', R_sol[y], 'TSI[y]', TSI[y]);
      // temperature model
      let RF_GG = F1 * R_CO2[y - 1] + F2 * R_CH4[y - 1];
      RF_[y] = RF_GG + F3 * R_SO2[y - 1] + F4 * R_volc[y - 1] + F5 * R_sol[y];
      //if (isNaN(RF_[y])) throw new Error('y = ' + y + ', RF_[y] = ' + RF_[y] + ', RF_GG = ' + RF_GG + ', F3 = ' + F3 + ', R_SO2[y-1] = ' + R_SO2[y-1] + ', F4 = ' + F4 +
      //	', R_volc[y-1] = ' + R_volc[y-1] + ', F5 = ' + F5 + ', R_sol[y] = ' + R_sol[y]);
      Ts[y] = Ts[y - 1] + constants.DT.value * (RF_[y - 1] - constants.L.value * Ts[y - 1] - constants.g.value * (Ts[y - 1] - To[y - 1])) / constants.Cs.value;

      //if (isNaN(Ts[y])) throw new Error('NaN: Ts[' + y + '] is NaN, DT = ' + DT + ', RF_[y-1] = ' + RF_[y-1] + ', L = ' + L + ', Ts[y-1] ' + Ts[y-1] + ', g = ' + g +
      //	', To[y-1] = ' + To[y-1] + ', Cs = ' + Cs);

      To[y] = To[y - 1] + constants.DT.value * (constants.g.value * (Ts[y - 1] - To[y - 1])) / constants.Co.value;
      Tsurf[y] = Ts[y] + F6 * deltaT[y];

      // SL
      SL[y] = SL[y - 1] + constants.DT.value * (constants.si_a.value * (Ts[y] - constants.si_To.value) + constants.si_b.value * (Ts[y] - Ts[y - 1]) / constants.DT.value);

      // radiative forcing to bulb conversion
      // L*Ts term includes changes in black body radiation as well as changes in LW due to feedbacks
      // 5.4*Ts is linearised stefan boltzman at 15oC

      // CO2, Methane and feedback terms (e.g. water vapour)
      bulbs_in_lw[y]  =  constants.nobulbs.value * (F1 * R_CO2[y - 1] + F2 * R_CH4[y - 1] - constants.L.value * Ts[y - 1] + 5.4 * Ts[y - 1]);
      // change in black body radiation
      bulbs_out_lw[y] = -constants.nobulbs.value * (-5.4 * Ts[y - 1]);
      bulbs_in_sw[y]  =  constants.nobulbs.value * ((TSI[y] - mTSI) / 4);
      bulbs_out_sw[y] = -constants.nobulbs.value * (R_sol[y] - (TSI[y] - mTSI) / 4 + (F3 * R_SO2[y - 1] + F4 * R_volc[y - 1]));
    }

    // manipulation of data at end, just before plotting
    // incrementing C_CH4 by C_CH4pi
    for (let i = 0; i < C_CH4.length; i++) {
      C_CH4[i] += C_CH4pi;
    }

    // AT, UP and LO inventories
    Cat = simulation.subtractByFirstIndex(Cat);
    Cup = simulation.subtractByFirstIndex(Cup);
    Clo = simulation.subtractByFirstIndex(Clo);
    // veg, soil and npp inventories
    N = simulation.subtractByFirstIndex(N);
    P = simulation.subtractByFirstIndex(P);
    So = simulation.subtractByFirstIndex(So);

    // multiplication by forcings
    // co2 emissions
    let co2e = [];
    for (let i = 0; i < emissions.CO2.length; i++) {
      co2e[i] = emissions.CO2[i] * F1;
    }
    // greenhouse gases CO2/CH4
    R_CO2 = simulation.multiplyAllBy(R_CO2, F1);
    R_CH4 = simulation.multiplyAllBy(R_CH4, F2);
    R_SO2 = simulation.multiplyAllBy(R_SO2, F3);
    R_volc = simulation.multiplyAllBy(R_volc, F4);
    R_sol = simulation.multiplyAllBy(R_sol, F5);
    // divide sea level by 1,000
    SL = simulation.multiplyAllBy(SL, 0.001);

    let reducedYearNodes = simulation.reverseInterpC(yearNodes, constants.DT.value);
    Tsurf = simulation.reverseInterpC(Tsurf, constants.DT.value);
    To = simulation.reverseInterpC(To, constants.DT.value);
    C_CO2 = simulation.reverseInterpC(C_CO2, constants.DT.value);
    C_CH4 = simulation.reverseInterpC(C_CH4, constants.DT.value);
    R_CO2 = simulation.reverseInterpC(R_CO2, constants.DT.value);
    R_CH4 = simulation.reverseInterpC(R_CH4, constants.DT.value);
    R_SO2 = simulation.reverseInterpC(R_SO2, constants.DT.value);
    R_volc = simulation.reverseInterpC(R_volc, constants.DT.value);
    R_sol = simulation.reverseInterpC(R_sol, constants.DT.value);
    Cat = simulation.reverseInterpC(Cat, constants.DT.value);
    Cup = simulation.reverseInterpC(Cup, constants.DT.value);
    Clo = simulation.reverseInterpC(Clo, constants.DT.value);
    N = simulation.reverseInterpC(N, constants.DT.value);
    P = simulation.reverseInterpC(P, constants.DT.value);
    So = simulation.reverseInterpC(So, constants.DT.value);
    pH = simulation.reverseInterpC(pH, constants.DT.value);
    bulbs_in_lw = simulation.reverseInterpC(bulbs_in_lw, constants.DT.value);
    bulbs_in_sw = simulation.reverseInterpC(bulbs_in_sw, constants.DT.value);
    bulbs_out_lw = simulation.reverseInterpC(bulbs_out_lw, constants.DT.value);
    bulbs_out_sw = simulation.reverseInterpC(bulbs_out_sw, constants.DT.value);
    SL = simulation.reverseInterpC(SL, constants.DT.value);

    // bulbs net
    let bulbs_net = [];
    for (let i = 0; i < bulbs_in_lw.length; i++) {
      bulbs_net[i] = bulbs_in_lw[i] + bulbs_in_sw[i] - bulbs_out_lw[i] - bulbs_out_sw[i];
    }

    // model simulation complete, post message back to draw the output charts
    let simulatedData = {
      type: 'finish',
      years: reducedYearNodes,
      charts: {
        baseTemperatures: [
          { name: 'Surface', data: Tsurf },
          { name: 'Ocean', data: To }
        ],
        co2Concentration: [ { name: 'CO2 Concentration', data: C_CO2 } ],
        ch4Concentration: [ { name: 'CH4 Concentration', data: C_CH4 }],
        gg: [
          { name: 'CO2', data: R_CO2 },
          { name: 'CH4', data: R_CH4 }
        ],
        aerosols: [
          { name: 'SO2', data: R_SO2 },
          { name: 'Volcanic emissions', data: R_volc }
        ],
        solar: [ {name: 'Solar', data: R_sol }],
        atUpLo: [
          { name: 'Atmosphere', data: Cat },
          { name: 'Upper Ocean', data: Cup },
          { name: 'Deep Ocean', data: Clo }
        ],
        vegSoilNPP: [
          { name: 'Vegetation Carbon', data: N },
          { name: 'Soil Carbon', data: P },
          { name: 'Net Primary Productions', data: So }
        ],
        ph: [ { name: 'pH', data: pH }],
        lw: [
          { name: 'Longwave IN', data: bulbs_in_lw },
          { name: 'Shortwave IN', data: bulbs_in_sw },
          { name: 'Longwave OUT', data: bulbs_out_lw },
          { name: 'Shortwave OUT', data: bulbs_out_sw },
          { name: 'Net', data: bulbs_net }
        ],
        seaLevel: [ { name: 'Sea level', data: SL } ]
      }
    };

    console.log('---- end simulation ----');
    console.log('data', simulatedData);

    this.updateRunningSimulation({status: true, output: simulatedData});

    simulation.runOutput = simulatedData;
  }
}
