import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import {Routes,RouterModule} from '@angular/router';

import { RegisterPageRoutingModule } from './register-routing.module';

import { RegisterPage } from './register.page';
const routes : Routes = [
  {
    path:'',
    component:RegisterPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RegisterPageRoutingModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule
  ],
  declarations: [RegisterPage]
})
export class RegisterPageModule {}
