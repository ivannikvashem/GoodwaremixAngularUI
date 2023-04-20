import { Component, OnInit } from '@angular/core';
import {DataStateService} from "../shared/data-state.service";
import {Supplier} from "../models/supplier.model";
import {FormControl} from "@angular/forms";
import {Subscription} from "rxjs";
import {LocalStorageService} from "../service/local-storage.service";

@Component({
  selector: 'app-attribute',
  templateUrl: './attribute.component.html',
  styleUrls: ['./attribute.component.css']
})
export class AttributeComponent implements OnInit {

  selectedSupplier: Supplier;
  searchQueryCtrl  = new FormControl<string>('');
  searchQuery: string = '';
  attributeFixedFilterState: boolean | null = null;

  pageIndex:number = 0;
  pageSize:number = 10;

  pageCookie$ = this._localStorageService.myData$
  pC: any = {};

  private subscription: Subscription;

  constructor(private dss: DataStateService, private _localStorageService: LocalStorageService) { }

  getCookie() {
    this._localStorageService.getDataByPageName("AttributeIndex")
    this.pageCookie$.subscribe(localStorageContent => {
      if (localStorageContent) {
        this.pC = localStorageContent;
        this.searchQueryCtrl.setValue(this.pC.searchQuery);
        this.searchQuery = this.pC.searchQuery
/*
        this.setValue(this.pC.withInternalCodeSelector);
*/
        this.attributeFixedFilterState = this.pC.attributeFixedFilterState
        this.pageIndex = this.pC.pageIndex
        this.pageSize = this.pC.pageSize
      }
    });
  }

  setCookie() {
    this._localStorageService.setDataByPageName("AttributeIndex", {
      searchQuery: this.searchQuery,
      attributeFixedFilterState: this.attributeFixedFilterState,
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

  handleChangeSelectedSupplier(supplier: Supplier) {
    this.dss.setSelectedSupplier(supplier.id, supplier.supplierName);
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

  onAttributeStateFilterChanged(attributeFilterState: boolean) {
    this.pageIndex = 0;
    this.attributeFixedFilterState = attributeFilterState;
    this.setCookie();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  onPageParamsChanged(params: any) {
    this.pageIndex = params.pageIndex;
    this.pageSize = params.pageSize;
    this.setCookie();
  }
}
