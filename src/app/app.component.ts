import { Component } from '@angular/core';
import {environment} from '../environments/environment';
import {AuthService} from "./auth/service/auth.service";
import {ApiClient} from "./service/httpClient";
import {catchError, filter} from "rxjs/operators";
import {throwError} from "rxjs";
import {NotificationService} from "./service/notification-service";
import {HttpStatusCode} from "@angular/common/http";
import {Title} from "@angular/platform-browser";
import {NavigationEnd, Router} from "@angular/router";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent{
  title = environment.production ? 'GoodWareMix UI' : 'Dev GoodWare';
  url = environment.apiURL;
  roles: string[] = [];
  isServerOffline: boolean;

  sidebarState: boolean = false;
  logoHover: boolean = false;

  menuItems:any = [
    { name: 'Главная', route: '/home', icon: 'home', role: 'goodware-manager' },
    { name: 'Товары', route: '/products', icon: 'local_offer', role: 'goodware-users' },
    { name: 'Поставщики', route: '/suppliers', icon: 'settings_accessibility', role: 'goodware-admin' },
    { name: 'Атрибуты', route: '/attributes', icon: 'list', role: 'goodware-admin' },
    { name: 'Документы', route: '/documents', icon: 'insert_drive_file', role: 'goodware-admin' },
    { name: 'Журнал событий', route: '/log', icon: 'receipt_long', role: 'goodware-admin' },
    { name: 'Пользователи', route: '/users', icon: 'manage_accounts', role: 'goodware-admin' },
    { name: 'Задачи', route: '/tasks', icon: 'task', role: 'goodware-admin' },
    { name: 'Панель администратора', route: '/admin', icon: 'admin_panel_settings', role: 'goodware-admin' },
    { name: 'Категории', route: '/categories', icon: 'segment', role: 'goodware-admin' },
  ]

  constructor(private auth: AuthService, private api: ApiClient, private _notyf: NotificationService, private titleService:Title, private router:Router) {
    this.roles = this.auth.getRoles();
    this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe((event:any) => {
      this.titleService.setTitle(this.menuItems.find((x:any) => x.route == event.url) ? this.menuItems.find((x:any) => x.route == event.url).name : 'GoodWareAngularUI')
    })
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
