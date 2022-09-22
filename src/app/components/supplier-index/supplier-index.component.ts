import {Component, OnInit, ViewChild} from '@angular/core';
import {SuppliersDataSource} from "../../repo/SuppliersDataSource";
import {ApiClient} from "../../repo/httpClient";
import {MatPaginator} from "@angular/material/paginator";
import {debounceTime, distinctUntilChanged, merge, tap} from "rxjs";
import {Router} from "@angular/router";
import {animate, state, style, transition, trigger} from "@angular/animations";
import {Supplier} from "../../models/supplier.model";
import {MatDialog} from "@angular/material/dialog";
import {ConfirmDialogComponent, ConfirmDialogModel} from "../shared/confirm-dialog/confirm-dialog.component";
import {MatSort, SortDirection} from "@angular/material/sort";
import {NotificationService} from "../../service/notification-service";
import {LocalStorageService} from "../../service/local-storage.service";
import {FormControl} from "@angular/forms";

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

  displayedColumns: string[] = ['SupplierName', 'type', 'fullfill', 'brands', 'Stat.ProductQty', 'Stat.lastImport', 'actions'];
  dataSource: SuppliersDataSource;
  searchQueryCtrl  = new FormControl<string>('');
  //searchQuery = "";
  expandedElement: Supplier | null | undefined;
  pageCookie$ = this._localStorageService.myData$
  pC: any = {};
  private sub: any;

  constructor(
    public api: ApiClient,
    private router: Router,
    public dialog: MatDialog,
    private _notyf: NotificationService,
    private _localStorageService: LocalStorageService
  ) {
    this.dataSource = new SuppliersDataSource(this.api);
  }

  @ViewChild(MatPaginator) paginator!: MatPaginator
  @ViewChild(MatSort) sort: MatSort | any;

  ngOnInit(): any {
    this.getCookie();
    Promise.resolve().then(() => {
      this.paginator.pageIndex = this.pC.pageIndex;
      this.paginator.pageSize = this.pC.pageSize;
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
    this._localStorageService.setDataByPageName(this.constructor.name, {
      searchQuery: this.searchQueryCtrl.value,
      pageIndex: this.paginator?.pageIndex,
      pageSize: this.paginator?.pageSize,
      sortDirection: this.sort?.direction,
      sortField: this.sort?.active
    });
  }

  getCookie() {
    //try to get cookie, if there's no cookie - make the blank and save
    this._localStorageService.getDataByPageName(this.constructor.name); //pretty wrong, upd data
    this.sub = this.pageCookie$.subscribe(x => {
      console.log("pc: " + JSON.stringify(x));
      this.pC = x;
      this.searchQueryCtrl.setValue(this.pC.searchQuery);
    });
  }

  loadData(): any {
    this.dataSource.loadPagedData(this.searchQueryCtrl.value, this.paginator?.pageIndex || 0, this.paginator?.pageSize || 15, this.sort?.active, this.sort?.direction);
  }

  addItem() {
    //this.addTmpSupplier();
  }

/*  applySupplierFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    //this.searchQuery = filterValue;
    this.paginator.pageIndex = 0;
    this.setCookie();
    this.loadData();
  }*/

  fixSupplierStat() {
    console.log("fixSupplierStat ");
    this.api.fixSupplierStat().subscribe( res => {
        console.log(JSON.stringify(res));
      },
      err => {
        this._notyf.onError("Ошибка: " + JSON.stringify(err));
      })
  }

  fetchItem(supplierName: any) {
    console.log("fetching " +supplierName);
    this.api.fetchDataFromSupplier(supplierName).subscribe( res => {
        console.log(JSON.stringify(res));
      },
      err => {
        this._notyf.onError("Ошибка: " + JSON.stringify(err));
      })
  }

  editItem(supplierId: any) {
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
      //this.result = dialogResult;
      if (dialogResult === true) {
        console.log("Confirm deleting " + id);
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
      //this.result = dialogResult;
      if (dialogResult === true) {
        console.log("Confirm deleting " + id);
        this.dataSource.deleteSupplierProducts(id);
      }
    });
  }

  internalCodeFetch(supplierName: string) {
    console.log("IC bind " +supplierName);
    this.api.internalCodeBindForSupplier(supplierName).subscribe( res => {
        console.log(JSON.stringify(res));
      },
      err => {
        console.log(err);
      })
  }

  fullInit() {
    console.log("full init");
    this.api.fullInit().subscribe( res => {
        console.log(JSON.stringify(res));
      },
      err => {
        this._notyf.onError("Ошибка: " + JSON.stringify(err));
      })
  }

  onClearSearchQuery() {
    this.searchQueryCtrl.setValue('');
    this.paginator.pageIndex = 0;
    this.loadData();
    this.setCookie();
  }
}
