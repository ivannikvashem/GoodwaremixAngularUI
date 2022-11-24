import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from "@angular/router";
import {ProductIndexComponent} from "./product/product-index/product-index.component";
import {AttributeIndexComponent} from "./attribute/attribute-index/attribute-index.component";
import {AttributeEditComponent} from "./attribute/attribute-edit/attribute-edit.component";
import {SupplierIndexComponent} from "./supplier/supplier-index/supplier-index.component";
import {SupplierEditComponent} from "./supplier/supplier-edit/supplier-edit.component";
import {ParserLogComponent} from "./log/parser-log/parser-log.component";
import {ProductDetailsComponent} from "./product/product-details/product-details.component";
import {ProductEditComponent} from "./product/product-edit/product-edit.component";
import {AdminPanelComponent} from "./admin/admin-panel/admin-panel.component";
import {TaskIndexComponent} from "./task/task-index/task-index.component";

const routes: Routes = [

  {path: 'products', component: ProductIndexComponent},
  {path: 'product-details/:id', component: ProductDetailsComponent},
  {path: 'product-add', component: ProductEditComponent},
  {path: 'product-edit/:id', component: ProductEditComponent},
  {path: 'attributes', component: AttributeIndexComponent},
  {path: 'attribute-add', component: AttributeEditComponent},
  {path: 'attribute-edit/:id', component: AttributeEditComponent},
  {path: 'suppliers', component: SupplierIndexComponent},
  {path: 'supplier-add', component: SupplierEditComponent},
  {path: 'supplier-edit/:supplierId', component: SupplierEditComponent},
  {path: 'log', component: ParserLogComponent},
  {path:'admin', component: AdminPanelComponent},
  {path: 'task', component: TaskIndexComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {scrollPositionRestoration: 'enabled'})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
