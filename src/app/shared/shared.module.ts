import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SupplierAutocompleteComponent} from "./supplier-autocomplete/supplier-autocomplete.component";
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {ReactiveFormsModule} from "@angular/forms";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {DocumentComponent} from "../document/document.component";
import {MatTableModule} from "@angular/material/table";

@NgModule({
    declarations: [
        SupplierAutocompleteComponent,
        DocumentComponent,
    ],
  imports: [
    CommonModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatIconModule,
    MatButtonModule,
    MatTableModule
  ],
    exports: [
        SupplierAutocompleteComponent,
        DocumentComponent
    ]
})
export class SharedModule { }
