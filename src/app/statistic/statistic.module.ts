import {NgModule} from "@angular/core";
import {StatisticComponent} from "./statistic.component";
import {MatCardModule} from "@angular/material/card";
import {NgChartsModule} from "ng2-charts";
import {SharedModule} from "../shared/shared.module";
import {DatePipe, KeyValuePipe, NgForOf, NgIf} from "@angular/common";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";

@NgModule({
  declarations:[
    StatisticComponent
  ],
  exports:[],
  imports: [
    MatCardModule,
    NgChartsModule,
    SharedModule,
    NgIf,
    DatePipe,
    NgForOf,
    MatIconModule,
    KeyValuePipe,
    MatButtonModule
  ]
})
export class StatisticModule { }
