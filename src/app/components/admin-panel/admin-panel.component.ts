import { Component, OnInit } from '@angular/core';
import {ApiClient} from "../../repo/httpClient";
import {NotificationService} from "../../service/notification-service";
import {Supplier} from "../../models/supplier.model";
import {MatTableDataSource} from "@angular/material/table";
import {SelectionModel} from "@angular/cdk/collections";

@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.css']
})
export class AdminPanelComponent implements OnInit {

  constructor(private api:ApiClient,
              private _notyf:NotificationService) { }
  displayedColumns: string[] = ['checkbox', 'supplier', 'Stat.ProductQty', 'Stat.lastImport'];
  supplierDataSource = new MatTableDataSource<Supplier>()
  selection = new SelectionModel<Supplier>(true, []);

  ngOnInit(): void {
    this.api.getSuppliers('', 0, 100, "SupplierName", "asc").subscribe((r: any) => {
      this.supplierDataSource.data = r.body.data
    });
  }

  fetchItem(supplierName: any) {
    this.api.fetchDataFromSupplier(supplierName).subscribe({
      next: next => {
        this._notyf.onSuccess('Сбор данных '+supplierName+' начат')
      },
      error: err => {
        this._notyf.onError("Ошибка: " + JSON.stringify(err));
      }})
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
      let downloadAction = document.createElement('a')
      downloadAction.download = table;
      downloadAction.href = window.URL.createObjectURL(new Blob([p.body], {type: 'application/json; charset=utf-8'}))
      downloadAction.click()
    })
  }

  fetchSelectedItems() {
    let suppliers = ''
    for (let i of this.selection.selected) {
      suppliers += i.id+';'
    }
    this.api.fetchDataFromSupplier(suppliers).subscribe({
      next:next => {
        this._notyf.onSuccess('Сбор данных начат')
      }, error:error => {
        this._notyf.onError('Ошибка' +JSON.stringify(error))
      }})
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.supplierDataSource.data.length;
    return numSelected === numRows;
  }

  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear()
      return
    }
    this.selection.select(...this.supplierDataSource.data)
  }

  applyFilter($event: Event) {
    const filterValue = ($event.target as HTMLInputElement).value;
    this.supplierDataSource.filter = filterValue.trim().toLowerCase();
  }
}
