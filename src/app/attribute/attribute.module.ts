import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {AttributeIndexComponent} from "./attribute-index/attribute-index.component";
import {AttributeEditComponent} from "./attribute-edit/attribute-edit.component";
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
import {MatLegacyProgressSpinnerModule as MatProgressSpinnerModule} from "@angular/material/legacy-progress-spinner";
import {RouterModule} from "@angular/router";
import { AttributeComponent } from './attribute.component';
import { AttrtibuteStateSwitchComponent } from './attrtibute-state-switch/attrtibute-state-switch.component';
import {MatLegacyCardModule as MatCardModule} from "@angular/material/legacy-card";

@NgModule({
  declarations: [
    AttributeIndexComponent,
    AttributeEditComponent,
    AttributeComponent,
    AttrtibuteStateSwitchComponent,
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
        ReactiveFormsModule,
        MatChipsModule,
        MatSelectModule,
        MatButtonModule,
        MatInputModule,
        MatDialogModule,
        MatProgressSpinnerModule,
        RouterModule,
        MatCardModule
    ]
})
export class AttributeModule { }
