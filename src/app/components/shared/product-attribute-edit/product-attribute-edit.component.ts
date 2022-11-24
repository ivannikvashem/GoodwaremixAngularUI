import {Component, Inject, OnInit} from '@angular/core';
import {ApiClient} from "../../../service/httpClient";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {Attribute} from "../../../models/attribute.model";
import {AttributeProduct} from "../../../models/attributeProduct.model";
import {FormControl, Validators} from "@angular/forms";
import {debounceTime, distinctUntilChanged, finalize, Observable, startWith, switchMap, tap} from "rxjs";
import {map} from "rxjs/operators";

export interface AttrDialogData {
  newAttribute?: AttributeProduct;
  oldAttribute?:AttributeProduct;
}

@Component({
  selector: 'app-product-attribute-edit',
  templateUrl: './product-attribute-edit.component.html',
  styleUrls: ['./product-attribute-edit.component.css']
})
export class ProductAttributeEditComponent implements OnInit {

  attributeProduct: Attribute = new Attribute();
  attributeValues: string[] = [];
  filteredAttributeValues: Observable<string[]>;
  attributesList: Attribute[] = [];
  searchAttributeCtrl = new FormControl<string | Attribute>('', Validators.required);
  attributeValuesCtrl = new FormControl<string>('', Validators.required);

  constructor(public api: ApiClient,
              public dialogRef: MatDialogRef<ProductAttributeEditComponent>,
              @Inject(MAT_DIALOG_DATA)
              public data: AttrDialogData) { }

  ngOnInit(): void {
    if (this.data.oldAttribute !== undefined) {
      this.api.getAttributeById(this.data.oldAttribute.attributeId).subscribe((response) => {
        if (response.status == 200) {
          this.attributeProduct = response.body;
          this.searchAttributeCtrl.setValue(this.attributeProduct);
          this.attributeValuesCtrl.setValue(this.data.oldAttribute.value);
          this.attributeValues = this.attributeProduct.allValue
          this.filteredAttributeValues = this.attributeValuesCtrl.valueChanges.pipe(
            startWith(''),
            map(value => this._filter(value)),
          );
        }
      });
    }

    this.searchAttributeCtrl.valueChanges.pipe(
      distinctUntilChanged(),
      debounceTime(100),
      tap(() => {
        // this.isLoading = true;
      }),
      switchMap(value => this.api.getAttributes(value, '' ,0, 10, undefined, "Rating", "desc")
        .pipe(
          finalize(() => {
            //this.isLoading = false
          }),
        )
      )
    ).subscribe((response: any) => { this.attributesList = response.body.data; });
  }
  onCancelClick(): void {
    this.dialogRef.close();
  }


  displayFn(attribute: Attribute): string {
    return attribute && attribute.nameAttribute ? attribute.nameAttribute : '';
  }

  onAttributeKeySelected() {
    let selectedAttribute = this.searchAttributeCtrl.value as Attribute;
    this.filteredAttributeValues = this.attributeValuesCtrl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value)),
    );

    this.attributeValues = selectedAttribute.allValue
    this.data.newAttribute.attributeId = selectedAttribute.id
    this.data.newAttribute.attributeName = selectedAttribute.nameAttribute
    this.data.newAttribute.etimFeature = selectedAttribute.etimFeature
    this.data.newAttribute.etimUnit = selectedAttribute.etimUnit
    this.data.newAttribute.unit = selectedAttribute.unit
    this.data.newAttribute.value = this.attributeValuesCtrl.value as string;
  }

  onAttributeValueSelected() {
    this.onAttributeKeySelected()
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.attributeValues.filter(attributeValues => attributeValues.toLowerCase().includes(filterValue));
  }

  submitForm() {
    this.data.newAttribute.value = this.attributeValuesCtrl.value
  }
}
