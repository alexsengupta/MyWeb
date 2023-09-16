import { Component, Input, OnInit, OnChanges } from '@angular/core';
import { Simulation } from '../../shared/model/simulation.model';
import { DATA_FORCINGS } from '../../shared/data/forcings.data';

@Component({
  selector: 'app-internal-variability-forcing-output',
  templateUrl: './internal-variability-forcing-output.component.html',
  styleUrls: ['./internal-variability-forcing-output.component.css']
})
export class InternalVariabilityForcingOutputComponent implements OnInit {

  @Input() key: string;
  @Input() simulation: Simulation;

  meta;

  constructor() { }

  ngOnInit() {
    this.meta = DATA_FORCINGS[this.key];
  }

  ngOnChanges() {
  }

  get isEnabled() {
    return (this.simulation.runInput.forcings[this.key] === 1) ? true : false;
  }

}
