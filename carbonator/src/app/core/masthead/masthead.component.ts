import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { ShareDialogComponent } from '../../pages/share-dialog/share-dialog.component';
import { TutorialDialogComponent } from '../../pages/tutorial-dialog/tutorial-dialog.component';
import { AdvancedDialogComponent } from '../../pages/advanced-dialog/advanced-dialog.component';
import { AppConfigService } from '../../shared/services/app-config.service';
import { Observable } from 'rxjs/index';

@Component({
  selector: 'app-masthead',
  templateUrl: './masthead.component.html',
  styleUrls: ['./masthead.component.css']
})
export class MastheadComponent implements OnInit {
  readOnly$: Observable<boolean>;

  constructor(
    private dialog: MatDialog,
    private appConfig: AppConfigService
  ) {}

  ngOnInit() {
    this.readOnly$ = this.appConfig.readOnly$;
  }

  setReadOnly(value: boolean) {
    this.appConfig.updateReadOnly(value);
  }

  openShareDialog() {

    const dialogConfig = new MatDialogConfig();

    dialogConfig.autoFocus = false;
    dialogConfig.maxWidth = 450;
    dialogConfig.position = {'top': '250px'};

    dialogConfig.data = {
      message: 'Sharing buttons and instructions'
    };

    const dialogRef = this.dialog.open(ShareDialogComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(
      data => console.log('Dialog output:', data)
    );
  }

  openTutorialDialog() {

    const dialogConfig = new MatDialogConfig();

    dialogConfig.autoFocus = false;
    dialogConfig.maxWidth = 450;
    dialogConfig.position = {'top': '250px'};

    this.dialog.open(TutorialDialogComponent, dialogConfig);
  }

  openAdvancedDialog() {

    const dialogConfig = new MatDialogConfig();

    dialogConfig.autoFocus = true;
    dialogConfig.maxWidth = 450;
    dialogConfig.position = {'top': '250px'};
    dialogConfig.disableClose = true;

    this.dialog.open(AdvancedDialogComponent, dialogConfig);
  }

}
