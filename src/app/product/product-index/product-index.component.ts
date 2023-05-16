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
  selectedProducts:string[] = []

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
          this.selectedProducts = []
          this.pageParams.next({pageIndex: this.paginator.pageIndex, pageSize:this.paginator.pageSize})
        })).subscribe();
  }

  loadProductPagedData(): any {
    this.dataSource.loadPagedData(this.searchQuery, this.selectedSupplier?.id,  this.pageIndex, this.pageSize, null, this.sortParams.active, this.sortParams.direction, this.withInternalCode);
    this.dataSource.connect(null).subscribe(x => {
      this.productsList = x
    })
  }

  goToItemDetails(id: any) {
    this.router.navigate([`product-details/${id}`]);
  }

  onProductSelect(selected: any) {
    if (!selected.isSelected) {
      this.selectedProducts.push(selected.id)
    } else {
      this.selectedProducts = this.selectedProducts.filter(x => x !== selected.id)
    }
  }

  onProductDelete(id: any) {
    if (Array.isArray(id)) {
      this.confirmDeleteDialog(id)
    } else {
      this.dataSource.fillData(1, this.searchQuery, this.selectedSupplier?.id,  this.pageIndex, this.pageSize, null, this.sortParams.active, this.sortParams.direction, this.withInternalCode)
      this.selectedProducts = this.selectedProducts.filter(x => x !== id)
      this.dataSource.deleteProduct(id);
    }
  }

  confirmDeleteDialog(ids: string[]): void {
    const message = `Удалить товары ?`;
    const dialogData = new ConfirmDialogModel("Подтверждение", message);
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      minWidth: "300px",
      maxWidth: "500px",
      data: dialogData
    });

    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult) {
        this.dataSource.fillData(ids.length, this.searchQuery, this.selectedSupplier?.id,  this.pageIndex, this.pageSize, null, this.sortParams.active, this.sortParams.direction, this.withInternalCode)

        for (let i of ids) {
          this.selectedProducts = this.selectedProducts.filter(x => x !== i)
          this.dataSource.deleteProduct(i);
        }
      }
    });
  }
}
