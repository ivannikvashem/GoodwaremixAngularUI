import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ProductDocumentEditComponent} from "../product-document-edit/product-document-edit.component";
import {Document} from "../../models/document.model";
import {MatTableDataSource} from "@angular/material/table";
import {MatDialog} from "@angular/material/dialog";
import {NotificationService} from "../../service/notification-service";
import {ApiClient} from "../../service/httpClient";

@Component({
  selector: 'app-product-document-list',
  templateUrl: './product-document-list.component.html',
  styleUrls: ['./product-document-list.component.css']
})
export class ProductDocumentListComponent implements OnInit {

  //TEMP
  imgPlaceholder:string = "https://mosbetontorg.ru/upload/iblock/17d/17d912c7a93426a0214cf2ca955cd8eb.jpg";

  dataSource = new MatTableDataSource<any>()
  documentsView:Document[] = []
  isLoading:boolean = false;
  constructor(public dialog: MatDialog, private _notyf: NotificationService, private api:ApiClient) { }
  @Input() document:string[] = []
  @Input() supplierId:string
  @Output() documentList = new EventEmitter<string[]>();


  ngOnInit(): void {
    if (this.document) {
      this.api.getDocumentsById(this.document).subscribe((response) => {
        if (response.status == 200)
          if (response.body.length > 0) {
            for (let i of response.body) {
              this.documentsView.push(i)
            }
          }
        })
    }
  }

  openDocumentEditorDialog(oldDocument?:any): void {
    if (this.supplierId) {
      const dialogRef = this.dialog.open(ProductDocumentEditComponent, {
        width: '1200px',
        autoFocus: false,
        data: {supplierId:this.supplierId, oldDocument: oldDocument, newDocument: new Document() },
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result != undefined && result != '') {
          if (this.documentsView.filter(x => x !== result?.newDocument)) {
            if (oldDocument == undefined) {
              this.documentsView.push(result.newDocument as Document)
              this.documentList.next( this.documentsView.map(x => x.id))
            } else {
              if (oldDocument !== result.newDocument) {
                const target = this.documentsView.find((obj) => obj === oldDocument)
                Object.assign(target, result.newDocument)
              }
            }
          }
        }
      });

    } else {
      this._notyf.onWarning('Выберите поставщика')
    }
  }

  deleteDocRow(row:any) {
    this.documentsView = this.documentsView.filter(dc => (dc != row))
    this.documentList.next(this.documentsView.map(x => x.id))
  }
}
