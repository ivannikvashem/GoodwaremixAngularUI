import { Component, OnInit } from '@angular/core';
import {ApiClient} from "../../repo/httpClient";
import {NotificationService} from "../../service/notification-service";
import {Supplier} from "../../models/supplier.model";
import {MatTableDataSource} from "@angular/material/table";

@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.css']
})
export class AdminPanelComponent implements OnInit {

  constructor(private api:ApiClient,
              private _notyf:NotificationService) { }
  supplierList:Supplier[] = []
  selectedSuppliersList:Supplier[] =[]
  displayedColumns: string[] = ['checkbox', 'supplier', 'Stat.ProductQty', 'Stat.lastImport'];
  supplierDataSource = new MatTableDataSource<Supplier>()

  ngOnInit(): void {
    this.api.getSuppliers('', 0, 100, "SupplierName", "asc").subscribe((r: any) => {
      this.supplierDataSource = r.body.data
    });
  }

  fetchItem(supplierName: any) {
    this.api.fetchDataFromSupplier(supplierName).subscribe({
      next: next => {
        this._notyf.onSuccess('Сбор данных '+supplierName+' начат')
      },
      error: err => {
        this._notyf.onError("Ошибка: " + JSON.stringify(err));
      },})
  }

  fullInit() {
    this.api.fullInit().subscribe({
      next: next => {
        this._notyf.onSuccess("Инициализация БД начата")
      },
      error: err => {
        this._notyf.onError("Ошибка: " + JSON.stringify(err));
      },})
    }

  fixSupplierStat() {
    this.api.fixSupplierStat().subscribe({
      next: next => {
        this._notyf.onSuccess("Обновление статистики")
      },
      error: err => {
        this._notyf.onError("Ошибка: " + JSON.stringify(err));
      },})
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

  fetchSelectedItems() {
    let suppliers = ''
    for (let i of this.selectedSuppliersList) {
      suppliers += i.supplierName+';'
    }
    this.api.fetchDataFromSupplier(suppliers).subscribe({
      next:next => {
        this._notyf.onSuccess('Сбор данных начат')
      }, error:error => {
        this._notyf.onError('Ошибка' +JSON.stringify(error))
      }, complete: () => { {this._notyf.onSuccess('Сбор данных закончен')}}
      }
    )
  }

  supplierChecked($event:any, supplier:Supplier) {
    if ($event.checked)
      this.selectedSuppliersList.push(supplier)
    else
      this.selectedSuppliersList = this.selectedSuppliersList.filter(sup => (sup !=supplier))
  }
}
