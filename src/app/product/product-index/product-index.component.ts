import {AfterViewInit, Component, EventEmitter, Input, OnInit, Output, SimpleChanges, ViewChild} from '@angular/core';
import {ProductsDataSource} from "../repo/ProductsDataSource";
import {ApiClient} from "../../service/httpClient";
import {MatDialog} from "@angular/material/dialog";
import {ActivatedRoute, Router} from "@angular/router";
import {MatPaginator} from "@angular/material/paginator";
import {
  tap
} from "rxjs";
import {Supplier} from "../../models/supplier.model";
import {ConfirmDialogComponent, ConfirmDialogModel} from "../../components/shared/confirm-dialog/confirm-dialog.component";
import {NotificationService} from "../../service/notification-service";
import {ImagePreviewDialogComponent} from "../image-preview-dialog/image-preview-dialog.component";
import {MissingImageHandler} from "../MissingImageHandler";
import {AuthService} from "../../auth/service/auth.service";

@Component({
  selector: 'app-product-index',
  templateUrl: './product-index.component.html',
  styleUrls: ['./product-index.component.css']
})
export class ProductIndexComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['preview', 'internalCode' ,'name', 'supplierName', 'actions'];
  dataSource: ProductsDataSource;
  roles: string[] = [];

  hoverImage: string = "";
  hoverRowId: string = "";

  @Input() searchQuery:string;
  @Input() withInternalCode = false;
  //selectedSupplier: Supplier = this.dss.selectedSupplierState.value
  @Input() selectedSupplier: Supplier;
  @Input() pageIndex:number;
  @Input() pageSize:number;
  @Output() pageParams:EventEmitter<any> = new EventEmitter();
  productId: string | any;

  constructor(
    public api: ApiClient,
    public dialog: MatDialog,
    public router: Router,
    private _ActivatedRoute:ActivatedRoute,
    private _notyf: NotificationService,
    private imgHandler:MissingImageHandler,
    private auth:AuthService
  ) {
    this.dataSource = new ProductsDataSource(this.api);
    this.roles = this.auth.getRoles();
  }

  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges): void {
    this.loadProductPagedData(false)
  }

  ngAfterViewInit(): void {
    this.paginator.page
      .pipe(
        tap( () => {
          this.loadProductPagedData(true)
          this.pageParams.next({pageIndex: this.paginator.pageIndex, pageSize:this.paginator.pageSize})
        })).subscribe();
  }

  loadProductPagedData(isPaginatorParams:boolean): any {
    this.dataSource.loadPagedData(this.searchQuery, this.withInternalCode, this.selectedSupplier?.id, isPaginatorParams ? this.paginator?.pageIndex : this.pageIndex, isPaginatorParams ? this.paginator?.pageSize : this.pageSize, null);
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
