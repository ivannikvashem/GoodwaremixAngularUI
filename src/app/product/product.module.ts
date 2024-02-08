import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatLegacyPaginatorModule as MatPaginatorModule} from "@angular/material/legacy-paginator";
import {MatSortModule} from "@angular/material/sort";
import {MatLegacyTableModule as MatTableModule} from "@angular/material/legacy-table";
import {SharedModule} from "../shared/shared.module";
import {MatLegacyButtonModule as MatButtonModule} from "@angular/material/legacy-button";
import {MatIconModule} from "@angular/material/icon";
import {ProductIndexComponent} from "./product-index/product-index.component";
import {ProductDetailsComponent} from "./product-details/product-details.component";
import {ProductEditComponent} from "./product-edit/product-edit.component";
import {MatButtonToggleModule} from "@angular/material/button-toggle";
import {MatLegacyFormFieldModule as MatFormFieldModule} from "@angular/material/legacy-form-field";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatLegacyTabsModule as MatTabsModule} from "@angular/material/legacy-tabs";
import {MatLegacyCardModule as MatCardModule} from "@angular/material/legacy-card";
import {MatLegacyInputModule as MatInputModule} from "@angular/material/legacy-input";
import {MatExpansionModule} from "@angular/material/expansion";
import {MatLegacyChipsModule as MatChipsModule} from "@angular/material/legacy-chips";
import {HoverImageSliderComponent} from "./hover-image-slider/hover-image-slider.component";
import {MatLegacyTooltipModule as MatTooltipModule} from "@angular/material/legacy-tooltip";
import {NgxBarcode6Module} from 'ngx-barcode6';
import {MatLegacyMenuModule as MatMenuModule} from "@angular/material/legacy-menu";
import {PackageCardComponent} from "./package-card/package-card.component";
import {ProductPackageEditComponent} from "./product-package-edit/product-package-edit.component";
import {ProductDocumentEditComponent} from "./product-document-edit/product-document-edit.component";
import {ProductAttributeEditComponent} from "./product-attribute-edit/product-attribute-edit.component";
import {MatLegacyDialogModule as MatDialogModule} from "@angular/material/legacy-dialog";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatLegacyAutocompleteModule as MatAutocompleteModule} from "@angular/material/legacy-autocomplete";
import {MatLegacySelectModule as MatSelectModule} from "@angular/material/legacy-select";
import {MatLegacyListModule as MatListModule} from "@angular/material/legacy-list";
import {MatLegacyProgressSpinnerModule as MatProgressSpinnerModule} from "@angular/material/legacy-progress-spinner";
import {RouterModule} from "@angular/router";
import { ProductComponent } from './product.component';
import { ImagePreviewDialogComponent } from './image-preview-dialog/image-preview-dialog.component';
import { AttributeFilterComponent } from './attribute-filter/attribute-filter.component';
import { ProductIcFilterSwitchComponent } from './product-ic-filter-switch/product-ic-filter-switch.component';
import {MatLegacyCheckboxModule as MatCheckboxModule} from "@angular/material/legacy-checkbox";
import { ProductDocumentListComponent } from './product-document-list/product-document-list.component';
import {ScrollingModule} from "@angular/cdk/scrolling";
import { ProductCardComponent } from './product-card/product-card.component';
import { ProductSelectedListComponent } from './product-selected-list/product-selected-list.component';
import {AdminModule} from "../admin/admin.module";
import {MatBadgeModule} from "@angular/material/badge";
import {MatLegacySliderModule as MatSliderModule} from "@angular/material/legacy-slider";
import {MatLegacyProgressBarModule as MatProgressBarModule} from "@angular/material/legacy-progress-bar";
import {
  ProductVerifiedFilterSwitchComponent
} from "./product-verified-filter-switch/product-verified-filter-switch.component";
import {MatLegacySlideToggleModule as MatSlideToggleModule} from "@angular/material/legacy-slide-toggle";

@NgModule({
  declarations: [
    ProductIndexComponent,
    ProductDetailsComponent,
    ProductEditComponent,
    HoverImageSliderComponent,
    PackageCardComponent,
    ProductPackageEditComponent,
    ProductDocumentEditComponent,
    ProductAttributeEditComponent,
    ProductComponent,
    ImagePreviewDialogComponent,
    AttributeFilterComponent,
    ProductIcFilterSwitchComponent,
    ProductDocumentListComponent,
    ProductCardComponent,
    ProductSelectedListComponent,
    ProductVerifiedFilterSwitchComponent,
  ],
  exports: [
    HoverImageSliderComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    MatInputModule,
    MatPaginatorModule,
    MatSortModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatButtonToggleModule,
    MatFormFieldModule,
    MatCardModule,
    MatExpansionModule,
    MatChipsModule,
    MatTooltipModule,
    ReactiveFormsModule,
    NgxBarcode6Module,
    MatTabsModule,
    MatMenuModule,
    MatDialogModule,
    SharedModule,
    MatDatepickerModule,
    MatAutocompleteModule,
    MatSelectModule,
    MatListModule,
    MatProgressSpinnerModule,
    RouterModule,
    MatCheckboxModule,
    ScrollingModule,
    AdminModule,
    MatBadgeModule,
    MatSliderModule,
    MatProgressBarModule,
    MatSlideToggleModule,
  ]
})
export class ProductModule { }
