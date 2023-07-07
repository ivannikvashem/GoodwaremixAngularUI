import {NgModule} from "@angular/core";
import {StatisticComponent} from "./statistic.component";
import {MatCardModule} from "@angular/material/card";
import {NgChartsModule} from "ng2-charts";
import {SharedModule} from "../shared/shared.module";
import {DatePipe, NgIf} from "@angular/common";

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
    DatePipe
  ]
})
export class StatisticModule { }
