import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import {IonicStorageModule, Storage} from '@ionic/storage';
import {JwtModule,JWT_OPTIONS} from '@auth0/angular-jwt';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import {HttpClientModule} from '@angular/common/http';
import { InvitationsPopoverPageModule } from './pages/invitations-popover/invitations-popover.module';
import { TaskPageModule } from './pages/task/task.module';
export function jwtOptionFactory(storage){
  return {
    tokenGetter :()=> {
      return storage.get('access_token');
    },
    whitelistedDomains:['localhost:5000']
  }
}
@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule,
  HttpClientModule,IonicStorageModule.forRoot(),
  JwtModule.forRoot({jwtOptionsProvider:{
    provide:JWT_OPTIONS,
    useFactory:jwtOptionFactory,
    deps :[Storage]

  }
  }),
  InvitationsPopoverPageModule,
  TaskPageModule
],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
