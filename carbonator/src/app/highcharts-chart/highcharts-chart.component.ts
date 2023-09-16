import { Component, ElementRef, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { Highcharts } from 'highcharts';

@Component({
  selector: 'app-highcharts-chart',
  template: '',
  styleUrls: ['./highcharts-chart.component.css']
})
export class HighchartsChartComponent implements OnInit {

  constructor(private el: ElementRef) { }

  ngOnInit() {
  }

  chart: any;
  @Input() Highcharts: any;
  @Input() constructorType: string;
  @Input() callbackFunction: any;
  optionsValue: any;
  @Input()
  set options(val) {
    this.optionsValue = val;
    this.updateOrCreateChart();
  }
  updateValue: boolean = false;
  @Output() updateChange: EventEmitter<{}> = new EventEmitter(true);
  @Input() set update(val) {
    if (val) {
      this.updateOrCreateChart();
      this.updateChange.emit(false); // clear the flag after update
    }
  }
  @Input() flagOneToOne: boolean; //#20

  updateOrCreateChart = function () {
    if (this.chart && this.chart.update) {
      this.chart.update(this.optionsValue, true, this.flagOneToOne || false);
    } else {
      this.chart = this.Highcharts[this.constructorType || 'chart'](
        this.el.nativeElement,
        this.optionsValue,
        this.callbackFunction || null
      );
      this.optionsValue.series = this.chart.userOptions.series;
    }
  }
}
