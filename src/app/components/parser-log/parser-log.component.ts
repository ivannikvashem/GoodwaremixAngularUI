import {Component, OnInit, ViewChild} from '@angular/core';
import {ApiClient} from "../../repo/httpClient";
import {MatPaginator} from "@angular/material/paginator";
import {debounceTime, distinctUntilChanged, finalize, merge, startWith, switchMap, tap} from "rxjs";
import {LogsDataSource} from "../../repo/LogDataSource";
import {MatSort, SortDirection} from "@angular/material/sort";
import {FormControl} from "@angular/forms";
import {Supplier} from "../../models/supplier.model";
import {LocalStorageService} from "../../service/local-storage.service";

class PageCookieProductIndex {
  pageIndex: number = 1;
  pageSize: number = 10;
  searchQuery: string = "";
  withInternalCodeSelector: boolean = false;
  supplierId: string = "";
  supplier: Supplier;

  constructor() {
    this.supplier = {id: this.supplierId} as Supplier;
  }
}

@Component({
  selector: 'app-parser-log',
  templateUrl: './parser-log.component.html',
  styleUrls: ['./parser-log.component.css']
})
export class ParserLogComponent implements OnInit {

  searchSuppliersCtrl  = new FormControl<string | Supplier>('');
  supplierList:Supplier[]
  displayedColumns: string[] = ['SupplierName', 'Date', 'status', 'result', 'actions'];
  dataSource: LogsDataSource;
  pageCookie$ = this._localStorageService.myData$
  pC: any = {};
  private sub: any;

  constructor(
    public api: ApiClient,
    private _localStorageService: LocalStorageService,
  ) {
      this.dataSource = new LogsDataSource(this.api);
    }

  @ViewChild(MatPaginator) paginator!: MatPaginator
  @ViewChild(MatSort) sort: MatSort | any;

  setCookie() {
    // on each interaction - save all controls state to cookies
    let supp = this.searchSuppliersCtrl.value as Supplier;
    this._localStorageService.setDataByPageName(this.constructor.name, {
      pageIndex: this.paginator?.pageIndex,
      pageSize: this.paginator?.pageSize,
      supplier: {id: supp.id, supplierName: supp.supplierName} as Supplier
    });
  }

  getCookie() {
    //try to get cookie, if there's no cookie - make the blank and save
    this._localStorageService.getDataByPageName(this.constructor.name) as PageCookieProductIndex; //pretty wrong, upd data
    this.sub = this.pageCookie$.subscribe(x => {
      if (!x) return;
      this.pC = x;
      this.searchSuppliersCtrl.setValue(this.pC.supplier as Supplier);
    });
  }


  ngOnInit(): any {
    this.getCookie();
    Promise.resolve().then(() => {
      this.paginator.pageIndex = this.pC.pageIndex;
      this.paginator.pageSize = this.pC.pageSize;
      this.loadData();
    })

    this.api.getSuppliers(this.pC?.searchQuery || "", 0 ,100, "SupplierName", "asc").subscribe( (r:any) => {
      this.supplierList = r.body.data
    });

    this.searchSuppliersCtrl.valueChanges.pipe(
      distinctUntilChanged(),
      debounceTime(300),
      tap(() => {
        //this.isLoading = true;
      }),
      switchMap(value => this.api.getSuppliers(value, 0 ,100,"SupplierName", "asc")
        .pipe(
          finalize(() => {
            //this.isLoading = false
          }),
        )
      )
    ).subscribe((data: any) => { this.supplierList = data.body.data; });
  }

  ngAfterViewInit(): void {
    // If the user changes the sort order, reset back to the first page.
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));
    //todo доделать нормальный pipe и обработку ошибок
    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        tap( () => this.loadData())
      ).subscribe();
  }

  loadData(): any {
    this.dataSource.loadPagedData((this.searchSuppliersCtrl.value as Supplier)?.id,this.paginator?.pageIndex ?? 0, this.paginator?.pageSize ?? 10, this.sort.active, this.sort.direction);
  }

  flushLogTable(): any {
    this.dataSource.deleteAllLogs();
  }

  displayFn(supplier: Supplier): string {
    return supplier && supplier.supplierName ? supplier.supplierName : '';
  }

  onQueryChanged() {
    this.paginator.pageIndex = 0;
    this.loadData()
    this.setCookie();
  }

  onClearSupplierSelection() {
    this.searchSuppliersCtrl.setValue('');
    this.onQueryChanged();
  }
}
