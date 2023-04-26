import { Component, OnInit } from '@angular/core';
import {FormControl} from "@angular/forms";
import {Supplier} from "../models/supplier.model";
import {DataStateService} from "../shared/data-state.service";
import {LocalStorageService} from "../service/local-storage.service";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-supplier',
  templateUrl: './supplier.component.html',
  styleUrls: ['./supplier.component.css']
})
export class SupplierComponent implements OnInit {

  selectedSupplier: Supplier;
  searchQueryCtrl  = new FormControl<string>(null);
  searchQuery:string = '';
  pageIndex:number = 0;
  pageSize:number = 10;
  sortDirection:string = 'asc'
  sortActive:string = 'supplierName'

  pageCookie$ = this._localStorageService.myData$;
  pC: any = {};
  private subscription: Subscription;

  constructor(private dss: DataStateService, private _localStorageService: LocalStorageService,) { }

  getCookie() {
    this._localStorageService.getDataByPageName("SupplierIndex")
    this.pageCookie$.subscribe(localStorageContent => {
      if (localStorageContent) {
        this.pC = localStorageContent;
        this.searchQueryCtrl.setValue(this.pC.searchQuery);
        this.searchQuery = this.pC.searchQuery;
        this.pageIndex = this.pC.pageIndex;
        this.pageSize = this.pC.pageSize;
        this.sortDirection = this.pC.sortDirection;
        this.sortActive = this.pC.sortActive;
      }
    });
  }

  setCookie() {
    this._localStorageService.setDataByPageName("SupplierIndex", {
      searchQuery: this.searchQuery,
      pageIndex: this.pageIndex,
      pageSize: this.pageSize,
      sortDirection: this.sortDirection,
      sortActive: this.sortActive,
    });
  }

  ngOnInit(): void {
    this.getCookie();
    this.subscription = this.dss.selectedSupplierState.subscribe(
      supplier => {
        this.selectedSupplier = supplier;
      }
    )
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

  onSortParamsChanged(params: any) {
    this.sortActive = params.active;
    this.sortDirection = params.direction;
    this.setCookie();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
