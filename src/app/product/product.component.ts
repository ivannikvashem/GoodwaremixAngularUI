import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {DatastateService} from "../shared/datastate.service";
import {Supplier} from "../models/supplier.model";

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {

  selectedSupplier: Supplier;

  constructor(
    private _ActivatedRoute:ActivatedRoute,
    private dss: DatastateService
  ) { }

  ngOnInit(): void {
    this.dss.selectedSupplierId.subscribe(
      id => {
        this.selectedSupplier = {
          id: id,
        } as Supplier;
      }
    );
    this._ActivatedRoute.queryParams.subscribe(params => {
      let supplierId = params['supplierId'];
      if (supplierId) {
        console.warn("Got q param: " + supplierId );
        this.dss.setSelectedSupplierId(supplierId);
      }
    });
  }
}
