import {Component, Inject, OnInit} from '@angular/core';
import {ApiClient} from "../../service/httpClient";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Category} from "../../models/category.model";
import {Attribute} from "../../models/attribute.model";
import {debounceTime, switchMap} from "rxjs";
import {CategoryDataSource} from "../repo/CategoryDataSource";

@Component({
  selector: 'app-category-edit',
  templateUrl: './category-edit.component.html',
  styleUrls: ['./category-edit.component.css']
})
export class CategoryEditComponent implements OnInit {

  category:Category = new Category();
  form:FormGroup;
  parentIdList:Category[];

  constructor(public api: ApiClient,
              public dialogRef: MatDialogRef<CategoryEditComponent>,
              @Inject(MAT_DIALOG_DATA)
              public data: any, private categoryDS: CategoryDataSource) {
    this.form = new FormGroup({
      "title": new FormControl<string>('', Validators.required),
      "parentId" : new FormControl<string | Attribute>('')
      /* "venderId": new FormControl<string>('', Validators.required), */
    })
  }

  ngOnInit(): void {
    if (this.data) {
      this.category = this.data;
      this.form.get("title").setValue(this.category.title)
      if (this.category.parentId) {
        this.categoryDS.getCategoryById(this.category.parentId).subscribe((x:any) => {
          this.form.get("parentId").setValue(x.body.result)
        })
      }
    }

    this.form.controls['parentId'].valueChanges.pipe(
      debounceTime(100),
      switchMap(value => this.categoryDS.loadAutocompleteData(value.toString(),0,  500))
    ).subscribe((data: Category[]) => {
      this.parentIdList = data;
    });
  }

  displayFn(value: Category): string {
    return value.title
  }


  onCancelClick() {
    this.dialogRef.close()
  }
}
