import {Component, OnInit} from '@angular/core';
import {Supplier} from "../models/supplier.model";
import {FormControl} from "@angular/forms";
import {Subscription} from "rxjs";
import {DataStateService} from "../shared/data-state.service";
import {LocalStorageService} from "../service/local-storage.service";
import {ProductDocumentEditComponent} from "../product/product-document-edit/product-document-edit.component";
import {Document} from "../models/document.model";
import {MatDialog} from "@angular/material/dialog";

@Component({
  selector: 'app-document',
  templateUrl: './document.component.html',
  styleUrls: ['./document.component.css']
})
export class DocumentComponent implements OnInit {

  selectedSupplier: Supplier;
  searchQueryCtrl  = new FormControl<string>('');
  searchQuery:string = '';
  pageIndex:number = 0;
  pageSize:number = 12;
  sortDirection:string = 'desc'
  sortActive:string = 'endDate'
  isCardLayout: boolean = true;

  pageCookie$ = this._localStorageService.myData$
  pC: any = {};

  sortOptions =[
    { displayText: 'По умолчанию',  value: { active: null, direction: 'asc'} },
    { displayText: 'По сроку действия ↑', value: { active: 'endDate', direction: 'asc' } },
    { displayText: 'По сроку действия ↓', value: { active: 'endDate', direction: 'desc' } },
  ];
  selectedSort:any = this.sortOptions[0].value;

  private subscription: Subscription;

  constructor(private dss: DataStateService, private _localStorageService: LocalStorageService, public dialog: MatDialog) { }

  getCookie() {
    this._localStorageService.getDataByPageName("DocumentIndex")
    this.pageCookie$.subscribe(localStorageContent => {
      if (localStorageContent) {
        this.pC = localStorageContent;
        this.searchQueryCtrl.setValue(this.pC.searchQuery);
        this.searchQuery = this.pC.searchQuery
        this.pageIndex = this.pC.pageIndex
        this.pageSize = this.pC.pageSize
        this.sortDirection = this.pC.sortDirection;
        this.sortActive = this.pC.sortActive;
        this.selectedSort = this.sortOptions.find(x => x.value.active == this.pC.sortActive && x.value.direction == this.pC.sortDirection)?.value
      }
    });
  }

  setCookie() {
    this._localStorageService.setDataByPageName("DocumentIndex", {
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

  onSortParamsChanged(params: any) {
    this.sortActive = params.active;
    this.sortDirection = params.direction;
    this.setCookie();
  }

  onPageParamsChanged(params: any) {
    this.pageIndex = params.pageIndex;
    this.pageSize = params.pageSize;
    this.setCookie();
  }

  sortData() {
    this.sortActive = this.selectedSort.active;
    this.sortDirection = this.selectedSort.direction;
    this.setCookie();
  }

  addDocumentDialog() {
    this.dialog.open(ProductDocumentEditComponent, {
      width: '1050px',
      autoFocus: false,
      data: {oldDocument: new Document(), newDocument: new Document() },
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}

