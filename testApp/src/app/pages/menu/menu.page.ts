import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
})
export class MenuPage implements OnInit {
  pages =[
    {
    title: 'My Boards',
    url:'/app/boards'
    },
    {
      title: 'Billing',
      url:'/app/billing'
      }
  ];

  constructor(private authService:AuthService) { }

  ngOnInit() {
  }
logout() {
  this.authService.logout();
}
}
