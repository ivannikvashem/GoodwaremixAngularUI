import {Supplier} from "../models/supplier.model";
import {BehaviorSubject, Observable} from "rxjs";
import {Injectable} from "@angular/core";

@Injectable()
export class DatastateService {

  // availableSuppliersList: Supplier[];
  selectedSupplier: Supplier;

  selectedSupplierState: BehaviorSubject<Supplier> = new BehaviorSubject(new Supplier());
  data$: Observable<Supplier> = this.selectedSupplierState.asObservable()

  constructor() {
  }

  setSelectedSupplier(id:string, name:string) {
    console.log(`DSS: ${id} - ${name}`);
    this.selectedSupplierState.next({id:id, supplierName:name} as Supplier)
  }
}
