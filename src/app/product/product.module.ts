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

@NgModule({
  declarations: [
    ProductIndexComponent,
    ProductDetailsComponent,
    ProductEditComponent,
    HoverImageSliderComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    MatInputModule,
    MatPaginatorModule,
    MatSortModule,
    MatTableModule,
    SharedModule,
    MatButtonModule,
    MatIconModule,
    MatButtonToggleModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatTabsModule,
    MatCardModule,
    MatExpansionModule,
    MatChipsModule,
  ]
})
export class ProductModule { }
