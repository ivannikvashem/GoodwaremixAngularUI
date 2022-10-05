import {Component, Inject, OnInit} from '@angular/core';
import {ApiClient} from "../../../repo/httpClient";
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
  selector: 'app-attribute-editor',
  templateUrl: './attribute-editor.component.html',
  styleUrls: ['./attribute-editor.component.css']
})
export class AttributeEditorComponent implements OnInit {

  attributeProduct: Attribute = new Attribute();
  attributeValues: string[] = [];
  filteredAttributeValues: Observable<string[]>;
  attributesList: Attribute[] = [];
  searchAttributeCtrl = new FormControl<string | Attribute>('', Validators.required);
  attributeValuesCtrl = new FormControl<string>('', Validators.required);

  constructor(public api: ApiClient,
              public dialogRef: MatDialogRef<AttributeEditorComponent>,
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
    )
      .subscribe((response: any) => {
        this.attributesList = response.body.data;
      });


  }
  onCancelClick(): void {
    this.dialogRef.close();
  }

  displayFn(attribute: Attribute): string {
    //return attribute ? attribute.nameAttribute:
    //return typeof attribute !== 'string' ? attribute.nameAttribute : attribute
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
  }

  onAttributeValueSelected() {
    this.onAttributeKeySelected()
    this.data.newAttribute.value = this.attributeValuesCtrl.value as string;
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.attributeValues.filter(attributeValues => attributeValues.toLowerCase().includes(filterValue));
  }

}
