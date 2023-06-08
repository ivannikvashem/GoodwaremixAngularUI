import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {DataStateService} from "../shared/data-state.service";
import {Supplier} from "../models/supplier.model";
import {FormControl} from "@angular/forms";
import {LocalStorageService} from "../service/local-storage.service";
import {Subscription} from "rxjs";
import {MatDialog} from "@angular/material/dialog";
import {AttributeFilterComponent, SelectedFilterAttributes} from "./attribute-filter/attribute-filter.component";
import {SelectedFiltersList} from "./repo/ProductsDataSource";


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
  sortDirection:string;
  sortActive:string = null;

  //About to be deprecated
  cardLayout:boolean = true;

  filterAttribute:SelectedFiltersList = new SelectedFiltersList()

  pageCookie$ = this._localStorageService.myData$;
  pC: any = {};
  withICFilter: boolean = false;

  sortOptions =[
    { displayText: 'По умолчанию',  value: { active: null, direction: 'asc'} },
    { displayText: 'По названию ↑', value: { active: 'title', direction: 'asc' } },
    { displayText: 'По названию ↓', value: { active: 'title', direction: 'desc' } },
    { displayText: 'По vendorId ↑', value: { active: 'vendorId', direction: 'asc' } },
    { displayText: 'По vendorId ↓', value: { active: 'vendorId', direction: 'desc' } },
    { displayText: 'По артикулу ↑', value: { active: 'internalCode', direction: 'asc' } },
    { displayText: 'По артикулу ↓', value: { active: 'internalCode', direction: 'desc' } },
  ];
  selectedSort:any = this.sortOptions[0].value;

  private subscription: Subscription;

  constructor(
    private _ActivatedRoute:ActivatedRoute,
    private dss: DataStateService,
    private _localStorageService: LocalStorageService,
    public dialog: MatDialog) { }

  getCookie() {
    this._localStorageService.getDataByPageName("ProductIndex")
    this.pageCookie$.subscribe(localStorageContent => {
      if (localStorageContent) {
        this.pC = localStorageContent;
        this.searchQueryCtrl.setValue(this.pC.searchQuery);
        this.searchQuery = this.pC.searchQuery;
        this.pageIndex = this.pC.pageIndex;
        this.pageSize = this.pC.pageSize;
        this.withICFilter = this.pC.withInternalCodeSelector;
        //this.filterAttribute = this.pC.filterAttribute;
      }
    });
  }

  setCookie() {
    this._localStorageService.setDataByPageName("ProductIndex", {
      searchQuery: this.searchQuery,
      pageIndex: this.pageIndex,
      pageSize: this.pageSize,
      withInternalCodeSelector: this.withICFilter,
      filterAttribute: this.filterAttribute != undefined ? this.filterAttribute : null
    });
  }

  ngOnInit(): void {
    this.getCookie();
    this.subscription = this.dss.selectedSupplierState.subscribe(
      supplier => {
        this.selectedSupplier = supplier;
        if (supplier) {
          this.pageIndex = 0;
        }
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

  sortData() {
    this.sortActive = this.selectedSort.active;
    this.sortDirection = this.selectedSort.direction;
  }

  attributeFilter() {
    const dialogRef = this.dialog.open(AttributeFilterComponent, {
      width: '900px',
      data: {filter: this.filterAttribute},
      autoFocus:false
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(result)
      if (result) {
        this.filterAttribute = result;
      } else {
        this.filterAttribute = new SelectedFiltersList();
      }
      this.setCookie();
    });
  }
}
