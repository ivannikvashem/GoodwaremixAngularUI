import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {TaskIndexComponent} from "./task-index/task-index.component";
import {TaskEditComponent} from "./task-edit/task-edit.component";
import {MatPaginatorModule} from "@angular/material/paginator";
import {MatSortModule} from "@angular/material/sort";
import {MatTableModule} from "@angular/material/table";
import {SharedModule} from "../shared/shared.module";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {MatDialogModule} from "@angular/material/dialog";
import {MatInputModule} from "@angular/material/input";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatSelectModule} from "@angular/material/select";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";


@NgModule({
  declarations: [
    TaskIndexComponent,
    TaskEditComponent
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
        MatProgressSpinnerModule
    ]
})
export class TaskModule { }
