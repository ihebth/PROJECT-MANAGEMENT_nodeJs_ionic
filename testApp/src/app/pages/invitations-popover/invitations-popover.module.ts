import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { InvitationsPopoverPage } from './invitations-popover.page';

const routes: Routes = [
  {
    path: '',
    component: InvitationsPopoverPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [InvitationsPopoverPage]
})
export class InvitationsPopoverPageModule {}
