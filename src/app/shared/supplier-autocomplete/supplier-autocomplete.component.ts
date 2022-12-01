import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {debounceTime, distinctUntilChanged, finalize, switchMap, tap} from "rxjs";
import {FormControl} from "@angular/forms";
import {Supplier} from "../../models/supplier.model";
import {ApiClient} from "../../service/httpClient";
import {DatastateService} from "../datastate.service";

@Component({
  selector: 'app-supplier-autocomplete',
  templateUrl: './supplier-autocomplete.component.html',
  styleUrls: ['./supplier-autocomplete.component.css']
})
export class SupplierAutocompleteComponent implements OnInit {

  searchSuppliersCtrl  = new FormControl<string | Supplier>('');
  supplierList:Supplier[];
  @Output() selectedSupplier = new EventEmitter<Supplier>();
  @Input() cookieSupplier:Supplier

  constructor(public api: ApiClient,
              public dss: DatastateService
  ) {}

  ngOnInit(): void {
    this.cookieSupplier = this.dss.selectedSupplierState.value

    if (this.cookieSupplier !== undefined && this.cookieSupplier.id !== undefined) {
      this.api.getSupplierById(this.cookieSupplier.id).subscribe( s => {
        this.searchSuppliersCtrl.setValue(s.body as Supplier);
      })
    }
    this.api.getSuppliers(this.searchSuppliersCtrl.value, 0 ,100, "SupplierName", "asc").subscribe( (r:any) => {
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

  onSupplierSelected() {
    this.selectedSupplier.emit((this.searchSuppliersCtrl.value) as Supplier);
    this.dss.selectedSupplierState.next((this.searchSuppliersCtrl.value) as Supplier)
  }

  onClearSupplierSelection() {
    this.searchSuppliersCtrl.setValue('');
    this.onSupplierSelected();
  }
}
