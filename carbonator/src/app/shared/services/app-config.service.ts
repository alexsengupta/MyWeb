import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/index';

@Injectable({
  providedIn: 'root'
})
export class AppConfigService {
  readOnly: BehaviorSubject<boolean> = new BehaviorSubject(true);
  readOnly$ = this.readOnly.asObservable();

  constructor( ) {}

  updateReadOnly(value: boolean) {
    this.readOnly.next(value);
  }

  toggleReadOnly() {
    this.updateReadOnly(!(this.readOnly.getValue()));
  }
}
