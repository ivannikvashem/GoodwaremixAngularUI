import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ProductDocumentEditComponent} from "../product-document-edit/product-document-edit.component";
import {Document} from "../../models/document.model";
import {DataSource} from "@angular/cdk/collections";
import {Observable, ReplaySubject} from "rxjs";
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

  dataToDisplayDoc:any = [];
  documentColumns:string[] = ['title', 'action']
  dataSource = new MatTableDataSource<any>()
  documentDataSource = new DocumentDataSource(this.dataToDisplayDoc)
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
          this.documentDataSource.setData(this.documentsView || []);
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
              console.log(result)
              setTimeout(() => {
                this.documentsView.push(result.newDocument as Document)
                this.documentDataSource.setData(this.documentsView || []);
                this.documentList.next( this.documentsView.map(x => x.id))
              },200)
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
    this.documentDataSource.setData(this.documentsView || [])
  }
}

class DocumentDataSource extends DataSource<Document> {
  private _dataStream = new ReplaySubject<Document[]>();
  constructor(initialData: Document[]) {
    super();
    this.setData(initialData);
  }
  connect(): Observable<Document[]> {
    return this._dataStream;
  }
  disconnect() {}
  setData(data: Document[]) {
    this._dataStream.next(data);
  }
}
