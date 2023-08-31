import {Component, Inject, OnInit} from '@angular/core';
import {ApiClient} from "../../service/httpClient";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {Attribute} from "../../models/attribute.model";
import {
  AttributeProduct, AttributeProductValueLogic, AttributeProductValueNumber, AttributeProductValueRange, AttributeProductValueText
} from "../../models/attributeProduct.model";
import {FormControl, Validators} from "@angular/forms";
import {debounceTime, distinctUntilChanged, finalize, Observable, startWith, switchMap, tap} from "rxjs";
import {map} from "rxjs/operators";
import {AuthService} from "../../auth/service/auth.service";

export interface AttrDialogData {
  newAttribute?: AttributeProduct;
  oldAttribute?:AttributeProduct;
  isValid:boolean;
}

@Component({
  selector: 'app-product-attribute-edit',
  templateUrl: './product-attribute-edit.component.html',
  styleUrls: ['./product-attribute-edit.component.css']
})
export class ProductAttributeEditComponent implements OnInit {

  selectedAttribute: Attribute;
  attributeValues: string[] = [];
  filteredAttributeValues: Observable<string[]>;
  attributesList: Attribute[] = [];
  searchAttributeCtrl = new FormControl<string | Attribute>(null, Validators.required);
  attributeValuesCtrl = new FormControl<string>(null, Validators.required);
  attributeValueRangeMin = new FormControl<number>(null, Validators.required);
  attributeValueRangeMax = new FormControl<number>(null, Validators.required);
  attributeValueLogic = new FormControl<boolean>(null, Validators.required);
  attributeValueNumber = new FormControl<number>(null, Validators.required);
  isOldAttributeLoading: boolean = false;

  roles: string[] = [];
  constructor(public api: ApiClient,
              public dialogRef: MatDialogRef<ProductAttributeEditComponent>,
              @Inject(MAT_DIALOG_DATA)
              public data: AttrDialogData, private auth: AuthService) {
    this.roles = this.auth.getRoles();
  }

  ngOnInit(): void {
    if (this.data.oldAttribute !== undefined) {
      this.isOldAttributeLoading = true;
      this.api.getAttributeById(this.data.oldAttribute.attributeId).pipe(
        tap(() => {
          this.isOldAttributeLoading = true
        }),
        finalize(() => this.isOldAttributeLoading = false)).subscribe((response) => {
        if (response.status == 200) {
          this.selectedAttribute = response.body;
          this.searchAttributeCtrl.setValue(this.selectedAttribute);
          if (this.data.isValid) {
            if (this.data.oldAttribute.type == 'N') {
              this.attributeValueNumber.setValue((this.data.oldAttribute.objectValue as AttributeProductValueNumber).value);
            } else if (this.data.oldAttribute.type == 'R') {
              this.attributeValueRangeMin.setValue((this.data.oldAttribute.objectValue as AttributeProductValueRange).minValue);
              this.attributeValueRangeMax.setValue((this.data.oldAttribute.objectValue as AttributeProductValueRange).maxValue);
            } else if (this.data.oldAttribute.type == 'L') {
              this.attributeValueLogic.setValue((this.data.oldAttribute.objectValue as AttributeProductValueLogic).value);
            } else {
              this.attributeValuesCtrl.setValue((this.data.oldAttribute.objectValue as AttributeProductValueText).value);
            }
          }

          this.attributeValues = this.selectedAttribute.allValues
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
      switchMap(value => this.api.getAttributes(value, '', 0, 100, undefined, "rating", "desc")
        .pipe(
          finalize(() => {
            //this.isLoading = false
          }),
        )
      )
    ).subscribe((response: any) => {
      this.attributesList = response.body.data;
    });
  }

  onCancelClick(): void {
    this.dialogRef.close();
  }


  displayFn(attribute: Attribute): string {
    return attribute && attribute.nameAttribute ? attribute.nameAttribute : '';
  }

  onAttributeKeySelected() {
    this.data.oldAttribute.type = (this.searchAttributeCtrl.value as Attribute).type;
    this.selectedAttribute = this.searchAttributeCtrl.value as Attribute;
    this.filteredAttributeValues = this.attributeValuesCtrl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value)),
    );
    this.attributeValues = this.selectedAttribute.allValues
  }

  onAttributeValueSelected() {
    this.onAttributeKeySelected()
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.attributeValues.filter(attributeValues => attributeValues.toLowerCase().includes(filterValue)).sort((a, b) => a.localeCompare(b, undefined, {
      numeric: true,
      sensitivity: 'base',
      ignorePunctuation: true
    }));
  }

  submitForm() {
    this.data.newAttribute.attributeId = this.selectedAttribute.id
    this.data.newAttribute.attributeName = this.selectedAttribute.nameAttribute
    this.data.newAttribute.etimFeature = this.selectedAttribute.etimFeature
    this.data.newAttribute.etimUnit = this.selectedAttribute.etimUnit
    this.data.newAttribute.type = this.selectedAttribute.type
    this.data.newAttribute.unit = this.selectedAttribute.unit
    if (this.data.newAttribute.type == 'R') {
      (this.data.newAttribute.objectValue as AttributeProductValueRange).minValue = this.attributeValueRangeMin.value;
      (this.data.newAttribute.objectValue as AttributeProductValueRange).maxValue = this.attributeValueRangeMax.value;
    }
    if (this.data.newAttribute.type == 'N')
      (this.data.newAttribute.objectValue as AttributeProductValueNumber).value = this.attributeValueNumber.value;
    if (this.data.newAttribute.type == 'L')
      (this.data.newAttribute.objectValue as AttributeProductValueLogic).value = this.attributeValueLogic.value;
    if (this.data.newAttribute.type == 'A')
      (this.data.newAttribute.objectValue as AttributeProductValueText).value = this.attributeValuesCtrl.value;
  }

  isFormValid() {
    return this.searchAttributeCtrl.valid && (this.attributeValuesCtrl.valid || this.attributeValueNumber.valid || this.attributeValueRangeMin.valid && this.attributeValueRangeMax.valid || this.attributeValueLogic.valid);
  }
}
