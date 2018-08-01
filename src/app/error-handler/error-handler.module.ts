import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ErrorAlertComponent } from './error-alert/error-alert.component';
import { NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';
import { ErrorMessageService } from './error-message.service';

@NgModule({
  imports: [
    CommonModule,
    NgbAlertModule
  ],
  declarations: [ ErrorAlertComponent ],
  providers: [ ErrorMessageService ],
  exports: [ ErrorAlertComponent ]
})
export class ErrorHandlerModule {
}
