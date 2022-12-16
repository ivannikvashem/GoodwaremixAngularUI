import { Component, OnInit } from '@angular/core';
import {defer, from, map, Observable} from "rxjs";
import {AuthService} from "../service/auth.service";
import {KeycloakProfile} from "keycloak-js";
import {Router} from "@angular/router";

@Component({
  selector: 'app-auth-toolbar',
  templateUrl: './auth-toolbar.component.html',
  styleUrls: ['./auth-toolbar.component.css']
})
export class AuthToolbarComponent implements OnInit {

  isLoggedIn$: Observable<boolean>;
  user$: Observable<string>;
  roles: string[];

  constructor(private auth: AuthService) { }

  ngOnInit(): void {
    this.isLoggedIn$ = defer(() => from(this.auth.isLoggedIn()));
    this.user$ = defer(() => from(this.auth.loadUserProfile()).pipe(map((x) => x.username)));
    this.roles = this.auth.getRoles();

    //TODO make a proper redirect to a specific profile and not here!!
    //default page with a method. resolving the role and perform another redirect. that's it
  }

  logout(): void {
    this.auth.logout();
  }

  login(): void {
    this.auth.login();
  }
}
