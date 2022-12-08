import {Supplier} from "../models/supplier.model";
import {BehaviorSubject} from "rxjs";
import {Injectable} from "@angular/core";

@Injectable()
export class DataStateService {

  selectedSupplierState: BehaviorSubject<Supplier | null> = new BehaviorSubject(null);

  // availableSuppliersList: Supplier[];
  //data$: Observable<Supplier> = this.selectedSupplierState.asObservable();

  constructor() {
  }

  setSelectedSupplier(id:string, name:string) {
    console.log(`DSS: ${id} - ${name}`);
    this.selectedSupplierState.next({id:id, supplierName:name} as Supplier);
    //console.log(`...DSS: ${this.selectedSupplierState}`);
  }
}
