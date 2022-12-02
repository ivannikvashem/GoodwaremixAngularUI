import { Component, OnInit } from '@angular/core';
import {DatastateService} from "../shared/datastate.service";
import {Supplier} from "../models/supplier.model";
import {FormControl} from "@angular/forms";

@Component({
  selector: 'app-attribute',
  templateUrl: './attribute.component.html',
  styleUrls: ['./attribute.component.css']
})
export class AttributeComponent implements OnInit {

  pageTitle:string = 'AttributeIndex'
  selectedSupplier: Supplier;
  searchQueryCtrl  = new FormControl<string>('');
  withFixedAttrSelectorCtrl = new FormControl<boolean | null>(null);
  searchQuery:string = ''
  constructor(private dss: DatastateService) { }

  ngOnInit(): void {
    this.dss.selectedSupplierState.subscribe(x => {
      this.selectedSupplier = x;
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

  onQueryChanged() {

  }
}
