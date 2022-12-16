import {APP_INITIALIZER, NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import {initializeKeycloak} from "./keycloak-initializer";
import {KeycloakAngularModule, KeycloakService} from "keycloak-angular";
import {AuthGuard} from "./auth.guard";
import {AuthService} from "./service/auth.service";
import { AuthToolbarComponent } from './auth-toolbar/auth-toolbar.component';
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";

@NgModule({
  declarations: [
    AuthToolbarComponent
  ],
  imports: [
    CommonModule,
    KeycloakAngularModule,
    MatIconModule,
    MatButtonModule,
  ],
  exports: [
    AuthToolbarComponent
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: initializeKeycloak,
      multi: true,
      deps: [KeycloakService]
    },
    AuthGuard,
    AuthService
  ]
})
export class AuthModule { }
