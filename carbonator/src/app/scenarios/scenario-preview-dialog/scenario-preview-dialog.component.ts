import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { ScenariosService } from '../../shared/services/scenarios.service';
import { Scenario } from '../../shared/model/scenario.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-scenario-preview-dialog',
  templateUrl: './scenario-preview-dialog.component.html',
  styleUrls: ['./scenario-preview-dialog.component.css']
})
export class ScenarioPreviewDialogComponent implements OnInit {
  scenario: Scenario;

  constructor(
    private dialogRef: MatDialogRef<ScenarioPreviewDialogComponent>,
    private scenariosService: ScenariosService,
    private router: Router,
    @Inject(MAT_DIALOG_DATA) private data
  ) { }

  ngOnInit() {
    const scenarioID = this.data.scenarioID;
    this.scenario = this.scenariosService.load(scenarioID);
  }

  startScenario() {
    this.router.navigate(['/scenario', this.data.scenarioID]);
    this.close();
  }

  close() {
    this.dialogRef.close();
  }
}
