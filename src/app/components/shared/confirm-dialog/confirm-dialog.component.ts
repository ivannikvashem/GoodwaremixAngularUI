import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-confirm-dialog',
  styles: [
    '.dialog-button {flex: 0 0 48%}'
  ],
  template: '<h1 mat-dialog-title>{{title}}</h1>\n' +
    '<div mat-dialog-content><p>{{message}}</p> </div>\n' +
    '<div mat-dialog-actions>\n' +
    '  <button mat-raised-button color="primary" (click)="onConfirm()" class="dialog-button">ОК</button>\n' +
    '  <button mat-button (click)="onDismiss()" class="dialog-button">Отмена</button>\n' +
    '</div>\n'
})
export class ConfirmDialogComponent implements OnInit {

  title: string;
  message: string;

  constructor(public dialogRef: MatDialogRef<ConfirmDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: ConfirmDialogModel) {
    this.title = data.title;
    this.message = data.message;
  }

  ngOnInit(): void {}

  onConfirm(): void {
    this.dialogRef.close(true);
  }

  onDismiss(): void {
    this.dialogRef.close(false);
  }

}

export class ConfirmDialogModel {
  constructor(public title: string, public message: string) {}
}
