import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ParserLogComponent} from "./parser-log/parser-log.component";
import {MatPaginatorModule} from "@angular/material/paginator";
import {MatSortModule} from "@angular/material/sort";
import {MatTableModule} from "@angular/material/table";
import {SharedModule} from "../shared/shared.module";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";

@NgModule({
  declarations: [
    ParserLogComponent,
  ],
  imports: [
    CommonModule,
    MatPaginatorModule,
    MatSortModule,
    MatTableModule,
    SharedModule,
    MatButtonModule,
    MatIconModule
  ]
})
export class LogModule { }
