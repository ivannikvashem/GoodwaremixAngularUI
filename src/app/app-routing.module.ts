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
import {UserIndexComponent} from "./users/user-index/user-index.component";
import {UserDetailsComponent} from "./users/user-details/user-details.component";
import {PageNotFoundComponent} from "./shared/page-not-found/page-not-found.component";
import {DocumentComponent} from "./document/document.component";
import {SupplierComponent} from "./supplier/supplier.component";
import {UnitConverterComponent} from "./unit-converter/unit-converter.component";
import {StatisticComponent} from "./statistic/statistic.component";

let routes: Routes;
routes = [
  {path: 'products', component: ProductComponent, canActivate: [AuthGuard], data: {roles: ['goodware-users']}},
  {path: 'product-details/:id', component: ProductDetailsComponent, canActivate: [AuthGuard], data: {roles: ['goodware-users']}},
  {path: 'product-add', component: ProductEditComponent, canActivate: [AuthGuard], data: {roles: ['goodware-manager']}},
  {path: 'product-edit/:id', component: ProductEditComponent, canActivate: [AuthGuard], data: {roles: ['goodware-manager']}},
  {path: 'attributes', component: AttributeComponent, canActivate: [AuthGuard], data: {roles: ['goodware-manager']}},
  {path: 'attribute-add', component: AttributeEditComponent, canActivate: [AuthGuard], data: {roles: ['goodware-manager']}},
  {path: 'attribute-edit/:id', component: AttributeEditComponent, canActivate: [AuthGuard], data: {roles: ['goodware-manager']}},
  {path: 'suppliers', component: SupplierComponent, canActivate: [AuthGuard], data: {roles: ['goodware-manager']}},
  {path: 'supplier-add', component: SupplierEditComponent, canActivate: [AuthGuard], data: {roles: ['goodware-admin']}},
  {path: 'supplier-edit/:supplierId', component: SupplierEditComponent, canActivate: [AuthGuard], data: {roles: ['goodware-admin']}},
  {path: 'log', component: LogComponent, canActivate: [AuthGuard], data: {roles: ['goodware-admin']}},
  {path: 'admin', component: AdminComponent, canActivate: [AuthGuard], data: {roles: ['goodware-admin']}},
  {path: 'task', component: TaskIndexComponent, canActivate: [AuthGuard], data: {roles: ['goodware-admin']}},
  {path: 'users', component: UserIndexComponent, canActivate: [AuthGuard], data: {roles: ['goodware-admin']}},
  {path: 'user-add', component: UserDetailsComponent, canActivate: [AuthGuard], data: {roles: ['goodware-admin']}},
  {path: 'user-edit/:id', component: UserDetailsComponent, canActivate: [AuthGuard], data: {roles: ['goodware-admin']}},
  {path: 'page-not-found', component: PageNotFoundComponent},
  {path: 'documents', component: DocumentComponent, canActivate: [AuthGuard], data: {roles: ['goodware-users']}},
  {path: 'units', component: UnitConverterComponent, canActivate: [AuthGuard], data: {roles: ['goodware-admin']}},
  {path: 'home', component: StatisticComponent, canActivate: [AuthGuard], data: {roles: ['goodware-users']}},
  {path: '**', pathMatch: 'full', redirectTo: '/home'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {scrollPositionRestoration: 'enabled'})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
