import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { AboutComponent } from './about/about.component';
import { RegistryModule } from './registry/registry.module';
import { ErrorHandlerModule } from './error-handler/error-handler.module';


@NgModule({
  declarations: [
    AppComponent, NavbarComponent, AboutComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
    NgbModule.forRoot(),
    ErrorHandlerModule,
    RegistryModule
  ],
  providers: [ ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
