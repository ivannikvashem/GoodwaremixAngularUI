import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {AttributeIndexComponent} from "./attribute-index/attribute-index.component";
import {AttributeEditComponent} from "./attribute-edit/attribute-edit.component";
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
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {RouterModule} from "@angular/router";
import { AttributeComponent } from './attribute.component';
import { AttrtibuteStateSwitchComponent } from './attrtibute-state-switch/attrtibute-state-switch.component';
import {MatCardModule} from "@angular/material/card";

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
