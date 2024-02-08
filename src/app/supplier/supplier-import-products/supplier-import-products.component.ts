import {Component, Inject, OnInit} from '@angular/core';
import {MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA, MatLegacyDialogRef as MatDialogRef} from "@angular/material/legacy-dialog";
import {ApiClient} from "../../service/httpClient";

@Component({
  selector: 'app-supplier-import-products',
  templateUrl: './supplier-import-products.component.html',
  styleUrls: ['./supplier-import-products.component.css']
})
export class SupplierImportProductsComponent implements OnInit {

  constructor(public dialogRef:MatDialogRef<SupplierImportProductsComponent>,
              @Inject(MAT_DIALOG_DATA)
              public data:any,
              private api:ApiClient) { }
  file:File;

  ngOnInit(): void {}

  onFileLoaded(event: any) {
    this.file = event.target.files[0];
  }

  importProducts() {
    this.api.importProducts(this.file, this.data.supplierId).subscribe(() => {
      this.dialogRef.close();
    })
  }
}
