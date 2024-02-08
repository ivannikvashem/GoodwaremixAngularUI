import {NgModule} from "@angular/core";
import {StatisticComponent} from "./statistic.component";
import {MatLegacyCardModule as MatCardModule} from "@angular/material/legacy-card";
import {NgChartsModule} from "ng2-charts";
import {SharedModule} from "../shared/shared.module";
import {DatePipe, JsonPipe, KeyValuePipe, NgForOf, NgIf} from "@angular/common";
import {MatIconModule} from "@angular/material/icon";
import {MatLegacyButtonModule as MatButtonModule} from "@angular/material/legacy-button";
import { AdminStatComponent } from './admin-stat/admin-stat.component';
import { ManagerStatComponent } from './manager-stat/manager-stat.component';
import { StatisticDetailsComponent } from './statistic-details/statistic-details.component';
import {MatLegacyDialogModule as MatDialogModule} from "@angular/material/legacy-dialog";
import {MatLegacyProgressSpinnerModule as MatProgressSpinnerModule} from "@angular/material/legacy-progress-spinner";
import {MatDividerModule} from "@angular/material/divider";

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
        MatDialogModule,
        MatProgressSpinnerModule,
        MatDividerModule
    ]
})
export class StatisticModule { }
