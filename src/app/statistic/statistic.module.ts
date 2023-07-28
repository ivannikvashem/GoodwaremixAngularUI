import {NgModule} from "@angular/core";
import {StatisticComponent} from "./statistic.component";
import {MatCardModule} from "@angular/material/card";
import {NgChartsModule} from "ng2-charts";
import {SharedModule} from "../shared/shared.module";
import {DatePipe, JsonPipe, KeyValuePipe, NgForOf, NgIf} from "@angular/common";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import { AdminStatComponent } from './admin-stat/admin-stat.component';
import { ManagerStatComponent } from './manager-stat/manager-stat.component';
import { StatisticDetailsComponent } from './statistic-details/statistic-details.component';
import {MatDialogModule} from "@angular/material/dialog";

@NgModule({
  declarations:[
    StatisticComponent,
    AdminStatComponent,
    ManagerStatComponent,
    StatisticDetailsComponent
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
    MatButtonModule,
    JsonPipe,
    MatDialogModule
  ]
})
export class StatisticModule { }
