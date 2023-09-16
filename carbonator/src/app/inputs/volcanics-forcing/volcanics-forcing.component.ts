import { Component, Input, OnInit, OnChanges, Output, EventEmitter } from '@angular/core';
import { DATA_FORCINGS } from '../../shared/data/forcings.data';

import * as Highcharts from 'highcharts/highcharts';
import * as HC_draggablePoints from 'highcharts-draggable-points';
import { AppConfigService } from '../../shared/services/app-config.service';
import { Observable } from 'rxjs/index';

HC_draggablePoints(Highcharts);

@Component({
  selector: 'app-volcanics-forcing',
  templateUrl: './volcanics-forcing.component.html',
  styleUrls: ['./volcanics-forcing.component.css']
})
export class VolcanicsForcingComponent implements OnInit {

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

  readOnly$: Observable<boolean>;

  key = 'volcanics';
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
    this.emitModification();
    // maybe here in solar do chartUpdate (via modifyConfig()) ? //
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
          cursor: 'ns-resize'
        }
      ];
    } else {
      this.chartOptions.series = [
        {
          data: this._data.y,
          draggableY: false,
          cursor: 'default'
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

    this.chartOptions.xAxis = {
      categories: this._data.x,
      plotLines: xPlotLines
    };

    this.updateFlag = true;
  }

  private refreshData() {

    this.config = this.simulation.forcingConfig(this.key);

    if (this.config.data) {
      this._data = JSON.parse(JSON.stringify(this.config.data));
      return;
    }

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


  doFlatLine() {

    const scenarioYearStart = this.simulation.scenario.range.start;
    const scenarioYearEnd = this.simulation.scenario.range.end;

    this.config.years = [scenarioYearStart, scenarioYearEnd];
    this.config.values = [0,0];
    this.config.data = null;

    this.modifyConfig();
  }

  doRandomise() {
    this.config.data = null;
    this.createRandomData();
    this.modifyConfig();
  }

  get canFlatLine() {
    return !(this.isReadOnly) && this.isEnabled;
  }

  get canRandomise() {
    const isReadOnly = this.appConfig.readOnly.getValue();
    return !(isReadOnly) && this.isEnabled;
  }

  private createRandomData() {

    const scenarioYearStart = this.simulation.scenario.range.start;
    const scenarioYearEnd = this.simulation.scenario.range.end;

    const totalYears = scenarioYearEnd - scenarioYearStart;
    const totalYearsInclusive = totalYears + 1;

    const yearNodes = this.simulation.generateYears(scenarioYearStart, scenarioYearEnd, 1);

    const pinatubo = 0.22;
    const totalEmissions = 0.011 * totalYearsInclusive;

    const syntheticData = this.simulation.multiplyAllBy(this.simulation.arrcpy(yearNodes), 0);

    let myTotal = 0;

    while (myTotal < totalEmissions) {

      const ind = Math.round(Math.random() * totalYears) + 1;
      const rand = this.simulation.randn();
      const sf = 0.2 * (Math.abs(Math.pow(rand, 2)));

      syntheticData[ind] = syntheticData[ind] + (sf * pinatubo);
      myTotal = myTotal + (sf * pinatubo);
    }

    this.config.data = {
      x: yearNodes,
      y: syntheticData
    }
  }
}
