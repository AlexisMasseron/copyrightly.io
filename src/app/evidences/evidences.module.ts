import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { UtilModule } from '../util/util.module';
import { AlertsModule } from '../alerts/alerts.module';
import { UploadEvidencesContractService } from './upload-evidences-contract.service';
import { UploadEvidenceEventComponent } from './upload-evidence-event.component';
import { UploadEvicenceComponent } from './create/upload-evicence.component';
import { UploadEvidenceDetailsComponent } from './details/upload-evidence-details.component';

@NgModule({
  declarations: [
    UploadEvicenceComponent,
    UploadEvidenceEventComponent,
    UploadEvidenceDetailsComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    UtilModule,
    AlertsModule
  ],
  exports: [
    UploadEvicenceComponent,
    UploadEvidenceDetailsComponent
  ],
  providers: [
    UploadEvidencesContractService
  ],
  bootstrap: [ UploadEvidenceEventComponent ]
})
export class EvidencesModule { }
