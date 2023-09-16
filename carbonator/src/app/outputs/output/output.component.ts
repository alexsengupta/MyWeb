import { Component, Input, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts/highcharts';
import { Simulation } from '../../shared/model/simulation.model';
import { DATA_OUTPUTS } from '../../shared/data/outputs.data';

@Component({
  selector: 'app-output',
  templateUrl: './output.component.html',
  styleUrls: ['./output.component.css']
})
export class OutputComponent implements OnInit {

  @Input() key: string;
  @Input() simulation: Simulation;

  meta;

  Highcharts = Highcharts;
  updateFlag = false;
  flagOneToOne = false;
  chartConstructor = 'chart';
  chartOptions = {
    series: [],
    credits: {
      enabled: false
    },
    yAxis: {
      title: { text: '' },
      labels: { formatter: undefined },
      plotLines: [],
      softMin: undefined,
      softMax: undefined,
      minRange: undefined,
      min: undefined,
      max: undefined
    },
    xAxis: {},
    legend: {
      enabled: false
    },
    title: {
      text: ''
    },
    tooltip: {
      pointFormat: '<span style="color:{point.color}">\u25CF</span> <b>{point.y}</b><br/>'
    },
    plotOptions: {
      column: {
        stacking: 'normal'
      },
      line: {
        cursor: 'ns-resize'
      }
    },
  };

  constructor() {}

  ngOnInit() {

  }

  ngOnChanges() {
    this.meta = DATA_OUTPUTS[this.key];
    this.updateChartData();
  }

  updateChartData() {

    this.chartOptions.series = this.simulation.runOutput.charts[this.key];

    this.chartOptions.yAxis.title.text = this.meta.axisLabel;

    let yPlotLines = [];
    if (this.key === 'ph') {

      yPlotLines.push({
        color: '#D2B48C',
        width: 1,
        value: 8.218504177697472,
        dashStyle: 'Dash',
        label: {
          align: 'right',
          text: 'Pre-industrial',
          textAlign: 'right'
        }
      });

      yPlotLines.push({
        color: '#D2B48C',
        width: 1,
        value: 8.09058303293605,
        dashStyle: 'Dash',
        label: {
          align: 'right',
          text: '@2000',
          textAlign: 'right'
        }
      });
      this.chartOptions.yAxis.minRange = 0.25;

    } else if (this.key === 'co2Concentration') {

      yPlotLines.push({
        color: '#D2B48C',
        width: 1,
        value: 280,
        dashStyle: 'Dash',
        label: {
          align: 'right',
          text: 'Pre-industrial',
          textAlign: 'right'
        }
      });

      yPlotLines.push({
        color: '#D2B48C',
        width: 1,
        value: 393,
        dashStyle: 'Dash',
        label: {
          align: 'right',
          text: '@2000',
          textAlign: 'right'
        }
      });

      this.chartOptions.yAxis.minRange = 150;

    } else if (this.key === 'ch4Concentration') {

      yPlotLines.push({
        color: '#D2B48C',
        width: 1,
        value: 791,
        dashStyle: 'Dash',
        label: {
          align: 'right',
          text: 'Pre-industrial',
          textAlign: 'right'
        }
      });

      yPlotLines.push({
        color: '#D2B48C',
        width: 1,
        value: 1741,
        dashStyle: 'Dash',
        label: {
          align: 'right',
          text: '@2000',
          textAlign: 'right'
        }
      });

      this.chartOptions.yAxis.minRange = 1500;

    }

    this.chartOptions.yAxis.plotLines = yPlotLines;


    this.chartOptions.xAxis = {
      categories: this.simulation.runOutput.years
    };

    if (this.meta.lines > 1 ) {
      this.chartOptions.legend = {
        enabled: true
      };
    }
    this.updateFlag = true;
  }

}
