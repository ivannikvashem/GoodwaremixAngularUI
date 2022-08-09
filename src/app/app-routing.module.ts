import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from "@angular/router";
import {ProductIndexComponent} from "./components/product-index/product-index.component";
import {AttributeIndexComponent} from "./components/attribute-index/attribute-index.component";
import {AttributeEditComponent} from "./components/attribute-edit/attribute-edit.component";
import {SupplierIndexComponent} from "./components/supplier-index/supplier-index.component";
import {SupplierEditComponent} from "./components/supplier-edit/supplier-edit.component";
import {ParserLogComponent} from "./components/parser-log/parser-log.component";
import {ProductEditComponent} from "./components/product-edit/product-edit.component";

const routes: Routes = [
/*  {path: 'photosets-list', component: PhotsetListComponent},
  ,*/
  {path: 'products', component: ProductIndexComponent},
  {path: 'product-edit/:id', component: ProductEditComponent},
  {path: 'attributes', component: AttributeIndexComponent},
  {path: 'attribute-edit/:id', component: AttributeEditComponent},
  {path: 'suppliers', component: SupplierIndexComponent},
  {path: 'supplier-edit/:supplierName', component: SupplierEditComponent},
  {path: 'log', component: ParserLogComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
