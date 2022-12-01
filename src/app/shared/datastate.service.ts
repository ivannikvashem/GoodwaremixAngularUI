import {Supplier} from "../models/supplier.model";
import {BehaviorSubject, Observable} from "rxjs";
import {Injectable} from "@angular/core";
import {LocalStorageService} from "../service/local-storage.service";
import {SupplierAutocompleteComponent} from "./supplier-autocomplete/supplier-autocomplete.component";

@Injectable()
export class DatastateService {

  // availableSuppliersList: Supplier[];
  selectedSupplier: Supplier;

  selectedSupplierState: BehaviorSubject<Supplier> = new BehaviorSubject(new Supplier());
  data$: Observable<Supplier> = this.selectedSupplierState.asObservable()

  constructor() {
  }

  setSelectedSupplier(supplier: Supplier) {
    this.selectedSupplierState.next(supplier)
  }
}
