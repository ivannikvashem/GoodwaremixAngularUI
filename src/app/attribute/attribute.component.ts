import { Component, OnInit } from '@angular/core';
import {DataStateService} from "../shared/data-state.service";
import {Supplier} from "../models/supplier.model";
import {FormControl} from "@angular/forms";
import {Subscription, take} from "rxjs";
import {LocalStorageService} from "../service/local-storage.service";

@Component({
  selector: 'app-attribute',
  templateUrl: './attribute.component.html',
  styleUrls: ['./attribute.component.scss']
})
export class AttributeComponent implements OnInit {

  selectedSupplier: Supplier;
  searchQueryCtrl  = new FormControl<string>('');
  searchQuery: string = '';
  attributeFixedFilterState: boolean | null = null;

  pageIndex:number = 0;
  pageSize:number = 12;
  sortDirection:string = 'asc';
  sortActive:string = 'rating';

  pageCookie$ = this._localStorageService.myData$
  pC: any = {};

  private subscription: Subscription;

  constructor(private dss: DataStateService, private _localStorageService: LocalStorageService) { }

  getCookie() {
    this._localStorageService.getDataByPageName("AttributeIndex")
    this.pageCookie$.pipe(take(1)).subscribe(localStorageContent => {
      if (localStorageContent) {
        this.pC = localStorageContent;
        this.searchQueryCtrl.setValue(this.pC.searchQuery);
        this.searchQuery = this.pC.searchQuery;
        this.attributeFixedFilterState = this.pC.attributeFixedFilterState;
        this.pageIndex = this.pC.pageIndex;
        this.pageSize = this.pC.pageSize;
        this.sortDirection = this.pC.sortDirection;
        this.sortActive = this.pC.sortActive;
      }
    });
  }

  setCookie() {
    this._localStorageService.setDataByPageName("AttributeIndex", {
      searchQuery: this.searchQuery,
      pageIndex: this.pageIndex,
      pageSize: this.pageSize,
      attributeFixedFilterState: this.attributeFixedFilterState,
      sortDirection: this.sortDirection,
      sortActive: this.sortActive
    });
  }

  ngOnInit(): void {
    this.getCookie();
    this.subscription = this.dss.getSelectedSupplier().subscribe((supplier:Supplier) => {
        this.selectedSupplier = supplier;
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
