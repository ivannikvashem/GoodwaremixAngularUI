import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {DataStateService} from "../shared/data-state.service";
import {Supplier} from "../models/supplier.model";
import {FormControl} from "@angular/forms";
import {LocalStorageService} from "../service/local-storage.service";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {
  selectedSupplier: Supplier;
  searchQueryCtrl  = new FormControl<string>(null);
  searchQuery:string = '';
  pageIndex:number = 0;
  pageSize:number = 10;

  pageCookie$ = this._localStorageService.myData$;
  pC: any = {};
  withICFilter: boolean = false;

  private subscription: Subscription;

  constructor(
    private _ActivatedRoute:ActivatedRoute,
    private dss: DataStateService,
    private _localStorageService: LocalStorageService,
  ) { }

  getCookie() {
    this._localStorageService.getDataByPageName("ProductIndex")
    this.pageCookie$.subscribe(localStorageContent => {
      if (localStorageContent) {
        this.pC = localStorageContent;
        this.searchQueryCtrl.setValue(this.pC.searchQuery);
        this.searchQuery = this.pC.searchQuery;
        this.withICFilter = this.pC.withInternalCodeSelector;
        this.pageIndex = this.pC.pageIndex;
        this.pageSize = this.pC.pageSize;
      }
    });
  }

  setCookie() {
    this._localStorageService.setDataByPageName("ProductIndex", {
      searchQuery: this.searchQuery,
      withInternalCodeSelector: this.withICFilter,
      pageIndex: this.pageIndex,
      pageSize: this.pageSize
    });
  }

  ngOnInit(): void {
    this.getCookie();
    this.subscription = this.dss.selectedSupplierState.subscribe(
      supplier => {
        console.log('sup from dss', supplier)
        this.selectedSupplier = supplier;
        this.pageIndex = 0;
        this.setCookie();
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

  onICFilterChanged(icFilterState: boolean) {
    this.pageIndex = 0;
    this.withICFilter = icFilterState;
    this.setCookie();
  }

  onPageParamsChanged(params: any) {
    this.pageIndex = params.pageIndex;
    this.pageSize = params.pageSize;
    this.setCookie();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
