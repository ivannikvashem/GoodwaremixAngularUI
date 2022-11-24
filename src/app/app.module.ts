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
import {DialogDataDialog, ProductIndexComponent} from './components/product-index/product-index.component';
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {MatTableModule} from "@angular/material/table";
import {MatIconModule} from "@angular/material/icon";
import { AttributeIndexComponent } from './components/attribute-index/attribute-index.component';
import { AttributeEditComponent } from './components/attribute-edit/attribute-edit.component';
import { SupplierIndexComponent } from './components/supplier-index/supplier-index.component';
import { SupplierEditComponent } from './components/supplier-edit/supplier-edit.component';
import { ProductDetailsComponent } from './components/product-details/product-details.component';
import { NgxBarcodeModule } from 'ngx-barcode';
import { PackageCardComponent } from './components/shared/package-card/package-card.component';
import {MatBadgeModule} from '@angular/material/badge';
import {
  ImageDialog,
  HoverImageSliderComponent
} from './components/shared/hover-image-slider/hover-image-slider.component';
import { ConfirmDialogComponent } from './components/shared/confirm-dialog/confirm-dialog.component';
import {STEPPER_GLOBAL_OPTIONS} from "@angular/cdk/stepper";
import { ProductEditComponent } from './components/product-edit/product-edit.component';
import {MatTabsModule} from "@angular/material/tabs";
import {getRuPaginatorIntl} from  './service/ru-paginator-intl'
import {MatMenuModule} from "@angular/material/menu";
import '@angular/common/locales/global/ru';
import { SwapAttributeComponent } from './components/shared/swap-attribute/swap-attribute.component'
import {ProductAttributeEditComponent} from "./components/shared/product-attribute-edit/product-attribute-edit.component";
import { ProductPackageEditComponent } from './components/shared/product-package-edit/product-package-edit.component';
import { ProductDocumentEditComponent } from './components/shared/product-document-edit/product-document-edit.component';
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MAT_DATE_LOCALE, MatNativeDateModule} from "@angular/material/core";
import { SupplierAttributeAddComponent } from './components/shared/supplier-attribute-add/supplier-attribute-add.component';
import {MatCheckboxModule} from "@angular/material/checkbox";
import {ScrollingModule} from "@angular/cdk/scrolling";
import { AdminPanelComponent } from './components/admin-panel/admin-panel.component';
import { TaskIndexComponent } from './components/task-index/task-index.component';
import { TaskEditComponent } from './components/shared/task-edit/task-edit.component';
import {LogModule} from "./log/log.module";
import {SharedModule} from "./shared/shared.module";

@NgModule({
  declarations: [
    AppComponent,
    ProductIndexComponent,
    DialogDataDialog,
    ImageDialog,
    AttributeIndexComponent,
    AttributeEditComponent,
    SupplierIndexComponent,
    SupplierEditComponent,
    ProductDetailsComponent,
    PackageCardComponent,
    HoverImageSliderComponent,
    ProductAttributeEditComponent,
    ConfirmDialogComponent,
    ProductEditComponent,
    SwapAttributeComponent,
    ProductPackageEditComponent,
    ProductDocumentEditComponent,
    SupplierAttributeAddComponent,
    AdminPanelComponent,
    TaskIndexComponent,
    TaskEditComponent
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
    NgxBarcodeModule,
    MatTabsModule,
    MatMenuModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCheckboxModule,
    ScrollingModule,
    LogModule,
    SharedModule
  ],
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { displayDefaultIndicatorType: false }
    },
    {provide: MatPaginatorIntl, useValue: getRuPaginatorIntl()},
    { provide: MAT_DATE_LOCALE, useValue: 'ru-RU' }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
