import {Component, EventEmitter, Input, OnInit, Output, SimpleChanges, ViewChild} from '@angular/core';
import {ApiClient} from "../../service/httpClient";
import {Document} from "../../models/document.model";
import {FormControl} from "@angular/forms";
import {MatLegacyPaginator as MatPaginator} from "@angular/material/legacy-paginator";
import {
  ConfirmDialogComponent,
  ConfirmDialogModel
} from "../../components/shared/confirm-dialog/confirm-dialog.component";
import {MatLegacyDialog as MatDialog} from "@angular/material/legacy-dialog";
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
  styleUrls: ['./document-index.component.scss']
})
export class DocumentIndexComponent implements OnInit {

  dataSource: DocumentsDataSource;
  searchQueryCtrl = new FormControl<string>('');
  documentList:Document[] = []
  // table view
  displayedColumns: string[] = ['preview', 'number', 'certTitle', 'endDate', 'actions'];
  isLoading:boolean;

  @Input() searchQuery:string;
  //selectedSupplier: Supplier = this.dss.selectedSupplierState.value
  @Input() selectedSupplier: Supplier;
  @Input() pageIndex:number;
  @Input() pageSize:number;
  @Input() sortActive:string;
  @Input() sortDirection:string;
  @Input() isCardLayout:boolean;
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
    this.dataSource.loading$.subscribe(loadState => {
      this.isLoading = loadState
    })
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.loadDocumentPagedData()
  }

  ngAfterViewInit(): void {
    this.paginator.page
      .pipe(
        tap( () => {
          this.pageParams.next({pageIndex: this.paginator.pageIndex, pageSize:this.paginator.pageSize})
        })).subscribe();

    this.dataSource.connect(null).subscribe(x => {
      this.documentList = x;
    })

  }

  loadDocumentPagedData(): any {
    this.dataSource.loadPagedData(this.searchQuery, this.selectedSupplier?.id,  this.pageIndex, this.pageSize, this.sortActive, this.sortDirection);
    this.dataSource.connect(null).subscribe(x => {
      this.documentList = x;
    })
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
          this.dataSource.deleteDocument(selected.document.id)
        }
      });
    }
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
        this.loadDocumentPagedData()
      }
    });
  }

  handleMissingImage($event: Event) {
    this.imgHandler.checkImgStatus($event);
  }

  sortData(sort: any) {
    this.sortParams.next({direction: sort.direction, active:sort.active});
  }

  isDateValid(endDate:any) {
    return endDate > new Date().toISOString()
  }
}
