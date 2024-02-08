import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {AdminPanelComponent} from "./admin-panel/admin-panel.component";
import {MatLegacyButtonModule as MatButtonModule} from "@angular/material/legacy-button";
import {MatIconModule} from "@angular/material/icon";
import {MatLegacyTableModule as MatTableModule} from "@angular/material/legacy-table";
import {MatLegacyCardModule as MatCardModule} from "@angular/material/legacy-card";
import {MatLegacyTabsModule as MatTabsModule} from "@angular/material/legacy-tabs";
import {MatLegacyInputModule as MatInputModule} from "@angular/material/legacy-input";
import {MatLegacyCheckboxModule as MatCheckboxModule} from "@angular/material/legacy-checkbox";
import {MatLegacyTooltipModule as MatTooltipModule} from "@angular/material/legacy-tooltip";
import { ProductExportTableComponent } from './product-export-table/product-export-table.component';
import {MatLegacyPaginatorModule as MatPaginatorModule} from "@angular/material/legacy-paginator";
import {SharedModule} from "../shared/shared.module";
import {DragDropModule} from "@angular/cdk/drag-drop";
import {CdkTableModule} from "@angular/cdk/table";
import {RouterModule} from "@angular/router";
import { AdminComponent } from './admin.component';
import {NgChartsModule} from "ng2-charts";
import {TaskModule} from "../task/task.module";

@NgModule({
    declarations: [
        AdminPanelComponent,
        ProductExportTableComponent,
        AdminComponent,
    ],
    exports: [
        ProductExportTableComponent,
    ],
    imports: [
        CommonModule,
        MatButtonModule,
        MatIconModule,
        MatTableModule,
        MatCardModule,
        MatTabsModule,
        MatInputModule,
        MatCheckboxModule,
        MatTooltipModule,
        MatPaginatorModule,
        SharedModule,
        DragDropModule,
        CdkTableModule,
        RouterModule,
        NgChartsModule,
        TaskModule
    ]
})
export class AdminModule { }
