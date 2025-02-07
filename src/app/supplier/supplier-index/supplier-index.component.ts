import {Component, EventEmitter, Input, OnInit, Output, SimpleChanges, ViewChild} from '@angular/core';
import {SuppliersDataSource} from "../repo/SuppliersDataSource";
import {ApiClient} from "../../service/httpClient";
import {MatPaginator} from "@angular/material/paginator";
import {finalize, tap} from "rxjs";
import {Router} from "@angular/router";
import {animate, state, style, transition, trigger} from "@angular/animations";
import {Supplier} from "../../models/supplier.model";
import {MatDialog} from "@angular/material/dialog";
import {ConfirmDialogComponent, ConfirmDialogModel} from "../../components/shared/confirm-dialog/confirm-dialog.component";
import {MatSort} from "@angular/material/sort";
import {NotificationService} from "../../service/notification-service";
import {LocalStorageService} from "../../service/local-storage.service";
import {DataStateService} from "../../shared/data-state.service";
import {SelectionModel} from "@angular/cdk/collections";
import {MatTableDataSource} from "@angular/material/table";
import {SupplierImportProductsComponent} from "../supplier-import-products/supplier-import-products.component";
import {StatisticDataSource} from "../../statistic/repo/StatisticDataSource";

@Component({
  selector: 'app-supplier-index',
  templateUrl: './supplier-index.component.html',
  styleUrls: ['./supplier-index.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class SupplierIndexComponent implements OnInit {

  displayedColumns: string[] = ['checkbox', 'supplierName', 'type', 'fullfill', 'brands', 'stat.productQty', 'stat.lastImport', 'actions'];
  isLoading:boolean;
  dataSource: SuppliersDataSource;
  @Input() searchQuery:string;
  @Input() selectedSupplier: Supplier;
  @Input() pageIndex:number;
  @Input() pageSize:number;
  @Input() sortActive:string;
  @Input() sortDirection:string;
  @Output() pageParams:EventEmitter<any> = new EventEmitter();
  @Output() sortParams:EventEmitter<any> = new EventEmitter();
  expandedElement: Supplier | null | undefined;

  supplierDataSource = new MatTableDataSource<Supplier>()
  selection = new SelectionModel<Supplier>(true, []);
  scrollToTop:boolean;
  isPaginatorFixed:boolean;

  constructor(
    public api: ApiClient,
    private router: Router,
    public dialog: MatDialog,
    private _notyf: NotificationService,
    private _localStorageService: LocalStorageService,
    private dss: DataStateService,
    private supplierDS: SuppliersDataSource,
    private statDS: StatisticDataSource
  ) {
    this.dataSource = new SuppliersDataSource(this.api, this.statDS);
  }

  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator
  @ViewChild(MatSort) sort: MatSort;

  ngOnInit() {
    this.dataSource.loading$.subscribe(loadState => {
      this.isLoading = loadState
    });

    this.dss.getSettings().subscribe((settings:any) => {
      this.scrollToTop = settings.scrollPageToTop;
      this.isPaginatorFixed = settings.isPaginatorFixed;
    })
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.loadSupplierPagedData();
  }

  ngAfterViewInit(): void {
    this.paginator.page
      .pipe(
        tap( () => {
          if (this.scrollToTop) {
            window.scroll(0, 0);
          }
          this.pageParams.next({pageIndex: this.paginator.pageIndex, pageSize:this.paginator.pageSize})
          this.selection.clear();
        })).subscribe();
  }

  loadSupplierPagedData(): any {
    this.dataSource.loadPagedData(this.searchQuery, this.pageIndex, this.pageSize, this.sortActive,  this.sortDirection);
    this.dataSource.connect(null).subscribe(x => {
      this.supplierDataSource.data = x;
    })
  }

  sortData(sort: any) {
    this.selection.clear()
    this.sortParams.next({direction: sort.direction, active:sort.active});
  }

  fixSupplierStat() {
    this.api.postRequest('service/cleanstat', {})
      .pipe(finalize( () => { this._notyf.onSuccess('Данные обновлены'); this.loadSupplierPagedData() })
      ).subscribe( { next: () => {},
      error: (err) => {
        this._notyf.onError("Ошибка: " + JSON.stringify(err));
      }})
  }

  confirmSelectionSuppDeleteDialog(): void {
    const message = `Удалить поставщиков (${this.selection.selected.length}) ?`;
    const dialogData = new ConfirmDialogModel("Подтверждение", message);
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      minWidth: "400px",
      data: dialogData
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult === true) {
        this.selection.selected.forEach(supplier => {
          this.dataSource.deleteSupplier(supplier.id);
        })
      }
    });
  }

  confirmSelectedSuppProductsDialog(): void {
    const message = `Удалить все товары выбранных поставщиков ?`;
    const dialogData = new ConfirmDialogModel("Подтверждение", message);
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: "500px",
      data: dialogData
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult === true) {
        this.selection.selected.forEach(supplier => {
          this.dataSource.deleteSupplierProducts(supplier.id);
        })
      }
    });
  }

  selectedSuppInternalCodesFetch() {
    this.selection.selected.forEach(supplier => {
      this.supplierDS.internalCodeBindForSupplier(supplier.id).subscribe( res => {
          console.log(JSON.stringify(res));
        },
        err => {
          console.log(err);
        })
    })
  }

  downloadSelectedSuppCollection(table:string) {
    this.selection.selected.forEach(supplier => {
      this.supplierDS.downloadTableFile(table, supplier.id).subscribe( (resp: any) => {
        let blob:any = new Blob([resp.body], {type: 'application/json; charset=utf-8'})
        let downloadAction = document.createElement('a')
        downloadAction.download = table;
        downloadAction.href = window.URL.createObjectURL(blob)
        downloadAction.click()
      })
    })
  }

  gotoProductsBySupplier(row: Supplier) {
    this.dss.setSelectedSupplier(row.id, row.supplierName);
    this.router.navigate(["/products"]);
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.supplierDataSource.data.length;
    return numSelected === numRows;
  }

  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear()
      return
    }
    this.selection.select(...this.supplierDataSource.data)
  }

  fetchSelectedItems() {
    let suppliers = ''
    for (let i of this.selection.selected) {
      suppliers += i.id+';'
    }
    this.supplierDS.fetchDataFromSupplier(suppliers).subscribe({
      next:() => {
        this._notyf.onSuccess('Сбор данных начат')
      }, error:error => {
        this._notyf.onError('Ошибка' +JSON.stringify(error))
      }})
  }

  bindSupplierCategories() {
    this.supplierDS.bindSupplierCategories(this.selection.selected.map(x => x.id)).subscribe();
  }

  importProducts(supplierId:string, supplierName:string) {
    this.dialog.open(SupplierImportProductsComponent, {
      maxWidth: "500px",
      data: { supplierId:supplierId, supplierName:supplierName},
      autoFocus: false
    });
  }

  supplierStatisticUpdate() {
    this.supplierDS.supplierStatUpdate(this.selection.selected.map(x => x.id)).subscribe();
  }
}
