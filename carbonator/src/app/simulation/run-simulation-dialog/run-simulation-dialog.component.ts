import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-run-simulation-dialog',
  templateUrl: './run-simulation-dialog.component.html',
  styleUrls: ['./run-simulation-dialog.component.css']
})
export class RunSimulationDialogComponent implements OnInit {

  constructor(
    private dialogRef: MatDialogRef<RunSimulationDialogComponent>
  ) { }

  ngOnInit() {
  }

  close() {
    this.dialogRef.close();
  }

}
