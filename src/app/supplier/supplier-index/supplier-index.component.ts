import {Component, OnInit, ViewChild} from '@angular/core';
import {SuppliersDataSource} from "../repo/SuppliersDataSource";
import {ApiClient} from "../../service/httpClient";
import {MatPaginator} from "@angular/material/paginator";
import {debounceTime, distinctUntilChanged, merge, Subscription, tap} from "rxjs";
import {Router} from "@angular/router";
import {animate, state, style, transition, trigger} from "@angular/animations";
import {Supplier} from "../../models/supplier.model";
import {MatDialog} from "@angular/material/dialog";
import {ConfirmDialogComponent, ConfirmDialogModel} from "../../components/shared/confirm-dialog/confirm-dialog.component";
import {MatSort, SortDirection} from "@angular/material/sort";
import {NotificationService} from "../../service/notification-service";
import {LocalStorageService} from "../../service/local-storage.service";
import {FormControl} from "@angular/forms";
import {DataStateService} from "../../shared/data-state.service";

@Component({
  selector: 'app-supplier-index',
  templateUrl: './supplier-index.component.html',
  styleUrls: ['./supplier-index.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class SupplierIndexComponent implements OnInit {

  pageTitle:string = 'SupplierIndex';

  displayedColumns: string[] = ['supplierName', 'type', 'fullfill', 'brands', 'Stat.ProductQty', 'Stat.lastImport', 'actions'];
  dataSource: SuppliersDataSource;
  searchQueryCtrl  = new FormControl<string>('');
  //searchQuery = "";
  expandedElement: Supplier | null | undefined;
  pageCookie$ = this._localStorageService.myData$
  pC: any = {};
  private sub: Subscription;

  constructor(
    public api: ApiClient,
    private router: Router,
    public dialog: MatDialog,
    private _notyf: NotificationService,
    private _localStorageService: LocalStorageService,
    private dss: DataStateService
  ) {
    this.dataSource = new SuppliersDataSource(this.api);
  }

  @ViewChild(MatPaginator) paginator!: MatPaginator
  @ViewChild(MatSort) sort: MatSort;

  ngOnInit(): void {
    this.getCookie();
    Promise.resolve().then(() => {
/*      this.paginator.pageIndex = this.pC.pageIndex;
      this.paginator.pageSize = this.pC.pageSize;*/
      this.sort.direction = this.pC.sortDirection;
      this.sort.active = this.pC.sortField;
      this.loadData();
    })

    this.searchQueryCtrl.valueChanges.pipe(
      distinctUntilChanged(),
      debounceTime(300)
    ).subscribe(()=> {
      this.loadData();
      this.setCookie();
    })
  }

  ngAfterViewInit(): void {
    // If the user changes the sort order, reset back to the first page.
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));

    //todo доделать нормальный pipe и обработку ошибок
    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        tap( () => {
          this.loadData();
          this.setCookie();
        })
      )
      .subscribe();
  }

  ngOnDestroy() {
    this.sub.unsubscribe(); //crutch to dispose subs
  }

  setCookie() {
    // on each interaction - save all controls state to cookies
    this._localStorageService.setDataByPageName(this.pageTitle, {
      searchQuery: this.searchQueryCtrl.value,
      pageIndex: this.paginator?.pageIndex,
      pageSize: this.paginator?.pageSize,
      sortDirection: this.sort?.direction,
      sortField: this.sort?.active
    });
  }

  getCookie() {
    //try to get cookie, if there's no cookie - make the blank and save
    this._localStorageService.getDataByPageName(this.pageTitle); //pretty wrong, upd data
    this.sub = this.pageCookie$.subscribe(x => {
      if (!x) return;
      this.pC = x;
      this.searchQueryCtrl.setValue(this.pC.searchQuery);
    });
  }

  loadData(): void {
    this.dataSource.loadPagedData(this.searchQueryCtrl.value, this.paginator?.pageIndex || 0, this.paginator?.pageSize || 15, this.sort?.active, this.sort?.direction);
  }

  fetchItem(supplierName: string, id:string) {
    this.api.fetchDataFromSupplier(id).subscribe( res => {
       this._notyf.onSuccess('Сбор данных '+supplierName+' начат')
      },
      err => {
        this._notyf.onError("Ошибка: " + JSON.stringify(err));
      })
  }

  stopFetchItem(supplierName: string) {
    this.api.stopFetchDataFromSupplier(supplierName).subscribe( res => {
        this._notyf.onSuccess('Сбор данных '+supplierName+' остановлен')
      },
      err => {
        this._notyf.onError("Ошибка: " + JSON.stringify(err));
      })
  }

  fixSupplierStat() {
    console.log("fixSupplierStat ");
    this.api.fixSupplierStat().subscribe( res => {
        console.log(JSON.stringify(res));
      },
      err => {
        this._notyf.onError("Ошибка: " + JSON.stringify(err));
      })
  }

  editItem(supplierId: string) {
    this.router.navigate([`supplier-edit/${supplierId}`]);
  }

  confirmDeleteSuppDialog(id: string, name: string): void {
    const message = `Удалить поставщика ` + name + `?`;
    const dialogData = new ConfirmDialogModel("Подтверждение", message);
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      minWidth: "400px",
      data: dialogData
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult === true) {
        this.dataSource.deleteSupplier(id);
      }
    });
  }

  confirmDeleteSuppProdDialog(id: string, name: string): void {
    const message = `Удалить все товары поставщика ` + name + `?`;
    const dialogData = new ConfirmDialogModel("Подтверждение", message);
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: "500px",
      data: dialogData
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult === true) {
        this.dataSource.deleteSupplierProducts(id);
      }
    });
  }

  internalCodeFetch(id: string) {
    console.log("IC bind " + id);
    this.api.internalCodeBindForSupplier(id).subscribe( res => {
        console.log(JSON.stringify(res));
      },
      err => {
        console.log(err);
      })
  }

  onQueryChanged() {
    this.paginator.pageIndex = 0;
    this.loadData();
    this.setCookie();
  }

  onClearSearchQuery() {
    this.searchQueryCtrl.setValue('');
    this.onQueryChanged();
  }

  downloadTable(table: string, id:string) {
    this.api.downloadTableFile(table, id).subscribe( (resp: any) => {
      let blob:any = new Blob([resp.body], {type: 'application/json; charset=utf-8'})
      let downloadAction = document.createElement('a')
      downloadAction.download = table;
      downloadAction.href = window.URL.createObjectURL(blob)
      downloadAction.click()
    })
  }

  gotoProductsBySupplier(row: Supplier) {
    this.dss.setSelectedSupplier(row.id, row.supplierName);
    this.router.navigate(["/products"]);
  }
}
