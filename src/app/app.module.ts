import { NgModule } from '@angular/core';
import {HttpClientModule} from "@angular/common/http";
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {MatCardModule} from '@angular/material/card';
import {MatChipsModule} from '@angular/material/chips';
import {MatStepperModule} from '@angular/material/stepper';
import {MatInputModule} from '@angular/material/input';
import {MatListModule} from '@angular/material/list';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatSnackBarModule} from "@angular/material/snack-bar";
import {MatSortModule} from "@angular/material/sort";
import {MatSelectModule} from "@angular/material/select";
import {MatProgressBarModule} from "@angular/material/progress-bar";
import {MatPaginatorIntl, MatPaginatorModule} from "@angular/material/paginator";
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {AppRoutingModule} from "./app-routing.module";
import {MatButtonModule} from "@angular/material/button";
import { MatFormFieldModule } from '@angular/material/form-field';
import {MatDialogModule} from '@angular/material/dialog';
import {MatTooltipModule} from '@angular/material/tooltip';
import { AppComponent } from './app.component';
import { CommonModule } from '@angular/common';
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {MatTableModule} from "@angular/material/table";
import {MatIconModule} from "@angular/material/icon";
import {MatBadgeModule} from '@angular/material/badge';
import { ConfirmDialogComponent } from './components/shared/confirm-dialog/confirm-dialog.component';
import {STEPPER_GLOBAL_OPTIONS} from "@angular/cdk/stepper";
import {MatTabsModule} from "@angular/material/tabs";
import {getRuPaginatorIntl} from  './service/ru-paginator-intl'
import {MatMenuModule} from "@angular/material/menu";
import '@angular/common/locales/global/ru';
import { SwapAttributeComponent } from './components/shared/swap-attribute/swap-attribute.component'
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MAT_DATE_LOCALE, MatNativeDateModule} from "@angular/material/core";
import { SupplierAttributeAddComponent } from './components/shared/supplier-attribute-add/supplier-attribute-add.component';
import {MatCheckboxModule} from "@angular/material/checkbox";
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
    UnitConverterModule
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
