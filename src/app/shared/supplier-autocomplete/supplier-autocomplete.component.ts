import {Component, EventEmitter, Injectable, OnInit, Output} from '@angular/core';
import {Subscription} from "rxjs";
import {FormControl} from "@angular/forms";
import {Supplier} from "../../models/supplier.model";
import {ApiClient} from "../../service/httpClient";
import {DataStateService} from "../data-state.service";
import {LocalStorageService} from "../../service/local-storage.service";
@Injectable({
  providedIn: 'root'
})
@Component({
  selector: 'app-supplier-autocomplete',
  templateUrl: './supplier-autocomplete.component.html',
  styleUrls: ['./supplier-autocomplete.component.css']
})
export class SupplierAutocompleteComponent implements OnInit {

  searchSuppliersCtrl  = new FormControl<string | Supplier>('');
  supplierList:Supplier[] = [];
  @Output() selectedSupplier = new EventEmitter<Supplier>();
  private subscription: Subscription;

  constructor(public api: ApiClient,
              public dss: DataStateService,
              private _localStorageService:LocalStorageService
  ) {}

  ngOnInit(): void {
    this.subscription = this.dss.getSelectedSupplier().subscribe((supplier: Supplier) => {
        this.searchSuppliersCtrl.setValue(supplier);
      }
    )

    if (this.dss.getSupplierList().length == 0) {
      this.api.getSuppliers("", 0 ,100, "supplierName", "asc").subscribe( (r:any) => {
        this.supplierList = r.body.data
        if (this.supplierList.length == 1) {
          this.searchSuppliersCtrl.setValue(this.supplierList[0])
          this.onSupplierSelected();
        }
        this.dss.setSupplierList(this.supplierList)
      });
    } else {
      this.supplierList = this.dss.getSupplierList();
    }
  }

  displayFn(supplier: Supplier): string {
    return supplier && supplier.supplierName ? supplier.supplierName : '';
  }

  onSupplierSelected() {
    let supp = this.searchSuppliersCtrl.value as Supplier
    if (supp.supplierName && supp.id) {
      this.selectedSupplier.emit(({id:supp.id, supplierName:supp.supplierName}) as Supplier);
      this.dss.getSelectedSupplier().next(({id:supp.id, supplierName:supp.supplierName}) as Supplier)
    } else {
      this.selectedSupplier.emit(new Supplier());
      this.dss.getSelectedSupplier().next(new Supplier())
    }
  }

  onClearSupplierSelection() {
    this.searchSuppliersCtrl.setValue('');
    this.onSupplierSelected();
  }

  onDestroy() {
    this.subscription.unsubscribe();
  }

  keyPressValidation($event: KeyboardEvent) {
    if (/[a-zA-Z0-9а-яА-Я ]/.test($event.key)){
      return true
    } else {
      $event.preventDefault()
      return false
    }
  }

  searchFilter(supplierList: Supplier[], search:string) {
    return supplierList.filter(option => option.supplierName.toLowerCase().includes(search.toLowerCase()));
  }
}
