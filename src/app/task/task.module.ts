import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {TaskIndexComponent} from "./task-index/task-index.component";
import {TaskEditComponent} from "./task-edit/task-edit.component";
import {MatLegacyPaginatorModule as MatPaginatorModule} from "@angular/material/legacy-paginator";
import {MatSortModule} from "@angular/material/sort";
import {MatLegacyTableModule as MatTableModule} from "@angular/material/legacy-table";
import {SharedModule} from "../shared/shared.module";
import {MatLegacyButtonModule as MatButtonModule} from "@angular/material/legacy-button";
import {MatIconModule} from "@angular/material/icon";
import {MatLegacyDialogModule as MatDialogModule} from "@angular/material/legacy-dialog";
import {MatLegacyInputModule as MatInputModule} from "@angular/material/legacy-input";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatLegacyFormFieldModule as MatFormFieldModule} from "@angular/material/legacy-form-field";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatLegacySelectModule as MatSelectModule} from "@angular/material/legacy-select";
import {MatLegacyProgressSpinnerModule as MatProgressSpinnerModule} from "@angular/material/legacy-progress-spinner";
import {MatLegacyCardModule as MatCardModule} from "@angular/material/legacy-card";
import {MatButtonToggleModule} from "@angular/material/button-toggle";
import {CronMaskInputDirective} from "./repo/cron-mask-input.directive";
import {MatLegacyCheckboxModule as MatCheckboxModule} from "@angular/material/legacy-checkbox";
import {MatLegacyTooltipModule as MatTooltipModule} from "@angular/material/legacy-tooltip";

@NgModule({
    declarations: [
        TaskIndexComponent,
        TaskEditComponent,
        CronMaskInputDirective
    ],
    exports: [
        TaskIndexComponent
    ],
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatButtonModule,
    MatDialogModule,
    MatInputModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatSelectModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatCardModule,
    MatButtonToggleModule,
    MatCheckboxModule,
    MatTooltipModule
  ]
})
export class TaskModule { }
