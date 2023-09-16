import { Component, OnInit } from '@angular/core';
import { AppConfigService } from '../../shared/services/app-config.service';
import { ScenariosService } from '../../shared/services/scenarios.service';
import { Scenario } from '../../shared/model/scenario.model';
import { Observable } from 'rxjs';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material';
import { ScenarioImportDialogComponent } from '../scenario-import-dialog/scenario-import-dialog.component';

@Component({
  selector: 'app-scenarios-menu',
  templateUrl: './scenarios-menu.component.html',
  styleUrls: ['./scenarios-menu.component.css']
})
export class ScenariosMenuComponent implements OnInit {
  readOnly$: Observable<boolean>;
  scenarios$: Observable<Scenario[]>;
  scenarioImportDialog: MatDialogRef<ScenarioImportDialogComponent>;

  constructor(
    private appConfig: AppConfigService,
    private scenariosService: ScenariosService,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
    this.readOnly$ = this.appConfig.readOnly$;
    this.scenarios$ = this.scenariosService.scenarios;
  }

  importScenario() {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.autoFocus = true;
    dialogConfig.width = '400px';
    dialogConfig.disableClose = true;

    this.scenarioImportDialog = this.dialog.open(ScenarioImportDialogComponent, dialogConfig);
  }
}
