import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {LogIndexComponent} from "./log-index/log-index.component";
import {MatPaginatorModule} from "@angular/material/paginator";
import {MatSortModule} from "@angular/material/sort";
import {MatTableModule} from "@angular/material/table";
import {SharedModule} from "../shared/shared.module";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {ScrollingModule} from "@angular/cdk/scrolling";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import { LogComponent } from './log.component';

@NgModule({
  declarations: [
    LogIndexComponent,
    LogComponent,
  ],
  imports: [
    CommonModule,
    MatPaginatorModule,
    MatSortModule,
    MatTableModule,
    SharedModule,
    MatButtonModule,
    MatIconModule,
    ScrollingModule,
    MatProgressSpinnerModule
  ]
})
export class LogModule { }
