import { Component, Input, OnInit, OnChanges, Output, EventEmitter } from '@angular/core';
import { DATA_FORCINGS } from '../../shared/data/forcings.data';

import * as Highcharts from 'highcharts/highcharts';
import * as HC_draggablePoints from 'highcharts-draggable-points';
import { AppConfigService } from '../../shared/services/app-config.service';
import { Observable } from 'rxjs/index';

HC_draggablePoints(Highcharts);

@Component({
  selector: 'app-tsi-forcing',
  templateUrl: './tsi-forcing.component.html',
  styleUrls: ['./tsi-forcing.component.css']
})
export class TSIForcingComponent implements OnInit {

  Highcharts = Highcharts;
  updateFlag = false;
  flagOneToOne = false;
  chartConstructor = 'chart';
  chartOptions = {
    series: [],
    credits: { enabled: false },
    yAxis: {
      title: { text: '' },
      labels: { formatter: undefined },
      plotLines: [],
      softMin: undefined,
      softMax: undefined,
      minRange: undefined
    },
    xAxis: {},
    legend: { enabled: false },
    title: { text: '' },
    tooltip: { pointFormat: '<span style="color:{point.color}">\u25CF</span> <b>{point.y}</b><br/>' }
  };

  @Input() simulation;

  @Output() modify: EventEmitter<{}> = new EventEmitter();

  private _data;
  private _waveData;

  readOnly$: Observable<boolean>;

  key = 'tsi';
  meta;
  config;

  constructor(
    private appConfig: AppConfigService
  ) { }

  ngOnInit() {
    this.readOnly$ = this.appConfig.readOnly;
    this.readOnly$.subscribe(
      value => this.doReadOnlyUpdate(value)
    );
  }

  ngOnChanges() {
    this.config = this.simulation.forcingConfig(this.key);
    this.meta = DATA_FORCINGS[this.key];
    this.updateChart();
  }

  modifyConfig() {
    this.emitModification();
    this.updateChart();
  }

  emitModification() {
    console.log('tsi-this.config', this.config);
    this.modify.emit({key: this.key, forcing: this.config});
  }


  doUpdateIsEnabled(event) {
    this.config.isEnabled = event.checked;
    this.config.nodesCount = 0;
    this.config.data = null;
    this.modifyConfig();
  }

  doUpdateNodesCount(event) {
    this.config.nodesCount = +event.value;
    this.config.data = null;
    this.modifyConfig();
  }

  doUpdateNodeValue(event) {
    this.config.data = {
      x: event.target.series.xAxis.categories,
      y: event.target.series.yData
    };
    this.modifyConfig();
  }

  doReadOnlyUpdate(value) {
    this.updateChart();
  }

  doReset() {
    this.modify.emit({key: this.key, forcing: null});
    this.updateChart();
  }



  get isEnabled() {
    return this.config.isEnabled;
  }

  get nodesCount() {
    return this.config.nodesCount;
  }

  get nodes() {
    const scenarioNodes = this.simulation.scenario.nodes;
    if (typeof scenarioNodes !== 'undefined') {
      return scenarioNodes;
    } else {
      return false;
    }
  }

  get isReadOnly() {
    return this.appConfig.readOnly.getValue();
  }



  get canUpdateIsEnabled() {
    return (this.meta.can.updateEnabled);
  }

  get canUpdateNodesCount() {
    return !(this.isReadOnly)
      && this.meta.can.updateNodesCount
      && this.nodes
      && this.isEnabled;
  }

  get canUpdateNodeValue() {
    return !(this.isReadOnly)
      && this.nodes
      && this.meta.can.updateNodeValue
      && this.isEnabled;
  }

  get canReset() {
    return !(this.isReadOnly);
  }



