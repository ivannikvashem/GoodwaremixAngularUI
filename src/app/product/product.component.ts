import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {DatastateService} from "../shared/datastate.service";
import {Supplier} from "../models/supplier.model";
import {FormControl} from "@angular/forms";
import {LocalStorageService} from "../service/local-storage.service";

class PageCookieProductIndex {
  pageIndex: number = 1;
  pageSize: number = 10;
  searchQuery: string = "";
  withInternalCodeSelector: boolean = false;
  supplier: Supplier;

  constructor() {
    this.supplier = new Supplier()
  }
}

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {

  pageTitle:string = 'ProductIndex'
  selectedSupplier: Supplier;
  searchQueryCtrl  = new FormControl<string>('');
  searchQuery:string = ''
  withInternalCodeCtrl  = new FormControl<boolean>(false);

  pageCookie$ = this._localStorageService.myData$
  pC: any = {};

  constructor(
    private _ActivatedRoute:ActivatedRoute,
    private dss: DatastateService,
    private _localStorageService: LocalStorageService
  ) { }

  getCookie() {
    //try to get cookie, if there's no cookie - make the blank and save
    this._localStorageService.getDataByPageName(this.pageTitle) as PageCookieProductIndex; //pretty wrong, upd data
    /*this.sub = */this.pageCookie$.subscribe(x => {
      if (x !== undefined) return;
      console.log(x)
      this.pC = x;
      this.searchQueryCtrl.setValue(this.pC.searchQuery);
      this.searchQuery = this.pC.searchQuery
      this.withInternalCodeCtrl.setValue(this.pC.withInternalCodeSelector);
    });
  }


  ngOnInit(): void {
    this.getCookie()
    this.dss.selectedSupplierState.subscribe(
      supplier => {
        this.selectedSupplier = supplier
      }
    );
    this._ActivatedRoute.queryParams.subscribe(params => {
      let supplierId = params['supplierId'];
      if (supplierId) {
        console.warn("Got q param: " + supplierId );
        this.dss.setSelectedSupplier(supplierId, null);
      }
    });
  }

  handleChangeSelectedSupplier(supplier: Supplier) {
    this.dss.setSelectedSupplier(supplier.id, supplier.supplierName)
  }

  searchQueryChanged() {
    this.searchQuery = this.searchQueryCtrl.value
  }

  searchQueryClear() {
    this.searchQueryCtrl.setValue('');
    this.searchQuery = ''
  }
}
