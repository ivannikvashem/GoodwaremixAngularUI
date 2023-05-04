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
import {Product} from "../../models/product.model";

@Component({
  selector: 'app-product-index',
  templateUrl: './product-index.component.html',
  styleUrls: ['./product-index.component.css']
})
export class ProductIndexComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['preview', 'internalCode' ,'name', 'supplierName', 'actions'];
  dataSource: ProductsDataSource;
  roles: string[] = [];
  productsList:Product[] = []
  isLoading:boolean;

  hoverImage: string = "";
  hoverRowId: string = "";

  @Input() searchQuery:string;
  @Input() withInternalCode = false;
  //selectedSupplier: Supplier = this.dss.selectedSupplierState.value
  @Input() selectedSupplier: Supplier;
  @Input() pageIndex:number;
  @Input() pageSize:number;
  @Input() sortParams:any;
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

  ngOnInit() {
    this.dataSource.loading$.subscribe(loadState => {
      this.isLoading = loadState
    })
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.loadProductPagedData()
  }

  ngAfterViewInit(): void {
    this.paginator.page
      .pipe(
        tap( () => {
          this.pageParams.next({pageIndex: this.paginator.pageIndex, pageSize:this.paginator.pageSize})
        })).subscribe();
  }

  loadProductPagedData(): any {
    this.dataSource.loadPagedData(this.searchQuery, this.selectedSupplier?.id,  this.pageIndex, this.pageSize, null, this.sortParams.active, this.sortParams.direction, this.withInternalCode);
    this.dataSource.connect(null).subscribe(x => {
      this.productsList = x
    })
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

  handleMissingImage($event: Event) {
    this.imgHandler.checkImgStatus($event);
  }
}
