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
import {MatPaginatorModule} from "@angular/material/paginator";
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatToolbarModule} from "@angular/material/toolbar";
import {AppRoutingModule} from "./app-routing.module";
import {MatButtonModule} from "@angular/material/button";
import {MatDialogModule} from '@angular/material/dialog';
import {MatTooltipModule} from '@angular/material/tooltip';
import { AppComponent } from './app.component';
import { CommonModule } from '@angular/common';
import {DialogDataExampleDialog, ProductIndexComponent} from './components/product-index/product-index.component';
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {MatTableModule} from "@angular/material/table";
import {MatIconModule} from "@angular/material/icon";
import { AttributeIndexComponent } from './components/attribute-index/attribute-index.component';
import { AttributeEditComponent } from './components/attribute-edit/attribute-edit.component';
import { SupplierIndexComponent } from './components/supplier-index/supplier-index.component';
import { SupplierEditComponent } from './components/supplier-edit/supplier-edit.component';
import { ParserLogComponent } from './components/parser-log/parser-log.component';
import { ProductDetailsComponent } from './components/product-details/product-details.component';
import { NgxBarcodeModule } from 'ngx-barcode';
import { PackageCardComponent } from './components/shared/package-card/package-card.component';
import {MatBadgeModule} from '@angular/material/badge';

@NgModule({
  declarations: [
    AppComponent,
    ProductIndexComponent,
    DialogDataExampleDialog,
    AttributeIndexComponent,
    AttributeEditComponent,
    SupplierIndexComponent,
    SupplierEditComponent,
    ParserLogComponent,
    ProductDetailsComponent,
    PackageCardComponent
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    MatAutocompleteModule,
    MatBadgeModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatChipsModule,
    MatDialogModule,
    MatExpansionModule,
    MatGridListModule,
    MatListModule,
    MatIconModule,
    MatInputModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    MatSelectModule,
    MatSortModule,
    MatSnackBarModule,
    MatStepperModule,
    MatTableModule,
    MatToolbarModule,
    MatTooltipModule,
    ReactiveFormsModule,
    NgxBarcodeModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
