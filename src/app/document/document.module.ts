import {NgModule} from "@angular/core";
import {DocumentIndexComponent} from "./document-index/document-index.component";
import {DocumentComponent} from "./document.component";
import {SharedModule} from "../shared/shared.module";
import {MatFormFieldModule} from "@angular/material/form-field";
import {ReactiveFormsModule} from "@angular/forms";
import {MatIconModule} from "@angular/material/icon";
import {MatPaginatorModule} from "@angular/material/paginator";
import {MatTabsModule} from "@angular/material/tabs";
import {MatTableModule} from "@angular/material/table";
import {MatCardModule} from "@angular/material/card";
import {ProductModule} from "../product/product.module";
import {CommonModule} from "@angular/common";
import {MatButtonModule} from "@angular/material/button";
import {MatInputModule} from "@angular/material/input";

@NgModule({
  declarations: [
    DocumentComponent,
    DocumentIndexComponent,
  ],
  exports: [
  ],
  imports: [
    CommonModule,
    SharedModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatIconModule,
    MatPaginatorModule,
    MatTabsModule,
    MatTableModule,
    MatCardModule,
    ProductModule,
    MatButtonModule,
    MatInputModule,
  ]
})
export class DocumentModule { }
