import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VeriguideMainRoutingModule } from './veriguide-main-routing.module';
import { MainMenuComponent } from './main-menu/main-menu.component';

@NgModule({
  imports: [
    CommonModule,
    VeriguideMainRoutingModule,
  ],
  declarations: [MainMenuComponent]
})
export class VeriguideMainModule { }
