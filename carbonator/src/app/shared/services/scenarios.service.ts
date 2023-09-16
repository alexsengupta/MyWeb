import { Injectable } from '@angular/core';
import { Scenario } from '../model/scenario.model';
import { DATA_SCENARIOS } from '../data/scenarios.data';
import { BehaviorSubject } from 'rxjs/index';
import { map } from 'rxjs/internal/operators';
import { ForcingConfig } from '../model/forcing.config';
import { DATA_CONSTANTS } from '../data/constants.data';

@Injectable({
  providedIn: 'root'
})
export class ScenariosService {
  private _scenarios: BehaviorSubject<Scenario[]>;
  private dataStore: {
    scenarios: Scenario[]
  };

  constructor( ) {
    this.dataStore = { scenarios: [] };
    this._scenarios = <BehaviorSubject<Scenario[]>> new BehaviorSubject([]);
    this.loadPresets();
  }

  emitScenarios() {
    this._scenarios.next(Object.assign({}, this.dataStore).scenarios);
  }

  get scenarios() {
    return this._scenarios.asObservable();
  }

  get presets() {

    return this.scenarios
      .pipe(
        map(scenarios => scenarios.filter(scenario => scenario.isPreset))
      );
  }

  existsByID(id: number) {
    return (typeof this.load(id) !== 'undefined');
  }

  load(id: number) {
    return this.dataStore.scenarios.find(scenario => scenario.id === id);
  }

  loadPresets() {
    this.dataStore.scenarios = DATA_SCENARIOS;
    this.emitScenarios();
  }

  remove(id: number) {
    this.dataStore.scenarios = this.dataStore.scenarios
      .filter(scenario => (scenario.id !== id || scenario.isPreset));
    this.emitScenarios();
  }

  importCSV(data) {

    let name,
        label,
        summary,
        rangeType,
        rangeStart,
        rangeEnd,
        newScenario;

    let hasMetaRow, hasRangeRow = false;

    const defaultConstants = JSON.parse(JSON.stringify(DATA_CONSTANTS));

    data.forEach(function(row) {

      if (row[0] === 'meta') {

        hasMetaRow = true;

        name = row[1];
        label = row[2];
        summary = row[3];
      }

    });

    if (!hasMetaRow) {
      return {
        error: 'Your file is missing the mandatory \'meta\' row'
      }
    }

    newScenario = this.create(name, label, summary);

    data.forEach(function(row) {
      if (row[0] === 'range') {

        hasRangeRow = true;

        rangeType = row[1];
        rangeStart = row[2];
        rangeEnd = row[3];

        newScenario.range = {
          start: +rangeStart,
          end: +rangeEnd,
          type: rangeType
        };
      }
    });

    if (!hasRangeRow) {
      return {
        error: 'Your file is missing the mandatory \'range\' row'
      }
    }

    data.forEach(function(row) {
      if (row[0] === 'nodes') {

        let nodesPosition = 1;
        let nodes = [];
        row.forEach(function(value) {
          if (nodesPosition >= 2) {
            if (typeof value !== 'undefined' && value !== '') {
              nodes.push(+value);
            }
          }
          nodesPosition++;
        });

        if (!nodes.length) {
          return {
            error: 'Your file \'nodes\' row is incorrect'
          }
        }

        newScenario.nodes = nodes;
      }
    });

    data.forEach(function(row) {
      if (row[0] === 'forcing') {

        let forcingKey = row[1];

        if (typeof newScenario.forcings[forcingKey] === 'undefined') {
          newScenario.forcings[forcingKey] = {};
        }

        if (forcingKey === 'internalVariability') {
          if (row[2] === 'meta') {
            newScenario.forcings[forcingKey].isEnabled = ( +row[3] > 0 );
          }

        } else {
          if (row[2] === 'meta') {
            newScenario.forcings[forcingKey].isEnabled = ( +row[3] > 0 );
            newScenario.forcings[forcingKey].nodesCount = +row[4];

          } else if (row[2] === 'years') {

            let yearPosition = 1;
            let years = [];
            row.forEach(function(value) {
              if (yearPosition >= 4) {
                if (typeof value !== 'undefined' && value !== '') {
                  years.push(+value);
                }
              }
              yearPosition++;
            });

            if (
              years[0] !== newScenario.range.start
              || years[years.length - 1] !== newScenario.range.end
            ) {
              return {
                error: 'Your ' + forcingKey +' forcing \'years\' do not match the range start/end'
              }
            }

            newScenario.forcings[forcingKey].years = years;

          } else if (row[2] === 'values') {

            let valuePosition = 1;
            let values = [];
            row.forEach(function(value) {
              if (valuePosition >= 4) {
                if (typeof value !== 'undefined' && value !== '') {
                  values.push(+value);
                }
              }
              valuePosition++;
            });

            newScenario.forcings[forcingKey].values = values;
          }
        }

      } else if (row[0] === 'constant') {
        newScenario.constants[row[1]] = {
          value: +row[2],
          label: defaultConstants[row[1]].label,
          symbol: defaultConstants[row[1]].symbol,
          description: defaultConstants[row[1]].description,
          units: defaultConstants[row[1]].units
        };
      }
    });

    this.dataStore.scenarios.push(newScenario);
    this.emitScenarios();

    return { scenario: JSON.parse(JSON.stringify(newScenario)) };
  }

  create(name, label, summary) {

    let newScenario: Scenario = {
      id: this.nextAvailableID,
      isPreset: false,
      name: name,
      label: label,
      summary: summary,
      imageUrl: '/assets/img/scenarios/custom.png',
      forcings: {},
      constants: {}
    };

    return newScenario;
  }

  get nextAvailableID() {

    let maxID = 0;
    this.dataStore.scenarios.forEach(function(scenario) {
      if (scenario.id > maxID) {
        maxID = scenario.id;
      }
    });
    return maxID + 1;
  }
}
