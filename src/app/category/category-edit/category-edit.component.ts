import {Component, Inject, OnInit} from '@angular/core';
import {ApiClient} from "../../service/httpClient";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Category} from "../../models/category.model";

@Component({
  selector: 'app-category-edit',
  templateUrl: './category-edit.component.html',
  styleUrls: ['./category-edit.component.css']
})
export class CategoryEditComponent implements OnInit {

  category:Category = new Category();
  form:FormGroup;

  constructor(public api: ApiClient,
              public dialogRef: MatDialogRef<CategoryEditComponent>,
              @Inject(MAT_DIALOG_DATA)
              public data: any) {
    this.form = new FormGroup({
      "title": new FormControl<string>('', Validators.required),
      "parentId": new FormControl<string>('', Validators.required),
/*
      "venderId": new FormControl<string>('', Validators.required),
*/
    })
  }

  ngOnInit(): void {
    if (this.data) {
      this.category = this.data;
      this.form.get("title").setValue(this.category.title)
      this.form.get("parentId").setValue(this.category.parentId)
/*
      this.form.get("venderId").setValue(this.category.venderId)
*/
    }
  }

  onSubmitClick() {
   /* if (this.form.valid) {
      this.dialogRef.close(this.form)
    }*/
  }
  onSupplierSelected(supplier: any) {
    //this.data.supplierId = supplier.id;
  }

  onCancelClick() {
    this.dialogRef.close()
  }
}
