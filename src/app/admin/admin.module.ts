import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {AdminPanelComponent} from "./admin-panel/admin-panel.component";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {MatTableModule} from "@angular/material/table";
import {MatCardModule} from "@angular/material/card";
import {MatTabsModule} from "@angular/material/tabs";
import {MatInputModule} from "@angular/material/input";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatTooltipModule} from "@angular/material/tooltip";
import { ProductExportTableComponent } from './product-export-table/product-export-table.component';
import {MatPaginatorModule} from "@angular/material/paginator";
import {SharedModule} from "../shared/shared.module";
import {DragDropModule} from "@angular/cdk/drag-drop";
import {CdkTableModule} from "@angular/cdk/table";
import {RouterModule} from "@angular/router";
import { AdminComponent } from './admin.component';
import {NgChartsModule} from "ng2-charts";
import {LogModule} from "../log/log.module";

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
        LogModule
    ]
})
export class AdminModule { }
