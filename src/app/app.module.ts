import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { RegistryModule } from './registry/registry.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatToolbarModule, MatIconModule, MatIconRegistry } from '@angular/material';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserAnimationsModule,
    MatToolbarModule,
    MatIconModule,
    BrowserModule,
    FormsModule,
    HttpClientModule,
    RegistryModule
  ],
  providers: [ MatIconRegistry ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
