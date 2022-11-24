import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SupplierAutocompleteComponent} from "./supplier-autocomplete/supplier-autocomplete.component";
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {BrowserModule} from "@angular/platform-browser";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";

@NgModule({
  declarations: [
    SupplierAutocompleteComponent,
  ],
  imports: [
    CommonModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
  ],
  exports: [
    SupplierAutocompleteComponent
  ]
})
export class SharedModule { }
