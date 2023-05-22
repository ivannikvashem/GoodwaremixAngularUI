import {Supplier} from "../models/supplier.model";
import {BehaviorSubject} from "rxjs";
import {Injectable} from "@angular/core";

@Injectable()
export class DataStateService {

  selectedSupplierState: BehaviorSubject<Supplier | null> = new BehaviorSubject(null);

  selectedProductsState: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([])
  // availableSuppliersList: Supplier[];
  //data$: Observable<Supplier> = this.selectedSupplierState.asObservable();

  constructor() {
  }

  setSelectedSupplier(id:string, name:string) {
    console.log(`DSS: ${id} - ${name}`);
    this.selectedSupplierState.next({id:id, supplierName:name} as Supplier);
    //console.log(`...DSS: ${this.selectedSupplierState}`);
  }

  setSelectedProduct(selectedItem:any) {
    if (this.selectedProductsState.value.filter(x => x.id === selectedItem.id).length == 0) {
      this.selectedProductsState.next(this.selectedProductsState.getValue().concat([selectedItem]))
    }
  }

  removeSelectedProduct(id:string) {
    this.selectedProductsState.next(this.selectedProductsState.getValue().filter(x => x.id != id))
  }

  clearSelectedProducts() {
    this.selectedProductsState.next([])
  }
}