  updateChart() {
    this.refreshData();

    if (this.canUpdateNodeValue) {
      this.chartOptions.series = [
        {
          data: this._waveData.y,
          color: '#D2B48C',
          lineWidth: 1,
          draggableY: false,
          xAxis: 1
        },
        {
          data: this._data.y,
          draggableY: true,
          point: {
            events: {
              drop: this.doUpdateNodeValue.bind(this)
            }
          },
          rangeSelector: {
            selected: 1
          },
          stickyTracking: false,
          cursor: 'ns-resize',
          xAxis: 0
        }
      ];
    } else {
      this.chartOptions.series = [
        {
          data: this._waveData.y,
          color: '#D2B48C',
          lineWidth: 1,
          draggableY: false,
          xAxis: 1
        },
        {
          data: this._data.y,
          draggableY: false,
          cursor: 'default',
          xAxis: 0
        }
      ];
    }
    this.chartOptions.yAxis.title.text = DATA_FORCINGS[this.key].axisLabel;

    let xPlotLines = [];
    const scenarioLabel = this.simulation.scenario.label;
    if (scenarioLabel === 'RCP3' || scenarioLabel === 'RCP4.5' || scenarioLabel === 'RCP6' || scenarioLabel === 'RCP8.5') {

      const plotLine2005 = 155 / 251; // 2005 is node 155 of 251 nodes
      const plotLineValue = (this.config.nodesCount === 0)
        ? plotLine2005 * 251
        // Reduce resulting value by 0.5 to take chart padding into account
        : plotLine2005 * this.config.nodesCount - 0.5;

      xPlotLines.push({
        color: '#111',
        width: 1,
        value: plotLineValue,
        dashStyle: 'Dash'
      });
    }

    const xMin = 0.5;
    const xMax = (this._data.x.length -1.5);

    this.chartOptions.xAxis = [
      {
        categories: this._data.x,
        min: xMin,
        max: xMax,
        plotLines: xPlotLines
      },
      {
        categories: this._waveData.x,
        visible: false
      }
    ];

    this.updateFlag = true;
  }

  private refreshData() {

    this.config = this.simulation.forcingConfig(this.key);

    let years = this.config.years;
    let values = this.config.values;
    let nodesCount = this.config.nodesCount;

    const scenarioYearStart = this.simulation.scenario.range.start;
    const scenarioYearEnd = this.simulation.scenario.range.end;

    if (typeof values === 'undefined' || this.config.isEnabled === false) {
      values = this.meta.default.value;
    }

    if (typeof values === 'number') {
      years = [scenarioYearStart, scenarioYearEnd];
      values = [values, values];
    }

    const totalYears = scenarioYearEnd - scenarioYearStart;
    const totalYearsInclusive = totalYears + 1;

    if (this.config.data) {
      this._data = JSON.parse(JSON.stringify(this.config.data));

    } else {

      if (nodesCount === 0) {
        nodesCount = totalYearsInclusive;
      }

      const stepCount = nodesCount - 1;
      const stepValue = totalYears / stepCount;

      const yearNodes = this.simulation.generateYears(scenarioYearStart, scenarioYearEnd, stepValue);
      const interpolatedData = this.simulation.interpolate(years, values, yearNodes);

      this._data = {
        x: yearNodes,
        y: interpolatedData
      };
    }

    let tsiYearNodes = JSON.parse(JSON.stringify(this._data.x));
    let tsiValues = JSON.parse(JSON.stringify(this._data.y));

    let waveCycle = [];
    let waveValues = [];

    if (totalYearsInclusive !== tsiYearNodes.length) {
      const yearAnnualNodes = this.simulation.generateYears(scenarioYearStart, scenarioYearEnd, 1);
      const interpValues = this.simulation.interpolate(tsiYearNodes, tsiValues, yearAnnualNodes);

      tsiYearNodes = yearAnnualNodes;
      tsiValues = interpValues;
    }

    tsiYearNodes.forEach(
      function(year) {
        const value = 0.3 * Math.sin(2 * 3.14 * year / 11);
        waveCycle.push(value);
      }
    );

    let i = 0;
    tsiValues.forEach(
      function(tsiValue) {
        waveValues[i] = tsiValue + waveCycle[i];
        i++;
      }
    );

    this._waveData = {
      x: waveCycle,
      y: waveValues
    };
  }
}
