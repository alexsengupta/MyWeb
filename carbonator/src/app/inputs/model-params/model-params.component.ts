import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { ModelParamsDialogComponent } from '../model-params-dialog/model-params-dialog.component';
import { Observable } from 'rxjs/index';
import { AppConfigService } from '../../shared/services/app-config.service';
import { ModelParamsEditorDialogComponent } from '../model-params-editor-dialog/model-params-editor-dialog.component';

@Component({
  selector: 'app-model-params',
  templateUrl: './model-params.component.html',
  styleUrls: ['./model-params.component.css']
})
export class ModelParamsComponent implements OnInit {
  @Input() simulation;

  @Output() modify: EventEmitter<{}> = new EventEmitter(true);

  data;

  constructor(
    private dialog: MatDialog,
    private appConfig: AppConfigService
  ) { }

  ngOnInit() {

  }

  ngOnChanges() {
    this.data = this.simulation.constants;
  }

  get canEdit() {
    const isReadOnly = this.appConfig.readOnly.getValue();
    return !(isReadOnly);
  }

  emitModification() {
    this.modify.emit(this.data);
  }

  openParamsDialog() {

    const dialogConfig = new MatDialogConfig();

    this.data = this.simulation.constants;

    dialogConfig.data = {
      constants: JSON.parse(JSON.stringify(this.data))
    };

    this.dialog.open(ModelParamsDialogComponent, dialogConfig);
  }

  openParamsEditorDialog() {

    const dialogConfig = new MatDialogConfig();

    this.data = this.simulation.constants;

    dialogConfig.data = {
      constants: JSON.parse(JSON.stringify(this.data))
    };

    const dialogRef = this.dialog.open(ModelParamsEditorDialogComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(
      data => {
        if (data === false) {
          return;
        } else if (typeof data.reset !== 'undefined') {
          this.data = false;
        } else {
          this.data = data.constants;
        }
        this.emitModification();
      }
    );
  }
}
