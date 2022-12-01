import { Component } from '@angular/core';
import {environment} from '../environments/environment';
import {LocalStorageService} from "./service/local-storage.service";
import {DatastateService} from "./shared/datastate.service";
import {Supplier} from "./models/supplier.model";

class mainLayoutCookie {
  supplier: Supplier;

  constructor() {
    this.supplier = {id: ''} as Supplier;
  }
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = environment.production ? 'GoodWareMix UI' : 'Dev GoodWare';
  url = environment.apiURL;
  pageCookie$ = this._localStorageService.myData$
  pC:any ={}
  selectedSupplier:Supplier;

  constructor(private _localStorageService: LocalStorageService, private dss:DatastateService) {
  }

  setCookie() {
    // on each interaction - save all controls state to cookies
    //let supp = this.dss.getSelectedSupplier;
    this._localStorageService.setDataByPageName("mainLayout", {
      supplier: {id: this.selectedSupplier.id, supplierName: this.selectedSupplier.supplierName}
    });
  }

  getCookie() {
    //try to get cookie, if there's no cookie - make the blank and save
    this._localStorageService.getDataByPageName("mainLayout") as mainLayoutCookie; //pretty wrong, upd data
    /*this.sub = */
    this.pageCookie$.subscribe(x => {
      if (!x) return;
      this.pC = x;
      //this.selectedSupplier = this.pC.supplier
      this.dss.setSelectedSupplier(this.pC.supplier);
    });
  }

  ngOnInit() {
    this.getCookie()
  }

  handleChangeSelectedSupplier(supplier: Supplier) {
    this.selectedSupplier = supplier
    this.setCookie()
  }
}
