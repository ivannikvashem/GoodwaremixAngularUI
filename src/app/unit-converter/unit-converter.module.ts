import {NgModule} from "@angular/core";
import {UnitConverterEditComponent} from "./unit-converter-edit/unit-converter-edit.component";
import {UnitConverterIndexComponent} from "./unit-converter-index/unit-converter-index.component";
import {MatTableModule} from "@angular/material/table";
import {MatPaginatorModule} from "@angular/material/paginator";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

@NgModule({
  declarations: [
    UnitConverterEditComponent,
    UnitConverterIndexComponent
  ],
  exports: [
    UnitConverterIndexComponent
  ],
  imports: [
    MatTableModule,
    MatPaginatorModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export  class UnitConverterModule { }
