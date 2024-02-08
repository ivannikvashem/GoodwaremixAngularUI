import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatLegacyPaginatorModule as MatPaginatorModule} from "@angular/material/legacy-paginator";
import {MatSortModule} from "@angular/material/sort";
import {MatLegacyTableModule as MatTableModule} from "@angular/material/legacy-table";
import {SharedModule} from "../shared/shared.module";
import {MatLegacyButtonModule as MatButtonModule} from "@angular/material/legacy-button";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonToggleModule} from "@angular/material/button-toggle";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatLegacyFormFieldModule as MatFormFieldModule} from "@angular/material/legacy-form-field";
import {MatLegacyChipsModule as MatChipsModule} from "@angular/material/legacy-chips";
import {MatLegacySelectModule as MatSelectModule} from "@angular/material/legacy-select";
import {MatLegacyInputModule as MatInputModule} from "@angular/material/legacy-input";
import {MatLegacyDialogModule as MatDialogModule} from "@angular/material/legacy-dialog";
import {SupplierIndexComponent} from "./supplier-index/supplier-index.component";
import {SupplierEditComponent} from "./supplier-edit/supplier-edit.component";
import {MatLegacyTabsModule as MatTabsModule} from "@angular/material/legacy-tabs";
import {MatLegacyCardModule as MatCardModule} from "@angular/material/legacy-card";
import {MatStepperModule} from "@angular/material/stepper";
import {RouterModule} from "@angular/router";
import {MatExpansionModule} from "@angular/material/expansion";
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatLegacyTooltipModule as MatTooltipModule} from "@angular/material/legacy-tooltip";
import {MatLegacyMenuModule as MatMenuModule} from "@angular/material/legacy-menu";
import {MatLegacySlideToggleModule as MatSlideToggleModule} from "@angular/material/legacy-slide-toggle";
import {MatLegacyAutocompleteModule as MatAutocompleteModule} from "@angular/material/legacy-autocomplete";
import {MatLegacyCheckboxModule as MatCheckboxModule} from "@angular/material/legacy-checkbox";
import { SupplierComponent } from './supplier.component';
import {MatLegacyProgressSpinnerModule as MatProgressSpinnerModule} from "@angular/material/legacy-progress-spinner";
import { SupplierDictionaryComponent } from './supplier-dictionary/supplier-dictionary.component';
import { SupplierImportProductsComponent } from './supplier-import-products/supplier-import-products.component';

@NgModule({
  declarations: [
    SupplierIndexComponent,
    SupplierEditComponent,
    SupplierComponent,
    SupplierDictionaryComponent,
    SupplierImportProductsComponent,
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
        MatProgressSpinnerModule,
    ]
})
export class SupplierModule { }
