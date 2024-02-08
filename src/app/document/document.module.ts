import {NgModule} from "@angular/core";
import {DocumentIndexComponent} from "./document-index/document-index.component";
import {DocumentComponent} from "./document.component";
import {SharedModule} from "../shared/shared.module";
import {MatLegacyFormFieldModule as MatFormFieldModule} from "@angular/material/legacy-form-field";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatIconModule} from "@angular/material/icon";
import {MatLegacyPaginatorModule as MatPaginatorModule} from "@angular/material/legacy-paginator";
import {MatLegacyTabsModule as MatTabsModule} from "@angular/material/legacy-tabs";
import {MatLegacyTableModule as MatTableModule} from "@angular/material/legacy-table";
import {MatLegacyCardModule as MatCardModule} from "@angular/material/legacy-card";
import {ProductModule} from "../product/product.module";
import {CommonModule} from "@angular/common";
import {MatLegacyButtonModule as MatButtonModule} from "@angular/material/legacy-button";
import {MatLegacyInputModule as MatInputModule} from "@angular/material/legacy-input";
import {MatSortModule} from "@angular/material/sort";

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
        MatSortModule,
        FormsModule,
    ]
})
export class DocumentModule { }
