import { Component, OnInit } from '@angular/core';
import {debounceTime, distinctUntilChanged, finalize, switchMap, tap} from "rxjs";
import {FormControl} from "@angular/forms";
import {Supplier} from "../../../models/supplier.model";
import {ApiClient} from "../../../repo/httpClient";

@Component({
  selector: 'app-supplier-autocomplete',
  templateUrl: './supplier-autocomplete.component.html',
  styleUrls: ['./supplier-autocomplete.component.css']
})
export class SupplierAutocompleteComponent implements OnInit {

  searchSuppliersCtrl  = new FormControl<string | Supplier>('');
  supplierList:Supplier[];
  pC: any = {};

  constructor(
    public api: ApiClient,
  ) { }

  ngOnInit(): void {
    this.api.getSuppliers(this.pC?.searchQuery || "", 0 ,100, "SupplierName", "asc").subscribe( (r:any) => {
      this.supplierList = r.body.data
    });

    this.searchSuppliersCtrl.valueChanges.pipe(
      distinctUntilChanged(),
      debounceTime(300),
      tap(() => {
        //this.isLoading = true;
      }),
      switchMap(value => this.api.getSuppliers(value, 0 ,100,"SupplierName", "asc")
        .pipe(
          finalize(() => {
            //this.isLoading = false
          }),
        )
      )
    ).subscribe((data: any) => { this.supplierList = data.body.data; });
  }

  displayFn(supplier: Supplier): string {
    return supplier && supplier.supplierName ? supplier.supplierName : '';
  }

  onQueryChanged() {

  }

  onClearSupplierSelection() {
    this.searchSuppliersCtrl.setValue('');
    this.onQueryChanged();
  }
}
