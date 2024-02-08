import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SupplierAutocompleteComponent} from "./supplier-autocomplete/supplier-autocomplete.component";
import {MatLegacyAutocompleteModule as MatAutocompleteModule} from "@angular/material/legacy-autocomplete";
import {MatLegacyFormFieldModule as MatFormFieldModule} from "@angular/material/legacy-form-field";
import {MatLegacyInputModule as MatInputModule} from "@angular/material/legacy-input";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatIconModule} from "@angular/material/icon";
import {MatLegacyButtonModule as MatButtonModule} from "@angular/material/legacy-button";
import {MatLegacyTableModule as MatTableModule} from "@angular/material/legacy-table";
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import {DocumentCardComponent} from "../document/document-card/document-card.component";
import {MatLegacyCardModule as MatCardModule} from "@angular/material/legacy-card";
import { ScrollToTopComponent } from './scroll-to-top/scroll-to-top.component';
import {MatLegacyTooltipModule as MatTooltipModule} from "@angular/material/legacy-tooltip";
import { MatPaginatorGotoComponent } from './mat-paginator-goto/mat-paginator-goto.component';
import {MatLegacyPaginatorModule as MatPaginatorModule} from "@angular/material/legacy-paginator";
import {MatLegacySelectModule as MatSelectModule} from "@angular/material/legacy-select";

@NgModule({
    declarations: [
        SupplierAutocompleteComponent,
        PageNotFoundComponent,
        DocumentCardComponent,
        ScrollToTopComponent,
        MatPaginatorGotoComponent,
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
    MatPaginatorGotoComponent
  ]
})
export class SharedModule { }
