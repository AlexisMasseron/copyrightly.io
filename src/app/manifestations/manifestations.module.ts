import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { UtilModule } from '../util/util.module';
import { AlertsModule } from '../alerts/alerts.module';
import { RegistryContractService } from './registry-contract.service';
import { ManifestSingleComponent } from './manifest/manifest-single.component';
import { ManifestationsSearchComponent } from './search/manifestations-search.component';
import { ManifestationsListComponent } from './list/manifestations-list.component';
import { ManifestUnregisteredDirective } from './manifest/manifest-unregistered.directive';
import { ManifestationDetailsComponent } from './details/manifestation-details.component';
import { ManifestEventComponent } from './manifest-event.component';

@NgModule({
  declarations: [
    ManifestSingleComponent,
    ManifestUnregisteredDirective,
    ManifestationsSearchComponent,
    ManifestationsListComponent,
    ManifestationDetailsComponent,
    ManifestEventComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    UtilModule,
    AlertsModule
  ],
  exports: [
    ManifestSingleComponent,
    ManifestationsSearchComponent,
    ManifestationsListComponent
  ],
  providers: [
    RegistryContractService
  ],
  bootstrap: [ ManifestEventComponent ]
})
export class ManifestationsModule { }
