import { Component } from '@angular/core';
import {environment} from '../environments/environment';
import {AuthService} from "./auth/service/auth.service";
import {ApiClient} from "./service/httpClient";
import {catchError} from "rxjs/operators";
import {throwError} from "rxjs";
import {NotificationService} from "./service/notification-service";
import {HttpStatusCode} from "@angular/common/http";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent{
  title = environment.production ? 'GoodWareMix UI' : 'Dev GoodWare';
  url = environment.apiURL;
  roles: string[] = [];
  isServerOffline: boolean;

  sidebarState: boolean = true;
  logoHover: boolean = false;

  constructor(private auth: AuthService, private api: ApiClient, private _notyf: NotificationService) {
    this.roles = this.auth.getRoles();
  }

  ngOnInit() {
    this.checkServerAvailability();
  }

  checkServerAvailability() {
    this.api.checkIfServerAlive()
      .pipe(
        catchError((err: any) => {
          if (err.status == 0 || err.status == HttpStatusCode.InternalServerError) {
            this._notyf.onError('Сервер недоступен');
            this.isServerOffline = true;
          }
          return throwError(err)
        })
      ).subscribe();
  }
}
