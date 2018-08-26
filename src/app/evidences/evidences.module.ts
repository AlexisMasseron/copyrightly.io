import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { UtilModule } from '../util/util.module';
import { AlertsModule } from '../alerts/alerts.module';
import { UploadEvidencesContractService } from './upload-evidences-contract.service';
import { UploadEvidenceEventComponent } from './upload-evidence-event.component';
import { UploadEvidenceComponent } from './create/upload-evidence.component';
import { UploadEvidenceDetailsComponent } from './details/upload-evidence-details.component';
import { UploadExistenceDirective } from './create/upload-existence.directive';

@NgModule({
  declarations: [
    UploadEvidenceComponent,
    UploadEvidenceEventComponent,
    UploadEvidenceDetailsComponent,
    UploadExistenceDirective
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    UtilModule,
    AlertsModule
  ],
  exports: [
    UploadEvidenceComponent,
    UploadEvidenceDetailsComponent
  ],
  providers: [
    UploadEvidencesContractService
  ],
  bootstrap: [ UploadEvidenceEventComponent ]
})
export class EvidencesModule { }
