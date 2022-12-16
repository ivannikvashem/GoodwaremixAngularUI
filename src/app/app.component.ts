import { Component } from '@angular/core';
import {environment} from '../environments/environment';
import {AuthService} from "./auth/service/auth.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent{
  title = environment.production ? 'GoodWareMix UI' : 'Dev GoodWare';
  url = environment.apiURL;
  roles: string[] = [];

  constructor(private auth: AuthService) {
    this.roles = this.auth.getRoles();
  }
}
