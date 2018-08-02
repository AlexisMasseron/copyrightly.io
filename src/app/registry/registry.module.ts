import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { UtilModule } from '../util/util.module';
import { AlertsModule } from '../alerts/alerts.module';
import { ManifestSingleComponent } from './manifest/manifest-single.component';
import { RegistrySearchComponent } from './search/registry-search.component';
import { RegistryContractService } from './registry-contract.service';

@NgModule({
  declarations: [
    ManifestSingleComponent,
    RegistrySearchComponent
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
    RegistrySearchComponent
  ],
  providers: [
    RegistryContractService
  ]
})
export class RegistryModule { }
