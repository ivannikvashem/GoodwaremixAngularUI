import { Component, OnInit } from '@angular/core';
import {FormControl} from "@angular/forms";
import {Supplier} from "../../models/supplier.model";

@Component({
  selector: 'app-product-edit',
  templateUrl: './product-edit.component.html',
  styleUrls: ['./product-edit.component.css']
})
export class ProductEditComponent implements OnInit {

  searchSuppliersCtrl = new FormControl<string | Supplier>('');
  public supplierList: Supplier[];  // public filteredSupplierList: Observable<Supplier[]> | undefined;
  selectedSupplier: Supplier;


  constructor() { }

  ngOnInit(): void {

  }

  onSupplierSelected() {
    //console.log("ctrlVal= " + JSON.stringify(this.searchSuppliersCtrl.value));
    this.selectedSupplier = this.searchSuppliersCtrl.value as Supplier;
    console.log("suppId= " + this.selectedSupplier?.id);
  }

  onClearSupplierSelection() {
    this.selectedSupplier=undefined;
    this.searchSuppliersCtrl.setValue('');
  }

  displayFn(supplier: Supplier): string {
    return supplier && supplier.supplierName ? supplier.supplierName : '';
  }

}
