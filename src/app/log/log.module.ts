import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {LogIndexComponent} from "./log-index/log-index.component";
import {MatLegacyPaginatorModule as MatPaginatorModule} from "@angular/material/legacy-paginator";
import {MatSortModule} from "@angular/material/sort";
import {MatLegacyTableModule as MatTableModule} from "@angular/material/legacy-table";
import {SharedModule} from "../shared/shared.module";
import {MatLegacyButtonModule as MatButtonModule} from "@angular/material/legacy-button";
import {MatIconModule} from "@angular/material/icon";
import {ScrollingModule} from "@angular/cdk/scrolling";
import {MatLegacyProgressSpinnerModule as MatProgressSpinnerModule} from "@angular/material/legacy-progress-spinner";
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
