import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DATA_FORCINGS } from '../../shared/data/forcings.data';

@Component({
  selector: 'app-internal-variability-forcing',
  templateUrl: './internal-variability-forcing.component.html',
  styleUrls: ['./internal-variability-forcing.component.css']
})
export class InternalVariabilityForcingComponent implements OnInit {

  @Input() simulation;

  @Output() modify: EventEmitter<{}> = new EventEmitter(true);

  key = 'internalVariability';
  meta;
  config;

  constructor() { }

  ngOnInit() { }

  ngOnChanges() {
    this.config = this.simulation.forcingConfig(this.key);
    this.meta = DATA_FORCINGS[this.key];
  }

  emitModification() {
    this.modify.emit({key: this.key, forcing: this.config});
  }

  doUpdateIsEnabled(event) {
    this.config.isEnabled = event.checked;
    this.emitModification();
  }

  get isEnabled() {
    return this.config.isEnabled;
  }
}
