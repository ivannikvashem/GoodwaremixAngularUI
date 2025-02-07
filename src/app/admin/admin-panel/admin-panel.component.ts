import { Component, OnInit } from '@angular/core';
import {ApiClient} from "../../service/httpClient";
import {NotificationService} from "../../service/notification-service";
import {
  ConfirmDialogComponent,
  ConfirmDialogModel
} from "../../components/shared/confirm-dialog/confirm-dialog.component";
import {MatDialog} from "@angular/material/dialog";
import {SuppliersDataSource} from "../../supplier/repo/SuppliersDataSource";

@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.scss']
})
export class AdminPanelComponent implements OnInit {

  constructor(private api:ApiClient, private _notyf:NotificationService, public dialog: MatDialog, private supplierDS: SuppliersDataSource) { }

  ngOnInit(): void {}

  fullInit() {
    const message = `Запустить инициализацию БД ?`;
    const dialogData = new ConfirmDialogModel("Подтверждение", message);
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: "500px",
      data: dialogData
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult === true) {
        this.api.postRequest('service/initOld', {}).subscribe({
          next: () => {
            this._notyf.onSuccess("Инициализация БД начата")
          },
          error: err => {
            this._notyf.onError("Ошибка: " + JSON.stringify(err));
          },})
      }
    });
  }

  fixSupplierStat() {
    this.api.postRequest('service/cleanstat', {}).subscribe({
      next: () => {
        this._notyf.onSuccess("Обновление статистики")
      },
      error: err => {
        this._notyf.onError("Ошибка: " + JSON.stringify(err));
      },})
  }

  downloadTable(table:string, supplierId?:string) {
    this.supplierDS.downloadTableFile(table,supplierId).subscribe((p:any) =>{
      let downloadAction = document.createElement('a')
      downloadAction.download = table;
      downloadAction.href = window.URL.createObjectURL(new Blob([p.body], {type: 'application/json; charset=utf-8'}))
      downloadAction.click()
    })
  }

}
