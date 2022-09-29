import {AfterViewInit, Component, Inject, OnInit, ViewChild} from '@angular/core';
import {ProductsDataSource} from "../../repo/ProductsDataSource";
import {ApiClient} from "../../repo/httpClient";
import {MAT_DIALOG_DATA, MatDialog} from "@angular/material/dialog";
import {ActivatedRoute, Router} from "@angular/router";
import {MatPaginator} from "@angular/material/paginator";
import {debounceTime, distinctUntilChanged, filter, finalize, map, Observable, startWith, switchMap, tap} from "rxjs";
import {FormControl} from '@angular/forms';
import {Supplier} from "../../models/supplier.model";
import {LocalStorageService} from "../../service/local-storage.service";
import {ConfirmDialogComponent, ConfirmDialogModel} from "../shared/confirm-dialog/confirm-dialog.component";

export interface DialogData {
  src: '';
}

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
  selector: 'app-product-index',
  templateUrl: './product-index.component.html',
  styleUrls: ['./product-index.component.css']
})
export class ProductIndexComponent implements OnInit, AfterViewInit {

  displayedColumns: string[] = ['preview', 'internalCode' ,'name', 'supplierName', 'actions'];
  dataSource: ProductsDataSource;

  hoverImage: string = "";
  hoverRowId: string = "";

  searchSuppliersCtrl = new FormControl<string | Supplier>('');
  searchQueryCtrl  = new FormControl<string>('');
  withInternalCodeCtrl  = new FormControl<boolean>(false);
  public supplierList: Supplier[] | undefined;  // public filteredSupplierList: Observable<Supplier[]> | undefined;
  isLoading = false;
  productId: string | any;
  pageCookie$ = this._localStorageService.myData$
  pC: any = {};
  private sub: any;

  constructor(
    public api: ApiClient,
    public dialog: MatDialog,
    public router: Router,
    private _ActivatedRoute:ActivatedRoute,
    private _localStorageService: LocalStorageService
  ) {
    this.dataSource = new ProductsDataSource(this.api);
  }

  @ViewChild(MatPaginator) paginator: MatPaginator

  setCookie() {
    // on each interaction - save all controls state to cookies
    let supp = this.searchSuppliersCtrl.value as Supplier;
    this._localStorageService.setDataByPageName(this.constructor.name, {
      searchQuery: this.searchQueryCtrl.value,
      pageIndex: this.paginator?.pageIndex,
      pageSize: this.paginator?.pageSize,
      withInternalCodeSelector: this.withInternalCodeCtrl.value,
      supplier: {id: supp.id, supplierName: supp.supplierName} as Supplier
    });
  }

  getCookie() {
    //try to get cookie, if there's no cookie - make the blank and save
    this._localStorageService.getDataByPageName(this.constructor.name) as PageCookieProductIndex; //pretty wrong, upd data
    this.sub = this.pageCookie$.subscribe(x => {
      if (!x) return;
      //console.log("pc: " + JSON.stringify(x.pageIndex));
      this.pC = x;
      this.searchQueryCtrl.setValue(this.pC.searchQuery);
      this.withInternalCodeCtrl.setValue(this.pC.withInternalCodeSelector);
      this.searchSuppliersCtrl.setValue(this.pC.supplier as Supplier);
    });
  }

  ngOnInit() {

    this.getCookie();

    Promise.resolve().then(() => {
      this.paginator.pageIndex = this.pC.pageIndex;
      this.paginator.pageSize = this.pC.pageSize;
      this.loadProductPagedData();
    })

    this.api.getSuppliers(this.pC?.searchQuery || "", 0 ,100, "SupplierName", "asc").subscribe( (r:any) => {
      this.supplierList = r.body.data
    });

    this._ActivatedRoute.queryParams.subscribe(params => {
      let supplierId = params['supplierId'];
      if (supplierId) {
        this.pC.supplierId = supplierId;
        this.searchSuppliersCtrl.setValue({id: supplierId} as Supplier);
        this.api.getSupplierById(supplierId).subscribe( s => {
          this.searchSuppliersCtrl.setValue(s.body as Supplier);
        })
      }
    });

    this.searchSuppliersCtrl.valueChanges.pipe(
      distinctUntilChanged(),
      debounceTime(300),
      tap(() => {
        this.isLoading = true;
      }),
      switchMap(value => this.api.getSuppliers(value, 0 ,100,"SupplierName", "asc")
        .pipe(
          finalize(() => {
            this.isLoading = false
          }),
        )
      )
    )
    .subscribe((data: any) => {
      this.supplierList = data.body.data;
    });

    this.searchQueryCtrl.valueChanges.pipe(
      distinctUntilChanged(),
      debounceTime(300)
    ).subscribe(()=> {
      this.loadProductPagedData();
      this.setCookie();
    })
  }

  ngAfterViewInit(): void {
    this.paginator.page
      .pipe(
        tap( () => {
          this.loadProductPagedData();
          this.setCookie();
        })
      )
      .subscribe();
  }

  ngOnDestroy() {
    this.sub.unsubscribe(); //crutch to dispose subs
  }

  displayFn(supplier: Supplier): string {
    return supplier && supplier.supplierName ? supplier.supplierName : '';
  }

  onQueryChanged() {
    this.paginator.pageIndex = 0;
    this.loadProductPagedData();
    this.setCookie();
  }

  onClearSupplierSelection() {
    this.searchSuppliersCtrl.setValue('');
    this.onQueryChanged();
  }

  loadProductPagedData(): any {
    this.dataSource.loadPagedData(this.searchQueryCtrl.value, this.withInternalCodeCtrl.value, (this.searchSuppliersCtrl.value as Supplier)?.id, this.paginator.pageIndex, this.paginator.pageSize);
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

  addItem() {
    this.router.navigate(['product-edit'])
  }

  goToEditItem(id:string) {
    this.router.navigate([`product-edit/${id}`]);
  }

  changeImage(row: any, image: any) {
    this.hoverRowId = row.id;
    this.hoverImage = image;
  }
  openDialog(image: string) {
    //console.log(image);
    let dialogBoxSettings = {
      /*maxHeight: '60%',*/
      maxWidth: '60%',
      margin: '0 auto',
      hasBackdrop: true,
      data: {
        src: image.replace("", ""),
      }
    };
    this.dialog.open(DialogDataExampleDialog, dialogBoxSettings);
  }
  handleMissingImage($event: Event) {
    ($event.target as HTMLImageElement).src='./assets/imgPlaceholder.png'
  }

}
@Component({
  selector: 'dialog-data-example-dialog',
  template: `
    <!--<img style="max-width: 800px;  max-height: 800px;" src='{{data.src}}'>-->
    <img (error)="handleMissingImage($event)" style="max-width: 95%;  max-height: 95%; margin: 0 auto; display: flex" src='{{data.src}}'>
`
})
export class DialogDataExampleDialog {
  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData) {}

  handleMissingImage($event: Event) {
    ($event.target as HTMLImageElement).src='./assets/imgPlaceholder.png'
  }
}
