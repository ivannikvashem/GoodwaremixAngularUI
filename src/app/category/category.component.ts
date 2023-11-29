import { Component, OnInit } from '@angular/core';
import {Supplier} from "../models/supplier.model";
import {FormControl} from "@angular/forms";
import {DataStateService} from "../shared/data-state.service";
import {LocalStorageService} from "../service/local-storage.service";
import {MatDialog} from "@angular/material/dialog";
import {Subscription} from "rxjs";
import {CategoryEditComponent} from "./category-edit/category-edit.component";
import {Category} from "../models/category.model";

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {

  selectedSupplier: Supplier;
  searchQueryCtrl  = new FormControl<string>('');
  searchQuery:string = '';
  pageIndex:number = 0;
  pageSize:number = 12;
  sortDirection:string = 'desc'
  sortActive:string = 'endDate'

  pageCookie$ = this._localStorageService.myData$
  pC: any = {};

  private subscription: Subscription;

  constructor(private dss: DataStateService, private _localStorageService: LocalStorageService, public dialog: MatDialog) { }

  getCookie() {
    this._localStorageService.getDataByPageName("CategoryIndex")
    this.pageCookie$.subscribe(localStorageContent => {
      if (localStorageContent) {
        this.pC = localStorageContent;
        this.searchQueryCtrl.setValue(this.pC.searchQuery);
        this.searchQuery = this.pC.searchQuery
        this.pageIndex = this.pC.pageIndex
        this.pageSize = this.pC.pageSize
        this.sortDirection = this.pC.sortDirection;
        this.sortActive = this.pC.sortActive;
      }
    });
  }

  setCookie() {
    this._localStorageService.setDataByPageName("CategoryIndex", {
      searchQuery: this.searchQuery,
      pageIndex: this.pageIndex,
      pageSize: this.pageSize,
      sortDirection: this.sortDirection,
      sortActive: this.sortActive,
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

  onPageParamsChanged(params: any) {
    this.pageIndex = params.pageIndex;
    this.pageSize = params.pageSize;
    this.setCookie();
  }

  addCategoryDialog() {
    this.dialog.open(CategoryEditComponent, {
      autoFocus: false,
      data: {oldCategory: new Category(), newCategory: new Category() },
    });
  }
}
