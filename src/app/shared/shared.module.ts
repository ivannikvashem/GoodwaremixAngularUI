import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SupplierAutocompleteComponent} from "./supplier-autocomplete/supplier-autocomplete.component";
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {ReactiveFormsModule} from "@angular/forms";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";

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
    MatIconModule,
    MatButtonModule
  ],
  exports: [
    SupplierAutocompleteComponent
  ]
})
export class SharedModule { }
