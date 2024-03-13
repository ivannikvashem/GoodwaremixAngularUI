import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {ApiClient} from "../../service/httpClient";
import {ProductsDataSource} from "../../product/repo/ProductsDataSource";

@Component({
  selector: 'app-supplier-import-products',
  templateUrl: './supplier-import-products.component.html',
  styleUrls: ['./supplier-import-products.component.css']
})
export class SupplierImportProductsComponent implements OnInit {

  constructor(public dialogRef:MatDialogRef<SupplierImportProductsComponent>,
              private productDS: ProductsDataSource,
              @Inject(MAT_DIALOG_DATA)
              public data:any) { }
  file:File;

  ngOnInit(): void {}

  onFileLoaded(event: any) {
    this.file = event.target.files[0];
  }

  importProducts() {
    this.productDS.importProducts(this.file, this.data.supplierId).subscribe(() => {
      this.dialogRef.close();
    })
  }
}
