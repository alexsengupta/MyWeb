import { Component, OnInit } from '@angular/core';
import { AppConfigService } from '../../shared/services/app-config.service';
import { ScenariosService } from '../../shared/services/scenarios.service';
import { Scenario } from '../../shared/model/scenario.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  config: {};
  scenarios$: Observable<Scenario[]>;

  constructor(
    private appConfig: AppConfigService,
    private scenariosService: ScenariosService
  ) { }

  ngOnInit() {
    this.config = this.appConfig;
    this.scenarios$ = this.scenariosService.presets;
  }
}
