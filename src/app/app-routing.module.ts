import { NgModule } from '@angular/core';
import {RouterModule, Routes} from "@angular/router";
import {AttributeEditComponent} from "./attribute/attribute-edit/attribute-edit.component";
import {SupplierEditComponent} from "./supplier/supplier-edit/supplier-edit.component";
import {ProductDetailsComponent} from "./product/product-details/product-details.component";
import {ProductEditComponent} from "./product/product-edit/product-edit.component";
import {AdminComponent} from "./admin/admin.component";
import {TaskIndexComponent} from "./task/task-index/task-index.component";
import {LogComponent} from "./log/log.component";
import {ProductComponent} from "./product/product.component";
import {AttributeComponent} from "./attribute/attribute.component";
import {AuthGuard} from "./auth/auth.guard";
import {UserDetailsComponent} from "./users/user-details/user-details.component";
import {PageNotFoundComponent} from "./shared/page-not-found/page-not-found.component";
import {DocumentComponent} from "./document/document.component";
import {SupplierComponent} from "./supplier/supplier.component";
import {UnitConverterComponent} from "./unit-converter/unit-converter.component";
import {StatisticComponent} from "./statistic/statistic.component";
import {UserComponent} from "./users/user.component";
import {CategoryComponent} from "./category/category.component";

let routes: Routes;
routes = [
  {path: 'products', component: ProductComponent, data: {roles: ['goodware-users']}},
  {path: 'products/:categoryId', component: ProductComponent, data: {roles: ['goodware-users']}},
  {path: 'product-details/:id', component: ProductDetailsComponent, data: {roles: ['goodware-users']}},
  {path: 'product-add', component: ProductEditComponent, data: {roles: ['goodware-manager']}},
  {path: 'product-edit/:id', component: ProductEditComponent, data: {roles: ['goodware-manager']}},
  {path: 'attributes', component: AttributeComponent, data: {roles: ['goodware-manager']}},
  {path: 'attribute-add', component: AttributeEditComponent, data: {roles: ['goodware-manager']}},
  {path: 'attribute-edit/:id', component: AttributeEditComponent, data: {roles: ['goodware-manager']}},
  {path: 'suppliers', component: SupplierComponent, data: {roles: ['goodware-manager']}},
  {path: 'supplier-add', component: SupplierEditComponent, data: {roles: ['goodware-admin']}},
  {path: 'supplier-edit/:supplierId', component: SupplierEditComponent, data: {roles: ['goodware-admin']}},
  {path: 'log', component: LogComponent, data: {roles: ['goodware-admin']}},
  {path: 'admin', component: AdminComponent, data: {roles: ['goodware-admin']}},
  {path: 'tasks', component: TaskIndexComponent, data: {roles: ['goodware-admin']}},
  {path: 'users', component: UserComponent, data: {roles: ['goodware-admin']}},
  {path: 'user-add', component: UserDetailsComponent, data: {roles: ['goodware-admin']}},
  {path: 'user-edit/:id', component: UserDetailsComponent, data: {roles: ['goodware-admin']}},
  {path: 'page-not-found', component: PageNotFoundComponent},
  {path: 'documents', component: DocumentComponent, data: {roles: ['goodware-admin']}},
  {path: 'units', component: UnitConverterComponent, data: {roles: ['goodware-admin']}},
  {path: 'home', component: StatisticComponent, data: {roles: ['goodware-manager']}},
  {path: 'categories', component: CategoryComponent, data: {roles: ['goodware-admin']}},
  {path: '', pathMatch: 'full', redirectTo: '/products'},
  {path: '**', pathMatch: 'full', redirectTo:'/products'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {scrollPositionRestoration: 'enabled'})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
