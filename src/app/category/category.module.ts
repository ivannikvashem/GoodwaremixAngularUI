import {NgModule} from "@angular/core";
import {CategoryComponent} from "./category.component";
import {CategoryIndexComponent} from "./category-index/category-index.component";
import {CategoryEditComponent} from "./category-edit/category-edit.component";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatDialogModule} from "@angular/material/dialog";
import {SharedModule} from "../shared/shared.module";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatPaginatorModule} from "@angular/material/paginator";
import {MatIconModule} from "@angular/material/icon";

@NgModule({
  declarations: [
/*    CategoryComponent,
    CategoryIndexComponent,
    CategoryEditComponent*/
  ],
  imports: [
    MatFormFieldModule,
    MatDialogModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    MatPaginatorModule,
    MatIconModule
  ]
})
export class CategoryModule { }
