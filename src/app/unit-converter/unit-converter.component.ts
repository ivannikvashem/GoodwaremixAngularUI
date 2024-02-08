import { Component, OnInit } from '@angular/core';
import {DataStateService} from "../shared/data-state.service";
import {LocalStorageService} from "../service/local-storage.service";
import {MatLegacyDialog as MatDialog} from "@angular/material/legacy-dialog";
import {FormControl} from "@angular/forms";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-unit-converter',
  templateUrl: './unit-converter.component.html',
  styleUrls: ['./unit-converter.component.css']
})
export class UnitConverterComponent implements OnInit {

  searchQueryCtrl  = new FormControl<string>(null);
  searchQuery:string = '';
  pageIndex:number = 0;
  pageSize:number = 10;
  pageCookie$ = this._localStorageService.myData$;
  pC: any = {};

  constructor(
    private dss: DataStateService,
    private _localStorageService: LocalStorageService,
    public dialog: MatDialog
  ) { }

  getCookie() {
    this._localStorageService.getDataByPageName("UnitConverterIndex")
    this.pageCookie$.subscribe(localStorageContent => {
      if (localStorageContent) {
        this.pC = localStorageContent;
        this.searchQueryCtrl.setValue(this.pC.searchQuery);
        this.searchQuery = this.pC.searchQuery;
        this.pageIndex = this.pC.pageIndex;
        this.pageSize = this.pC.pageSize;
      }
    });
  }

  setCookie() {
    this._localStorageService.setDataByPageName("UnitConverterIndex", {
      searchQuery: this.searchQuery,
      pageIndex: this.pageIndex,
      pageSize: this.pageSize,
    });
  }

  ngOnInit(): void {
    this.getCookie();
  }

  searchQueryChanged() {
    this.pageIndex = 0;
    this.searchQuery = this.searchQueryCtrl.value;
    this.setCookie();
  }

  searchQueryClear() {
    this.pageIndex = 0;
    this.searchQueryCtrl.setValue('');
    this.searchQuery = '';
    this.setCookie();
  }

  onPageParamsChanged(params: any) {
    this.pageIndex = params.pageIndex;
    this.pageSize = params.pageSize;
    this.setCookie();
  }
}
