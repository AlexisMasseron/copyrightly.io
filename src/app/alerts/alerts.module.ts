import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertsComponent } from './alerts.component';
import { NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';
import { AlertsService } from './alerts.service';

@NgModule({
  imports: [
    CommonModule,
    NgbAlertModule
  ],
  declarations: [ AlertsComponent ],
  providers: [ AlertsService ],
  exports: [ AlertsComponent ]
})
export class AlertsModule {
}
