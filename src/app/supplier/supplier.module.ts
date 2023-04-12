import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatPaginatorModule} from "@angular/material/paginator";
import {MatSortModule} from "@angular/material/sort";
import {MatTableModule} from "@angular/material/table";
import {SharedModule} from "../shared/shared.module";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonToggleModule} from "@angular/material/button-toggle";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatChipsModule} from "@angular/material/chips";
import {MatSelectModule} from "@angular/material/select";
import {MatInputModule} from "@angular/material/input";
import {MatDialogModule} from "@angular/material/dialog";
import {SupplierIndexComponent} from "./supplier-index/supplier-index.component";
import {SupplierEditComponent} from "./supplier-edit/supplier-edit.component";
import {MatTabsModule} from "@angular/material/tabs";
import {MatCardModule} from "@angular/material/card";
import {MatStepperModule} from "@angular/material/stepper";
import {RouterModule} from "@angular/router";
import {MatExpansionModule} from "@angular/material/expansion";
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatTooltipModule} from "@angular/material/tooltip";
import {MatMenuModule} from "@angular/material/menu";
import {MatSlideToggleModule} from "@angular/material/slide-toggle";
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import {MatCheckboxModule} from "@angular/material/checkbox";
import { SupplierComponent } from './supplier.component';

@NgModule({
  declarations: [
    SupplierIndexComponent,
    SupplierEditComponent,
    SupplierComponent,
  ],
    imports: [
        CommonModule,
        MatPaginatorModule,
        MatSortModule,
        MatTableModule,
        SharedModule,
        MatButtonModule,
        MatIconModule,
        MatButtonToggleModule,
        FormsModule,
        MatFormFieldModule,
        MatChipsModule,
        MatSelectModule,
        MatButtonModule,
        MatInputModule,
        MatDialogModule,
        MatCardModule,
        MatStepperModule,
        RouterModule,
        MatExpansionModule,
        MatToolbarModule,
        MatTooltipModule,
        ReactiveFormsModule,
        MatTabsModule,
        MatMenuModule,
        MatSlideToggleModule,
        MatAutocompleteModule,
        MatCheckboxModule,
    ]
})
export class SupplierModule { }
