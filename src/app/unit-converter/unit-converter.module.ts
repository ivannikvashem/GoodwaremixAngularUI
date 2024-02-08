import {NgModule} from "@angular/core";
import {UnitConverterEditComponent} from "./unit-converter-edit/unit-converter-edit.component";
import {UnitConverterIndexComponent} from "./unit-converter-index/unit-converter-index.component";
import {MatLegacyTableModule as MatTableModule} from "@angular/material/legacy-table";
import {MatLegacyPaginatorModule as MatPaginatorModule} from "@angular/material/legacy-paginator";
import {MatIconModule} from "@angular/material/icon";
import {MatLegacyButtonModule as MatButtonModule} from "@angular/material/legacy-button";
import {MatLegacyInputModule as MatInputModule} from '@angular/material/legacy-input';
import {MatLegacyFormFieldModule as MatFormFieldModule} from '@angular/material/legacy-form-field';
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
