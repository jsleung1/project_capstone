import { VerimarkerUserServiceModule } from './user-service/verimarker-user-service.module';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { VerimarkerRestServiceModule } from './rest-service/verimarker-rest-service.module';

import { CookieService } from 'ngx-cookie-service';
import { NgxSpinnerModule } from 'ngx-spinner';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    VerimarkerRestServiceModule,
    VerimarkerUserServiceModule,
    NgxSpinnerModule
  ],
  providers: [
    CookieService,
    // [{ provide: URL_PATH_CONFIG, useValue: VeriguidePathConfig }]
  ],
  bootstrap: [AppComponent]
})
export class AppModule {

  // Diagnostic only: inspect router configuration
  constructor() {
  }
}
