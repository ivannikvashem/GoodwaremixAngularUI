import { Component, OnInit } from '@angular/core';
import {MatBottomSheetRef} from "@angular/material/bottom-sheet";
import {LocalStorageService} from "../service/local-storage.service";
import {BehaviorSubject, take} from "rxjs";
import {DataStateService} from "../shared/data-state.service";
import {SettingsModel} from "../models/service/settings.model";

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

  pageCookie$ = this._localStorageService.myData$
  pC: any = {};
  scrollPageToTop:boolean = false;
  menuState:boolean = true;
  isPaginatorFixed:boolean = true;
  isMobile:boolean;

  constructor(private _bottomSheetRef: MatBottomSheetRef<SettingsComponent>, private _localStorageService: LocalStorageService, private dss: DataStateService) { }

  getCookie() {
    this._localStorageService.getDataByPageName("Settings")
    this.pageCookie$.pipe(take(1)).subscribe(localStorageContent => {
      if (localStorageContent) {
        this.pC = localStorageContent;
        this.scrollPageToTop = this.pC.scrollPageToTop;
        this.menuState = this.pC.menuState;
        this.isPaginatorFixed = this.pC.isPaginatorFixed;
      }
    });
  }

  setCookie() {
    this._localStorageService.setDataByPageName("Settings", {
      scrollPageToTop: this.scrollPageToTop,
      menuState: this.menuState,
      isPaginatorFixed: this.isPaginatorFixed
    });
  }

  ngOnInit(): void {
    this.getCookie();
    this.isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  }

  saveSettings() {
    this.dss.setSettings(new BehaviorSubject<SettingsModel>({menuState: this.menuState, scrollPageToTop: this.scrollPageToTop, isPaginatorFixed: this.isPaginatorFixed}));
    this.setCookie();
    this._bottomSheetRef.dismiss();
  }

  restoreSettings() {
    this.scrollPageToTop = false;
    this.menuState = true;
    this.isPaginatorFixed = true;
    this.saveSettings();
  }
}
