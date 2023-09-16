import { Component, OnInit } from '@angular/core';
import { AppConfigService } from '../../shared/services/app-config.service';
import { ScenariosService } from '../../shared/services/scenarios.service';
import { Scenario } from '../../shared/model/scenario.model';
import { Observable } from 'rxjs';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { ScenarioPreviewDialogComponent } from '../scenario-preview-dialog/scenario-preview-dialog.component';

@Component({
  selector: 'app-scenarios-list',
  templateUrl: './scenarios-list.component.html',
  styleUrls: ['./scenarios-list.component.css']
})
export class ScenariosListComponent implements OnInit {
  config: {};
  scenarios$: Observable<Scenario[]>;

  constructor(
    private appConfig: AppConfigService,
    private scenariosService: ScenariosService,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
    this.config = this.appConfig;
    this.scenarios$ = this.scenariosService.presets;
  }

  openScenarioPreviewDialog(scenarioID: number) {

    const dialogConfig = new MatDialogConfig();

    dialogConfig.autoFocus = false;
    dialogConfig.maxWidth = 500;
    dialogConfig.position = {'top': '250px'};

    dialogConfig.data = {
      scenarioID: scenarioID
    };

    const dialogRef = this.dialog.open(ScenarioPreviewDialogComponent, dialogConfig);
  }
}
