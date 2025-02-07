import {Supplier} from "../models/supplier.model";
import {BehaviorSubject, take} from "rxjs";
import {Injectable} from "@angular/core";
import {LocalStorageService} from "../service/local-storage.service";
import {SettingsModel} from "../models/service/settings.model";

@Injectable()
export class DataStateService {

  private selectedSupplierState: BehaviorSubject<Supplier | null> = new BehaviorSubject(null);
  private selectedProductsState: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([])
  private supplierList: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([])
  private settings: BehaviorSubject<SettingsModel> = new BehaviorSubject<SettingsModel>(null)

  constructor(private _localStorageService: LocalStorageService) {
    this.getCookie();
  }

  pageCookie$ = this._localStorageService.myData$;

  getCookie() {
    this._localStorageService.getDataByPageName("SupplierAutocomplete")
    this.pageCookie$.pipe(take(1)).subscribe((localStorageContent:any) => {
      if (localStorageContent) {
        this.setSelectedSupplier(localStorageContent?.id, localStorageContent?.supplierName)
      }
    });

    this._localStorageService.getDataByPageName("Settings")
    this.pageCookie$.pipe(take(1)).subscribe((localStorageContent:any) => {
      if (localStorageContent) {
        this.setSettings(new BehaviorSubject<SettingsModel>({menuState: /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) ? false : localStorageContent.menuState, scrollPageToTop: localStorageContent.scrollPageToTop, isPaginatorFixed: localStorageContent.isPaginatorFixed}));
      }
    });
  }

  setCookie() {
    this._localStorageService.setDataByPageName("SupplierAutocomplete", {
      id: this.selectedSupplierState.value.id, supplierName:this.selectedSupplierState.value.supplierName,
    });
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
    this.setCookie();
  }

  getSelectedSupplier() {
    return this.selectedSupplierState;
  }

  clearSelectedSupplier() {
    this.selectedSupplierState.next(new Supplier());
    this.setCookie();
  }

  setSelectedProduct(selectedItem:any) {
    if (this.selectedProductsState.value.filter(x => x.id === selectedItem.id).length == 0) {
      this.selectedProductsState.next(this.selectedProductsState.getValue().concat([selectedItem]))
    }
  }

  getSelectedProducts() {
    return this.selectedProductsState;
  }

  removeSelectedProduct(id:string) {
    this.selectedProductsState.next(this.selectedProductsState.getValue().filter(x => x.id != id))
  }

  clearSelectedProducts() {
    this.selectedProductsState.next([])
  }

  setSettings(settings:BehaviorSubject<SettingsModel>) {
    this.settings.next(settings.value);
  }

  getSettings() {
    if (this.settings.value == null) {
      return new BehaviorSubject<SettingsModel>({isPaginatorFixed: true, menuState: true, scrollPageToTop: false});
    } else {
      return this.settings;
    }
  }
}
