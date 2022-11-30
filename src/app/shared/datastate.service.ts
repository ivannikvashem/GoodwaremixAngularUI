import {Supplier} from "../models/supplier.model";
import {BehaviorSubject} from "rxjs";
import {Injectable} from "@angular/core";

@Injectable()
export class DatastateService {

  // availableSuppliersList: Supplier[];
  // selectedSupplier: Supplier;
  selectedSupplierId: BehaviorSubject<string> = new BehaviorSubject('');

  constructor() {
  }

  setSelectedSupplierId(id: string) {
    this.selectedSupplierId.next(id)
    console.log("id selected: " + id);
  }
}
