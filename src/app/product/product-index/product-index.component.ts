import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges, ViewChild} from '@angular/core';
import {ProductsDataSource} from "../repo/ProductsDataSource";
import {ApiClient} from "../../service/httpClient";
import {MatDialog} from "@angular/material/dialog";
import {ActivatedRoute, Router} from "@angular/router";
import {MatPaginator} from "@angular/material/paginator";
import {tap} from "rxjs";
import {Supplier} from "../../models/supplier.model";
import {ConfirmDialogComponent, ConfirmDialogModel} from "../../components/shared/confirm-dialog/confirm-dialog.component";
import {NotificationService} from "../../service/notification-service";
import {MissingImageHandler} from "../MissingImageHandler";
import {AuthService} from "../../auth/service/auth.service";
import {Product} from "../../models/product.model";
import {DataStateService} from "../../shared/data-state.service";
import {ProductSelectedListComponent} from "../product-selected-list/product-selected-list.component";

@Component({
  selector: 'app-product-index',
  templateUrl: './product-index.component.html',
  styleUrls: ['./product-index.component.css']
})
export class ProductIndexComponent implements OnInit {
  displayedColumns: string[] = ['preview', 'internalCode' ,'name', 'supplierName', 'actions'];
  dataSource: ProductsDataSource;
  roles: string[] = [];
  productsList:Product[] = []
  isLoading:boolean;

  selectionActive:boolean = false;
  selectionItems:any[] = []

  hoverImage: string = "";
  hoverRowId: string = "";

  @Input() searchQuery:string;
  @Input() withInternalCode = false;
  @Input() isVerified:boolean = false;
  //selectedSupplier: Supplier = this.dss.selectedSupplierState.value
  @Input() selectedSupplier: Supplier;
  @Input() pageIndex:number;
  @Input() pageSize:number;
  @Input() sortActive:any;
  @Input() attributeFilter:any;
  @Output() pageParams:EventEmitter<any> = new EventEmitter();

  productId: string | any;

  //About to be deprecated
  @Input() isCardLayout:boolean;

  constructor(
    public api: ApiClient,
    public dialog: MatDialog,
    public router: Router,
    private _ActivatedRoute:ActivatedRoute,
    private _notyf: NotificationService,
    private imgHandler:MissingImageHandler,
    private dss:DataStateService,
    private auth:AuthService) {
    this.dataSource = new ProductsDataSource(this.api);
    this.roles = this.auth.getRoles();
  }

  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator

  ngOnInit() {
    this.dataSource.loading$.subscribe(loadState => {
      this.isLoading = loadState
    })

    this.dss.getSelectedProducts().subscribe((selection:Product[]) => {
      if (selection.length > 0) {
        this.selectionActive = true;
        this.selectionItems = selection;
      } else {
        this.selectionActive = false;
      }
    })
  }

  ngOnChanges(changes: SimpleChanges): void {
    for (const propName in changes) {
      if (changes.hasOwnProperty(propName)) {
        const changedProp = changes[propName];
        if (JSON.stringify(changedProp.previousValue) !== JSON.stringify(changedProp.currentValue)) {
          this.loadProductPagedData();
          break;
        }
      }
    }
  }

  // isCardLayout params should be removed
  loadProductPagedData(): any {
    this.dataSource.loadPagedData(this.isCardLayout, this.searchQuery, this.selectedSupplier?.id,  this.pageIndex, this.pageSize, this.attributeFilter, this.sortActive.active, this.sortActive.direction,this.isVerified ? false : null, this.withInternalCode);
    this.dataSource.connect(null).subscribe(x => {
      this.productsList = x
    })
  }

  goToItemDetails(id: any) {
    this.router.navigate([`product-details/${id}`]);
  }

  confirmDeleteDialog(): void {
    const message = `Удалить товар(ы) ?`;
    const dialogData = new ConfirmDialogModel("Подтверждение", message);
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      minWidth: "300px",
      maxWidth: "500px",
      data: dialogData
    });

    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult) {
        for (let i of this.selectionItems) {
          this.dataSource.deleteProduct(i.id);
        }
        this.loadProductPagedData()
        this.dss.clearSelectedProducts()
      }
    });
  }

  selectAll() {
    for (let product of this.productsList) {
      this.dss.setSelectedProduct({id:product.id,vendorId:product.vendorId, internalCode: product.internalCode})
    }
  }

  deselectAll() {
    for (let product of this.productsList) {
      this.dss.removeSelectedProduct(product.id)
    }
  }

  showSelectedItems() {
    this.dialog.open(ProductSelectedListComponent, {
      minWidth: "600px",
      minHeight: "250px",
      autoFocus: false
    });
  }

  downloadProductsImage() {
    for (let product of this.selectionItems) {
      this.dataSource.downloadImages(product.internalCode)
    }
  }

  paginatorChanged(matPaginator: MatPaginator) {
    this.paginator = matPaginator;
    this.paginator.page
      .pipe(
        tap( () => {
          this.pageParams.next({pageIndex: this.paginator.pageIndex, pageSize:this.paginator.pageSize})
        })).subscribe();
  }
}
