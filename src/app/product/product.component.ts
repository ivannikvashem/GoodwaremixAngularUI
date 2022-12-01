import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {DatastateService} from "../shared/datastate.service";
import {Supplier} from "../models/supplier.model";
import {FormControl} from "@angular/forms";

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {

  selectedSupplier: Supplier;
  searchQueryCtrl  = new FormControl<string>('');
  withInternalCodeCtrl  = new FormControl<boolean>(false);

  constructor(
    private _ActivatedRoute:ActivatedRoute,
    private dss: DatastateService
  ) { }

  ngOnInit(): void {
    this.dss.selectedSupplierState.subscribe(
      supplier => {
        this.selectedSupplier = supplier
      }
    );
    this._ActivatedRoute.queryParams.subscribe(params => {
      let supplierId = params['supplierId'];
      if (supplierId) {
        console.warn("Got q param: " + supplierId );
        this.dss.setSelectedSupplier(supplierId);
      }
    });
  }

  handleChangeSelectedSupplier(supplier: Supplier) {
    this.dss.setSelectedSupplier(supplier)
  }
}
