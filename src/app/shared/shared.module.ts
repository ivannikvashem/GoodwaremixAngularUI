import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SupplierAutocompleteComponent} from "./supplier-autocomplete/supplier-autocomplete.component";
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {ReactiveFormsModule} from "@angular/forms";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {MatTableModule} from "@angular/material/table";
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import {DocumentCardComponent} from "../document/document-card/document-card.component";
import {MatCardModule} from "@angular/material/card";
import { ScrollToTopComponent } from './scroll-to-top/scroll-to-top.component';

@NgModule({
    declarations: [
        SupplierAutocompleteComponent,
        PageNotFoundComponent,
        DocumentCardComponent,
        ScrollToTopComponent
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
  ],
    exports: [
        SupplierAutocompleteComponent,
        DocumentCardComponent,
        ScrollToTopComponent
    ]
})
export class SharedModule { }
