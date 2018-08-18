import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { UtilModule } from '../util/util.module';
import { AlertsModule } from '../alerts/alerts.module';
import { RegistryContractService } from './registry-contract.service';
import { ManifestSingleComponent } from './manifest/manifest-single.component';
import { RegistrySearchComponent } from './search/registry-search.component';
import { ListComponent } from './list/list.component';
import { ManifestUnregisteredDirective } from './manifest/manifest-unregistered.directive';

@NgModule({
  declarations: [
    ManifestSingleComponent,
    RegistrySearchComponent,
    ListComponent,
    ManifestUnregisteredDirective
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
    RegistrySearchComponent,
    ListComponent
  ],
  providers: [
    RegistryContractService
  ]
})
export class RegistryModule { }
