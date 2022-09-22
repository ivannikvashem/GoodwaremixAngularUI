import {Component, Inject, OnInit} from '@angular/core';
import {ApiClient} from "../../../repo/httpClient";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {Attribute} from "../../../models/attribute.model";
import {AttributeProduct} from "../../../models/attributeProduct.model";
import {FormControl} from "@angular/forms";
import {debounceTime, distinctUntilChanged, finalize, Observable, startWith, switchMap, tap} from "rxjs";
import {map} from "rxjs/operators";
import {Supplier} from "../../../models/supplier.model";

export interface AttrDialogData {
  newAttribute: Attribute;
  attributeId:string
  nameAttribute:string;
  attributeName:string;
  etimFeature:string;
  etimUnit:string;
  unit:string;
  value:string;
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
  attributesList: Attribute = new Attribute();
  searchAttributeCtrl = new FormControl<string | Attribute>('');
  attributeValuesCtrl = new FormControl<string>('');



  constructor(public api: ApiClient,
              public dialogRef: MatDialogRef<AttributeEditorComponent>,
              @Inject(MAT_DIALOG_DATA)
              public data: AttrDialogData) { }

  ngOnInit(): void {
    console.log('data', this.data)
    this.api.getAttributeById(this.data.attributeId).subscribe((response) => {
      this.attributeProduct = response.body.data;
      this.searchAttributeCtrl.setValue(response.body.data as Attribute);

    });

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
    if (this.attributeProduct) {
      this.searchAttributeCtrl.setValue(this.attributeProduct as Attribute)
    }
    if (this.data?.nameAttribute) {
      this.onAttributeValueSelected()
    }
    let selectedAttribute = this.searchAttributeCtrl.value as Attribute;

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
    this.filteredAttributeValues =this.attributeValuesCtrl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value)),
    );
    this.attributeValues = selectedAttribute.allValue

    this.data.attributeId = selectedAttribute.id
    this.data.nameAttribute = selectedAttribute.nameAttribute
    this.data.etimFeature = selectedAttribute.etimFeature
    this.data.etimUnit = selectedAttribute.etimUnit
    this.data.unit = selectedAttribute.unit

  }

  onAttributeValueSelected() {
    this.data.value = this.attributeValuesCtrl.value as string;
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.attributeValues.filter(attributeValues => attributeValues.toLowerCase().includes(filterValue));
  }
}
