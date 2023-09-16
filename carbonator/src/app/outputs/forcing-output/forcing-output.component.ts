import { Component, Input, OnInit, OnChanges } from '@angular/core';
import * as Highcharts from 'highcharts/highcharts';
import { Simulation } from '../../shared/model/simulation.model';
import { DATA_FORCINGS } from '../../shared/data/forcings.data';

@Component({
  selector: 'app-forcing-output',
  templateUrl: './forcing-output.component.html',
  styleUrls: ['./forcing-output.component.css']
})
export class ForcingOutputComponent implements OnInit {

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
      title: {
        text: ''
      },
      min: null,
      max: null,
      labels: {
        formatter: undefined
      }
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

  constructor() { }

  ngOnInit() {
    this.updateChartData();
  }

  ngOnChanges() {
    this.meta = DATA_FORCINGS[this.key];
    this.updateChartData();
  }

  updateChartData() {
    const xSeries = this.simulation.reverseInterpC(this.simulation.runInput.years, this.simulation.constants.DT.value);
    const ySeries = this.simulation.reverseInterpC(this.simulation.runInput.forcings[this.key], this.simulation.constants.DT.value);

    this.chartOptions.series = [
      {
        data: ySeries
      }
    ];
    this.chartOptions.yAxis.title.text = DATA_FORCINGS[this.key].axisLabel;
    this.chartOptions.xAxis = {
      categories: xSeries
    };
    this.updateFlag = true;
  }

}
