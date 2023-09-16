import { Component } from '@angular/core';
import { AppConfigService } from './shared/services/app-config.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  config: AppConfigService;

  constructor(private appConfig: AppConfigService) {}

  ngOnInit() {
    this.config = this.appConfig;
  }
}
