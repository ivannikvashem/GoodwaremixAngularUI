import {Component, Inject, OnInit} from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";
import {Supplier} from "../../../models/supplier.model";
import {BehaviorSubject} from "rxjs";
import {Attribute} from "../../../models/attribute.model";
import {ApiClient} from "../../../service/httpClient";
import {ActivatedRoute} from "@angular/router";
import {COMMA, ENTER} from "@angular/cdk/keycodes";
import {MatChipInputEvent} from "@angular/material/chips";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

interface AttributeType {
  value: string;
  viewValue: string;
}

export interface AttrDialogData {
  supplierName?: string;
  newAttribute?:Attribute;
}

@Component({
  selector: 'app-supplier-attribute-add',
  templateUrl: './supplier-attribute-add.component.html',
  styleUrls: ['./supplier-attribute-add.component.css']
})
export class SupplierAttributeAddComponent implements OnInit {

  addOnBlur = true;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  searchSuppliersCtrl = new FormControl<string | Supplier>('');
  public supplierList: Supplier[] | undefined;
  private loadingSubject = new BehaviorSubject<boolean>(true);
  id: string | null | undefined;
  form:FormGroup
  attribute: Attribute = new Attribute();
  attrType: AttributeType[] = [
    {value: 'L', viewValue: 'Бинарный'},
    {value: 'N', viewValue: 'Числовой'},
    {value: 'R', viewValue: 'Числовой диапазон'},
    {value: 'A', viewValue: 'Текстовый'},
  ];

  constructor(
    public api: ApiClient,
    private _ActivatedRoute:ActivatedRoute,
    public dialogRef: MatDialogRef<SupplierAttributeAddComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: AttrDialogData
  ) {}

  ngOnInit(): void {
      this.attribute = new Attribute()
      this.attribute.rating = 0;
  }

  addPossibleValue(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    const idx = this.attribute?.allValues?.indexOf(value);
    if (value && idx === -1 ) {
      this.attribute?.allValues?.push(value);
    }
    event.chipInput!.clear();
  }

  removePossibleValue(value: string): void {
    const index = this.attribute?.allValues?.indexOf(value);
    if (typeof(index) == "number" && index >= 0) {
      this.attribute?.allValues?.splice(index, 1);
    }
  }

  addPossibleName(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    const idx = this.attribute?.altValues?.indexOf(value);
    if (value && idx === -1 ) {
      this.attribute?.altValues?.push(value);
    }
    event.chipInput!.clear();
  }

  removePossibleName(value: string): void {
    const index = this.attribute?.altValues?.indexOf(value);
    if (typeof(index) == "number" && index >= 0) {
      this.attribute?.altValues?.splice(index, 1);
    }
  }

  displayFn(supplier: Supplier): string {
    return supplier && supplier.supplierName ? supplier.supplierName : '';
  }

  saveAttribute() {
    this.data.newAttribute = this.attribute
    // if (!this.attribute.supplierId) {
    //   const supp = this.searchSuppliersCtrl.value as Supplier
    //   this.attribute.supplierId = supp.id
    //   this.attribute.supplierName = supp.supplierName
    // }
    // console.log('attr', this.attribute)
    // this.api.updateAttribute(this.attribute).subscribe(x => {
    //   console.log('res', x)
    // })
  }

  onCancelClick(): void {
    this.dialogRef.close();
  }

}
