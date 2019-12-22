import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VerimarkerHttpInterceptor } from './verimarker-http-interceptor';
import { VerimarkerCommonUiModule } from '../common-ui/verimarker-common-ui.module';
import { BrowserModule } from '@angular/platform-browser';

@NgModule({
  declarations: [],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: VerimarkerHttpInterceptor, multi: true }
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    BrowserModule,
    VerimarkerCommonUiModule
  ]
})
export class VerimarkerRestServiceModule { }
