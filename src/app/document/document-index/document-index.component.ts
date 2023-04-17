import {Component, EventEmitter, Input, OnInit, Output, SimpleChanges, ViewChild} from '@angular/core';
import {ApiClient} from "../../service/httpClient";
import {Document} from "../../models/document.model";
import {FormControl} from "@angular/forms";
import {MatPaginator, PageEvent} from "@angular/material/paginator";
import {
  ConfirmDialogComponent,
  ConfirmDialogModel
} from "../../components/shared/confirm-dialog/confirm-dialog.component";
import {MatDialog} from "@angular/material/dialog";
import {ProductDocumentEditComponent} from "../../product/product-document-edit/product-document-edit.component";
import {ImagePreviewDialogComponent} from "../../product/image-preview-dialog/image-preview-dialog.component";
import {Supplier} from "../../models/supplier.model";
import {DocumentsDataSource} from "../repo/DocumentsDataSource";
import {tap} from "rxjs";
import {MissingImageHandler} from "../../product/MissingImageHandler";
import {MatSort} from "@angular/material/sort";

@Component({
  selector: 'app-document-index',
  templateUrl: './document-index.component.html',
  styleUrls: ['./document-index.component.css']
})
export class DocumentIndexComponent implements OnInit {

  dataSource: DocumentsDataSource;
  searchQueryCtrl = new FormControl<string>('');
  documentList:Document[] = []
  totalRecordsLength:number

  // table view
  displayedColumns: string[] = ['preview', 'number', 'title', 'actions'];

  @Input() searchQuery:string;
  //selectedSupplier: Supplier = this.dss.selectedSupplierState.value
  @Input() selectedSupplier: Supplier;
  @Input() pageIndex:number;
  @Input() pageSize:number;
  @Input() sortActive:string;
  @Input() sortDirection:string;
  @Output() pageParams:EventEmitter<any> = new EventEmitter();
  @Output() sortParams:EventEmitter<any> = new EventEmitter();

  constructor(
    private api: ApiClient,
    public dialog: MatDialog,
    private imgHandler:MissingImageHandler
  ) { this.dataSource = new DocumentsDataSource(this.api) }

  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator
  @ViewChild(MatSort) sort: MatSort;

  ngOnInit(): void {
    this.loadDocuments()
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.loadDocumentPagedData(false)
  }

  loadDocuments(searchQuery?:string, pageIndex?:number, pageSize?:number) {
    this.api.getDocuments(searchQuery || '', pageIndex || 0, pageSize || 12,'','desc').subscribe(x => {
      this.documentList = x.body.data
      this.totalRecordsLength = x.body.totalRecords
    });
  }

  ngAfterViewInit(): void {
    this.paginator.page
      .pipe(
        tap( () => {
          this.loadDocumentPagedData(true);
          this.pageParams.next({pageIndex: this.paginator.pageIndex, pageSize:this.paginator.pageSize})
        })).subscribe();
  }


  loadDocumentPagedData(isPaginatorParams:boolean): any {
    this.dataSource.loadPagedData(this.searchQuery, this.selectedSupplier?.id, isPaginatorParams ? this.paginator?.pageIndex : this.pageIndex,isPaginatorParams ? this.paginator?.pageSize : this.pageSize, this.sortActive, this.sortDirection);
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

  openPreviewInDialog(image: string) {
    let dialogBoxSettings = {
      margin: '0 auto',
      hasBackdrop: true,
      data: {
        src: image.replace("", ""),
      }
    };
    this.dialog.open(ImagePreviewDialogComponent, dialogBoxSettings);
  }

  openDocumentEditorDialog(oldDocument?:any): void {
    const dialogRef = this.dialog.open(ProductDocumentEditComponent, {
      width: '1050px',
      autoFocus: false,
      data: {documentIds:null, supplierId:oldDocument.supplierId, oldDocument: oldDocument, newDocument: new Document() },
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result != undefined && result != '') {
        this.loadDocumentPagedData(false)
      }
    });
  }

  handleMissingImage($event: Event) {
    this.imgHandler.checkImgStatus($event);
  }

  sortData(sort: any) {
    this.sortParams.next({direction: sort.direction, active:sort.active});
  }
}
