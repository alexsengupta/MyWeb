import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-model-params-output',
  templateUrl: './model-params-output.component.html',
  styleUrls: ['./model-params-output.component.css']
})
export class ModelParamsOutputComponent implements OnInit {

  @Input() simulation;

  showContent: boolean = false;
  constants;

  constructor() { }

  ngOnInit() {
    this.constants = this.simulation.runInput.constants;
  }

  toggleContent() {
    this.showContent = !(this.showContent);
  }

  get constantsKeys() {
    return Object.keys(this.constants);
  }

}
