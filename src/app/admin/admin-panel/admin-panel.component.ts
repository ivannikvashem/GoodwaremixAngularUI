import { Component, OnInit } from '@angular/core';
import {ApiClient} from "../../service/httpClient";
import {NotificationService} from "../../service/notification-service";

@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.css']
})
export class AdminPanelComponent implements OnInit {

  constructor(private api:ApiClient, private _notyf:NotificationService) { }

  ngOnInit(): void {}

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
}
