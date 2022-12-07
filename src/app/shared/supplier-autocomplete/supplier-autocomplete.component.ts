import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {debounceTime, distinctUntilChanged, finalize, Subscription, switchMap, tap} from "rxjs";
import {FormControl} from "@angular/forms";
import {Supplier} from "../../models/supplier.model";
import {ApiClient} from "../../service/httpClient";
import {DatastateService} from "../datastate.service";
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
  @Input() cookieSupplier:Supplier
  pageCookie$ = this._localStorageService.myData$
  pC: any = {};

  private subscription: Subscription;

  constructor(public api: ApiClient,
              public dss: DatastateService,
              private _localStorageService:LocalStorageService
  ) {}

  ngOnInit(): void {
    this.getCookie()
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
    let supp = this.searchSuppliersCtrl.value as Supplier
    this.selectedSupplier.emit(({id:supp.id, supplierName:supp.supplierName}) as Supplier);
    this.dss.selectedSupplierState.next(({id:supp.id, supplierName:supp.supplierName}) as Supplier)
    this.setCookie({id:supp.id, supplierName:supp.supplierName} as Supplier)
  }

  onClearSupplierSelection() {
    this.searchSuppliersCtrl.setValue('');
    this.onSupplierSelected();
  }

  setCookie(supplier:Supplier) {
    this._localStorageService.setDataByPageName('SelectedSupplier', {
      supplier:supplier
    });
  }

  getCookie() {
    this._localStorageService.getDataByPageName('SelectedSupplier');
    this.subscription = this.pageCookie$.subscribe(x => {
      if (!x) return;
      this.pC = x;
      this.cookieSupplier = this.pC.supplier
      this.dss.setSelectedSupplier(this.pC.supplier?.id,this.pC.supplier?.supplierName)
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
