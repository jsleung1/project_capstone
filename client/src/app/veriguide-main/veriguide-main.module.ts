import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VerimarkerMainRoutingModule } from './veriguide-main-routing.module';
import { MainMenuComponent } from './main-menu/main-menu.component';

@NgModule({
  imports: [
    CommonModule,
    VerimarkerMainRoutingModule,
  ],
  declarations: [MainMenuComponent]
})
export class VeriguideMainModule { }
