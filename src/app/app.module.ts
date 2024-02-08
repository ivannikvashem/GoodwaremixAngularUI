import { NgModule } from '@angular/core';
import {HttpClientModule} from "@angular/common/http";
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {MatLegacyCardModule as MatCardModule} from '@angular/material/legacy-card';
import {MatLegacyChipsModule as MatChipsModule} from '@angular/material/legacy-chips';
import {MatStepperModule} from '@angular/material/stepper';
import {MatLegacyInputModule as MatInputModule} from '@angular/material/legacy-input';
import {MatLegacyListModule as MatListModule} from '@angular/material/legacy-list';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatLegacySnackBarModule as MatSnackBarModule} from "@angular/material/legacy-snack-bar";
import {MatSortModule} from "@angular/material/sort";
import {MatLegacySelectModule as MatSelectModule} from "@angular/material/legacy-select";
import {MatLegacyProgressBarModule as MatProgressBarModule} from "@angular/material/legacy-progress-bar";
import {MatLegacyPaginatorIntl as MatPaginatorIntl, MatLegacyPaginatorModule as MatPaginatorModule} from "@angular/material/legacy-paginator";
import {MatLegacyAutocompleteModule as MatAutocompleteModule} from "@angular/material/legacy-autocomplete";
import {MatLegacyProgressSpinnerModule as MatProgressSpinnerModule} from '@angular/material/legacy-progress-spinner';
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatLegacySlideToggleModule as MatSlideToggleModule} from '@angular/material/legacy-slide-toggle';
import {AppRoutingModule} from "./app-routing.module";
import {MatLegacyButtonModule as MatButtonModule} from "@angular/material/legacy-button";
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import {MatLegacyDialogModule as MatDialogModule} from '@angular/material/legacy-dialog';
import {MatLegacyTooltipModule as MatTooltipModule} from '@angular/material/legacy-tooltip';
import { AppComponent } from './app.component';
import { CommonModule } from '@angular/common';
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {MatLegacyTableModule as MatTableModule} from "@angular/material/legacy-table";
import {MatIconModule} from "@angular/material/icon";
import {MatBadgeModule} from '@angular/material/badge';
import { ConfirmDialogComponent } from './components/shared/confirm-dialog/confirm-dialog.component';
import {STEPPER_GLOBAL_OPTIONS} from "@angular/cdk/stepper";
import {MatLegacyTabsModule as MatTabsModule} from "@angular/material/legacy-tabs";
import {getRuPaginatorIntl} from  './service/ru-paginator-intl'
import {MatLegacyMenuModule as MatMenuModule} from "@angular/material/legacy-menu";
import '@angular/common/locales/global/ru';
import { SwapAttributeComponent } from './components/shared/swap-attribute/swap-attribute.component'
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MAT_DATE_LOCALE, MatNativeDateModule} from "@angular/material/core";
import { SupplierAttributeAddComponent } from './components/shared/supplier-attribute-add/supplier-attribute-add.component';
import {MatLegacyCheckboxModule as MatCheckboxModule} from "@angular/material/legacy-checkbox";
import {ScrollingModule} from "@angular/cdk/scrolling";
import {LogModule} from "./log/log.module";
import {SharedModule} from "./shared/shared.module";
import {AdminModule} from "./admin/admin.module";
import {AttributeModule} from "./attribute/attribute.module";
import {SupplierModule} from "./supplier/supplier.module";
import {ProductModule} from "./product/product.module";
import {TaskModule} from "./task/task.module";
import {DataStateService} from "./shared/data-state.service";
import {AuthModule} from "./auth/auth.module";
import {UsersModule} from "./users/users.module";
import {DocumentModule} from "./document/document.module";
import { UnitConverterComponent } from './unit-converter/unit-converter.component';
import {UnitConverterModule} from "./unit-converter/unit-converter.module";
import {StatisticModule} from "./statistic/statistic.module";
import {MatSidenavModule} from "@angular/material/sidenav";

@NgModule({
    declarations: [
        AppComponent,
        ConfirmDialogComponent,
        SwapAttributeComponent,
        SupplierAttributeAddComponent,
        UnitConverterComponent
    ],
  imports: [
    CommonModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatBadgeModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatChipsModule,
    MatDialogModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatGridListModule,
    MatListModule,
    MatIconModule,
    MatInputModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    MatSelectModule,
    MatSortModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatStepperModule,
    MatTableModule,
    MatToolbarModule,
    MatTooltipModule,
    ReactiveFormsModule,
    MatTabsModule,
    MatMenuModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCheckboxModule,
    ScrollingModule,
    LogModule,
    SharedModule,
    AdminModule,
    AttributeModule,
    SupplierModule,
    ProductModule,
    TaskModule,
    AuthModule,
    UsersModule,
    DocumentModule,
    UnitConverterModule,
    StatisticModule,
    MatSidenavModule
  ],
    providers: [
        {
            provide: STEPPER_GLOBAL_OPTIONS,
            useValue: {displayDefaultIndicatorType: false}
        },
        {provide: MatPaginatorIntl, useValue: getRuPaginatorIntl()},
        {provide: MAT_DATE_LOCALE, useValue: 'ru-RU'},
        DataStateService
    ],
  exports: [
    UnitConverterComponent
  ],
    bootstrap: [AppComponent]
})
export class AppModule { }
