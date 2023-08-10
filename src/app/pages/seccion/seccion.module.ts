import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SeccionPageRoutingModule } from './seccion-routing.module';

import { SeccionPage } from './seccion.page';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SeccionPageRoutingModule,
    SharedModule
  ],
  declarations: [SeccionPage]
})
export class SeccionPageModule {}
