import { Component, OnInit } from '@angular/core';
import { AppConfigService } from '../shared/services/app-config.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Simulation } from '../shared/model/simulation.model';
import { SimulationsService } from '../shared/services/simulations.service';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material';
import { AdvancedDialogComponent } from '../pages/advanced-dialog/advanced-dialog.component';
import { RunSimulationDialogComponent } from './run-simulation-dialog/run-simulation-dialog.component';
import { Observable, Subscription } from 'rxjs/index';
import { ScenariosService } from '../shared/services/scenarios.service';

@Component({
  selector: 'app-simulation',
  templateUrl: './simulation.component.html',
  styleUrls: ['./simulation.component.css']
})
export class SimulationComponent implements OnInit {
  simulation: Simulation;
  runningSimulation$: Subscription;
  runningSimulationDialog: MatDialogRef<RunSimulationDialogComponent>;

  constructor(
    private route: ActivatedRoute,
    private simulationsService: SimulationsService,
    private scenariosService: ScenariosService,
    private appConfig: AppConfigService,
    private router: Router,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
    this.appConfig.readOnly$.subscribe(
      value => {
        if (value === true && this.simulation) {
          const scenarioID = this.simulation.scenario.id;
          this.simulationsService.deleteAll();
          this.loadSimulation(scenarioID);
        }
      }
    );
    this.route.params.subscribe(
      params => this.handleRoute(params)
    );
  }

  get isReadOnly() {
    return this.appConfig.readOnly.getValue();
  }

  handleRoute(params) {
    if (this.scenariosService.existsByID(+params.id)) {
      this.loadSimulation(+params.id);
    } else {
      this.router.navigate(['/']);
    }
  }

  loadSimulation(id: number) {
    this.simulation = this.simulationsService.load(id);
  }

  modifySimulationForcing(event: {key: string, forcing}) {
    this.simulation.modifyForcingConfig(event.key, event.forcing);
  }

  modifySimulationConstants(event) {
    this.simulation.modifyConstants(event);
  }

  revertRun() {
    this.simulation.doRevertRun();
  }

  resetSimulation() {
    const scenarioID = this.simulation.scenario.id;
    this.simulationsService.delete(scenarioID);
    this.loadSimulation(scenarioID);
  }

  exportSimulation() {
    this.simulationsService.exportToCSV(this.simulation);
  }

  exportSimulationOutputs() {
    this.simulationsService.exportOutputsToCSV(this.simulation);
  }

  runSimulation() {
    this.openRunSimulationDialog();
    this.simulationsService.run(this.simulation);
    this.runSimulationUpdates();
  }

  runSimulationUpdates() {
    this.runningSimulation$ = this.simulationsService.runningSimulation.subscribe(
      data => {

        if (typeof data['status'] !== undefined) {
          if (data['status'] === true) {
            this.runSimulationEnd();
          }
        }
      }
    );
  }

  runSimulationEnd() {
    setTimeout(val => {
      this.runningSimulationDialog.close();
      this.simulation.runComplete = true;
    }, 2000);
  }

  openRunSimulationDialog() {

    const dialogConfig = new MatDialogConfig();

    dialogConfig.autoFocus = true;
    dialogConfig.maxWidth = 450;
    dialogConfig.position = {'top': '250px'};
    dialogConfig.disableClose = true;

    this.runningSimulationDialog = this.dialog.open(RunSimulationDialogComponent, dialogConfig);
  }
}
