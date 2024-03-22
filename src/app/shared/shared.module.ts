import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SupplierAutocompleteComponent} from "./supplier-autocomplete/supplier-autocomplete.component";
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {MatTableModule} from "@angular/material/table";
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import {DocumentCardComponent} from "../document/document-card/document-card.component";
import {MatCardModule} from "@angular/material/card";
import { ScrollToTopComponent } from './scroll-to-top/scroll-to-top.component';
import {MatTooltipModule} from "@angular/material/tooltip";
import { MatPaginatorGotoComponent } from './mat-paginator-goto/mat-paginator-goto.component';
import {MatPaginatorModule} from "@angular/material/paginator";
import {MatSelectModule} from "@angular/material/select";
import { CategoryAutocompleteComponent } from './category-autocomplete/category-autocomplete.component';

@NgModule({
    declarations: [
        SupplierAutocompleteComponent,
        PageNotFoundComponent,
        DocumentCardComponent,
        ScrollToTopComponent,
        MatPaginatorGotoComponent,
        CategoryAutocompleteComponent,
    ],
  imports: [
    CommonModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatIconModule,
    MatButtonModule,
    MatTableModule,
    MatCardModule,
    MatTooltipModule,
    MatPaginatorModule,
    MatSelectModule,
    FormsModule,
  ],
    exports: [
        SupplierAutocompleteComponent,
        DocumentCardComponent,
        ScrollToTopComponent,
        MatPaginatorGotoComponent,
        CategoryAutocompleteComponent
    ]
})
export class SharedModule { }
