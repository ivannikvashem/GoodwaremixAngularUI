import {Supplier} from "../models/supplier.model";
import {BehaviorSubject} from "rxjs";
import {Injectable} from "@angular/core";

@Injectable()
export class DataStateService {

  private selectedSupplierState: BehaviorSubject<Supplier | null> = new BehaviorSubject(null);
  private selectedProductsState: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([])
  private supplierList: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([])

  constructor() {
  }

  setSupplierList(suppliers:Supplier[]) {
    this.supplierList.next(suppliers)
  }

  getSupplierList() {
    return this.supplierList.value;
  }

  setSelectedSupplier(id:string, name:string) {
    console.log(`DSS: ${id} - ${name}`);
    this.selectedSupplierState.next({id:id, supplierName:name} as Supplier);
    //console.log(`...DSS: ${this.selectedSupplierState}`);
  }

  getSelectedSupplier() {
    return this.selectedSupplierState;
  }

  setSelectedProduct(selectedItem:any) {
    if (this.selectedProductsState.value.filter(x => x.id === selectedItem.id).length == 0) {
      this.selectedProductsState.next(this.selectedProductsState.getValue().concat([selectedItem]))
    }
  }

  getSelectedProducts() {
    return this.selectedProductsState;
  }

  isProductSelected(id:string) {
    console.log(id)
    return this.selectedProductsState.value.map((x:any) => x.id === id) ? true : false;
  }

  removeSelectedProduct(id:string) {
    this.selectedProductsState.next(this.selectedProductsState.getValue().filter(x => x.id != id))
  }

  clearSelectedProducts() {
    this.selectedProductsState.next([])
  }
}
