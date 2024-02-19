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
    if (this.data.oldCategory !== undefined) {
      this.category = this.data.oldCategory;
      this.form.get("title").setValue(this.category.title)
      this.form.get("parentId").setValue(this.category.parentId)
      this.form.get("venderId").setValue(this.category.venderId)
      this.form.get("description").setValue(this.category.description)
    }
  }

  onSubmitClick() {
    if (this.form.valid) {
      this.data.newCategory.title = this.form.get("title").value
      this.data.newCategory.parentId = this.form.get("parentId").value
      this.data.newCategory.venderId = this.form.get("venderId").value
      this.data.newCategory.description = this.form.get("description").value

      if (this.data.oldCategory?.id != undefined) {
        this.updateCategory(this.data.newCategory)
      } else {
        this.insertCategory(this.data.newCategory)
      }
    }
  }

  insertCategory(newCategory:Category) {
    this.api.insertCategory(newCategory).subscribe((x:any) => {
      if (x.body) {
        this.data.newCategory.id = x.body
      }
    })
  }

  updateCategory(category:Category) {
    this.data.newCategory.id = this.data.oldCategory.id
    this.api.updateCategory(category).subscribe(() => {

    })
    this.dialogRef.close(this.data)
  }

  onSupplierSelected(supplier: any) {
    this.data.newCategory.supplierId = supplier.id;
  }

  onCancelClick() {
    this.dialogRef.close()
  }
}
