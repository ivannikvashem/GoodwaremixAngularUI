import {Component, Inject, OnInit} from '@angular/core';
import {Attribute} from "../../../models/attribute.model";
import {debounceTime, distinctUntilChanged, finalize, Observable, startWith, switchMap, tap} from "rxjs";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {ApiClient} from "../../../repo/httpClient";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {map} from "rxjs/operators";
import {Package} from "../../../models/package.model";
import {COMMA, ENTER} from "@angular/cdk/keycodes";
import {Document} from "../../../models/document.model";
import {MatChipInputEvent} from "@angular/material/chips";
import {DocumentEditorComponent} from "../document-editor/document-editor.component";

export interface AttrDialogData {
  newPackage?: Package;
  oldPackage?:Package;
  newNetto:any
  oldNetto:any
}

@Component({
  selector: 'app-package-editor',
  templateUrl: './package-editor.component.html',
  styleUrls: ['./package-editor.component.css']
})
export class PackageEditorComponent implements OnInit {

  packageProduct: Package = new Package();
  nettoProduct: any
  form:FormGroup
  isNetto:boolean = false;

  constructor(public api: ApiClient,
              public dialogRef: MatDialogRef<DocumentEditorComponent>,
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
      this.packageProduct = this.data.oldPackage
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

  onCancelClick() {
    console.log('closed')
  }



}
