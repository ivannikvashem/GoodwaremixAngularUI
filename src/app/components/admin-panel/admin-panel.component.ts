import { Component, OnInit } from '@angular/core';
import {ApiClient} from "../../repo/httpClient";
import {NotificationService} from "../../service/notification-service";

@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.css']
})
export class AdminPanelComponent implements OnInit {

  constructor(private api:ApiClient,
              private _notyf:NotificationService) { }

  ngOnInit(): void {
  }

  fetchItem(supplierName: any) {
    this.api.fetchDataFromSupplier(supplierName).subscribe( res => {
        this._notyf.onSuccess('Сбор данных '+supplierName+' начат')
      },
      err => {
        this._notyf.onError("Ошибка: " + JSON.stringify(err));
      })
  }

  fullInit() {
    console.log("full init");
    this.api.fullInit().subscribe( res => {
        console.log(JSON.stringify(res));
      },
      err => {
        this._notyf.onError("Ошибка: " + JSON.stringify(err));
      })
  }

  fixSupplierStat() {
    console.log("fixSupplierStat ");
    this.api.fixSupplierStat().subscribe( res => {
        console.log(JSON.stringify(res));
      },
      err => {
        this._notyf.onError("Ошибка: " + JSON.stringify(err));
      })
  }

  downloadTable(table:string, supplierId?:string) {
    this.api.downloadTableFile(table,supplierId).subscribe((p:any) =>{
      let blob:any = new Blob([p.body], {type: 'application/json; charset=utf-8'})
      let downloadAction = document.createElement('a')
      downloadAction.download = table;
      downloadAction.href = window.URL.createObjectURL(blob)
      downloadAction.click()
    })
  }
}
