import {Component, Inject, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {ApiClient} from "../../../repo/httpClient";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {Package} from "../../../models/package.model";
import {ProductDocumentEditComponent} from "../product-document-edit/product-document-edit.component";

export interface AttrDialogData {
  newPackage?: Package;
  oldPackage?:Package;
}

@Component({
  selector: 'app-product-package-edit',
  templateUrl: './product-package-edit.component.html',
  styleUrls: ['./product-package-edit.component.css']
})
export class ProductPackageEditComponent implements OnInit {
  form:FormGroup
  constructor(public api: ApiClient,
              public dialogRef: MatDialogRef<ProductDocumentEditComponent>,
              @Inject(MAT_DIALOG_DATA)
              public data: AttrDialogData) {
    this.form = new FormGroup<any>({
      "barcode": new FormControl<string>('', Validators.required),
      "type": new FormControl<string>(''),
      "height": new FormControl<number>(null),
      "width": new FormControl<number>(null),
      "depth": new FormControl<number>(null),
      "volume": new FormControl<number>(null),
      "weight": new FormControl<number>(null),
      "packQty": new FormControl<number>(null),
    })
  }

  ngOnInit(): void {
    if (this.data.oldPackage !== undefined) {
      this.form.get("barcode").setValue(this.data.oldPackage.barcode)
      this.form.get("type").setValue(this.data.oldPackage.type)
      this.form.get("height").setValue(this.data.oldPackage.height)
      this.form.get("width").setValue(this.data.oldPackage.width)
      this.form.get("depth").setValue(this.data.oldPackage.depth)
      this.form.get("volume").setValue(this.data.oldPackage.volume)
      this.form.get("weight").setValue(this.data.oldPackage.weight)
      this.form.get("packQty").setValue(this.data.oldPackage.packQty)
    }
  }

  onSubmitClick() {
    if (this.form.valid) {
      this.data.newPackage.barcode = this.form.get("barcode").value
      this.data.newPackage.type = this.form.get("type").value
      this.data.newPackage.height = this.form.get("height").value
      this.data.newPackage.width = this.form.get("width").value
      this.data.newPackage.depth = this.form.get("depth").value
      this.data.newPackage.volume = this.form.get("volume").value
      this.data.newPackage.weight = this.form.get("weight").value
      this.data.newPackage.packQty = this.form.get("packQty").value
    }
  }
  onCancelClick() {}
}
