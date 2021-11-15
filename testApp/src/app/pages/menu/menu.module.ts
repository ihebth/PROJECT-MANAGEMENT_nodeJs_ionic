import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MenuPageRoutingModule } from './menu-routing.module';
import {Routes,RouterModule} from '@angular/router';

import { MenuPage } from './menu.page';
const routes : Routes = [
  {
    path:'',
    component:MenuPage,
    children:[
      {
        path: 'boards', loadChildren: () => import('../boards/boards.module').then( m => m.BoardsPageModule),
      },
      {
        path: 'boards/:id', loadChildren: () => import('../board/board.module').then( m => m.BoardPageModule),
      },
      {
        path: 'billing', loadChildren: () => import('../billing/billing.module').then( m => m.BillingPageModule),
      }
    ]

  }
]

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [MenuPage]
})
export class MenuPageModule {}
