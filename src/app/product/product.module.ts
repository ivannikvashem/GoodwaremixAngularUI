import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatPaginatorModule} from "@angular/material/paginator";
import {MatSortModule} from "@angular/material/sort";
import {MatTableModule} from "@angular/material/table";
import {SharedModule} from "../shared/shared.module";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {ProductIndexComponent} from "./product-index/product-index.component";
import {ProductDetailsComponent} from "./product-details/product-details.component";
import {ProductEditComponent} from "./product-edit/product-edit.component";
import {MatButtonToggleModule} from "@angular/material/button-toggle";
import {MatFormFieldModule} from "@angular/material/form-field";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatTabsModule} from "@angular/material/tabs";
import {MatCardModule} from "@angular/material/card";
import {MatInputModule} from "@angular/material/input";
import {MatExpansionModule} from "@angular/material/expansion";
import {MatChipsModule} from "@angular/material/chips";
import {HoverImageSliderComponent} from "./hover-image-slider/hover-image-slider.component";
import {MatTooltipModule} from "@angular/material/tooltip";
import {NgxBarcode6Module} from 'ngx-barcode6';
import {MatMenuModule} from "@angular/material/menu";
import {PackageCardComponent} from "./package-card/package-card.component";
import {ProductPackageEditComponent} from "./product-package-edit/product-package-edit.component";
import {ProductDocumentEditComponent} from "./product-document-edit/product-document-edit.component";
import {ProductAttributeEditComponent} from "./product-attribute-edit/product-attribute-edit.component";
import {MatDialogModule} from "@angular/material/dialog";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import {MatSelectModule} from "@angular/material/select";
import {MatListModule} from "@angular/material/list";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {RouterModule} from "@angular/router";
import { ProductComponent } from './product.component';
import { ImagePreviewDialogComponent } from './image-preview-dialog/image-preview-dialog.component';
import { AttributeFilterComponent } from './attribute-filter/attribute-filter.component';
import { ProductIcFilterSwitchComponent } from './product-ic-filter-switch/product-ic-filter-switch.component';
import {MatCheckboxModule} from "@angular/material/checkbox";
import { ProductDocumentListComponent } from './product-document-list/product-document-list.component';
import {ScrollingModule} from "@angular/cdk/scrolling";
import { ProductCardComponent } from './product-card/product-card.component';
import { ProductSelectedListComponent } from './product-selected-list/product-selected-list.component';
import {AdminModule} from "../admin/admin.module";
import {MatBadgeModule} from "@angular/material/badge";
import {MatSliderModule} from "@angular/material/slider";
import {MatProgressBarModule} from "@angular/material/progress-bar";
import {
  ProductVerifiedFilterSwitchComponent
} from "./product-verified-filter-switch/product-verified-filter-switch.component";
import {MatSlideToggleModule} from "@angular/material/slide-toggle";
import { ProductCategoryFilterSwitchComponent } from './product-category-filter-switch/product-category-filter-switch.component';
import {PdfViewerModule} from "ng2-pdf-viewer";

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
    ProductCategoryFilterSwitchComponent,
  ],
    exports: [
        HoverImageSliderComponent,
        ProductCardComponent,
        PackageCardComponent
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
        PdfViewerModule
    ]
})
export class ProductModule { }
