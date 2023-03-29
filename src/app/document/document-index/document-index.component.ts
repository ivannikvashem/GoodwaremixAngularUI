import { Component, OnInit } from '@angular/core';
import {ApiClient} from "../../service/httpClient";
import {Document} from "../../models/document.model";
import {FormControl} from "@angular/forms";
import {PageEvent} from "@angular/material/paginator";
import {
  ConfirmDialogComponent,
  ConfirmDialogModel
} from "../../components/shared/confirm-dialog/confirm-dialog.component";
import {MatDialog} from "@angular/material/dialog";
import {ProductDocumentEditComponent} from "../../product/product-document-edit/product-document-edit.component";

@Component({
  selector: 'app-document-index',
  templateUrl: './document-index.component.html',
  styleUrls: ['./document-index.component.css']
})
export class DocumentIndexComponent implements OnInit {
  searchQueryCtrl = new FormControl<string>('');
  documentList:Document[] = []
  totalRecordsLength:number

  constructor(private api: ApiClient, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.loadDocuments()
  }

  searchQueryChanged(searchQuery:string) {
    this.loadDocuments(searchQuery)
  }

  loadDocuments(searchQuery?:string, pageIndex?:number, pageSize?:number) {
    this.api.getDocuments(searchQuery || '', pageIndex || 0, pageSize || 12,'','desc').subscribe(x => {
      this.documentList = x.body.data
      this.totalRecordsLength = x.body.totalRecords
    });
  }

  handlePageEvent(pageEvent: PageEvent) {
    this.loadDocuments('', pageEvent.pageIndex, pageEvent.pageSize)
  }

  onDocumentSelected(selected: any) {
    if (selected.toDelete) {
      const message = `Удалить документ ` + (selected.document.certNumber ? `№ ` + selected.document.certNumber : '') + ` ?`;
      const dialogData = new ConfirmDialogModel("Подтверждение", message);
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        minWidth: "400px",
        data: dialogData
      });
      dialogRef.afterClosed().subscribe(dialogResult => {
        if (dialogResult === true) {
          console.log('delete event')
        }
      });
    }
  }

  addDocumentDialog() {
    const dialogRef = this.dialog.open(ProductDocumentEditComponent, {
      width: '1050px',
      autoFocus: false,
      data: {oldDocument: new Document(), newDocument: new Document() },
    });
  }
}
