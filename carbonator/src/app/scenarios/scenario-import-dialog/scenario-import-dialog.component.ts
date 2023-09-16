import { Component, Inject, OnInit } from '@angular/core';
import { AppConfigService } from '../../shared/services/app-config.service';
import { Observable } from 'rxjs/index';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { FileValidator } from 'ngx-material-file-input';
import { Papa } from 'ngx-papaparse';
import { ScenariosService } from '../../shared/services/scenarios.service';
import { Router } from '@angular/router';

export function scenarioImportFileTypeValidator(type): ValidatorFn {
  return (control: AbstractControl): {[key: string]: any} | null => {
    if (control.value !== null && typeof control.value.files !== 'undefined' && typeof control.value.files[0] !== 'undefined') {
      return (control.value.files[0].type === type)
        ? null
        : {'fileType': {value: control.value.files[0].type}};
    }
    return null;
  };
}

@Component({
  selector: 'app-scenario-import-dialog',
  templateUrl: './scenario-import-dialog.component.html',
  styleUrls: ['./scenario-import-dialog.component.css']
})
export class ScenarioImportDialogComponent implements OnInit {
  readOnly$: Observable<boolean>;
  importForm: FormGroup;

  constructor(
    private dialogRef: MatDialogRef<ScenarioImportDialogComponent>,
    private appConfig: AppConfigService,
    private formBuilder: FormBuilder,
    private papa: Papa,
    private scenariosService: ScenariosService,
    private router: Router,
    @Inject(MAT_DIALOG_DATA) private data
  ) { }

  ngOnInit() {
    this.readOnly$ = this.appConfig.readOnly$;

    this.importForm = this.formBuilder.group({
      requiredfile: [
        undefined,
        [
          Validators.required,
          scenarioImportFileTypeValidator('text/csv')
        ]
      ]
    });
  }

  onSubmitImportForm() {
    if (this.importForm.invalid) return;
    this.parse(this.importForm.value.requiredfile.files[0]);
  }

  parse(file: File): void {
    const reader: FileReader = new FileReader();
    reader.readAsText(file);
    reader.onload = e => {
      const csv = reader.result;
      this.papa.parse(csv, {
        complete: (results, file) => {
          const importResult = this.scenariosService.importCSV(results.data);

          if (typeof importResult.error !== 'undefined') {
            alert(importResult.error);
            this.importForm.reset();
          } else {
            this.router.navigate(['/scenario', importResult.scenario.id]);
            this.close();
          }
        }
      });
    }
  }

  close() {
    this.importForm.reset();
    this.dialogRef.close();
  }

}
