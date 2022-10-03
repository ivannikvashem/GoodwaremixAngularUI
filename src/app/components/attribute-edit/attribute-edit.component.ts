import { Component, OnInit } from '@angular/core';
import {MatChipInputEvent} from "@angular/material/chips";
import {COMMA, ENTER} from "@angular/cdk/keycodes";
import {Attribute} from "../../models/attribute.model";
import {ApiClient} from "../../repo/httpClient";
import {ActivatedRoute, Router} from "@angular/router";
import {catchError, finalize, map} from "rxjs/operators";
import {BehaviorSubject, debounceTime, distinctUntilChanged, of, pipe, switchMap, tap} from "rxjs";
import {FormControl} from "@angular/forms";
import {Supplier} from "../../models/supplier.model";

interface AttributeType {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-attribute-edit',
  templateUrl: './attribute-edit.component.html',
  styleUrls: ['./attribute-edit.component.css']
})
export class AttributeEditComponent implements OnInit {

  searchSuppliersCtrl = new FormControl<string | Supplier>('');
  public supplierList: Supplier[] | undefined;
  private loadingSubject = new BehaviorSubject<boolean>(true);
  id: string | null | undefined;
  attribute: Attribute ;
  attrType: AttributeType[] = [
    {value: 'L', viewValue: 'Бинарный'},
    {value: 'N', viewValue: 'Числовой'},
    {value: 'R', viewValue: 'Числовой диапазон'},
    {value: 'A', viewValue: 'Текстовый'},
  ];

  constructor(
    public api: ApiClient,
    private _ActivatedRoute:ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.id = this._ActivatedRoute.snapshot.paramMap.get("id");
    if (this.id) {
      this.api.getAttributeById(this.id ?? "")
        .pipe(
          map(res => {
            //this.rowCount = res.body.count;
            return res.body;
          }),
          catchError(() => of([])),
          finalize(() => this.loadingSubject.next(false))
        )
        //.subscribe(data => this.AttributeSubject.next(data));
        .subscribe(data => {
          this.attribute = data;
          console.log(JSON.stringify(data));
        });
    }
    else {
      this.attribute = new Attribute()
      this.api.getSuppliers('', 0 ,100, "SupplierName", "asc").subscribe( (r:any) => {
        this.supplierList = r.body.data
      });
      this.searchSuppliersCtrl.valueChanges.pipe(
        distinctUntilChanged(),
        debounceTime(300),
        tap(() => {

        }),
        switchMap(value => this.api.getSuppliers(value, 0 ,100, "SupplierName", "asc")
          .pipe(
            finalize(() => {

            }),
          )
        )
      )
        .subscribe((data: any) => {
          this.supplierList = data.body.data;
        });
    }

  }

  addOnBlur = true;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    // Add our fruit
    const idx = this.attribute?.allValue?.indexOf(value);
    if (value && idx === -1 ) {
      this.attribute?.allValue?.push(value);
    }

    // Clear the input value
    event.chipInput!.clear();
  }

  remove(fruit: string): void {
    const index = this.attribute?.allValue?.indexOf(fruit);

    if (typeof(index) == "number" && index >= 0) {
      this.attribute?.allValue?.splice(index, 1);
    }
  }

  displayFn(supplier: Supplier): string {
    return supplier && supplier.supplierName ? supplier.supplierName : '';
  }

  onQueryChanged() {

  }

  saveAttribute() {
    if (!this.attribute.supplierId) {
      const supp = this.searchSuppliersCtrl.value as Supplier
      this.attribute.supplierId = supp.id
      this.attribute.supplierName = supp.supplierName
    }
    console.log('attr', this.attribute)
    this.api.updateAttribute(this.attribute).subscribe(x => {
      console.log('res', x)
    })
  }
}
