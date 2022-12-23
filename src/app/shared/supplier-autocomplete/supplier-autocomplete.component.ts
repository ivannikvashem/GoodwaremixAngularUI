import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {debounceTime, distinctUntilChanged, finalize, Subscription, switchMap, tap} from "rxjs";
import {FormControl} from "@angular/forms";
import {Supplier} from "../../models/supplier.model";
import {ApiClient} from "../../service/httpClient";
import {DataStateService} from "../data-state.service";
import {LocalStorageService} from "../../service/local-storage.service";

@Component({
  selector: 'app-supplier-autocomplete',
  templateUrl: './supplier-autocomplete.component.html',
  styleUrls: ['./supplier-autocomplete.component.css']
})
export class SupplierAutocompleteComponent implements OnInit {

  searchSuppliersCtrl  = new FormControl<string | Supplier>('');
  supplierList:Supplier[];
  @Output() selectedSupplier = new EventEmitter<Supplier>();

  private subscription: Subscription;

  constructor(public api: ApiClient,
              public dss: DataStateService,
              private _localStorageService:LocalStorageService
  ) {}

  ngOnInit(): void {

    this.subscription = this.dss.selectedSupplierState.subscribe(
      (supplier: Supplier) => {
        this.searchSuppliersCtrl.setValue(supplier);
      }
    )

    this.api.getSuppliers("", 0 ,100, "SupplierName", "asc").subscribe( (r:any) => {
      this.supplierList = r.body.data
      if (this.supplierList.length == 1) {
        this.searchSuppliersCtrl.setValue(this.supplierList[0])
      }
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
    let supp = this.searchSuppliersCtrl.value as Supplier
    if (supp.supplierName && supp.id) {
      this.selectedSupplier.emit(({id:supp.id, supplierName:supp.supplierName}) as Supplier);
      this.dss.selectedSupplierState.next(({id:supp.id, supplierName:supp.supplierName}) as Supplier)
    } else {
      this.selectedSupplier.emit(new Supplier());
      this.dss.selectedSupplierState.next(new Supplier())
    }
  }

  onClearSupplierSelection() {
    this.searchSuppliersCtrl.setValue('');
    this.onSupplierSelected();
    console.log(this.searchSuppliersCtrl.value)
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
