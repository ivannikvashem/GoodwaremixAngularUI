import {AfterViewInit, Component, Input, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import {ProductsDataSource} from "../repo/ProductsDataSource";
import {ApiClient} from "../../service/httpClient";
import {MatDialog} from "@angular/material/dialog";
import {ActivatedRoute, Router} from "@angular/router";
import {MatPaginator} from "@angular/material/paginator";
import {
  tap
} from "rxjs";
import {Supplier} from "../../models/supplier.model";
import {LocalStorageService} from "../../service/local-storage.service";
import {ConfirmDialogComponent, ConfirmDialogModel} from "../../components/shared/confirm-dialog/confirm-dialog.component";
import {NotificationService} from "../../service/notification-service";
import {ImagePreviewDialogComponent} from "../image-preview-dialog/image-preview-dialog.component";
import {MissingImageHandler} from "../MissingImageHandler";

@Component({
  selector: 'app-product-index',
  templateUrl: './product-index.component.html',
  styleUrls: ['./product-index.component.css']
})
export class ProductIndexComponent implements OnInit, AfterViewInit {

  pageTitle:string = 'ProductIndex';
  displayedColumns: string[] = ['preview', 'internalCode' ,'name', 'supplierName', 'actions'];
  dataSource: ProductsDataSource;

  hoverImage: string = "";
  hoverRowId: string = "";

  @Input() searchQuery = "";
  @Input() withInternalCode = false;
  //selectedSupplier: Supplier = this.dss.selectedSupplierState.value
  @Input() selectedSupplier: Supplier;

  productId: string | any;
  pageCookie$ = this._localStorageService.myData$
  pC: any = {};


  constructor(
    public api: ApiClient,
    public dialog: MatDialog,
    public router: Router,
    private _ActivatedRoute:ActivatedRoute,
    private _localStorageService: LocalStorageService,
    private _notyf: NotificationService,
    private imgHandler:MissingImageHandler
  ) {
    this.dataSource = new ProductsDataSource(this.api);
  }

  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator

  setCookie() {
    this._localStorageService.setDataByPageName(this.pageTitle, {
      searchQuery: this.searchQuery,
      pageIndex: this.paginator?.pageIndex,
      pageSize: this.paginator?.pageSize,
      withInternalCodeSelector: this.withInternalCode,
    });
  }

  getCookie() {
    this._localStorageService.getDataByPageName(this.pageTitle);
    this.pageCookie$.subscribe(x => {
      if (!x) return;
      this.pC = x;
  /*    this.paginator.pageIndex = this.pC.pageIndex
      this.paginator.pageSize = this.pC.pageSize*/
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.onQueryChanged();
  }

  ngOnInit() {
    //this.getCookie();
    //this.dataSource.loadPagedData('', this.withInternalCode, this.selectedSupplier?.id, 0, 15, null);
  }

  ngAfterViewInit(): void {
    this.paginator.page
      .pipe(
        tap( () => {
          this.loadProductPagedData();
          //this.setCookie();
        })
      ).subscribe();
  }

  onQueryChanged() {
    if (this.paginator?.pageIndex) {
      this.paginator.pageIndex = 0;
    }
    //this.setCookie();
    this.loadProductPagedData();
  }

  loadProductPagedData(): any {
    this.dataSource.loadPagedData(this.searchQuery, this.withInternalCode, this.selectedSupplier?.id, this.paginator?.pageIndex || 0, this.paginator?.pageSize || 15, null);
  }

  confirmDeleteDialog(id: string, name: string): void {
    const message = `Удалить товар ` + name + `?`;
    const dialogData = new ConfirmDialogModel("Подтверждение", message);

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      minWidth: "300px",
      maxWidth: "500px",
      data: dialogData
    });

    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult === true) {
        this.dataSource.deleteProduct(id);
      }
    });
  }

  goToItemDetails(id: any) {
    this.router.navigate([`product-details/${id}`]);
  }

  goToEditItem(id:string) {
    this.router.navigate([`product-edit/${id}`]);
  }

  changeImage(row: any, image: any) {
    this.hoverRowId = row.id;
    this.hoverImage = image;
  }
  openDialog(image: string) {
    let dialogBoxSettings = {
      margin: '0 auto',
      hasBackdrop: true,
      data: {
        src: image.replace("", ""),
      }
    };
    this.dialog.open(ImagePreviewDialogComponent, dialogBoxSettings);
  }

  copyVendorId(vendorId: string) {
    navigator.clipboard.writeText(vendorId);
    this._notyf.onSuccess('Артикул поставщика скопирован')
  }

  handleMissingImage($event: Event) {
    this.imgHandler.checkImgStatus($event);
  }
}
