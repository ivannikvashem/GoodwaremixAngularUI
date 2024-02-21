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
    this.form = new FormGroup<any>({
      "title": new FormControl<string>('', Validators.required),
      "parentId": new FormControl<string>('', Validators.required),
      "venderId": new FormControl<string>('', Validators.required),
      "description": new FormControl<string>(''),
    })
  }

  ngOnInit(): void {
    if (this.data) {
      this.category = this.data;
      this.form.get("title").setValue(this.category.title)
      this.form.get("parentId").setValue(this.category.parentId)
      this.form.get("venderId").setValue(this.category.venderId)
      this.form.get("description").setValue(this.category.description)
    }
  }

  onSubmitClick() {
    if (this.form.valid) {
      this.data.title = this.form.get("title").value
      this.data.parentId = this.form.get("parentId").value
      this.data.venderId = this.form.get("venderId").value
      this.data.description = this.form.get("description").value
    }
  }
  onSupplierSelected(supplier: any) {
    this.data.supplierId = supplier.id;
  }

  onCancelClick() {
    this.dialogRef.close()
  }
}
