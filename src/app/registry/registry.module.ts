import { NgModule } from '@angular/core';
import { UtilModule } from '../util/util.module';
import { RouterModule } from '@angular/router';
import { MatButtonModule, MatCardModule, MatFormFieldModule, MatIconModule, MatInputModule,
  MatOptionModule, MatSelectModule, MatSnackBarModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { ManifestSingleComponent } from './manifest/manifest-single.component';
import { RegistrySearchComponent } from './search/registry-search.component';

@NgModule({
  declarations: [
    ManifestSingleComponent,
    RegistrySearchComponent
  ],
  imports: [
    BrowserAnimationsModule,
    FormsModule,
    RouterModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatOptionModule,
    MatSelectModule,
    MatSnackBarModule,
    MatIconModule,
    UtilModule
  ],
  exports: [
    ManifestSingleComponent,
    RegistrySearchComponent
  ]
})
export class RegistryModule { }
